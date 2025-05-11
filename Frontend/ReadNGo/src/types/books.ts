// @/types/books.ts
export interface Book {
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
}

export interface CartItem extends Book {
  quantity: number;
}

export interface Review {
  id: string;
  bookId: number;
  userId: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean; // Verified purchase
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  discount: number;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  claimCode: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  membershipId: string;
  orderCount: number;
  wishlist: number[]; // array of book IDs
  cart: CartItem[];
  orders: Order[];
  reviews: Review[];
}