import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Sidebar";
import { getBooks, editBook } from "@/api/apiConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { AddBook } from "@/api/apiConfig";

export default function EditBookPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [book, setBook] = useState<AddBook | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const categories = [
        "All Books",
        "Bestsellers",
        "Award Winners",
        "New Releases",
        "New Arrivals",
        "Coming Soon",
        "Deals"
    ];

    useEffect(() => {
        const fetchBook = async () => {
            try {
                setLoading(true);
                const res = await getBooks();
                console.log("API Response:", res);

                if (!res.success || !res.data) {
                    throw new Error("Invalid response format");
                }

                const found = res.data.find((b: any) => b.id === parseInt(id || "0"));
                console.log("Found book:", found);

                if (!found) {
                    toast.error("Book Not Found", {
                        description: "The requested book could not be found.",
                    });
                    navigate("/admin-get-books");
                    return;
                }

                // Map the found book to AddBook format
                const mappedBook: AddBook = {
                    id: found.id,
                    title: found.title || "",
                    author: found.author || "",
                    genre: found.genre || "",
                    language: found.language || "",
                    format: found.format || "",
                    publisher: found.publisher || "",
                    publicationDate: found.publicationDate || new Date().toISOString(),
                    category: found.category || "",
                    arrivalDate: found.arrivalDate || new Date().toISOString(),
                    price: found.price || 0,
                    isOnSale: found.isOnSale || false,
                    discountPercentage: found.discountPercentage || 0,
                    discountStartDate: found.discountStartDate || new Date().toISOString(),
                    discountEndDate: found.discountEndDate || new Date().toISOString(),
                    description: found.description || "",
                    isbn: found.isbn || "",
                    stockQuantity: found.stockQuantity || 0,
                };

                setBook(mappedBook);
                if (found.imagePath) setPreviewUrl(found.imagePath);
            } catch (error) {
                console.error("Error fetching book:", error);
                toast.error("Failed to Load Book", {
                    description: "An error occurred while fetching book details.",
                });
                navigate("/admin-get-books");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchBook();
        }
    }, [id, navigate]);

    const handleChange = (field: keyof AddBook, value: any) => {
        if (!book) return;
        setBook({ ...book, [field]: value });
    };

    const handleNumberChange = (field: keyof AddBook, value: string) => {
        if (!book) return;
        if (value === "") {
            setBook({ ...book, [field]: "" });
        } else {
            setBook({ ...book, [field]: parseFloat(value) });
        }
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

        if (!book) return;

        setSaving(true);

        const loadingId = toast.loading("Updating Book", {
            description: "Please wait while we save your changes...",
        });

        try {
            const res = await editBook(book.id, book, imageFile || undefined);

            toast.dismiss(loadingId);

            if (res.success) {
                toast.success("Success!", {
                    description: `"${book.title}" has been updated successfully.`,
                });
                navigate("/admin-get-books");
            } else {
                toast.error("Failed to Update Book", {
                    description: res.error || "An unexpected error occurred.",
                });
            }
        } catch (error) {
            toast.dismiss(loadingId);

            toast.error("Error", {
                description: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return "";
        try {
            return new Date(dateStr).toISOString().split('T')[0];
        } catch {
            return "";
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded w-2/4 mb-8"></div>
                            <div className="space-y-4">
                                <div className="h-10 bg-gray-200 rounded"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                                <div className="h-10 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="flex min-h-screen bg-gray-50">
                <Sidebar />
                <main className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-2xl font-bold mb-4">Book not found</h1>
                        <Button onClick={() => navigate("/admin-get-books")}>
                            Go Back
                        </Button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-6">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Edit Book - #{book.id}</CardTitle>
                        <CardDescription>
                            Modify the book details below and click "Save Changes".
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Info Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={book.title}
                                        onChange={(e) => handleChange("title", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="author">Author</Label>
                                    <Input
                                        id="author"
                                        name="author"
                                        value={book.author}
                                        onChange={(e) => handleChange("author", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="genre">Genre</Label>
                                    <Input
                                        id="genre"
                                        name="genre"
                                        value={book.genre}
                                        onChange={(e) => handleChange("genre", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Input
                                        id="language"
                                        name="language"
                                        value={book.language}
                                        onChange={(e) => handleChange("language", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="format">Format</Label>
                                    <Input
                                        id="format"
                                        name="format"
                                        value={book.format}
                                        onChange={(e) => handleChange("format", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="publisher">Publisher</Label>
                                    <Input
                                        id="publisher"
                                        name="publisher"
                                        value={book.publisher}
                                        onChange={(e) => handleChange("publisher", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="isbn">ISBN</Label>
                                    <Input
                                        id="isbn"
                                        name="isbn"
                                        value={book.isbn}
                                        onChange={(e) => handleChange("isbn", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={book.category} onValueChange={(value) => handleChange("category", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat} value={cat}>
                                                    {cat}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Date Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="publicationDate">Publication Date</Label>
                                    <Input
                                        id="publicationDate"
                                        name="publicationDate"
                                        type="date"
                                        value={formatDate(book.publicationDate)}
                                        onChange={(e) => handleChange("publicationDate", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="arrivalDate">Arrival Date</Label>
                                    <Input
                                        id="arrivalDate"
                                        name="arrivalDate"
                                        type="date"
                                        value={formatDate(book.arrivalDate)}
                                        onChange={(e) => handleChange("arrivalDate", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Number Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (NPR)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        step="0.01"
                                        value={book.price || ""}
                                        onChange={(e) => handleNumberChange("price", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="discountPercentage">Discount %</Label>
                                    <Input
                                        id="discountPercentage"
                                        name="discountPercentage"
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={book.discountPercentage || ""}
                                        onChange={(e) => handleNumberChange("discountPercentage", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                                    <Input
                                        id="stockQuantity"
                                        name="stockQuantity"
                                        type="number"
                                        min="0"
                                        value={book.stockQuantity || ""}
                                        onChange={(e) => handleNumberChange("stockQuantity", e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Discount Date Fields */}
                            {book.isOnSale && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="discountStartDate">Discount Start Date</Label>
                                        <Input
                                            id="discountStartDate"
                                            name="discountStartDate"
                                            type="date"
                                            value={formatDate(book.discountStartDate)}
                                            onChange={(e) => handleChange("discountStartDate", e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discountEndDate">Discount End Date</Label>
                                        <Input
                                            id="discountEndDate"
                                            name="discountEndDate"
                                            type="date"
                                            value={formatDate(book.discountEndDate)}
                                            onChange={(e) => handleChange("discountEndDate", e.target.value)}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* On Sale Checkbox */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isOnSale"
                                    checked={book.isOnSale}
                                    onCheckedChange={(checked) => handleChange("isOnSale", checked)}
                                />
                                <Label
                                    htmlFor="isOnSale"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    On Sale
                                </Label>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    value={book.description}
                                    onChange={(e) => handleChange("description", e.target.value)}
                                    className="resize-none"
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label htmlFor="image">Book Cover Image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                {previewUrl && (
                                    <div className="mt-2">
                                        <img
                                            src={previewUrl}
                                            alt="Book cover preview"
                                            className="max-h-48 rounded-md shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={saving}
                                >
                                    {saving ? "Saving Changes..." : "Save Changes"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate("/admin-get-books")}
                                    disabled={saving}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}