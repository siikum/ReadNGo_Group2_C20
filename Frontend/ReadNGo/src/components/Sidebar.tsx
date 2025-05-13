import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Book, User, UserPlus, List } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-gray-100 p-6 border-r">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-3">
        <Link to="/admin-add-books">
          <Button variant="ghost" className="justify-start w-full">
            <Home className="mr-2 h-5 w-5" />
            Add Books
          </Button>
        </Link>
        <Link to="/admin-get-books">
        <Button variant="ghost" className="justify-start w-full">
            <Book className="mr-2 h-5 w-5" />
            Books
        </Button>
        </Link>
        <Link to="/admin-create-staff">
          <Button variant="ghost" className="justify-start w-full">
            <User className="mr-2 h-5 w-5" />
            Create Staff
          </Button>
        </Link>
        <Link to="/admin-create-announcement">
          <Button variant="ghost" className="justify-start w-full">
            <UserPlus className="mr-2 h-5 w-5" />
            Create Announcement
          </Button>
        </Link>
        {/*<Link to="/">*/}
        {/*  <Button variant="ghost" className="justify-start w-full">*/}
        {/*    <List className="mr-2 h-5 w-5" />*/}
        {/*    Start Page*/}
        {/*  </Button>*/}
        {/*</Link>*/}
      </nav>
    </div>
  );
}
