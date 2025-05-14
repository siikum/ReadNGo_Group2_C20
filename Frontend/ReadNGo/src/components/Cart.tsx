// @/components/Cart.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/context/CartContext';
import { Trash2 } from 'lucide-react';

export const Cart = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    placeOrder,
    applyDiscount,
    clearCart,
  } = useCart();

  const discount = applyDiscount();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = subtotal * discount;
  const total = subtotal - discountAmount;

  const handlePlaceOrder = async () => {
    const order = await placeOrder();
    if (order) {
      // In a real app, you would redirect to order confirmation
      alert(`Order placed! Your claim code is: ${order.claimCode}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Your cart is empty</p>
          <Button className="mt-4" variant="outline">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="border rounded-lg p-4 flex flex-col sm:flex-row gap-4">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-24 h-32 object-contain"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600">by {item.author}</p>
                    <p className="font-bold mt-2">Rs. {item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                      className="w-20"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border rounded-lg p-6 h-fit">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discount * 100}%)</span>
                  <span>-Rs. {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>
            </div>
            
            <Button className="w-full mt-6" onClick={handlePlaceOrder}>
              Place Order
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full mt-2"
              onClick={clearCart}
            >
              Clear Cart
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};