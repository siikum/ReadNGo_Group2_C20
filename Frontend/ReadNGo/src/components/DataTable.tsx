import { useEffect, useState } from "react";
import {
    booksFilter,
    booksSearchByTitle,
    deleteBook,
    getDistinctAuthors,
    getDistinctGenres,
    getDistinctLanguages,
    getDistinctFormats
} from "@/api/apiConfig";
import { useNavigate } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
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
    actualPrice?: number;
    imagePath?: string;
}

interface FilterState {
    author: string;
    genre: string;
    format: string;
    language: string;
    availableInLibrary: string;
    minPrice: string;
    maxPrice: string;
}

export default function DataTable() {
    const [books, setBooks] = useState<Book[]>([]);
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [searchResults, setSearchResults] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filters, setFilters] = useState<FilterState>({
        author: "",
        genre: "",
        format: "",
        language: "",
        availableInLibrary: "",
        minPrice: "",
        maxPrice: ""
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [authors, setAuthors] = useState<string[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [languages, setLanguages] = useState<string[]>([]);
    const [formats, setFormats] = useState<string[]>([]);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const itemsPerPage = 20;

    const navigate = useNavigate();

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
                setAllBooks(response.data);
                setBooks(response.data);
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
            if (filters.availableInLibrary === "yes" && book.stockQuantity <= 0) return false;
            if (filters.availableInLibrary === "no" && book.stockQuantity > 0) return false;
            if (filters.minPrice && book.price < parseFloat(filters.minPrice)) return false;
            if (filters.maxPrice && book.price > parseFloat(filters.maxPrice)) return false;
            return true;
        });

        setBooks(filteredBooks);
        setCurrentPage(1);
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
                setIsSearchActive(true);
                setSearchResults(response.data);
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

    const handleDelete = async (bookId: number, bookTitle: string) => {
        // Show custom confirmation toast
        toast.custom(
            (t) => (
                <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full">
                    <h3 className="font-semibold mb-2 text-gray-900">Delete Book</h3>
                    <p className="text-sm mb-4 text-gray-700">
                        Are you sure you want to delete "{bookTitle}"?
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="bg-gray-200 hover:bg-gray-300"
                            onClick={() => toast.dismiss(t)}
                        >
                            Cancel
                        </Button>
                        <Button
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={async () => {
                                toast.dismiss(t);
                                await performDelete(bookId);
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            ),
            {
                duration: Infinity,
                position: "top-center",
            }
        );
    };

    const performDelete = async (bookId: number) => {
        // Show loading toast
        const loadingId = toast.loading("Deleting Book", {
            description: "Please wait while we delete this book...",
        });

        try {
            const response = await deleteBook(bookId);

            // Dismiss loading toast
            toast.dismiss(loadingId);

            if (response.success) {
                // Update all book lists
                setBooks(prev => prev.filter(b => b.id !== bookId));
                setAllBooks(prev => prev.filter(b => b.id !== bookId));
                if (isSearchActive) {
                    setSearchResults(prev => prev.filter(b => b.id !== bookId));
                }

                toast.success("Success!", {
                    description: "Book has been deleted successfully.",
                });
            } else {
                toast.error("Failed to Delete Book", {
                    description: response.error || "An unexpected error occurred.",
                });
            }
        } catch (error) {
            // Dismiss loading toast
            toast.dismiss(loadingId);

            toast.error("Error", {
                description: "An unexpected error occurred while deleting the book.",
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
            maxPrice: ""
        });
    };

    const totalPages = Math.ceil(books.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentBooks = books.slice(startIndex, endIndex);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const calculateDiscountedPrice = (price: number, discountPercentage: number) => {
        return (price * (1 - discountPercentage / 100)).toFixed(2);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSearch} className="mb-6 flex gap-4 flex-wrap">
                <Input
                    type="text"
                    placeholder="Search books by title, author, ISBN, or description..."
                    className="flex-1 max-w-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button type="submit">Search</Button>
                <Button type="button" variant="secondary" onClick={resetFiltersAndSearch}>
                    Reset All
                </Button>
            </form>

            <div className="mb-4 flex gap-4 items-center flex-wrap">
                {isSearchActive && searchQuery && (
                    <div className="p-2 bg-blue-100 rounded">
                        Showing search results for: "{searchQuery}"
                    </div>
                )}
                {Object.entries(filters).some(([key, value]) => value) && (
                    <div className="p-2 bg-green-100 rounded">
                        Filters applied
                    </div>
                )}
                <div className="text-sm text-gray-600">
                    {books.length} books found
                </div>
            </div>

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
                    <label className="text-sm font-medium mb-1 block">Available in Library</label>
                    <Select
                        value={filters.availableInLibrary || "all"}
                        onValueChange={(value) => setFilters(prev => ({ ...prev, availableInLibrary: value === "all" ? "" : value }))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Availability" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Books</SelectItem>
                            <SelectItem value="yes">Available</SelectItem>
                            <SelectItem value="no">Not Available</SelectItem>
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

            <div className="rounded-md border mb-6">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80px]">Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Author</TableHead>
                            <TableHead>Genre</TableHead>
                            <TableHead>Format</TableHead>
                            <TableHead>Language</TableHead>
                            <TableHead>Publisher</TableHead>
                            <TableHead>Publication Date</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>ISBN</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentBooks.map((book) => (
                            <TableRow key={book.id}>
                                <TableCell>
                                    {book.imagePath ? (
                                        <img
                                            src={`https://localhost:7149${book.imagePath}`}
                                            alt={book.title}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                            No Image
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="font-medium">{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.genre}</TableCell>
                                <TableCell>{book.format}</TableCell>
                                <TableCell>{book.language}</TableCell>
                                <TableCell>{book.publisher}</TableCell>
                                <TableCell>{formatDate(book.publicationDate)}</TableCell>
                                <TableCell>
                                    {book.isOnSale ? (
                                        <>
                                            <span className="line-through text-gray-400 mr-2">
                                                NPR {book.price.toFixed(2)}
                                            </span>
                                            <span className="text-green-600">
                                                NPR {calculateDiscountedPrice(book.price, book.discountPercentage)}
                                            </span>
                                        </>
                                    ) : (
                                        `NPR ${book.price.toFixed(2)}`
                                    )}
                                </TableCell>
                                <TableCell>{book.stockQuantity}</TableCell>
                                <TableCell>{book.isbn}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex gap-2 justify-end">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => navigate(`/edit-book/${book.id}`)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(book.id, book.title)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {books.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    itemsPerPage={itemsPerPage}
                    totalItems={books.length}
                />
            )}

            {books.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    No books found matching your criteria
                </div>
            )}
        </div>
    );
}