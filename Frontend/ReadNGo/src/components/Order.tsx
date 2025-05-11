// @/pages/Orders.tsx
import { Navbar } from '@/components/NavBar';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const { orders, hasUserReviewedBook } = useCart();
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-6 w-6" />
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map(order => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Placed on {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                      <p className="text-lg font-bold mt-2">${order.total.toFixed(2)}</p>
                      {order.discount > 0 && (
                        <p className="text-sm text-green-600">
                          {(order.discount * 100).toFixed(0)}% discount applied
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-start border-b pb-4 last:border-0">
                        <div className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-16 h-24 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-gray-600">by {item.author}</p>
                            <p className="text-sm mt-1">
                              Quantity: {item.quantity} × ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                          {order.status === 'completed' && !hasUserReviewedBook(item.id) && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              onClick={() => navigate(`/books/${item.id}`)}
                            >
                              <Star className="h-4 w-4 mr-1" />
                              Write Review
                            </Button>
                          )}
                          {hasUserReviewedBook(item.id) && (
                            <Badge variant="secondary" className="mt-2">
                              Reviewed
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {order.claimCode && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium">Claim Code: {order.claimCode}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-8">
              Start shopping to see your orders here!
            </p>
            <Button
              onClick={() => navigate('/')}
              variant="default"
            >
              Start Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}