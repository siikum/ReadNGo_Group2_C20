import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getBooks } from "@/api/apiConfig";

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
}

export default function BooksTable() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const response = await getBooks();

                if (response.success && response.data) {
                    setBooks(response.data);
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
    }, []);

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

    return (
        <div>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Books Catalog</h2>
                <div className="text-sm text-gray-500">{books.length} books found</div>
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
                                    No books found
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
                                                    ${(book.price * (1 - book.discountPercentage / 100)).toFixed(2)}
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