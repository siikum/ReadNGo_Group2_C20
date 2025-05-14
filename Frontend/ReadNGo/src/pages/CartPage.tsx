// @/pages/CartPage.tsx
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Navbar } from '@/components/NavBar';
import { Trash2, Mail, ShoppingBag, CheckCircle } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCart } from '@/api/apiConfig';
import { getUserRole } from '@/lib/auth';

export const CartPage = () => {
    const {
        cart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyDiscount,
        setCartFromApi
    } = useCart();
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { placeOrder } = useCart();
    const userRole = getUserRole();

    // Check authentication first
    useEffect(() => {
        if (!userRole) {
            navigate('/login');
            return;
        }
    }, [userRole, navigate]);

    const fetchCart = useCallback(async () => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');

        if (!userId || !token) {
            navigate('/login');
            return;
        }

        try {
            setLoading(true);
            const response = await getCart(parseInt(userId));

            if (response.success && response.data && response.data.cartItems) {
                setCartFromApi(response.data.cartItems);
            } else {
                setError(response.error || 'Failed to fetch cart items');
                console.error(response.error);
            }
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError('An error occurred while fetching your cart');
        } finally {
            setLoading(false);
        }
    }, [navigate, setCartFromApi]);

    // Fetch cart when component mounts or when location changes
    useEffect(() => {
        let isMounted = true;

        const loadCart = async () => {
            await fetchCart();
        };

        loadCart();

        return () => {
            isMounted = false;
        };
    }, [fetchCart, location]);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = applyDiscount();
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

    // Function to get the correct image URL
    const getImageUrl = (image: string) => {
        if (!image) return 'https://placehold.co/200x300/e2e8f0/1e293b?text=Book+Cover';

        // If the image is a path that starts with a slash
        if (image.startsWith('/')) {
            return `https://localhost:7149${image}`;
        }

        // If it's just a filename
        if (!image.includes('/') && !image.startsWith('http')) {
            return `https://localhost:7149/images/${image}`;
        }

        // If it already has https:// or http://, return as is
        return image;
    };

    const handlePlaceOrder = async () => {
        try {
            setLoading(true);
            const order = await placeOrder(); // This calls the context function

            if (order) {
                setConfirmationCode(order.claimCode);
                setOrderPlaced(true);
                clearCart(); // This may not be needed if already included in context logic
            } else {
                alert('Failed to place order. Please try again.');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!userRole) {
        return null; // The useEffect will redirect, no need to render anything
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-12 flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-12">
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <p className="text-red-600 mb-4">{error}</p>
                        <Button onClick={() => navigate('/homepage')}>Return to Homepage</Button>
                    </div>
                </div>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-12">
                    
                    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle className="h-8 w-8 text-green-500" />
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>

                        <p className="text-gray-600 mb-4">
                            Thank you for your purchase. Your order will be ready for pickup soon.
                        </p>

                        <div className="mb-6 p-4 bg-blue-50 rounded-lg text-left">
                            <div className="flex items-start">
                                <Mail className="h-5 w-5 text-blue-800 mr-2 mt-0.5" />
                                <div>
                                    <p className="text-blue-800 font-medium">Email Confirmation</p>
                                    <p className="text-blue-700 text-sm">
                                        An email has been sent to your personal email address with all the order details and confirmation code.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg mb-6">
                            <p className="font-medium">Payment Method:</p>
                            <p className="text-gray-600 mb-4">Come to physical store for payment</p>


                          
                        </div>

                        <Button
                            className="w-full"
                            onClick={() => navigate('/homepage')}
                        >
                            <ShoppingBag className="h-4 w-4 mr-2" />
                            Continue Shopping
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Your Shopping Cart</h1>

                {cart.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                        <p className="text-gray-600 mb-4">Your cart is empty</p>
                        <Button onClick={() => navigate('/homepage')}>Browse Books</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                {cart.map(item => (
                                    <div key={item.id} className="flex flex-col sm:flex-row gap-4 py-4 border-b last:border-b-0">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={getImageUrl(item.image)}
                                                alt={item.title}
                                                className="w-20 h-24 object-cover rounded"
                                                onError={(e) => {
                                                    
                                                    const img = e.target as HTMLImageElement;
                                                    if (!img.dataset.usedFallback) {
                                                        img.dataset.usedFallback = 'true';
                                                        // Use an external placeholder service that is guaranteed to work
                                                        img.src = `https://placehold.co/200x300/e2e8f0/1e293b?text=${encodeURIComponent(item.title)}`;
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-medium">{item.title}</h3>
                                            <p className="text-sm text-gray-600">by {item.author}</p>
                                            <p className="font-bold mt-1">Rs.{((item.price) * 139).toFixed(2)}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                                className="w-16 p-2 border rounded text-center"
                                            />
                                            <Button onClick={() => removeFromCart(item.id)}>
                                                <Trash2 size={16} className="mr-2" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-sm h-fit sticky top-24">
                            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>Rs.{(subtotal * 139).toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount ({discount * 100}%)</span>
                                        <span>-Rs.{(discountAmount * 139).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                                    <span>Total</span>
                                    <span>Rs.{(total * 139).toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="font-medium text-blue-800">Payment</p>
                                    <p className="text-sm text-blue-600">Payment accepted in physical store</p>
                                </div>

                                <Button
                                    className="w-full"
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;