// @/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { BookCard } from '@/components/BookCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import { Navbar } from '@/components/NavBar';
import { 
    getBooks, 
    booksFilter, 
    booksSearchByTitle, 
    getDistinctAuthors, 
    getDistinctGenres, 
    getDistinctLanguages, 
    getDistinctFormats 
} from '@/api/apiConfig';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

export const Homepage = () => {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const booksPerPage = 8;

    // All filter states
    const [filters, setFilters] = useState({
        genre: 'all',
        author: 'all',
        language: 'all',
        format: 'all',
        availability: 'all',
        minPrice: '',
        maxPrice: '',
        minRating: ''
    });

    // Sort options
    const [sortOption, setSortOption] = useState('popularity');
    
    // Options for dropdowns
    const [genres, setGenres] = useState<string[]>([]);
    const [authors, setAuthors] = useState<string[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [formats, setFormats] = useState<string[]>([]);
    
    // Active filters count
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);
    
    // Search results state
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);

    const { addToCart } = useCart();

    // Handle adding book to cart
    const handleAddToCart = async (book: any) => {
        try {
            // Map the book data to match expected cart format
            const cartBook = {
                ...book,
                image: book.imagePath ? `https://localhost:7149${book.imagePath}` : '/placeholder-book.png',
                stock: book.stockQuantity,
                discount: book.discountPercentage,
                rating: book.averageRating,
                isBestseller: book.category === 'Bestsellers',
                isAwardWinner: book.category === 'Award Winners',
                isNewRelease: book.category === 'New Releases',
                popularity: book.reviewCount || 0
            };
            await addToCart(cartBook);
            alert('Book added to cart successfully!');
        } catch (error) {
            alert('Failed to add book to cart. Please try again.');
            console.error('Error adding to cart:', error);
        }
    };

    // Fetch all dropdown data
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [authorsResponse, genresResponse, languagesResponse, formatsResponse] = await Promise.all([
                    getDistinctAuthors(),
                    getDistinctGenres(),
                    getDistinctLanguages(),
                    getDistinctFormats()
                ]);

                if (authorsResponse.success && authorsResponse.data) {
                    setAuthors(authorsResponse.data);
                }
                if (genresResponse.success && genresResponse.data) {
                    setGenres(genresResponse.data);
                }
                if (languagesResponse.success && languagesResponse.data) {
                    setLanguages(languagesResponse.data);
                }
                if (formatsResponse.success && formatsResponse.data) {
                    setFormats(formatsResponse.data);
                }
            } catch (err) {
                console.error("Error fetching dropdown data:", err);
            }
        };

        fetchDropdownData();
    }, []);

    // Fetch books from API
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                // Use booksFilter instead of getBooks to apply filters from the start
                const result = await booksFilter();
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

    // Count active filters
    useEffect(() => {
        let count = 0;
        if (filters.genre !== 'all') count++;
        if (filters.author !== 'all') count++;
        if (filters.language !== 'all') count++;
        if (filters.format !== 'all') count++;
        if (filters.availability !== 'all') count++;
        if (filters.minPrice) count++;
        if (filters.maxPrice) count++;
        if (filters.minRating) count++;
        
        setActiveFiltersCount(count);
    }, [filters]);

    // Apply filters and search
    const applyFiltersAndSearch = async () => {
        setLoading(true);
        try {
            let queryParams: any = {};
            
            // Add filter parameters
            if (filters.genre !== 'all') queryParams.genre = filters.genre;
            if (filters.author !== 'all') queryParams.author = filters.author;
            if (filters.language !== 'all') queryParams.language = filters.language;
            if (filters.format !== 'all') queryParams.format = filters.format;
            if (filters.availability === 'yes') queryParams.availableInLibrary = true;
            if (filters.availability === 'no') queryParams.availableInLibrary = false;
            if (filters.minPrice) queryParams.minPrice = parseFloat(filters.minPrice);
            if (filters.maxPrice) queryParams.maxPrice = parseFloat(filters.maxPrice);
            if (filters.minRating) queryParams.minRating = parseFloat(filters.minRating);

            let response;
            
            // If search is active, use search endpoint
            if (searchTerm) {
                response = await booksSearchByTitle(searchTerm);
                setIsSearchActive(true);
                
                // If we have filters active, manually filter the search results
                if (Object.keys(queryParams).length > 0 && response.success && response.data) {
                    let filteredResults = response.data.filter((book: any) => {
                        if (filters.genre !== 'all' && book.genre !== filters.genre) return false;
                        if (filters.author !== 'all' && book.author !== filters.author) return false;
                        if (filters.language !== 'all' && book.language !== filters.language) return false;
                        if (filters.format !== 'all' && book.format !== filters.format) return false;
                        if (filters.availability === 'yes' && book.stockQuantity <= 0) return false;
                        if (filters.availability === 'no' && book.stockQuantity > 0) return false;
                        if (filters.minPrice && book.price < parseFloat(filters.minPrice)) return false;
                        if (filters.maxPrice && book.price > parseFloat(filters.maxPrice)) return false;
                        if (filters.minRating && book.averageRating < parseFloat(filters.minRating)) return false;
                        return true;
                    });
                    setBooks(filteredResults);
                    setSearchResults(response.data);
                } else if (response.success && response.data) {
                    setBooks(response.data);
                    setSearchResults(response.data);
                }
            } else {
                // Otherwise use filter endpoint
                response = await booksFilter(queryParams);
                setIsSearchActive(false);
                
                if (response.success && response.data) {
                    setBooks(response.data);
                }
            }
            
            setCurrentPage(1);
            
            if (!response.success) {
                setError(response.error || 'Failed to fetch books');
            }
        } catch (err) {
            console.error('Error applying filters:', err);
            setError('Failed to apply filters');
        } finally {
            setLoading(false);
        }
    };

    // Handle search submit
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        applyFiltersAndSearch();
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            genre: 'all',
            author: 'all',
            language: 'all',
            format: 'all',
            availability: 'all',
            minPrice: '',
            maxPrice: '',
            minRating: ''
        });
        setSearchTerm('');
        setIsSearchActive(false);
        setCurrentPage(1);
        
        // Fetch all books again
        const fetchAllBooks = async () => {
            setLoading(true);
            try {
                const result = await booksFilter();
                if (result.success && result.data) {
                    setBooks(result.data);
                }
            } catch (err) {
                console.error('Error fetching books:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAllBooks();
    };

    // Update filter state
    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    // Sort books
    const sortBooks = (books: any[]) => {
        return [...books].sort((a, b) => {
            switch (sortOption) {
                case 'title':
                    return (a.title || '').localeCompare(b.title || '');
                case 'title_desc':
                    return (b.title || '').localeCompare(a.title || '');
                case 'author':
                    return (a.author || '').localeCompare(b.author || '');
                case 'author_desc':
                    return (b.author || '').localeCompare(a.author || '');
                case 'price':
                    return (a.price || 0) - (b.price || 0);
                case 'price_desc':
                    return (b.price || 0) - (a.price || 0);
                case 'rating':
                    return (b.averageRating || 0) - (a.averageRating || 0);
                case 'rating_desc':
                    return (a.averageRating || 0) - (b.averageRating || 0);
                case 'newest':
                    return new Date(b.publicationDate || 0).getTime() - new Date(a.publicationDate || 0).getTime();
                case 'oldest':
                    return new Date(a.publicationDate || 0).getTime() - new Date(b.publicationDate || 0).getTime();
                case 'arrival_newest':
                    return new Date(b.arrivalDate || 0).getTime() - new Date(a.arrivalDate || 0).getTime();
                case 'arrival_oldest':
                    return new Date(a.arrivalDate || 0).getTime() - new Date(b.arrivalDate || 0).getTime();
                default: // For popularity
                    return (b.reviewCount || 0) - (a.reviewCount || 0);
            }
        });
    };

    // Apply sort to books
    const sortedBooks = sortBooks(books);

    // Pagination logic
    const indexOfLastBook = currentPage * booksPerPage;
    const indexOfFirstBook = indexOfLastBook - booksPerPage;
    const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);
    const totalPages = Math.ceil(sortedBooks.length / booksPerPage);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    // Calculate discounted price for display
    const calculateDiscountedPrice = (price: number, discountPercentage: number) => {
        return (price * (1 - discountPercentage / 100)).toFixed(2);
    };

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
                    <form onSubmit={handleSearch} className="mb-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Input
                                    placeholder="Search by title, author, or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-gray-50 border-gray-200 pr-10"
                                />
                                {searchTerm && (
                                    <button 
                                        type="button"
                                        className="absolute right-10 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        onClick={() => setSearchTerm('')}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                )}
                                <button 
                                    type="submit"
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <Search className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                                    Search
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={resetFilters}
                                    className="border-gray-300"
                                >
                                    Reset
                                </Button>
                            </div>
                        </div>
                    </form>

                    {/* Active filters indicators */}
                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                                {activeFiltersCount} {activeFiltersCount === 1 ? 'filter' : 'filters'} applied
                            </Badge>
                            
                            {filters.genre !== 'all' && (
                                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                                    Genre: {filters.genre}
                                    <X 
                                        className="h-3 w-3 ml-1 cursor-pointer" 
                                        onClick={() => {
                                            handleFilterChange('genre', 'all');
                                            setTimeout(() => applyFiltersAndSearch(), 100);
                                        }}
                                    />
                                </Badge>
                            )}
                            
                            {filters.author !== 'all' && (
                                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                                    Author: {filters.author}
                                    <X 
                                        className="h-3 w-3 ml-1 cursor-pointer" 
                                        onClick={() => {
                                            handleFilterChange('author', 'all');
                                            setTimeout(() => applyFiltersAndSearch(), 100);
                                        }}
                                    />
                                </Badge>
                            )}
                            
                            {filters.language !== 'all' && (
                                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                                    Language: {filters.language}
                                    <X 
                                        className="h-3 w-3 ml-1 cursor-pointer" 
                                        onClick={() => {
                                            handleFilterChange('language', 'all');
                                            setTimeout(() => applyFiltersAndSearch(), 100);
                                        }}
                                    />
                                </Badge>
                            )}
                            
                            {filters.format !== 'all' && (
                                <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
                                    Format: {filters.format}
                                    <X 
                                        className="h-3 w-3 ml-1 cursor-pointer" 
                                        onClick={() => {
                                            handleFilterChange('format', 'all');
                                            setTimeout(() => applyFiltersAndSearch(), 100);
                                        }}
                                    />
                                </Badge>
                            )}
                        </div>
                    )}

                    {/* Simple Filter Dropdowns */}
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Genre Filter */}
                        <div>
                            <Select
                                value={filters.genre}
                                onValueChange={(value) => {
                                    handleFilterChange('genre', value);
                                    setTimeout(() => applyFiltersAndSearch(), 100);
                                }}
                            >
                                <SelectTrigger className="bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Select Genre" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Genres</SelectItem>
                                    {genres.map(genre => (
                                        <SelectItem key={genre} value={genre}>
                                            {genre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Author Filter */}
                        <div>
                            <Select
                                value={filters.author}
                                onValueChange={(value) => {
                                    handleFilterChange('author', value);
                                    setTimeout(() => applyFiltersAndSearch(), 100);
                                }}
                            >
                                <SelectTrigger className="bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Select Author" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Authors</SelectItem>
                                    {authors.map(author => (
                                        <SelectItem key={author} value={author}>
                                            {author}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Language Filter */}
                        <div>
                            <Select
                                value={filters.language}
                                onValueChange={(value) => {
                                    handleFilterChange('language', value);
                                    setTimeout(() => applyFiltersAndSearch(), 100);
                                }}
                            >
                                <SelectTrigger className="bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Select Language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Languages</SelectItem>
                                    {languages.map(language => (
                                        <SelectItem key={language} value={language}>
                                            {language}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        {/* Format Filter */}
                        <div>
                            <Select
                                value={filters.format}
                                onValueChange={(value) => {
                                    handleFilterChange('format', value);
                                    setTimeout(() => applyFiltersAndSearch(), 100);
                                }}
                            >
                                <SelectTrigger className="bg-gray-50 border-gray-200">
                                    <SelectValue placeholder="Select Format" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Formats</SelectItem>
                                    {formats.map(format => (
                                        <SelectItem key={format} value={format}>
                                            {format}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    
                    {/* Sort Option */}
                    <div className="mt-4">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Sort by:</span>
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
                                    <SelectItem value="title">Title (A-Z)</SelectItem>
                                    <SelectItem value="title_desc">Title (Z-A)</SelectItem>
                                    <SelectItem value="author">Author (A-Z)</SelectItem>
                                    <SelectItem value="author_desc">Author (Z-A)</SelectItem>
                                    <SelectItem value="price">Price (Low to High)</SelectItem>
                                    <SelectItem value="price_desc">Price (High to Low)</SelectItem>
                                    <SelectItem value="rating">Rating (High to Low)</SelectItem>
                                    <SelectItem value="rating_desc">Rating (Low to High)</SelectItem>
                                    <SelectItem value="newest">Publication Date (Newest)</SelectItem>
                                    <SelectItem value="oldest">Publication Date (Oldest)</SelectItem>
                                    <SelectItem value="arrival_newest">Arrival Date (Newest)</SelectItem>
                                    <SelectItem value="arrival_oldest">Arrival Date (Oldest)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Results Summary */}
                <div className="mb-6">
                    {isSearchActive && (
                        <div className="p-2 bg-blue-50 rounded-md">
                            <p className="text-blue-700">
                                Showing search results for: "{searchTerm}"
                            </p>
                        </div>
                    )}
                    
                    <p className="text-sm text-gray-600 mt-2">
                        {sortedBooks.length} books found
                    </p>
                </div>

                {/* Book Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
                    {currentBooks.map(book => {
                        // Prepare book data with all necessary properties
                        const bookData = {
                            ...book,
                            // Map properties to match what BookCard expects
                            image: book.imagePath ? `https://localhost:7149${book.imagePath}` : '/placeholder-book.png',
                            stock: book.stockQuantity,
                            discount: book.discountPercentage,
                            rating: book.averageRating,
                            // Add default values for properties not in API
                            isBestseller: book.category === 'Bestsellers',
                            isAwardWinner: book.category === 'Award Winners',
                            isNewRelease: book.category === 'New Releases',
                            popularity: book.reviewCount || 0,
                            // Format price display
                            formattedPrice: `NPR ${book.price.toFixed(2)}`,
                            formattedDiscountedPrice: book.isOnSale ? 
                                `NPR ${calculateDiscountedPrice(book.price, book.discountPercentage)}` : 
                                null
                        };

                        return (
                            <BookCard
                                key={book.id}
                                book={bookData}
                                onAddToCart={() => handleAddToCart(book)}
                            />
                        );
                    })}
                </div>

                {/* Show message if no books found */}
                {sortedBooks.length === 0 && (
                    <div className="text-center text-gray-600 py-8 bg-white rounded-lg shadow-sm">
                        <p className="text-lg font-medium">No books found matching your criteria.</p>
                        <p className="mt-2">Try adjusting your filters or search term.</p>
                        <Button 
                            className="mt-4" 
                            variant="outline"
                            onClick={resetFilters}
                        >
                            Reset All Filters
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {sortedBooks.length > booksPerPage && (
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