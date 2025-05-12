// @/pages/Wishlist.tsx
import { Navbar } from '@/components/NavBar';
import { BookCard } from '@/components/BookCard';
import { books } from '@/Data/book';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Wishlist() {
  const { wishlist } = useCart();
  const navigate = useNavigate();

  const wishlistBooks = books.filter(book => wishlist.includes(book.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="h-6 w-6 text-red-500 fill-red-500" />
          <h1 className="text-2xl font-bold">My Wishlist</h1>
        </div>

        {wishlistBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlistBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Start adding books you love to your wishlist!
            </p>
            <Button
              onClick={() => navigate('/')}
              variant="default"
            >
              Browse Books
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}