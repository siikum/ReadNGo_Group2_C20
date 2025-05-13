import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addBooks } from "@/api/apiConfig";
import type { AddBook } from "@/api/apiConfig";

interface InputFieldProps {
    label: string;
    name: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    disabled?: boolean;
    min?: string | number;
    step?: string | number;
}

export default function AdminAddBooks() {
    const [book, setBook] = useState<AddBook>({
        id: 0,
        title: "",
        author: "",
        genre: "",
        language: "",
        format: "",
        publisher: "",
        publicationDate: new Date().toISOString(),
        category: "",
        arrivalDate: new Date().toISOString(),
        price: 0,
        isOnSale: false,
        discountPercentage: 0,
        discountStartDate: new Date().toISOString(),
        discountEndDate: new Date().toISOString(),
        description: "",
        isbn: "",
        stockQuantity: 0,
    });

    const [image, setImage] = useState<File | null>(null);
    const [isbnError, setIsbnError] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        "All Books",
        "Bestsellers",
        "Award Winners",
        "New Releases",
        "New Arrivals",
        "Coming Soon",
        "Deals"
    ];

    // Auto-determine category based on conditions
    useEffect(() => {
        let autoCategory = "";

        // Check if arrival date is in the future
        const arrivalDate = new Date(book.arrivalDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        arrivalDate.setHours(0, 0, 0, 0);

        if (arrivalDate > today) {
            autoCategory = "Coming Soon";
            // Set stock quantity to 0 for future arrivals
            setBook(prev => ({
                ...prev,
                category: "Coming Soon",
                stockQuantity: 0
            }));
        } else {
            // Check if it's a new arrival (arrived in the past month)
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
            if (arrivalDate >= oneMonthAgo) {
                autoCategory = "New Arrivals";
            }

            // Check if it's a new release (published in the past three months)
            const publicationDate = new Date(book.publicationDate);
            const threeMonthsAgo = new Date();
            threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
            if (publicationDate >= threeMonthsAgo) {
                autoCategory = "New Releases";
            }

            // Check if it's on sale
            if (book.isOnSale && book.discountPercentage > 0) {
                autoCategory = "Deals";
            }

            // If a category was auto-determined, set it
            if (autoCategory && book.category !== autoCategory) {
                setBook(prev => ({
                    ...prev,
                    category: autoCategory
                }));
            }
        }
    }, [book.arrivalDate, book.publicationDate, book.isOnSale, book.discountPercentage]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        // Handle ISBN validation
        if (name === "isbn") {
            if (value.length <= 10) {
                setBook(prev => ({ ...prev, isbn: value }));
                if (value.length < 10) {
                    setIsbnError("ISBN must be exactly 10 digits");
                } else if (!/^\d{10}$/.test(value)) {
                    setIsbnError("ISBN must contain only digits");
                } else {
                    setIsbnError("");
                }
            }
            return;
        }

        // Handle numeric fields differently
        if (type === "number" || ["price", "discountPercentage", "stockQuantity"].includes(name)) {
            // If the field is empty, set it to empty string instead of 0
            // This allows users to clear the field and type a new number
            if (value === "") {
                setBook(prev => ({
                    ...prev,
                    [name]: ""
                }));
            } else {
                setBook(prev => ({
                    ...prev,
                    [name]: Number(value)
                }));
            }
        } else {
            setBook(prev => ({
                ...prev,
                [name]: name.includes("Date") ? value : value,
            }));
        }
    };

    const handleSelectChange = (value: string) => {
        setBook(prev => ({ ...prev, category: value }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setBook(prev => ({
            ...prev,
            isOnSale: checked,
            ...(checked ? {} : {
                discountPercentage: 0,
                discountStartDate: new Date().toISOString(),
                discountEndDate: new Date().toISOString()
            })
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImage(file);
    };

    const formatDateForInput = (dateString: string) => {
        try {
            return new Date(dateString).toISOString().split("T")[0];
        } catch {
            return "";
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!image) {
            toast.error("Image Required", {
                description: "Please upload a book cover image.",
            });
            return;
        }

        if (book.isbn.length !== 10 || !/^\d{10}$/.test(book.isbn)) {
            toast.error("Invalid ISBN", {
                description: "ISBN must be exactly 10 digits.",
            });
            return;
        }

        if (book.isOnSale) {
            if (!book.discountPercentage || book.discountPercentage <= 0) {
                toast.error("Invalid Discount", {
                    description: "Please enter a valid discount percentage.",
                });
                return;
            }
            if (!book.discountStartDate || !book.discountEndDate) {
                toast.error("Missing Dates", {
                    description: "Please enter discount start and end dates.",
                });
                return;
            }
        }

        setIsSubmitting(true);

        // Show loading toast
        const loadingId = toast.loading("Adding Book", {
            description: "Please wait while we add the book to your store...",
        });

        try {
            const response = await addBooks(book, image);

            if (response.success) {
                // Dismiss loading toast and show success
                toast.dismiss(loadingId);
                toast.success("Success!", {
                    description: `"${book.title}" has been added to your store.`,
                });

                // Reset form
                setBook({
                    id: 0,
                    title: "",
                    author: "",
                    genre: "",
                    language: "",
                    format: "",
                    publisher: "",
                    publicationDate: new Date().toISOString(),
                    category: "",
                    arrivalDate: new Date().toISOString(),
                    price: 0,
                    isOnSale: false,
                    discountPercentage: 0,
                    discountStartDate: new Date().toISOString(),
                    discountEndDate: new Date().toISOString(),
                    description: "",
                    isbn: "",
                    stockQuantity: 0,
                });
                setImage(null);
                setIsbnError("");

                // Reset file input
                const fileInput = document.getElementById('image') as HTMLInputElement;
                if (fileInput) fileInput.value = '';
            } else {
                // Dismiss loading toast and show error
                toast.dismiss(loadingId);
                toast.error("Failed to Add Book", {
                    description: response.error || "An unexpected error occurred.",
                });
            }
        } catch (error) {
            // Dismiss loading toast and show error
            toast.dismiss(loadingId);
            toast.error("Error", {
                description: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Check if arrival date is in the future
    const isFutureArrival = () => {
        const arrivalDate = new Date(book.arrivalDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        arrivalDate.setHours(0, 0, 0, 0);
        return arrivalDate > today;
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-6">
                <Card className="max-w-4xl mx-auto">
                    <CardHeader>
                        <CardTitle>Add New Book</CardTitle>
                        <CardDescription>
                            Fill out the form below to add a new book to your store.
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
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="author">Author</Label>
                                    <Input
                                        id="author"
                                        name="author"
                                        value={book.author}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="genre">Genre</Label>
                                    <Input
                                        id="genre"
                                        name="genre"
                                        value={book.genre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="language">Language</Label>
                                    <Input
                                        id="language"
                                        name="language"
                                        value={book.language}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="format">Format</Label>
                                    <Input
                                        id="format"
                                        name="format"
                                        value={book.format}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="publisher">Publisher</Label>
                                    <Input
                                        id="publisher"
                                        name="publisher"
                                        value={book.publisher}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Category and Dates Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={book.category} onValueChange={handleSelectChange}>
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
                                    {book.category && (
                                        <p className="text-sm text-muted-foreground">
                                            Auto-selected: {book.category}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="publicationDate">Publication Date</Label>
                                    <Input
                                        id="publicationDate"
                                        name="publicationDate"
                                        type="date"
                                        value={formatDateForInput(book.publicationDate)}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="arrivalDate">Arrival Date</Label>
                                    <Input
                                        id="arrivalDate"
                                        name="arrivalDate"
                                        type="date"
                                        value={formatDateForInput(book.arrivalDate)}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (NPR)</Label>
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        placeholder="Enter price in NPR"
                                        value={book.price || ""}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-base font-medium">Sale Status</Label>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="isOnSale"
                                            checked={book.isOnSale}
                                            onCheckedChange={handleCheckboxChange}
                                        />
                                        <Label
                                            htmlFor="isOnSale"
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            On Sale
                                        </Label>
                                    </div>
                                </div>
                            </div>

                            {/* Discount Details (conditional) */}
                            {book.isOnSale && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="discountPercentage">Discount %</Label>
                                        <Input
                                            id="discountPercentage"
                                            name="discountPercentage"
                                            type="number"
                                            min="0"
                                            max="100"
                                            placeholder="0"
                                            value={book.discountPercentage || ""}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discountStartDate">Discount Start</Label>
                                        <Input
                                            id="discountStartDate"
                                            name="discountStartDate"
                                            type="date"
                                            value={formatDateForInput(book.discountStartDate)}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="discountEndDate">Discount End</Label>
                                        <Input
                                            id="discountEndDate"
                                            name="discountEndDate"
                                            type="date"
                                            value={formatDateForInput(book.discountEndDate)}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Stock and ISBN Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="stockQuantity">Stock Quantity</Label>
                                    <Input
                                        id="stockQuantity"
                                        name="stockQuantity"
                                        type="number"
                                        min="0"
                                        placeholder="0"
                                        value={book.stockQuantity || ""}
                                        onChange={handleChange}
                                        disabled={isFutureArrival()}
                                        required
                                    />
                                    {isFutureArrival() && (
                                        <p className="text-sm text-muted-foreground">
                                            Stock set to 0 for future arrivals
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="isbn">ISBN (10 digits)</Label>
                                    <Input
                                        id="isbn"
                                        name="isbn"
                                        value={book.isbn}
                                        onChange={handleChange}
                                        required
                                    />
                                    {isbnError && (
                                        <Alert variant="destructive">
                                            <AlertDescription>{isbnError}</AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div className="space-y-2">
                                <Label htmlFor="image">Book Cover Image</Label>
                                <Input
                                    id="image"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    required
                                />
                                {image && (
                                    <p className="text-sm text-muted-foreground">
                                        Selected: {image.name}
                                    </p>
                                )}
                            </div>

                            {/* Description Section */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    rows={5}
                                    value={book.description}
                                    onChange={handleChange}
                                    className="resize-none"
                                />
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding Book..." : "Add Book"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}