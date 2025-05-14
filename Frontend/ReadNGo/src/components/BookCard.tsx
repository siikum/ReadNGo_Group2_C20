// @/components/BookCard.tsx
import { Book } from '@/types/books';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addToWishlist as addToWishlistAPI, removeFromWishlist as removeFromWishlistAPI } from '@/api/apiConfig';
import { useState } from 'react';

interface BookCardProps {
    book: Book;
    onAddToCart?: () => void;
}

export const BookCard = ({ book, onAddToCart }: BookCardProps) => {
    const { addToCart, isInWishlist, addToWishlist: addToWishlistContext, removeFromWishlist: removeFromWishlistContext } = useCart();
    const navigate = useNavigate();
    const [isWishlistLoading, setIsWishlistLoading] = useState(false);

    const calculateDiscountedPrice = () => {
        return book.discount > 0
            ? (book.price * (1 - book.discount / 100)).toFixed(2)
            : book.price.toFixed(2);
    };

    const getImageUrl = () => {
        // Check for typical imagePath pattern from API
        if ('imagePath' in book && book.imagePath) {
            return `https://localhost:7149${book.imagePath}`;
        }

        // Check for image property which might be a full path or filename
        if (book.image) {
            // If it's a path that starts with a slash
            if (book.image.startsWith('/')) {
                return `https://localhost:7149${book.image}`;
            }

            // If it's just a filename (like the one you provided)
            if (!book.image.includes('/') && !book.image.startsWith('http')) {
                return `https://localhost:7149/images/${book.image}`;
            }

            // If it already has https:// or http://, return as is
            return book.image;
        }

        // Fallback to placeholder
        return '/placeholder-book.png';
    };

    const handleCardClick = () => {
        navigate(`/books/${book.id}`);
    };

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.stopPropagation();

        // If onAddToCart prop is provided, use it. Otherwise use context
        if (onAddToCart) {
            onAddToCart();
        } else {
            try {
                await addToCart(book);
            } catch (error) {
                console.error('Error adding to cart:', error);
            }
        }
    };

    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (isWishlistLoading) return; // Prevent multiple clicks

        setIsWishlistLoading(true);

        try {
            const userId = localStorage.getItem('userId');

            if (!userId) {
                console.error('User not authenticated');
                alert("Please log in to add items to your wishlist");
                navigate('/login');
                return;
            }

            const isInWishlistAlready = isInWishlist(book.id);

            if (isInWishlistAlready) {
                // Remove from wishlist
                console.log(`Removing book ${book.id} from wishlist`);
                const result = await removeFromWishlistAPI(parseInt(userId), book.id);

                if (result.success) {
                    // Update local state in context
                    removeFromWishlistContext(book.id);
                    console.log(`${book.title} has been removed from your wishlist`);
                } else {
                    throw new Error(result.error || 'Failed to remove from wishlist');
                }
            } else {
                // Add to wishlist
                console.log(`Adding book ${book.id} to wishlist`);
                const result = await addToWishlistAPI({
                    userId: parseInt(userId),
                    bookId: book.id
                });

                if (result.success) {
                    // Update local state in context
                    addToWishlistContext(book.id);
                    console.log(`${book.title} has been added to your wishlist`);
                } else {
                    throw new Error(result.error || 'Failed to add to wishlist');
                }
            }
        } catch (error) {
            console.error('Error toggling wishlist status:', error);
            alert(error instanceof Error ? error.message : 'An error occurred with your wishlist');
        } finally {
            setIsWishlistLoading(false);
        }
    };

    const inWishlist = isInWishlist(book.id);

    const imageUrl = getImageUrl();

    return (
        <Card
            className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
            onClick={handleCardClick}
        >
            <div className="relative aspect-[3/4] overflow-hidden">
                <img
                    src={imageUrl}
                    alt={book.title}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                        // Use a placeholder image if the original fails to load
                        const img = e.target as HTMLImageElement;
                        if (!img.dataset.usedFallback) {
                            img.dataset.usedFallback = 'true';
                            console.error(`Failed to load image: ${img.src}`);
                            img.src = '/placeholder-book.png';
                        }
                    }}
                />

                {/* Wishlist Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                    onClick={handleWishlistToggle}
                    disabled={isWishlistLoading}
                >
                    {isWishlistLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Heart
                            className={`h-4 w-4 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                        />
                    )}
                </Button>

                {book.discount > 0 && (
                    <Badge className="absolute top-2 left-2 bg-red-500">
                        -{book.discount}%
                    </Badge>
                )}

                {book.stock === 0 && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Badge variant="secondary" className="text-lg">Out of Stock</Badge>
                    </div>
                )}
            </div>

            <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-1">{book.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{book.author}</p>

                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-primary">
                        Rs. {calculateDiscountedPrice()}
                    </span>
                    {book.discount > 0 && (
                        <span className="text-sm text-gray-500 line-through">
                            Rs. {book.price.toFixed(2)}
                        </span>
                    )}
                </div>

                {book.isBestseller && (
                    <Badge variant="secondary" className="text-xs">
                        Bestseller
                    </Badge>
                )}
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full"
                    onClick={handleAddToCart}
                    disabled={book.stock === 0}
                >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </CardFooter>
        </Card>
    );
};