// @/pages/BookDetail.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/NavBar';
import { books } from '@/Data/book';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { ArrowLeft, ShoppingCart, Heart, Award, TrendingUp, Sparkle, AlertTriangle, Star, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const book = books.find(b => b.id === parseInt(id || '0'));
  
  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Book not found</h1>
          <p className="mt-4 text-gray-600">The book you're looking for doesn't exist.</p>
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
    return book.discount > 0 
      ? (book.price * (1 - book.discount / 100)).toFixed(2)
      : book.price.toFixed(2);
  };

  const handleAddToCart = () => {
    addToCart(book);
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
                src={book.image}
                alt={book.title}
                className="w-full max-w-md mx-auto rounded-lg shadow-lg object-cover"
              />
              {book.discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  -{book.discount}%
                </div>
              )}
            </div>

            {/* Book Information */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                <p className="text-xl text-gray-600 mt-2">by {book.author}</p>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {book.isBestseller && (
                  <Badge className="bg-blue-500">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Bestseller
                  </Badge>
                )}
                {book.isAwardWinner && (
                  <Badge className="bg-purple-500">
                    <Award className="h-3 w-3 mr-1" />
                    Award Winner
                  </Badge>
                )}
                {book.isNewRelease && (
                  <Badge className="bg-green-500">
                    <Sparkle className="h-3 w-3 mr-1" />
                    New Release
                  </Badge>
                )}
                {book.stock === 0 && (
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
                {book.discount > 0 && (
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
                      className={`text-lg ${
                        i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-gray-600">{book.rating}</span>
                <span className="text-gray-500">({reviews.length} reviews)</span>
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
              </div>

              {/* Stock Info */}
              <div>
                <p className="text-sm text-gray-500">Stock</p>
                <p className={`font-medium ${
                  book.stock === 0 ? 'text-red-500' : 
                  book.stock < 5 ? 'text-orange-500' : 'text-green-500'
                }`}>
                  {book.stock === 0 ? 'Out of Stock' : 
                   book.stock < 5 ? `Only ${book.stock} left` : 'In Stock'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={book.stock === 0}
                  className="flex-1 h-12"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className="h-12"
                >
                  <Heart className={`h-4 w-4 mr-2 ${
                    isInWishlist(book.id) ? 'fill-red-500 text-red-500' : ''
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
                          className={`h-6 w-6 ${
                            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
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
                            className={`h-4 w-4 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
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