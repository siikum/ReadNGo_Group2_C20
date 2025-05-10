import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { booksFilter, booksSearchByTitle } from "@/api/apiConfig";

// Define interface for book data
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
    description: string;
    isbn: string;
    stockQuantity: number;
    averageRating: number;
    reviewCount: number;
    actualPrice?: number; // Added from API response
}

// Define interface for filter options
interface FilterOptions {
    genre: string;
    author: string;
    format: string;
    language: string;
    publisher: string;
}

export default function FilteredBooksTable() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isSearching, setIsSearching] = useState<boolean>(false);

    // Filter states
    const [filters, setFilters] = useState<FilterOptions>({
        genre: "",
        author: "",
        format: "",
        language: "",
        publisher: ""
    });

    // Available filter options (populated from API data)
    const [availableFilters, setAvailableFilters] = useState<{
        genres: string[];
        authors: string[];
        formats: string[];
        languages: string[];
        publishers: string[];
    }>({
        genres: [],
        authors: [],
        formats: [],
        languages: [],
        publishers: []
    });

    // Handle filter change
    const handleFilterChange = (filterName: keyof FilterOptions, value: string) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Reset all filters
    const resetFilters = () => {
        setFilters({
            genre: "",
            author: "",
            format: "",
            language: "",
            publisher: ""
        });
        setSearchQuery("");
        setIsSearching(false);
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Handle search form submission
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setLoading(true);
            setIsSearching(true);

            const response = await booksSearchByTitle(searchQuery.trim());

            if (response.success && response.data) {
                setBooks(response.data);
                setError(null);
            } else {
                setError(response.error || "Failed to search books");
            }
        } catch (err) {
            setError("An unexpected error occurred during search");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Extract unique values for filter dropdowns
    const extractFilterOptions = (booksData: Book[]) => {
        const genres = [...new Set(booksData.map(book => book.genre))];
        const authors = [...new Set(booksData.map(book => book.author))];
        const formats = [...new Set(booksData.map(book => book.format))];
        const languages = [...new Set(booksData.map(book => book.language))];
        const publishers = [...new Set(booksData.map(book => book.publisher))];

        setAvailableFilters({
            genres,
            authors,
            formats,
            languages,
            publishers
        });
    };

    useEffect(() => {
        const fetchBooks = async () => {
            // Skip filter-based fetch if we're in search mode
            if (isSearching) return;

            try {
                setLoading(true);

                // Build query parameters from non-empty filters
                const queryParams = Object.entries(filters)
                    .filter(([_, value]) => value !== "")
                    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
                    .join("&");

                const response = await booksFilter(queryParams);

                if (response.success && response.data) {
                    setBooks(response.data);
                    // Only extract filter options on initial load or reset
                    if (Object.values(filters).every(val => val === "")) {
                        extractFilterOptions(response.data);
                    }
                } else {
                    setError(response.error || "Failed to fetch books");
                }
            } catch (err) {
                setError("An unexpected error occurred");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [filters, isSearching]);

    if (loading) {
        return <div className="text-center py-8">Loading books...</div>;
    }

    if (error) {
        return (
            <div className="text-center py-8 text-red-500">
                Error: {error}
            </div>
        );
    }

    // Create filter dropdown component
    const FilterDropdown = ({
        label,
        options,
        value,
        onChange
    }: {
        label: string;
        options: string[];
        value: string;
        onChange: (value: string) => void
    }) => (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{label}</label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="p-2 border rounded text-sm"
            >
                <option value="">All {label}s</option>
                {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </div>
    );

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Books Catalog</h2>
                <div className="text-sm text-gray-500">{books.length} books found</div>
            </div>

            {/* Search bar */}
            <div className="mb-4 p-4 border rounded-md bg-gray-50">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search books by title..."
                        className="flex-1 p-2 border rounded"
                    />
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Search
                    </button>
                    {isSearching && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery("");
                                setIsSearching(false);
                            }}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                        >
                            Clear Search
                        </button>
                    )}
                </form>
            </div>

            {/* Filters section */}
            <div className="mb-6 p-4 border rounded-md bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Filter Books</h3>
                    <button
                        onClick={resetFilters}
                        className="text-sm px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded"
                    >
                        Reset All
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <FilterDropdown
                        label="Genre"
                        options={availableFilters.genres}
                        value={filters.genre}
                        onChange={(value) => handleFilterChange("genre", value)}
                    />
                    <FilterDropdown
                        label="Author"
                        options={availableFilters.authors}
                        value={filters.author}
                        onChange={(value) => handleFilterChange("author", value)}
                    />
                    <FilterDropdown
                        label="Format"
                        options={availableFilters.formats}
                        value={filters.format}
                        onChange={(value) => handleFilterChange("format", value)}
                    />
                    <FilterDropdown
                        label="Language"
                        options={availableFilters.languages}
                        value={filters.language}
                        onChange={(value) => handleFilterChange("language", value)}
                    />
                    <FilterDropdown
                        label="Publisher"
                        options={availableFilters.publishers}
                        value={filters.publisher}
                        onChange={(value) => handleFilterChange("publisher", value)}
                    />
                </div>
            </div>

            <div className="border rounded-md overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Genre</TableHead>
                            <TableHead>Format</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Rating</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {books.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-4">
                                    {isSearching
                                        ? `No books found matching "${searchQuery}"`
                                        : "No books found with the selected filters"}
                                </TableCell>
                            </TableRow>
                        ) : (
                            books.map((book) => (
                                <TableRow key={book.id}>
                                    <TableCell>{book.id}</TableCell>
                                    <TableCell className="font-medium">{book.title}</TableCell>
                                    <TableCell>{book.author}</TableCell>
                                    <TableCell>{book.genre}</TableCell>
                                    <TableCell>{book.format}</TableCell>
                                    <TableCell>
                                        {book.isOnSale ? (
                                            <div>
                                                <span className="line-through text-gray-400">${book.price.toFixed(2)}</span>
                                                <span className="ml-2 text-green-600">
                                                    ${book.actualPrice ? book.actualPrice.toFixed(2) :
                                                        (book.price * (1 - book.discountPercentage / 100)).toFixed(2)}
                                                </span>
                                            </div>
                                        ) : (
                                            <span>${book.price.toFixed(2)}</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {book.stockQuantity > 0 ? book.stockQuantity : (
                                            <span className="text-red-500">Out of stock</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <span className="text-yellow-500 mr-1">★</span>
                                            <span>{book.averageRating.toFixed(1)}</span>
                                            <span className="text-gray-400 ml-1">({book.reviewCount})</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}