import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBooks, editBook } from "@/api/apiConfig";

export default function EditBookPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await getBooks();
                const found = res.data?.find((b) => b.id === parseInt(id || ""));
                if (!found) return setError("Book not found");
                setBook(found);
            } catch {
                setError("Failed to fetch book.");
            } finally {
                setLoading(false);
            }
        };
        fetchBook();
    }, [id]);

    const handleChange = (field: string, value: any) => {
        setBook((prev: any) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await editBook(book.id, book);
        if (res.success) navigate("/user-get-books");
        else alert(res.error || "Failed to update book.");
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Book - #{book.id}</h1>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                {[
                    ["title", "Title"],
                    ["author", "Author"],
                    ["genre", "Genre"],
                    ["language", "Language"],
                    ["format", "Format"],
                    ["publisher", "Publisher"],
                    ["isbn", "ISBN"],
                    ["description", "Description"],
                ].map(([field, label]) => (
                    <div key={field} className="col-span-1">
                        <label className="text-sm font-medium">{label}</label>
                        <input
                            className="w-full p-2 border rounded"
                            value={book[field] || ""}
                            onChange={(e) => handleChange(field, e.target.value)}
                        />
                    </div>
                ))}

                {[
                    ["price", "Price"],
                    ["discountPercentage", "Discount %"],
                    ["stockQuantity", "Stock"],
                    ["averageRating", "Rating"],
                    ["reviewCount", "Review Count"],
                ].map(([field, label]) => (
                    <div key={field}>
                        <label className="text-sm font-medium">{label}</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded"
                            value={book[field] || 0}
                            onChange={(e) => handleChange(field, parseFloat(e.target.value))}
                        />
                    </div>
                ))}

                {[
                    ["publicationDate", "Publication Date"],
                    ["discountStartDate", "Discount Start"],
                    ["discountEndDate", "Discount End"],
                ].map(([field, label]) => (
                    <div key={field}>
                        <label className="text-sm font-medium">{label}</label>
                        <input
                            type="date"
                            className="w-full p-2 border rounded"
                            value={book[field]?.substring(0, 10)}
                            onChange={(e) => handleChange(field, e.target.value)}
                        />
                    </div>
                ))}

                <div className="col-span-2 flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={book.isOnSale}
                        onChange={(e) => handleChange("isOnSale", e.target.checked)}
                    />
                    <label>On Sale</label>
                </div>

                <div className="col-span-2">
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}
