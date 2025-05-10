// @/components/Order.tsx
'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { CalendarDays, X } from 'lucide-react';

export const Order = () => {
  const { orders, cancelOrder } = useCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Order #{order.id}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      order.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : order.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <CalendarDays size={14} className="mr-1" />
                    {new Date(order.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${order.total.toFixed(2)}</p>
                  {order.discount > 0 && (
                    <p className="text-xs text-green-600">
                      Saved ${(order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * order.discount).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <p className="text-sm font-medium mb-2">Claim Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{order.claimCode}</span></p>
                <p className="text-sm mb-4">Please present this code at the store to claim your order.</p>
                
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {order.items.reduce((sum, item) => sum + item.quantity, 0)} items
                  </p>
                  {order.status === 'pending' && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => cancelOrder(order.id)}
                    >
                      <X size={16} className="mr-1" /> Cancel Order
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};