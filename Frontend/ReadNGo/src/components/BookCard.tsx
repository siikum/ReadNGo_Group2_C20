// @/components/BookCard.tsx
import { Book } from '@/types/books';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const navigate = useNavigate();

  const calculateDiscountedPrice = () => {
    return book.discount > 0 
      ? (book.price * (1 - book.discount / 100)).toFixed(2)
      : book.price.toFixed(2);
  };

  const handleCardClick = () => {
    navigate(`/books/${book.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(book);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWishlist(book.id)) {
      removeFromWishlist(book.id);
    } else {
      addToWishlist(book.id);
    }
  };

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={book.image}
          alt={book.title}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
          onClick={handleWishlistToggle}
        >
          <Heart 
            className={`h-4 w-4 ${
              isInWishlist(book.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </Button>
        
        {book.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-red-500">
            -{book.discount}%
          </Badge>
        )}
        {book.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg">Out of Stock</Badge>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-primary">
            ${calculateDiscountedPrice()}
          </span>
          {book.discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              ${book.price.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={`text-sm ${
                i < Math.floor(book.rating) ? 'text-yellow-400' : 'text-gray-300'
              }`}
            >
              ★
            </span>
          ))}
          <span className="text-sm text-gray-600">({book.rating})</span>
        </div>
        {book.isBestseller && (
          <Badge variant="secondary" className="text-xs">
            Bestseller
          </Badge>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full"
          onClick={handleAddToCart}
          disabled={book.stock === 0}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {book.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
};