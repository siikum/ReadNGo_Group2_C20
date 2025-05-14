// Updated OrderDetails.tsx with fixed imports
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/NavBar';
import { getOrder, cancelOrder } from '@/api/apiConfig';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Package,
    Calendar,
    DollarSign,
    Book,
    X,
    Check,
    ArrowLeft,
    Clock,
    AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Remove the AlertDialog imports that are causing the error 
// or use a simple confirmation approach without those components

interface OrderItem {
    id: number;
    userId: number;
    bookIds: number[];
    bookTitles: string[];
    totalAmount: number;
    orderDate: string;
    isCancelled: boolean;
    isProcessed: boolean;
}

export default function OrderDetails() {
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [cancelingOrderId, setCancelingOrderId] = useState<number | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                // Get userId from localStorage
                const userId = localStorage.getItem('userId');

                if (!userId) {
                    setError('User not authenticated');
                    navigate('/login');
                    return;
                }

                const result = await getOrder(parseInt(userId));

                if (result.success && result.data) {
                    // Handle both array and single object responses
                    const ordersArray = Array.isArray(result.data) ? result.data : [result.data];
                    setOrders(ordersArray);
                } else {
                    setError(result.error || 'Failed to fetch orders');
                }
            } catch (err) {
                setError('An error occurred while fetching orders');
                console.error('Error fetching orders:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [navigate]);

    // Function to handle order cancellation with simple confirmation
    const handleCancelOrder = async (orderId: number) => {
        // Use browser's built-in confirm instead of AlertDialog
        const confirmed = window.confirm('Are you sure you want to cancel this order? This action cannot be undone.');

        if (!confirmed) return;

        try {
            setCancelingOrderId(orderId);
            const result = await cancelOrder(orderId);

            if (result.success) {
                // Update the order in local state
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === orderId ? { ...order, isCancelled: true } : order
                    )
                );
            } else {
                setError(`Failed to cancel order: ${result.error}`);
                setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
            }
        } catch (err) {
            console.error('Error cancelling order:', err);
            setError('An error occurred while cancelling the order');
            setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
        } finally {
            setCancelingOrderId(null);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Function to determine order status
    const getOrderStatus = (order: OrderItem) => {
        if (order.isCancelled) {
            return {
                label: "Cancelled",
                variant: "destructive" as const,
                icon: <X className="h-3 w-3 mr-1" />
            };
        } else if (order.isProcessed) {
            return {
                label: "Completed",
                variant: "success" as const,
                icon: <Check className="h-3 w-3 mr-1" />
            };
        } else {
            return {
                label: "Processing",
                variant: "outline" as const,
                icon: <Clock className="h-3 w-3 mr-1" />
            };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <p>Loading orders...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="container mx-auto px-4 py-16 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Error</h1>
                    <p className="mt-4 text-gray-600">{error}</p>
                    <Button
                        onClick={() => navigate('/')}
                        className="mt-8"
                    >
                        Go back to homepage
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                {/* Header with back button */}
                <div className="flex items-center mb-8">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(-1)}
                        className="mr-4 hover:bg-gray-100"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Go Back
                    </Button>
                    <h1 className="text-2xl font-bold">My Orders</h1>
                </div>

                {/* Error message (if any) */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                        <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                )}

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">No Orders Found</h2>
                        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                        <Button onClick={() => navigate('/')}>Browse Books</Button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const status = getOrderStatus(order);
                            const canCancel = !order.isProcessed && !order.isCancelled;
                            const isCanceling = cancelingOrderId === order.id;

                            return (
                                <Card key={order.id} className="overflow-hidden">
                                    <CardHeader className="bg-gray-50 border-b">
                                        <div className="flex flex-wrap justify-between items-center">
                                            <CardTitle className="text-lg">
                                                Order #{order.id}
                                            </CardTitle>
                                            <Badge
                                                variant={status.variant}
                                                className={`ml-auto ${status.label === "Processing" ? "bg-amber-100 text-amber-800 hover:bg-amber-100" :
                                                    status.label === "Completed" ? "bg-green-100 text-green-800 hover:bg-green-100" : ""}`}
                                            >
                                                {status.icon} {status.label}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid md:grid-cols-3 gap-6">
                                            {/* Order Info */}
                                            <div className="space-y-4">
                                                <div className="flex items-start">
                                                    <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Order Date</p>
                                                        <p className="font-medium">{formatDate(order.orderDate)}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start">
                                                    <DollarSign className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Total Amount</p>
                                                        <p className="font-medium">${order.totalAmount.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Book List */}
                                            <div className="md:col-span-2">
                                                <p className="text-sm text-gray-500 mb-3">
                                                    <Book className="h-4 w-4 inline mr-1" />
                                                    Books ({order.bookIds.length})
                                                </p>
                                                <div className="space-y-3">
                                                    {order.bookTitles.map((title, index) => (
                                                        <div key={index} className="flex gap-3 p-3 bg-gray-50 rounded-md">
                                                            <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center text-primary">
                                                                {index + 1}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{title}</p>
                                                                <p className="text-xs text-gray-500">Book ID: {order.bookIds[index]}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status-specific Messages */}
                                        {!order.isProcessed && !order.isCancelled && (
                                            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
                                                <div className="flex items-start">
                                                    <Clock className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-amber-800">Order is being processed</p>
                                                        <p className="text-sm text-amber-700">Your order is awaiting processing by our staff. Once processed, you'll be able to collect your books.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {order.isProcessed && !order.isCancelled && (
                                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
                                                <div className="flex items-start">
                                                    <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-green-800">Order is ready for collection</p>
                                                        <p className="text-sm text-green-700">Your order has been processed and is ready for collection. Please visit our store with your order ID.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {order.isCancelled && (
                                            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
                                                <div className="flex items-start">
                                                    <X className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                                                    <div>
                                                        <p className="font-medium text-red-800">Order has been cancelled</p>
                                                        <p className="text-sm text-red-700">This order has been cancelled and will not be processed.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>

                                    {/* Cancel Button for Processing Orders */}
                                    {canCancel && (
                                        <CardFooter className="bg-gray-50 border-t p-4">
                                            <Button
                                                variant="outline"
                                                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                                                onClick={() => handleCancelOrder(order.id)}
                                                disabled={isCanceling}
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                {isCanceling ? 'Cancelling...' : 'Cancel Order'}
                                            </Button>
                                        </CardFooter>
                                    )}
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}