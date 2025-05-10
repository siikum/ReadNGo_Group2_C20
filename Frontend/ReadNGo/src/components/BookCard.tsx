// @/components/BookCard.tsx
'use client';

import { Book } from '@/types/book';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export const BookCard = ({ book }: { book: Book }) => {
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="p-4 flex-grow">
        {imageError ? (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center mb-4 rounded">
            <span className="text-gray-400">No image available</span>
          </div>
        ) : (
          <img 
            src={book.image} 
            alt={book.title}
            className="w-full h-48 object-contain mb-4"
            onError={() => setImageError(true)}
          />
        )}
        <h3 className="font-semibold text-lg mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-1">by {book.author}</p>
        
        <div className="flex items-center mb-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(book.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">({book.rating})</span>
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-bold text-lg">Rs.{((book.price)*139).toFixed(2)}</p>
            {book.stock > 0 ? (
              <p className="text-xs text-green-600">In Stock ({book.stock})</p>
            ) : (
              <p className="text-xs text-red-600">Out of Stock</p>
            )}
          </div>
          <Button 
            size="sm"
            onClick={() => addToCart(book)}
            disabled={book.stock === 0}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};