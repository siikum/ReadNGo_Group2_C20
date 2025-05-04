import Sidebar from "@/components/sidebar";
import BooksTable from "@/components/DataTable";

export default function BooksPage() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">Books</h1>
        <BooksTable />
      </main>
    </div>
  );
}
