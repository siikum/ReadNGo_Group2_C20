import { useEffect, useState } from "react";
import { booksFilter, booksSearchByTitle, deleteBook } from "@/api/apiConfig";
import { useNavigate } from "react-router-dom";

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

export default function DataTable() {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filters, setFilters] = useState({ genre: "", author: "", format: "", language: "", publisher: "" });

    const navigate = useNavigate();

    useEffect(() => {
        fetchBooks();
    }, [filters]);

    const fetchBooks = async () => {
        const queryParams = Object.entries(filters)
            .filter(([_, val]) => val)
            .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
            .join("&");

        const response = await booksFilter(queryParams);
        if (response.success && response.data) setBooks(response.data);
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        const response = await booksSearchByTitle(searchQuery.trim());
        if (response.success && response.data) setBooks(response.data);
    };

    const handleDelete = async (bookId: number) => {
        const response = await deleteBook(bookId);
        if (response.success) setBooks(prev => prev.filter(b => b.id !== bookId));
    };

    const resetFiltersAndSearch = () => {
        setSearchQuery("");
        setFilters({ genre: "", author: "", format: "", language: "", publisher: "" });
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSearch} className="mb-6 flex gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search books by title..."
                    className="p-2 border rounded flex-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Search</button>
                <button type="button" onClick={resetFiltersAndSearch} className="bg-gray-400 text-white px-4 py-2 rounded">Reset</button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(filters).map(([key, value]) => (
                    <input
                        key={key}
                        type="text"
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        className="p-2 border rounded"
                        value={value}
                        onChange={(e) => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map(book => (
                    <div key={book.id} className="border rounded-lg shadow p-4 relative bg-white">
                        {book.imagePath ? (
                            <img src={`https://localhost:7149${book.imagePath}`} alt={book.title} className="w-full h-60 object-cover rounded mb-4" />
                        ) : (
                            <div className="w-full h-60 bg-gray-200 flex items-center justify-center rounded mb-4">No Image</div>
                        )}

                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">by {book.author}</p>
                        <p className="text-sm text-gray-600 mb-2">{book.genre} | {book.format}</p>
                        <p className="text-sm">{book.isOnSale ? (
                            <>
                                <span className="line-through text-gray-400 mr-2">${book.price.toFixed(2)}</span>
                                <span className="text-green-600">${(book.price * (1 - book.discountPercentage / 100)).toFixed(2)}</span>
                            </>
                        ) : `$${book.price.toFixed(2)}`}</p>

                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => navigate(`/edit-book/${book.id}`)}
                                className="bg-yellow-500 text-white px-3 py-1 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => handleDelete(book.id)}
                                className="bg-red-500 text-white px-3 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
