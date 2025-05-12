import { useState, useEffect } from 'react';
import StaffSidebar from "../components/ui/StaffSidebar";
import { processedOrders, ProcessedOrdersResponse } from '../api/apiConfig';
import { AlertCircle, Loader2, Package, User, Hash, DollarSign, Calendar, RefreshCw, Search, BookOpen, CheckCircle2, XCircle } from 'lucide-react';

export default function StaffProcessedOrders() {
    const [orders, setOrders] = useState<ProcessedOrdersResponse[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOrders, setFilteredOrders] = useState<ProcessedOrdersResponse[]>([]);

    // Fetch processed orders
    const fetchProcessedOrders = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await processedOrders();
            if (response.success && response.data) {
                setOrders(response.data);
                setFilteredOrders(response.data);
            } else {
                setError(response.error || 'Failed to fetch processed orders');
            }
        } catch (error) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders on component mount
    useEffect(() => {
        fetchProcessedOrders();
    }, []);

    // Filter orders based on search term
    useEffect(() => {
        if (searchTerm) {
            const filtered = orders.filter(order =>
                order.orderId.toString().includes(searchTerm) ||
                order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.claimCode.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredOrders(filtered);
        } else {
            setFilteredOrders(orders);
        }
    }, [searchTerm, orders]);

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <StaffSidebar />
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Processed Orders</h1>
                            <p className="text-gray-600">View all confirmed and completed orders</p>
                        </div>
                        <button
                            onClick={fetchProcessedOrders}
                            disabled={loading}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by Order ID, Customer Name, or Claim Code..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="mb-6 p-4 rounded-lg flex items-center gap-3 bg-red-50 text-red-800 border border-red-200">
                            <AlertCircle className="w-5 h-5 text-red-600" />
                            <p>{error}</p>
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && !orders.length ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                        </div>
                    ) : filteredOrders.length > 0 ? (
                        /* Orders Table */
                        <div className="bg-white rounded-lg shadow-md overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order ID
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Customer
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Claim Code
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Books
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Final Amount
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Order Date
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredOrders.map((order) => (
                                            <tr key={order.orderId} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    #{order.orderId}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <User className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-sm text-gray-900">{order.userName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <span className="font-mono text-xs">{order.claimCode}</span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                                                        <span className="text-sm text-gray-900">{order.bookCount}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    ${order.finalAmount.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(order.orderDate)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {order.isCancelled ? (
                                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                            <XCircle className="w-3 h-3 mr-1" />
                                                            Cancelled
                                                        </span>
                                                    ) : order.isConfirmed ? (
                                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            <CheckCircle2 className="w-3 h-3 mr-1" />
                                                            Confirmed
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        /* Empty State */
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Processed Orders</h3>
                            <p className="text-gray-500">
                                {searchTerm ? 'No orders match your search criteria.' : 'No orders have been processed yet.'}
                            </p>
                        </div>
                    )}

                    {/* Summary Statistics */}
                    {orders.length > 0 && (
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center gap-3">
                                    <Hash className="w-8 h-8 text-blue-600 bg-blue-100 rounded-lg p-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Total Orders</p>
                                        <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-8 h-8 text-green-600 bg-green-100 rounded-lg p-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Confirmed Orders</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {orders.filter(order => order.isConfirmed && !order.isCancelled).length}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center gap-3">
                                    <BookOpen className="w-8 h-8 text-purple-600 bg-purple-100 rounded-lg p-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Total Books</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {orders.reduce((sum, order) => sum + order.bookCount, 0)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex items-center gap-3">
                                    <DollarSign className="w-8 h-8 text-green-600 bg-green-100 rounded-lg p-2" />
                                    <div>
                                        <p className="text-sm text-gray-500">Total Revenue</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            ${orders.reduce((sum, order) => sum + order.finalAmount, 0).toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}