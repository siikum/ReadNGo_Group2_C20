// @/context/CartContext.tsx
// @/context/CartContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Book, CartItem, Order, Review } from '@/types/books';
import {
    addToCart as addToCartAPI,
    createOrder as createOrderAPI,
    deleteFromCart,  // Import as a value, not a type
    getCart  // Add this to import getCart for the fetchCart function
} from '@/api/apiConfig';
import type { AddToCartData } from '@/api/apiConfig';  // Keep this as type import

type CartContextType = {
    cart: CartItem[];
    orders: Order[];
    wishlist: number[];
    reviews: Review[];
    addToCart: (book: Book) => void;
    removeFromCart: (bookId: number) => void;
    updateQuantity: (bookId: number, quantity: number) => void;
    placeOrder: () => Promise<Order | null>;
    cancelOrder: (orderId: string) => void;
    applyDiscount: () => number;
    clearCart: () => void;
    addToWishlist: (bookId: number) => void;
    removeFromWishlist: (bookId: number) => void;
    isInWishlist: (bookId: number) => boolean;
    addReview: (review: Omit<Review, 'id' | 'date' | 'userName'>) => void;
    getBookReviews: (bookId: number) => Review[];
    hasUserReviewedBook: (bookId: number) => boolean;
    canUserReviewBook: (bookId: number) => boolean;
    setCartFromApi: (cartItems: any[]) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [wishlist, setWishlist] = useState<number[]>([]);
    const [reviews, setReviews] = useState<Review[]>([
        // Sample reviews for demonstration
        {
            id: '1',
            bookId: 1,
            userId: 2,
            userName: 'Jane Smith',
            rating: 5,
            comment: 'This book changed my perspective on life! Highly recommended.',
            date: '2024-10-15',
            verified: true
        },
        {
            id: '2',
            bookId: 1,
            userId: 3,
            userName: 'Bob Johnson',
            rating: 4,
            comment: 'Great read, though it gets a bit slow in the middle.',
            date: '2024-09-20',
            verified: true
        }
    ]);

    // Mock current user ID (in real app, this would come from auth context)
    const currentUserId = 1;
    const currentUserName = 'John Doe';

    // Use useCallback to memoize the setCartFromApi function
    const setCartFromApi = useCallback((apiCartItems: any[]) => {
        // Transform API cartItems to match your local format
        const transformedItems = apiCartItems.map(item => ({
            id: item.bookId,
            title: item.title,
            author: item.author,
            price: item.price,
            quantity: item.quantity,
            // Update the placeholder image path to match your application structure
            image: item.imagePath || '/images/book-placeholder.jpg',
        }));

        setCart(transformedItems);
    }, []);

    const fetchCart = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        if (!userId) {
            console.error('User not authenticated');
            return;
        }
        try {
            const response = await getCart(parseInt(userId));
            if (response.success && response.data && response.data.cartItems) {
                setCartFromApi(response.data.cartItems);
            } else {
                console.error('Failed to fetch cart:', response.error);
            }
        } catch (err) {
            console.error('Error fetching cart:', err);
        }
    }, [setCartFromApi]);

    const addToCart = async (book: Book) => {
        // Get the real user ID from localStorage
        const userId = localStorage.getItem('userId');

        if (!userId) {
            console.error('User not authenticated');
            throw new Error('User not authenticated');
            return;
        }

        // Call API to add to cart
        const cartData: AddToCartData = {
            userId: parseInt(userId), // Use the real user ID from localStorage
            bookId: book.id,
            quantity: 1
        };

        const response = await addToCartAPI(cartData);

        if (response.success) {
            // Update local state
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
        } else {
            // Handle error
            console.error('Failed to add to cart:', response.error);
            throw new Error(response.error || 'Failed to add to cart');
        }
    };

    // In CartContext.tsx, update the removeFromCart function:
    // In CartContext.tsx, update the removeFromCart function:
    const removeFromCart = async (bookId: number) => {
        const userId = localStorage.getItem('userId');

        if (!userId) {
            console.error('User not authenticated');
            return;
        }

        // Optimistically update UI first for better user experience
        setCart(prev => prev.filter(item => item.id !== bookId));

        // Then sync with backend
        try {
            const response = await deleteFromCart(parseInt(userId), bookId);
            if (!response.success) {
                console.error('Failed to delete item from cart:', response.error);
                // Optionally fetch the cart again to sync with backend state
                fetchCart(); // You'd need to implement this function
            }
        } catch (err) {
            console.error('Error calling deleteFromCart API:', err);
            // Consider fetching the cart again to restore state from backend
        }
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

        try {
            // Prepare order data for API
            const bookIds = cart.flatMap(item =>
                Array(item.quantity).fill(item.id)
            );

            const orderData = {
                userId: currentUserId,
                bookIds: bookIds
            };

            // Call API to create order
            const response = await createOrderAPI(orderData);

            if (response.success) {
                // Create local order object
                const discount = applyDiscount();
                const subtotal = cart.reduce(
                    (sum, item) => sum + item.price * item.quantity, 0
                );
                const total = subtotal * (1 - discount);

                const newOrder: Order = {
                    id: response.data.id || Math.random().toString(36).substring(2, 9),
                    items: [...cart],
                    total,
                    discount,
                    date: new Date().toISOString(),
                    status: 'completed',
                    claimCode: response.data.claimCode || Math.random().toString(36).substring(2, 8).toUpperCase(),
                };

                setOrders(prev => [...prev, newOrder]);
                setCart([]);
                return newOrder;
            } else {
                throw new Error(response.error || 'Failed to place order');
            }
        } catch (error) {
            console.error('Failed to place order:', error);
            throw error;
        }
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

    // Wishlist functions
    const addToWishlist = (bookId: number) => {
        setWishlist(prev => {
            if (!prev.includes(bookId)) {
                return [...prev, bookId];
            }
            return prev;
        });
    };

    const removeFromWishlist = (bookId: number) => {
        setWishlist(prev => prev.filter(id => id !== bookId));
    };

    const isInWishlist = (bookId: number) => {
        return wishlist.includes(bookId);
    };

    // Review functions
    const addReview = (review: Omit<Review, 'id' | 'date' | 'userName'>) => {
        const newReview: Review = {
            ...review,
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString().split('T')[0],
            userName: currentUserName,
        };
        setReviews(prev => [...prev, newReview]);
    };

    const getBookReviews = (bookId: number) => {
        return reviews.filter(review => review.bookId === bookId);
    };

    const hasUserReviewedBook = (bookId: number) => {
        return reviews.some(review =>
            review.bookId === bookId && review.userId === currentUserId
        );
    };

    const canUserReviewBook = (bookId: number) => {
        // Check if user has completed an order containing this book
        return orders.some(order =>
            order.status === 'completed' &&
            order.items.some(item => item.id === bookId)
        );
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                orders,
                wishlist,
                reviews,
                addToCart,
                removeFromCart,
                updateQuantity,
                placeOrder,
                cancelOrder,
                applyDiscount,
                clearCart,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                addReview,
                getBookReviews,
                hasUserReviewedBook,
                canUserReviewBook,
                setCartFromApi
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