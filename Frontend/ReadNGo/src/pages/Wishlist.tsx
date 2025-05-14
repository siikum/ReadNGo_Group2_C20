// @/pages/Wishlist.tsx
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/NavBar';
import { BookCard } from '@/components/BookCard';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getWishlist } from '@/api/apiConfig';
import { getBooks } from '@/api/apiConfig';

// Define a book type that matches what the API returns
interface Book {
    id: number;
    title: string;
    author: string;
    genre?: string;
    language?: string;
    format?: string;
    publisher?: string;
    price: number;
    discount: number;
    stock: number;
    rating: number;
    isBestseller?: boolean;
    image: string;
}

export default function Wishlist() {
    const { wishlist, addToWishlist } = useCart();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [wishlistBooks, setWishlistBooks] = useState<Book[]>([]);

    const fetchWishlistBooks = async (showRefreshing = false) => {
        try {
            if (showRefreshing) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            // Get userId from localStorage
            const userId = localStorage.getItem('userId');

            if (!userId) {
                setError('User not authenticated');
                navigate('/login');
                return;
            }

            // Fetch wishlist from API
            const wishlistResult = await getWishlist(parseInt(userId));

            if (!wishlistResult.success) {
                throw new Error(wishlistResult.error || 'Failed to fetch wishlist');
            }

            // Extract book IDs from the wishlist result
            const wishlistIds: number[] = [];

            if (Array.isArray(wishlistResult.data)) {
                wishlistResult.data.forEach(item => {
                    if (typeof item === 'number') {
                        wishlistIds.push(item);
                    } else if (typeof item === 'object' && item !== null) {
                        const id = item.bookId || item.id;
                        if (typeof id === 'number') {
                            wishlistIds.push(id);
                        }
                    }
                });
            }

            // Update the wishlist in context to keep it synchronized
            if (addToWishlist && wishlistIds.length > 0) {
                wishlistIds.forEach(id => {
                    if (!wishlist.includes(id)) {
                        addToWishlist(id);
                    }
                });
            }

            // Fetch all books to filter the ones in wishlist
            const booksResult = await getBooks();

            if (!booksResult.success) {
                throw new Error(booksResult.error || 'Failed to fetch books');
            }

            // Filter books that are in the wishlist
            const filteredBooks = booksResult.data.filter(book =>
                wishlistIds.includes(book.id)
            );

            setWishlistBooks(filteredBooks);
        } catch (err) {
            console.error('Error fetching wishlist:', err);
            setError(err instanceof Error ? err.message : 'An error occurred while fetching your wishlist');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchWishlistBooks();
    }, [navigate]);

    // Function to handle refresh button click
    const handleRefresh = () => {
        fetchWishlistBooks(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-gray-500">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Error</h2>
                    <p className="text-gray-500 mb-8">{error}</p>
                    <Button onClick={() => navigate('/')} variant="default">
                        Return to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Heart className="h-6 w-6 text-red-500 fill-red-500" />
                        <h1 className="text-2xl font-bold">My Wishlist</h1>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        {refreshing ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Refreshing...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </>
                        )}
                    </Button>
                </div>

                {wishlistBooks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {wishlistBooks.map(book => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-500 mb-8">
                            Start adding books you love to your wishlist!
                        </p>
                        <Button
                            onClick={() => navigate('/')}
                            variant="default"
                        >
                            Browse Books
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}