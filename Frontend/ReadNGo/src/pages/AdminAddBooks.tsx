import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addBooks } from "@/api/apiConfig";
import type { AddBook } from "@/api/apiConfig";

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
        price: 0,
        isOnSale: false,
        discountPercentage: 0,
        discountStartDate: new Date().toISOString(),
        discountEndDate: new Date().toISOString(), // Added missing field
        description: "",
        isbn: "",
        stockQuantity: 0,
        averageRating: 0,
        reviewCount: 0,
    });

    const [image, setImage] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement; // Type assertion to access 'type'

        if (name === "isOnSale") {
            setBook(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked
            }));
            return;
        }

        setBook(prev => ({
            ...prev,
            [name]: type === "number" || name === "price" || name === "discountPercentage" ||
                name === "stockQuantity" || name === "averageRating" || name === "reviewCount"
                ? Number(value)
                : name.includes("Date") ? value // Keep date as string when it comes from input
                    : value,
        }));
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBook(prev => ({
            ...prev,
            [name]: value ? new Date(value).toISOString() : new Date().toISOString()
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!image) {
            alert("Please upload an image.");
            return;
        }

        try {
            const response = await addBooks(book, image);

            if (response.success) {
                alert("Book added successfully!");
                setBook({
                    id: 0,
                    title: "",
                    author: "",
                    genre: "",
                    language: "",
                    format: "",
                    publisher: "",
                    publicationDate: new Date().toISOString(),
                    price: 0,
                    isOnSale: false,
                    discountPercentage: 0,
                    discountStartDate: new Date().toISOString(),
                    discountEndDate: new Date().toISOString(),
                    description: "",
                    isbn: "",
                    stockQuantity: 0,
                    averageRating: 0,
                    reviewCount: 0,
                });
                setImage(null);
            } else {
                alert(`Failed to add book: ${response.error}`);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An unexpected error occurred.");
        }
    };

    
    const formatDateForInput = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toISOString().split('T')[0];
        } catch (error) {
            return "";
        }
    };

    return (
        <div className="flex flex-col p-6">
            <h1 className="text-2xl font-bold mb-4">Add New Book</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input name="title" placeholder="Title" value={book.title} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Author</label>
                        <Input name="author" placeholder="Author" value={book.author} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Genre</label>
                        <Input name="genre" placeholder="Genre" value={book.genre} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Language</label>
                        <Input name="language" placeholder="Language" value={book.language} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Format</label>
                        <Input name="format" placeholder="Format" value={book.format} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Publisher</label>
                        <Input name="publisher" placeholder="Publisher" value={book.publisher} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Publication Date</label>
                        <Input
                            name="publicationDate"
                            type="date"
                            value={formatDateForInput(book.publicationDate)}
                            onChange={handleDateChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <Input name="price" type="number" placeholder="Price" value={book.price} onChange={handleChange} required step="0.01" />
                    </div>
                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium">On Sale</label>
                        <input
                            name="isOnSale"
                            type="checkbox"
                            checked={book.isOnSale}
                            onChange={(e) => setBook(prev => ({ ...prev, isOnSale: e.target.checked }))}
                            className="h-4 w-4"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Discount Percentage</label>
                        <Input
                            name="discountPercentage"
                            type="number"
                            placeholder="Discount Percentage"
                            value={book.discountPercentage}
                            onChange={handleChange}
                            min="0"
                            max="100"
                            step="0.01"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Discount Start Date</label>
                        <Input
                            name="discountStartDate"
                            type="date"
                            value={formatDateForInput(book.discountStartDate)}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Discount End Date</label>
                        <Input
                            name="discountEndDate"
                            type="date"
                            value={formatDateForInput(book.discountEndDate)}
                            onChange={handleDateChange}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">ISBN</label>
                        <Input name="isbn" placeholder="ISBN" value={book.isbn} onChange={handleChange} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                        <Input name="stockQuantity" type="number" placeholder="Stock Quantity" value={book.stockQuantity} onChange={handleChange} min="0" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Average Rating</label>
                        <Input
                            name="averageRating"
                            type="number"
                            placeholder="Average Rating"
                            value={book.averageRating}
                            onChange={handleChange}
                            min="0"
                            max="5"
                            step="0.1"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Review Count</label>
                        <Input name="reviewCount" type="number" placeholder="Review Count" value={book.reviewCount} onChange={handleChange} min="0" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Book Image</label>
                    <Input type="file" accept="image/*" onChange={handleImageChange} required />
                    {image && <p className="text-sm mt-1 text-gray-500">Selected: {image.name}</p>}
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={book.description}
                        onChange={handleChange}
                        className="p-2 border rounded w-full h-32"
                    />
                </div>
                <Button type="submit" className="w-full">Add Book</Button>
            </form>
        </div>
    );
}