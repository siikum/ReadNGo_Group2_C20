import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  
  const books = [
    {
      id: 1,
      title: "Atomic Habits",
      author: "James Clear",
      genre: "Self-help",
      published: "2018",
    },
    {
      id: 2,
      title: "The Alchemist",
      author: "Paulo Coelho",
      genre: "Fiction",
      published: "1988",
    },
    {
      id: 3,
      title: "Sapiens",
      author: "Yuval Noah Harari",
      genre: "History",
      published: "2011",
    },
  ];
  
  export default function BooksTable() {
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Genre</TableHead>
            <TableHead>Published</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.id}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.genre}</TableCell>
              <TableCell>{book.published}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }
  