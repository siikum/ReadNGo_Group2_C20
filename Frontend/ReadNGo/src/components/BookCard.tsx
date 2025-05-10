// src/components/BookCard.tsx
import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Book } from '../types/books';

export interface BookCardProps {
  book: Book;
  onAddToCart?: (book: Book) => void;
  onViewDetails?: (book: Book) => void;
}

const BookCard: React.FC<BookCardProps> = ({
  book,
  onAddToCart,
  onViewDetails,
}) => {
  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
    });
  };

  return (
    <Card className="h-full flex flex-col transition-transform hover:scale-105">
      <CardHeader className="p-0">
        <div className="relative">
          <img
            src={book.imagePath || '/placeholder-book.jpg'}
            alt={book.title}
            className="w-full h-48 object-cover rounded-t-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-book.jpg';
            }}
          />
          {book.isOnSale && (
            <Badge className="absolute top-2 right-2 bg-red-500">
              {book.discountPercentage}% OFF
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-4">
        <h3 
          className="font-semibold text-lg line-clamp-2 mb-1 cursor-pointer hover:text-blue-600"
          onClick={() => onViewDetails?.(book)}
        >
          {book.title}
        </h3>
        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
        
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {book.genre}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {book.format}
          </Badge>
        </div>

        <div className="flex items-center gap-1 mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{book.averageRating.toFixed(1)}</span>
          <span className="text-sm text-gray-500">({book.reviewCount})</span>
        </div>

        <div className="flex items-center gap-2">
          {book.isOnSale ? (
            <>
              <span className="text-lg font-bold text-red-600">
                {formatCurrency(book.actualPrice)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(book.price)}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold">
              {formatCurrency(book.price)}
            </span>
          )}
        </div>

        <div className="text-sm text-gray-500 mt-1">
          Published: {formatDate(book.publicationDate)}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={book.stockQuantity === 0}
          onClick={() => onAddToCart?.(book)}
        >
          {book.stockQuantity === 0 ? (
            'Out of Stock'
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default BookCard;