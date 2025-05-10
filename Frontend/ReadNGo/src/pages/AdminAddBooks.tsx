import { useState } from "react";
import Sidebar from "@/components/sidebar";
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
        discountEndDate: new Date().toISOString(),
        description: "",
        isbn: "",
        stockQuantity: 0,
        //averageRating: 0,
        //reviewCount: 0,
    });

    const [image, setImage] = useState<File | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        setBook(prev => ({
            ...prev,
            [name]:
                type === "number" || ["price", "discountPercentage", "stockQuantity"].includes(name)
                    ? Number(value)
                    : name.includes("Date")
                        ? value
                        : name === "isOnSale"
                            ? (e.target as HTMLInputElement).checked
                            : value,
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
            alert("Please upload an image.");
            return;
        }

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
                //averageRating: 0,
                //reviewCount: 0,
            });
            setImage(null);
        } else {
            alert(`Failed to add book: ${response.error}`);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Add New Book</h1>
                <p className="text-gray-600 mb-6">
                    Fill out the form below to add a new book to your store.
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <InputField label="Title" name="title" value={book.title} onChange={handleChange} required />
                    <InputField label="Author" name="author" value={book.author} onChange={handleChange} required />
                    <InputField label="Genre" name="genre" value={book.genre} onChange={handleChange} required />
                    <InputField label="Language" name="language" value={book.language} onChange={handleChange} required />
                    <InputField label="Format" name="format" value={book.format} onChange={handleChange} required />
                    <InputField label="Publisher" name="publisher" value={book.publisher} onChange={handleChange} required />

                    {/* Pricing and Sale */}
                    <InputField label="Price ($)" name="price" value={book.price} onChange={handleChange} type="number" required />
                    <div className="flex items-center space-x-2 mt-2">
                        <input
                            name="isOnSale"
                            type="checkbox"
                            checked={book.isOnSale}
                            onChange={handleChange}
                            className="h-4 w-4"
                        />
                        <label className="text-sm">On Sale</label>
                    </div>
                    <InputField
                        label="Discount %"
                        name="discountPercentage"
                        value={book.discountPercentage}
                        onChange={handleChange}
                        type="number"
                    />
                    <InputField
                        label="Discount Start"
                        name="discountStartDate"
                        value={formatDateForInput(book.discountStartDate)}
                        onChange={handleChange}
                        type="date"
                    />
                    <InputField
                        label="Discount End"
                        name="discountEndDate"
                        value={formatDateForInput(book.discountEndDate)}
                        onChange={handleChange}
                        type="date"
                    />

                    {/* Stock & Rating */}
                    <InputField label="Stock Quantity" name="stockQuantity" value={book.stockQuantity} onChange={handleChange} type="number" />
                    {/*<InputField label="Average Rating" name="averageRating" value={book.averageRating} onChange={handleChange} type="number" />*/}
                    {/*<InputField label="Review Count" name="reviewCount" value={book.reviewCount} onChange={handleChange} type="number" />*/}
                    <InputField label="ISBN" name="isbn" value={book.isbn} onChange={handleChange} />

                    {/* Dates */}
                    <InputField
                        label="Publication Date"
                        name="publicationDate"
                        value={formatDateForInput(book.publicationDate)}
                        onChange={handleChange}
                        type="date"
                    />

                    {/* Image Upload */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Book Cover Image</label>
                        <Input type="file" accept="image/*" onChange={handleImageChange} required />
                        {image && <p className="text-sm mt-1 text-gray-500">Selected: {image.name}</p>}
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            className="w-full border rounded p-2"
                            rows={5}
                            value={book.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <Button type="submit" className="w-full">
                            Add Book
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}

// Reusable field input component
function InputField({ label, name, value, onChange, type = "text", required = false }: any) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <Input name={name} value={value} onChange={onChange} type={type} required={required} />
        </div>
    );
}
