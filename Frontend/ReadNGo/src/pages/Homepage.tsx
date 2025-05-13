// @/pages/HomePage.tsx
import { useEffect, useState } from "react";
import {
    booksFilter,
    booksSearchByTitle,
    getDistinctAuthors,
    getDistinctGenres,
    getDistinctLanguages,
    getDistinctFormats
} from "@/api/apiConfig";
import { BookCard } from "@/components/BookCard";
import { Navbar } from "@/components/NavBar";
import { Book } from "@/types/books";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Pagination from "@/components/Pagination";
import { toast } from "sonner";
import { ArrowUpDown } from "lucide-react";

interface FilterState {
    author: string;
    genre: string;
    format: string;
    language: string;
    availableInLibrary: string;
    minPrice: string;
    maxPrice: string;
    sortBy: string;
}

// Extended Book interface to include genre, language, and format
interface ExtendedBook extends Book {
    genre?: string;
    language?: string;
    format?: string;
}

export default function HomePage() {
    const [books, setBooks] = useState<ExtendedBook[]>([]);
    const [allBooks, setAllBooks] = useState<ExtendedBook[]>([]);
    const [searchResults, setSearchResults] = useState<ExtendedBook[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filters, setFilters] = useState<FilterState>({
        author: "",
        genre: "",
        format: "",
        language: "",
        availableInLibrary: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "default"
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [authors, setAuthors] = useState<string[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [formats, setFormats] = useState<string[]>([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isFilterExpanded, setIsFilterExpanded] = useState(false);
    const itemsPerPage = 12;

    useEffect(() => {
        fetchDropdownData();
        fetchBooks();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, searchResults, allBooks, isSearchActive]);

    const fetchDropdownData = async () => {
        try {
            const [authorsResponse, genresResponse, languagesResponse, formatsResponse] = await Promise.all([
                getDistinctAuthors(),
                getDistinctGenres(),
                getDistinctLanguages(),
                getDistinctFormats()
            ]);

            if (authorsResponse.success && authorsResponse.data) {
                const validAuthors = authorsResponse.data.filter(author => author && author.trim());
                setAuthors(validAuthors);
            }
            if (genresResponse.success && genresResponse.data) {
                const validGenres = genresResponse.data.filter(genre => genre && genre.trim());
                setGenres(validGenres);
            }
            if (languagesResponse.success && languagesResponse.data) {
                const validLanguages = languagesResponse.data.filter(language => language && language.trim());
                setLanguages(validLanguages);
            }
            if (formatsResponse.success && formatsResponse.data) {
                const validFormats = formatsResponse.data.filter(format => format && format.trim());
                setFormats(validFormats);
            }
        } catch (error) {
            console.error("Error fetching dropdown data:", error);
        }
    };

    const fetchBooks = async () => {
        try {
            const queryParams: any = {};
            const response = await booksFilter(queryParams);
            if (response.success && response.data) {
                // Map to BookCard's Book type structure with extended properties
                const mappedBooks = response.data.map(book => ({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    discount: book.isOnSale ? book.discountPercentage : 0,
                    image: book.imagePath ? `https://localhost:7149${book.imagePath}` : "/placeholder-book.jpg",
                    rating: book.averageRating || 0,
                    stock: book.stockQuantity,
                    isBestseller: false, // Assuming this data isn't available from API
                    // Add these properties to enable filtering
                    genre: book.genre,
                    language: book.language,
                    format: book.format
                }));
                setAllBooks(mappedBooks);
                setBooks(mappedBooks);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("Error fetching books:", error);
        }
    };

    const applyFilters = () => {
        let booksToFilter = isSearchActive ? searchResults : allBooks;

        let filteredBooks = booksToFilter.filter(book => {
            if (filters.author && book.author !== filters.author) return false;
            if (filters.genre && book.genre !== filters.genre) return false;
            if (filters.language && book.language !== filters.language) return false;
            if (filters.format && book.format !== filters.format) return false;
            if (filters.availableInLibrary === "yes" && book.stock <= 0) return false;
            if (filters.availableInLibrary === "no" && book.stock > 0) return false;
            if (filters.minPrice && book.price < parseFloat(filters.minPrice)) return false;
            if (filters.maxPrice && book.price > parseFloat(filters.maxPrice)) return false;
            return true;
        });

        // Apply sorting
        if (filters.sortBy !== "default") {
            filteredBooks = sortBooks(filteredBooks, filters.sortBy);
        }

        setBooks(filteredBooks);
        setCurrentPage(1);
    };

    const sortBooks = (booksToSort: Book[], sortBy: string) => {
        const sorted = [...booksToSort];

        switch (sortBy) {
            case "price-low-high":
                sorted.sort((a, b) => {
                    const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
                    const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
                    return priceA - priceB;
                });
                break;
            case "price-high-low":
                sorted.sort((a, b) => {
                    const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
                    const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
                    return priceB - priceA;
                });
                break;
            case "bestsellers":
                sorted.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
                break;
            case "rating-high-low":
                sorted.sort((a, b) => b.rating - a.rating);
                break;
            case "title-a-z":
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case "title-z-a":
                sorted.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                // Default sorting (no sorting)
                break;
        }

        return sorted;
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!searchQuery.trim()) {
            setIsSearchActive(false);
            setSearchResults([]);
            return;
        }

        try {
            const response = await booksSearchByTitle(searchQuery.trim());

            if (response.success && response.data) {
                // Map to BookCard's Book type structure with extended properties
                const mappedBooks = response.data.map(book => ({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    price: book.price,
                    discount: book.isOnSale ? book.discountPercentage : 0,
                    image: book.imagePath ? `https://localhost:7149${book.imagePath}` : "/placeholder-book.jpg",
                    rating: book.averageRating || 0,
                    stock: book.stockQuantity,
                    isBestseller: false,
                    // Add these properties to enable filtering
                    genre: book.genre,
                    language: book.language,
                    format: book.format
                }));
                setIsSearchActive(true);
                setSearchResults(mappedBooks);
            } else {
                console.log("Search failed:", response.error);
                toast.error("Search Failed", {
                    description: response.error || "An error occurred while searching",
                });
            }
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Search Error", {
                description: "An unexpected error occurred while searching",
            });
        }
    };

    const resetFiltersAndSearch = () => {
        setSearchQuery("");
        setIsSearchActive(false);
        setSearchResults([]);
        setFilters({
            author: "",
            genre: "",
            format: "",
            language: "",
            availableInLibrary: "",
            minPrice: "",
            maxPrice: "",
            sortBy: "default"
        });
    };

    const totalPages = Math.ceil(books.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBooks = books.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleFilters = () => {
        setIsFilterExpanded(!isFilterExpanded);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-2xl font-bold mb-6">Explore Books</h1>

                    <form onSubmit={handleSearch} className="mb-6 flex gap-4 flex-wrap">
                        <Input
                            type="text"
                            placeholder="Search books by title, author, or ISBN..."
                            className="flex-1 min-w-[300px]"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button type="submit">Search</Button>
                        <Button type="button" variant="outline" onClick={toggleFilters}>
                            {isFilterExpanded ? "Hide Filters" : "Show Filters"}
                        </Button>
                        <Button type="button" variant="secondary" onClick={resetFiltersAndSearch}>
                            Reset All
                        </Button>
                    </form>

                    {isFilterExpanded && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Author</label>
                                <Select
                                    value={filters.author || "all"}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, author: value === "all" ? "" : value }))}
                                >
                                    <SelectTrigger>
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

                            <div>
                                <label className="text-sm font-medium mb-1 block">Genre</label>
                                <Select
                                    value={filters.genre || "all"}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, genre: value === "all" ? "" : value }))}
                                >
                                    <SelectTrigger>
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

                            <div>
                                <label className="text-sm font-medium mb-1 block">Language</label>
                                <Select
                                    value={filters.language || "all"}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, language: value === "all" ? "" : value }))}
                                >
                                    <SelectTrigger>
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

                            <div>
                                <label className="text-sm font-medium mb-1 block">Format</label>
                                <Select
                                    value={filters.format || "all"}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, format: value === "all" ? "" : value }))}
                                >
                                    <SelectTrigger>
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

                            <div>
                                <label className="text-sm font-medium mb-1 block">Availability</label>
                                <Select
                                    value={filters.availableInLibrary || "all"}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, availableInLibrary: value === "all" ? "" : value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select Availability" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Books</SelectItem>
                                        <SelectItem value="yes">In Stock</SelectItem>
                                        <SelectItem value="no">Out of Stock</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Min Price</label>
                                <Input
                                    type="number"
                                    placeholder="Min price"
                                    min="0"
                                    step="0.01"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium mb-1 block">Max Price</label>
                                <Input
                                    type="number"
                                    placeholder="Max price"
                                    min="0"
                                    step="0.01"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-2">
                            {isSearchActive && searchQuery && (
                                <div className="p-2 bg-blue-100 text-blue-800 rounded-md text-sm">
                                    Search results for: "{searchQuery}"
                                </div>
                            )}
                            {Object.entries(filters).some(([key, value]) => value && key !== "sortBy") && (
                                <div className="p-2 bg-green-100 text-green-800 rounded-md text-sm">
                                    Filters applied
                                </div>
                            )}
                            <div className="text-sm text-gray-600">
                                {books.length} books found
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center">
                                <Select
                                    value={filters.sortBy}
                                    onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                                >
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="default">Default</SelectItem>
                                        <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                                        <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                                        <SelectItem value="bestsellers">Bestsellers</SelectItem>
                                        <SelectItem value="rating-high-low">Rating</SelectItem>
                                        <SelectItem value="title-a-z">Title: A to Z</SelectItem>
                                        <SelectItem value="title-z-a">Title: Z to A</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                {books.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {currentBooks.map((book) => (
                            <div key={book.id}>
                                <BookCard book={book} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Books Found</h3>
                        <p className="text-gray-500">
                            We couldn't find any books matching your criteria. Try adjusting your filters or search terms.
                        </p>
                    </div>
                )}

                {books.length > 0 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                            itemsPerPage={itemsPerPage}
                            totalItems={books.length}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}