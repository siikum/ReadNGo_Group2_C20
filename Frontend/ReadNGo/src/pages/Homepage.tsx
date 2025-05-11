// @/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { BookCard } from '@/components/BookCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar } from '@/components/NavBar';
import { getBooks } from '@/api/apiConfig';

export const Homepage = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [genreFilter, setGenreFilter] = useState<string>('all');
    const [sortOption, setSortOption] = useState('popularity');
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 8;

    // Fetch books from API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const result = await getBooks();
                if (result.success && result.data) {
                    setBooks(result.data);
                } else {
                    setError(result.error || 'Failed to fetch books');
                }
            } catch (err) {
                setError('Failed to fetch books');
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    // Filter and sort books
    const filteredBooks = books
        .filter(book =>
            book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(book => genreFilter === 'all' ? true : book.genre === genreFilter)
        .sort((a, b) => {
            switch (sortOption) {
                case 'title': return (a.title || '').localeCompare(b.title || '');
                case 'price': return (a.price || 0) - (b.price || 0);
                case 'rating': return (b.averageRating || 0) - (a.averageRating || 0);
                case 'newest': return new Date(b.publicationDate || 0).getTime() - new Date(a.publicationDate || 0).getTime();
                default: // For popularity, you might need to add a popularity field or use review count
                    return (b.reviewCount || 0) - (a.reviewCount || 0);
            }
        });

    // Pagination logic
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

    // Get unique genres from fetched books
    const genres = ['all', ...new Set(books.map(book => book.genre).filter(Boolean))];

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center">Loading books...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-red-600">Error: {error}</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
                {/* Search & Filters */}
                <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
                    <h2 className="text-xl font-semibold mb-4">Find Your Next Read</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by title, author, or description..."
                                value={searchTerm}
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="bg-gray-50 border-gray-200"
                            />
                        </div>

                        <div className="flex gap-4">
                            <Select
                                value={genreFilter}
                                onValueChange={(value) => {
                                    setGenreFilter(value);
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Filter by genre" />
                                </SelectTrigger>
                                <SelectContent>
                                    {genres.map(genre => (
                                        <SelectItem key={genre} value={genre}>
                                            {genre === 'all' ? 'All Genres' : genre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={sortOption}
                                onValueChange={(value) => {
                                    setSortOption(value);
                                    setCurrentPage(1);
                                }}
                            >
                                <SelectTrigger className="w-[180px] bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="popularity">Popularity</SelectItem>
                                    <SelectItem value="title">Title</SelectItem>
                                    <SelectItem value="price">Price</SelectItem>
                                    <SelectItem value="rating">Rating</SelectItem>
                                    <SelectItem value="newest">Newest</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Book Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {currentBooks.map(book => {
                        // Debug: Log what we're passing to BookCard
                        const bookData = {
                            ...book,
                            imagePath: book.imagePath ? `https://localhost:7149${book.imagePath}` : null,
                            // Also try providing alternative property names that BookCard might expect
                            image: book.imagePath ? `https://localhost:7149${book.imagePath}` : null,
                            coverImageUrl: book.imagePath ? `https://localhost:7149${book.imagePath}` : null,
                        };

                        console.log('Passing to BookCard:', bookData);

                        return (
                            <BookCard
                                key={book.id}
                                book={bookData}
                            />
                        );
                    })}
                </div>

                {/* Show message if no books found */}
                {filteredBooks.length === 0 && (
                    <div className="text-center text-gray-600 py-8">
                        No books found matching your criteria.
                    </div>
                )}

                {/* Pagination */}
                {filteredBooks.length > booksPerPage && (
                    <div className="flex justify-center items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>

                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <Button
                                    key={pageNum}
                                    variant={currentPage === pageNum ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => paginate(pageNum)}
                                >
                                    {pageNum}
                                </Button>
                            );
                        })}

                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <span className="px-2">...</span>
                        )}

                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => paginate(totalPages)}
                            >
                                {totalPages}
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Homepage;