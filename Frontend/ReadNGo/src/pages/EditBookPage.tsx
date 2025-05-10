import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar";
import { getBooks, editBook } from "@/api/apiConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EditBookPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState<any>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                const res = await getBooks();
                const found = res.data?.find((b) => b.id === parseInt(id || ""));
                if (!found) return setError("Book not found");
                setBook(found);
                if (found.imagePath) setPreviewUrl(found.imagePath);
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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await editBook(book.id, book, imageFile || undefined);
        if (res.success) navigate("/admin-get-books");
        else alert(res.error || "Failed to update book.");
    };

    const formatDate = (dateStr: string) => {
        return dateStr?.substring(0, 10);
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (error) return <div className="p-6 text-red-500">{error}</div>;

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Edit Book - #{book.id}</h1>
                <p className="text-gray-600 mb-6">Modify the book details below and click "Save Changes".</p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Text Fields */}
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
                        <InputField
                            key={field}
                            label={label}
                            name={field}
                            value={book[field]}
                            onChange={(e: any) => handleChange(field, e.target.value)}
                        />
                    ))}

                    {/* Number Fields */}
                    {[
                        ["price", "Price"],
                        ["discountPercentage", "Discount %"],
                        ["stockQuantity", "Stock"],
                        //["averageRating", "Rating"],
                        //["reviewCount", "Review Count"],
                    ].map(([field, label]) => (
                        <InputField
                            key={field}
                            label={label}
                            name={field}
                            type="number"
                            value={book[field]}
                            onChange={(e: any) => handleChange(field, parseFloat(e.target.value))}
                        />
                    ))}

                    {/* Date Fields */}
                    {[
                        ["publicationDate", "Publication Date"],
                        ["discountStartDate", "Discount Start"],
                        ["discountEndDate", "Discount End"],
                    ].map(([field, label]) => (
                        <InputField
                            key={field}
                            label={label}
                            name={field}
                            type="date"
                            value={formatDate(book[field])}
                            onChange={(e: any) => handleChange(field, e.target.value)}
                        />
                    ))}

                    {/* On Sale Checkbox */}
                    <div className="flex items-center space-x-2 md:col-span-2">
                        <input
                            type="checkbox"
                            checked={book.isOnSale}
                            onChange={(e) => handleChange("isOnSale", e.target.checked)}
                            className="h-4 w-4"
                        />
                        <label className="text-sm font-medium">On Sale</label>
                    </div>

                    {/* Image Upload */}
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-1 block">Book Cover Image</label>
                        <Input type="file" accept="image/*" onChange={handleImageChange} />
                        {previewUrl && <img src={previewUrl} alt="Preview" className="mt-2 max-h-40 rounded" />}
                    </div>

                    {/* Submit */}
                    <div className="md:col-span-2">
                        <Button type="submit" className="w-full">Save Changes</Button>
                    </div>
                </form>
            </main>
        </div>
    );
}

// Reusable input field
function InputField({ label, name, value, onChange, type = "text" }: any) {
    return (
        <div>
            <label className="text-sm font-medium block mb-1">{label}</label>
            <Input name={name} value={value} onChange={onChange} type={type} />
        </div>
    );
}
