import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Book, User, UserPlus, List } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-100 p-6 border-r">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-3">
        <Link to="/dashboard">
          <Button variant="ghost" className="justify-start w-full">
            <Home className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        </Link>
        <Link to="/books">
        <Button variant="ghost" className="justify-start w-full">
            <Book className="mr-2 h-5 w-5" />
            Books
        </Button>
        </Link>
        <Link to="/login">
          <Button variant="ghost" className="justify-start w-full">
            <User className="mr-2 h-5 w-5" />
            Login
          </Button>
        </Link>
        <Link to="/register">
          <Button variant="ghost" className="justify-start w-full">
            <UserPlus className="mr-2 h-5 w-5" />
            Register
          </Button>
        </Link>
        <Link to="/">
          <Button variant="ghost" className="justify-start w-full">
            <List className="mr-2 h-5 w-5" />
            Start Page
          </Button>
        </Link>
      </nav>
    </div>
  );
}
