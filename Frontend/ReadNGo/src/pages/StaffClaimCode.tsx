import { useState } from 'react';
import StaffSidebar from "../components/ui/StaffSidebar";
import { processClaimCode, ClaimCodeResponse } from '../api/apiConfig';
import { AlertCircle, CheckCircle2, Loader2, Package, User, Hash, DollarSign, CreditCard, Mail } from 'lucide-react';

export default function StaffClaimCode() {
    const [claimCode, setClaimCode] = useState('');
    const [membershipId, setMembershipId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [orderDetails, setOrderDetails] = useState<ClaimCodeResponse | null>(null);

    const handleProcessClaim = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!claimCode.trim()) {
            setMessage({ type: 'error', text: 'Please enter a claim code' });
            return;
        }

        if (!membershipId.trim()) {
            setMessage({ type: 'error', text: 'Please enter membership ID' });
            return;
        }

        setLoading(true);
        setMessage(null);
        setOrderDetails(null);

        try {
            const response = await processClaimCode({
                claimCode: claimCode.trim(),
                membershipId: membershipId.trim()
            });

            if (response.success && response.data) {
                // Check if the claim code is valid based on the presence of orderId
                if (response.data.orderId) {
                    setMessage({ type: 'success', text: response.data.message });
                    setOrderDetails(response.data);
                    setClaimCode(''); // Clear the input after successful processing
                    setMembershipId(''); // Clear membership ID as well
                } else {
                    // Invalid claim code or membership ID
                    setMessage({ type: 'error', text: response.data.message });
                }
            } else {
                setMessage({ type: 'error', text: response.error || 'Failed to process claim code' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An unexpected error occurred' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            <StaffSidebar />
            <div className="flex-1 p-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Collection Point</h1>
                        <p className="text-gray-600">Process customer claim codes to complete order pickup</p>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="font-medium text-blue-900 mb-1">Customer Order Process</h3>
                            <p className="text-blue-800 text-sm">
                                Customers receive an email with their order details after placing an order online.
                                They must present their claim code and membership ID for verification.
                            </p>
                        </div>
                    </div>

                    {/* Claim Code Form */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Verify Customer Order</h2>
                        <form onSubmit={handleProcessClaim} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Claim Code Input */}
                                <div>
                                    <label htmlFor="claimCode" className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <Hash className="w-4 h-4 text-gray-500" />
                                            Claim Code
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        id="claimCode"
                                        value={claimCode}
                                        onChange={(e) => setClaimCode(e.target.value)}
                                        placeholder="e.g., 79A6E418-96A2-46DE-A022-BD07BD8B93BC"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        disabled={loading}
                                    />
                                </div>

                                {/* Membership ID Input */}
                                <div>
                                    <label htmlFor="membershipId" className="block text-sm font-medium text-gray-700 mb-2">
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-gray-500" />
                                            Membership ID
                                        </div>
                                    </label>
                                    <input
                                        type="text"
                                        id="membershipId"
                                        value={membershipId}
                                        onChange={(e) => setMembershipId(e.target.value)}
                                        placeholder="e.g., bcd7886f-e05c-41ba-b34a-43df1717f03b"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    'Verify & Process Order'
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Message Display */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${message.type === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                            }`}>
                            {message.type === 'success' ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-red-600" />
                            )}
                            <p>{message.text}</p>
                        </div>
                    )}

                    {/* Order Details Display */}
                    {orderDetails && orderDetails.orderId && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Verified Order Details</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                {/* Order Information */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Hash className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Order ID</p>
                                            <p className="font-semibold">{orderDetails.orderId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <User className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Membership ID</p>
                                            <p className="font-semibold text-xs break-all">{orderDetails.membershipId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <DollarSign className="w-5 h-5 text-gray-500" />
                                        <div>
                                            <p className="text-sm text-gray-500">Total Amount</p>
                                            <p className="font-semibold text-green-600">${orderDetails.totalAmount?.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Books Information */}
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <Package className="w-5 h-5 text-gray-500" />
                                        <h3 className="font-medium text-gray-900">Books to Hand Over</h3>
                                    </div>
                                    {orderDetails.books && orderDetails.books.length > 0 ? (
                                        <div className="space-y-2">
                                            {orderDetails.books.map((book, index) => (
                                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                    <span className="font-medium">Book ID: {book.bookId}</span>
                                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                                        Qty: {book.quantity}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No books in this order</p>
                                    )}
                                </div>
                            </div>

                            {/* Action Button */}
                            <div className="border-t pt-6">
                                <button
                                    onClick={() => {
                                        // Here you can add logic to mark the order as completed
                                        setMessage({ type: 'success', text: 'Order completed successfully! Books have been handed to the customer.' });
                                        setOrderDetails(null);
                                    }}
                                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Complete Order & Hand Over Books
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-6">
                        <h3 className="font-medium text-gray-900 mb-3">Standard Operating Procedure</h3>
                        <ol className="list-decimal list-inside text-gray-700 space-y-2">
                            <li>Ask the customer to show their order confirmation email</li>
                            <li>Request their claim code and membership ID from the email</li>
                            <li>Enter both values in the fields above and click "Verify & Process Order"</li>
                            <li>Verify the customer's identity against their membership ID</li>
                            <li>Collect the books listed in the order details</li>
                            <li>Hand over the books to the customer</li>
                            <li>Click "Complete Order" to finalize the transaction</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
}