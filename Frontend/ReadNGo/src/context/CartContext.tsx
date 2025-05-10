// @/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Book, CartItem, Order } from '@/types/book';

type CartContextType = {
  cart: CartItem[];
  orders: Order[];
  addToCart: (book: Book) => void;
  removeFromCart: (bookId: number) => void;
  updateQuantity: (bookId: number, quantity: number) => void;
  placeOrder: () => Promise<Order | null>;
  cancelOrder: (orderId: string) => void;
  applyDiscount: () => number;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (book: Book) => {
    setCart(prev => {
      const existingItem = prev.find(item => item.id === book.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === book.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...book, quantity: 1 }];
    });
  };

  const removeFromCart = (bookId: number) => {
    setCart(prev => prev.filter(item => item.id !== bookId));
  };

  const updateQuantity = (bookId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === bookId ? { ...item, quantity } : item))
    );
  };

  const applyDiscount = () => {
    let discount = 0;
    // 5% discount for 5+ books
    if (cart.reduce((sum, item) => sum + item.quantity, 0) >= 5) {
      discount += 0.05;
    }
    // Additional 10% discount logic would go here (would need to track order count)
    return discount;
  };

  const placeOrder = async () => {
    if (cart.length === 0) return null;
    
    const discount = applyDiscount();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );
    const total = subtotal * (1 - discount);
    
    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 9),
      items: [...cart],
      total,
      discount,
      date: new Date().toISOString(),
      status: 'pending',
      claimCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };
    
    setOrders(prev => [...prev, newOrder]);
    setCart([]);
    return newOrder;
  };

  const cancelOrder = (orderId: string) => {
    setOrders(prev =>
      prev.map(order =>
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateQuantity,
        placeOrder,
        cancelOrder,
        applyDiscount,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};