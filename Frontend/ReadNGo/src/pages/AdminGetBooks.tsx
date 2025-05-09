import Sidebar from "@/components/sidebar";
import BooksTable from "@/components/DataTable"; // Updated import path if needed

export default function AdminGetBooks() {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Book Catalog</h1>
                <p className="text-gray-600 mb-6">
                    Browse our collection of books available for purchase.
                </p>
                <BooksTable />
            </main>
        </div>
    );
}