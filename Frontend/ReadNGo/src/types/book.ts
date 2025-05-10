// @/types/book.ts
export type Book = {
    id: number;
    title: string;
    author: string;
    genre: string;
    format: string;
    price: number;
    stock: number;
    rating: number;
    publishDate: string;
    publisher: string;
    language: string;
    isbn: string;
    description: string;
    image: string;
    discount: number;
    popularity: number;
    isOnSale: boolean;
    isNewRelease: boolean;
    isNewArrival: boolean;
    isAwardWinner: boolean;
    isBestseller: boolean;
  };
  
  export type CartItem = Book & {
    quantity: number;
  };
  
  export type Order = {
    id: string;
    items: CartItem[];
    total: number;
    discount: number;
    date: string;
    status: 'pending' | 'completed' | 'cancelled';
    claimCode: string;
  };