// @/pages/BookDetail.tsx - Updated with appropriate endpoint handling
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ShoppingCart, Heart, AlertTriangle, Star, CheckCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    getBooks,
    addBookReview,
    getBookReviews,
    canUserReviewBook,
    hasUserReviewedBook,
    isAuthenticated,
    getOrder
} from '@/api/apiConfig';
import { toast } from 'sonner';
import type { ReviewResponse } from '@/api/apiConfig';

interface Book {
    id: number;
    title: string;
    author: string;
    genre: string;
    language: string;
    format: string;
    publisher: string;
    publicationDate: string;
    price: number;
    isOnSale: boolean;
    discountPercentage: number;
    discountStartDate: string;
    discountEndDate: string;
    actualPrice: number;
    description: string;
    isbn: string;
    stockQuantity: number;
    averageRating: number;
    reviewCount: number;
    imagePath: string;
}

export default function BookDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [reviews, setReviews] = useState<ReviewResponse[]>([]);
    const [userCanReview, setUserCanReview] = useState(false);
    const [userHasReviewed, setUserHasReviewed] = useState(false);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);

    // Fetch book details and review status
    useEffect(() => {
        const fetchBookDetails = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const result = await getBooks();
                if (result.success && result.data) {
                    const foundBook = result.data.find(b => b.id === parseInt(id));
                    if (foundBook) {
                        setBook(foundBook);

                        // Fetch review data
                        await fetchReviews();

                        // Check if user can review (only if authenticated)
                        if (isAuthenticated()) {
                            await checkReviewStatus(foundBook.id);
                        }
                    } else {
                        setError('Book not found');
                    }
                } else {
                    setError(result.error || 'Failed to fetch book details');
                }
            } catch (err) {
                setError('Failed to fetch book details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookDetails();
    }, [id]);

    // Fetch reviews for this book
    const fetchReviews = async () => {
        if (!id) return;

        try {
            setReviewsLoading(true);
            const result = await getBookReviews(parseInt(id));
            if (result.success && result.data) {
                setReviews(result.data);

                // Check if user has reviewed using the reviews data
                const userId = localStorage.getItem('userId');
                if (userId && result.data.length > 0) {
                    const hasReviewed = result.data.some(
                        review => review.userId === parseInt(userId)
                    );
                    setUserHasReviewed(hasReviewed);
                }
            } else {
                console.error('Failed to fetch reviews:', result.error);
            }
        } catch (err) {
            console.error('Error fetching reviews:', err);
        } finally {
            setReviewsLoading(false);
        }
    };

    // Alternative method to check if user has purchased the book through order history
    const checkIfUserPurchasedBook = async (bookId: number): Promise<boolean> => {
        try {
            const userId = localStorage.getItem('userId');
            if (!userId) return false;

            // Get user's orders
            const orderResult = await getOrder(parseInt(userId));
            if (!orderResult.success || !orderResult.data) return false;

            // Check if the book is in any of the user's orders
            
            const orders = orderResult.data;

            // Check if the book exists in any order items
            
            if (Array.isArray(orders.cartItems)) {
                return orders.cartItems.some(item => item.bookId === bookId);
            }

            return false;
        } catch (error) {
            console.error('Error checking purchase history:', error);
            return false;
        }
    };

    // Check if user can review and has already reviewed
    const checkReviewStatus = async (bookId: number) => {
        try {
            // Try to use the dedicated API endpoints
            const canReviewResult = await canUserReviewBook(bookId);
            const hasReviewedResult = await hasUserReviewedBook(bookId);

            // If the canReview endpoint is available and returns valid data
            if (canReviewResult.success && typeof canReviewResult.data === 'boolean') {
                setUserCanReview(canReviewResult.data);
            } else {
                // Fallback: check purchase history
                const hasPurchased = await checkIfUserPurchasedBook(bookId);
                setUserCanReview(hasPurchased);
            }

            // If the hasReviewed endpoint is available and returns valid data
            if (hasReviewedResult.success && typeof hasReviewedResult.data === 'boolean') {
                setUserHasReviewed(hasReviewedResult.data);
            }
            // Otherwise, we rely on the check done in fetchReviews

        } catch (err) {
            console.error('Error checking review status:', err);
            // Default to not allowing reviews if we can't determine status
            setUserCanReview(false);
        }
    };

    const handleAddToCart = async () => {
        if (!book) return;

        try {
            // Create a properly formatted book object for the cart
            const cartBook = {
                id: book.id,
                title: book.title,
                author: book.author,
                price: book.price,
                discount: book.isOnSale ? book.discountPercentage : 0,
                stock: book.stockQuantity,
                rating: book.averageRating,
                isBestseller: false, // Add default value
                image: book.imagePath ? `https://localhost:7149${book.imagePath}` : '/images/book-placeholder.jpg',
            };

            // Call the addToCart function from the context
            await addToCart(cartBook);
            toast.success(`${book.title} added to your cart`);
        } catch (error) {
            console.error('Error adding to cart:', error);
            toast.error('Failed to add book to cart');
        }
    };

    const handleWishlistToggle = () => {
        if (!book) return;

        if (isInWishlist(book.id)) {
            removeFromWishlist(book.id);
            toast.success('Removed from wishlist');
        } else {
            addToWishlist(book.id);
            toast.success('Added to wishlist');
        }
    };

    const handleSubmitReview = async () => {
        if (!book || !comment.trim()) return;

        if (!isAuthenticated()) {
            toast.error('Please login to submit a review');
            navigate('/login');
            return;
        }

        try {
            setSubmittingReview(true);

            const userId = localStorage.getItem('userId');
            if (!userId) {
                toast.error('Authentication required');
                return;
            }

            const reviewData = {
                bookId: book.id,
                userId: parseInt(userId),
                comment: comment.trim(),
                rating
            };

            const response = await addBookReview(reviewData);

            if (response.success) {
                toast.success('Review submitted successfully');
                setShowReviewForm(false);
                setComment('');
                setRating(5);

                // Refresh reviews and status
                await fetchReviews();
                setUserHasReviewed(true); // Update locally to prevent multiple reviews
            } else {
                toast.error(response.error || 'Failed to submit review');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('An error occurred while submitting your review');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p>Loading book details...</p>
                </div>
            </div>
        );
    }

    if (error || !book) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Book not found</h1>
                    <p className="mt-4 text-gray-600">{error || "The book you're looking for doesn't exist."}</p>
                    <Button
                        onClick={() => navigate('/')}
                        className="mt-8"
                    >
                        Go back to homepage
                    </Button>
                </div>
            </div>
        );
    }

    const calculateDiscountedPrice = () => {
        return book.isOnSale && book.discountPercentage > 0
            ? (book.price * (1 - book.discountPercentage / 100)).toFixed(2)
            : book.price.toFixed(2);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-8 hover:bg-gray-100"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                </Button>

                {/* Book Details */}
                <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Book Image */}
                        <div className="relative">
                            <img
                                src={book.imagePath ? `https://localhost:7149${book.imagePath}` : '/placeholder-book.png'}
                                alt={book.title}
                                className="w-full max-w-md mx-auto rounded-lg shadow-lg object-cover"
                            />
                            {book.isOnSale && book.discountPercentage > 0 && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    -{book.discountPercentage}%
                                </div>
                            )}
                        </div>

                        {/* Book Information */}
                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                                <p className="text-xl text-gray-600 mt-2">by {book.author}</p>
                            </div>

                            {/* Badges - These might need to be added to your API response */}
                            <div className="flex flex-wrap gap-2">
                                {book.stockQuantity === 0 && (
                                    <Badge variant="destructive">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Out of Stock
                                    </Badge>
                                )}
                            </div>

                            {/* Price */}
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-primary">
                                    ${calculateDiscountedPrice()}
                                </span>
                                {book.isOnSale && book.discountPercentage > 0 && (
                                    <span className="text-xl text-gray-500 line-through">
                                        ${book.price.toFixed(2)}
                                    </span>
                                )}
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <div className="flex">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={`text-lg ${i < Math.floor(book.averageRating) ? 'text-yellow-400' : 'text-gray-300'
                                                }`}
                                        >
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="text-gray-600">{book.averageRating.toFixed(1)}</span>
                                <span className="text-gray-500">({book.reviewCount} reviews)</span>
                            </div>

                            {/* Description */}
                            <div>
                                <h2 className="text-lg font-semibold mb-2">Description</h2>
                                <p className="text-gray-700 leading-relaxed">{book.description}</p>
                            </div>

                            {/* Book Details Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Genre</p>
                                    <p className="font-medium">{book.genre}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Format</p>
                                    <p className="font-medium">{book.format}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Language</p>
                                    <p className="font-medium">{book.language}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Publisher</p>
                                    <p className="font-medium">{book.publisher}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">ISBN</p>
                                    <p className="font-medium">{book.isbn}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Publication Date</p>
                                    <p className="font-medium">{new Date(book.publicationDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Stock Info */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500 mb-1">Stock Availability</p>
                                <div className="flex items-center justify-between">
                                    <p className={`font-bold text-lg ${book.stockQuantity === 0 ? 'text-red-500' :
                                        book.stockQuantity < 5 ? 'text-orange-500' : 'text-green-500'
                                        }`}>
                                        {book.stockQuantity === 0 ? 'Out of Stock' :
                                            book.stockQuantity < 5 ? `Only ${book.stockQuantity} left` : `${book.stockQuantity} in Stock`}
                                    </p>
                                    <Badge
                                        variant={book.stockQuantity === 0 ? "destructive" :
                                            book.stockQuantity < 5 ? "default" : "secondary"}
                                        className={book.stockQuantity === 0 ? "bg-red-500" :
                                            book.stockQuantity < 5 ? "bg-orange-500" : "bg-green-500"}
                                    >
                                        {book.stockQuantity} units
                                    </Badge>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={book.stockQuantity === 0}
                                    className="flex-1 h-12"
                                >
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    {book.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={handleWishlistToggle}
                                    className="h-12"
                                >
                                    <Heart className={`h-4 w-4 mr-2 ${isInWishlist(book.id) ? 'fill-red-500 text-red-500' : ''
                                        }`} />
                                    {isInWishlist(book.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-lg shadow-sm p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Customer Reviews</h2>
                        {isAuthenticated() && userCanReview && !userHasReviewed && !showReviewForm && (
                            <Button
                                onClick={() => setShowReviewForm(true)}
                                variant="outline"
                            >
                                Write a Review
                            </Button>
                        )}
                        {!isAuthenticated() && (
                            <Button
                                onClick={() => navigate('/login')}
                                variant="outline"
                            >
                                Login to Review
                            </Button>
                        )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && userCanReview && !userHasReviewed && (
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Write Your Review</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Rating</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none"
                                                type="button"
                                            >
                                                <Star
                                                    className={`h-6 w-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Your Review</label>
                                    <Textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Share your thoughts about this book..."
                                        rows={4}
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleSubmitReview}
                                        disabled={submittingReview || !comment.trim()}
                                    >
                                        {submittingReview ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Submitting...
                                            </>
                                        ) : 'Submit Review'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowReviewForm(false);
                                            setComment('');
                                            setRating(5);
                                        }}
                                        disabled={submittingReview}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Reviews List */}
                    {reviewsLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <Card key={review.id}>
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold">{review.userName}</span>
                                                    {review.verified && (
                                                        <Badge variant="secondary" className="text-xs">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Verified Purchase
                                                        </Badge>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="flex">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-gray-700">{review.comment}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500">
                                No reviews yet. {userCanReview && !userHasReviewed ? "Be the first to review this book!" : ""}
                            </p>
                            {isAuthenticated() && !userCanReview && (
                                <p className="mt-2 text-gray-500">
                                    Purchase this book to leave a review.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}