// @/pages/CartPage.tsx
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Navbar } from '@/components/NavBar';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CartPage = () => {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    applyDiscount
  } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = applyDiscount();
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  const generateConfirmationCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handlePlaceOrder = () => {
    // Generate confirmation code
    const code = generateConfirmationCode();
    setConfirmationCode(code);
    setOrderPlaced(true);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order will be ready for pickup soon.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="font-medium">Payment Method:</p>
              <p className="text-gray-600 mb-4">Cash on Delivery</p>
              <p className="font-medium">Confirmation Code:</p>
              <p className="text-2xl font-bold text-primary">{confirmationCode}</p>
            </div>
            
            <Button 
              className="w-full"
              onClick={() => navigate('/homepage')}
            >
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
                        src={item.image} 
                        alt={item.title}
                        className="w-20 h-24 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/book-placeholder.jpg';
                        }}
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-gray-600">by {item.author}</p>
                      <p className="font-bold mt-1">Rs.{((item.price)*139).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                        className="w-16 p-2 border rounded text-center"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
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
                  <span>Rs.{(subtotal*139).toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({discount * 100}%)</span>
                    <span>-Rs.{(discountAmount*139).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rs.{(total*139).toFixed(2)}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-800">Payment Method</p>
                  <p className="text-sm text-blue-600">Cash on Delivery Only</p>
                </div>
                
                <Button 
                  className="w-full"
                  onClick={handlePlaceOrder}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};