// @/pages/BookDetail.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ShoppingCart, Heart, Award, TrendingUp, Sparkle, AlertTriangle, Star, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBooks } from '@/api/apiConfig';

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
    const {
        addToCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        getBookReviews,
        addReview,
        hasUserReviewedBook,
        canUserReviewBook
    } = useCart();

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    // Fetch book details
    useEffect(() => {
        const fetchBookDetails = async () => {
            try {
                setLoading(true);
                const result = await getBooks();
                if (result.success && result.data) {
                    const foundBook = result.data.find(b => b.id === parseInt(id || '0'));
                    if (foundBook) {
                        setBook(foundBook);
                    } else {
                        setError('Book not found');
                    }
                } else {
                    setError(result.error || 'Failed to fetch book details');
                }
            } catch (err) {
                setError('Failed to fetch book details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBookDetails();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
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

    const reviews = getBookReviews(book.id);
    const canReview = canUserReviewBook(book.id) && !hasUserReviewedBook(book.id);

    const calculateDiscountedPrice = () => {
        return book.isOnSale && book.discountPercentage > 0
            ? (book.price * (1 - book.discountPercentage / 100)).toFixed(2)
            : book.price.toFixed(2);
    };

    const handleAddToCart = async () => {
        if (!book) return;

        try {
            setIsAddingToCart(true);

            // Get the userId from localStorage
            const userId = localStorage.getItem('userId');
            if (!userId) {
                navigate('/login');
                return;
            }

            // Directly call the API function to ensure correct userId is used
            const cartData = {
                userId: parseInt(userId),
                bookId: book.id,
                quantity: 1
            };

            // Option 1: Call API directly (most reliable)
            const response = await addToCartAPI(cartData);

            if (response.success) {
                // You can still call the context method for local state update
                // but with correct book structure
                const cartBook = {
                    id: book.id, // This should match what your CartItem expects
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    genre: book.genre,
                    format: book.format,
                    stock: book.stockQuantity,
                    rating: book.averageRating,
                    image: book.imagePath ? `https://localhost:7149${book.imagePath}` : '/images/book-placeholder.jpg',
                    // Add other fields as needed
                };

                // Call context method for local state
                await addToCart(cartBook);

                alert('Book added to cart successfully!');

                // Navigate to cart with state to trigger refresh
                navigate('/cart', { state: { bookAdded: Date.now() } });
            } else {
                throw new Error(response.error || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('Failed to add book to cart. Please try again.');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleWishlistToggle = () => {
        if (isInWishlist(book.id)) {
            removeFromWishlist(book.id);
        } else {
            addToWishlist(book.id);
        }
    };

    const handleSubmitReview = () => {
        if (comment.trim()) {
            addReview({
                bookId: book.id,
                userId: 1, // Mock user ID
                rating,
                comment: comment.trim(),
                verified: true
            });
            setShowReviewForm(false);
            setComment('');
            setRating(5);
        }
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
                        {canReview && !showReviewForm && (
                            <Button
                                onClick={() => setShowReviewForm(true)}
                                variant="outline"
                            >
                                Write a Review
                            </Button>
                        )}
                    </div>

                    {/* Review Form */}
                    {showReviewForm && canReview && (
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
                                    <Button onClick={handleSubmitReview}>Submit Review</Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setShowReviewForm(false);
                                            setComment('');
                                            setRating(5);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Reviews List */}
                    {reviews.length > 0 ? (
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
                                                <p className="text-sm text-gray-500">{review.date}</p>
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
                        <p className="text-gray-500 text-center py-8">
                            No reviews yet. Be the first to review this book!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}