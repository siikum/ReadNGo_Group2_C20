import { useState, useEffect } from 'react';
import StaffSidebar from "../components/ui/StaffSidebar";
import { dashboard, StaffDashboardResponse } from '../api/apiConfig';
import { FileText, CheckCircle2, Clock, TrendingUp, DollarSign, RefreshCw, BarChart3 } from 'lucide-react';

export default function StaffDashboard() {
    const [loadingDashboard, setLoadingDashboard] = useState(false);
    const [dashboardData, setDashboardData] = useState<StaffDashboardResponse | null>(null);
    const [error, setError] = useState<string | null>(null);


    // Fetch dashboard data
    const fetchDashboardData = async () => {
        setLoadingDashboard(true);
        setError(null);
        try {
            const response = await dashboard();
            if (response.success && response.data) {
                setDashboardData(response.data);  // Removed the type casting
            } else {
                setError(response.error || 'Failed to fetch dashboard data');
            }
        } catch (error) {
            setError('An unexpected error occurred');
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoadingDashboard(false);
        }
    };

    // Fetch dashboard data on component mount
    useEffect(() => {
        fetchDashboardData();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <StaffSidebar />
            <div className="flex-1 p-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
                            <p className="text-gray-600">Real-time order statistics and metrics</p>
                        </div>
                        <button
                            onClick={fetchDashboardData}
                            disabled={loadingDashboard}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-4 h-4 ${loadingDashboard ? 'animate-spin' : ''}`} />
                            Refresh
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Main Stats Grid */}
                    {loadingDashboard ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                                </div>
                            ))}
                        </div>
                    ) : dashboardData && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {/* Total Orders */}
                                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <BarChart3 className="w-5 h-5 text-gray-400" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData.totalOrders}</p>
                                    <p className="text-xs text-gray-500 mt-2">All time</p>
                                </div>

                                {/* Processed Orders */}
                                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                                        </div>
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-500">Processed Orders</h3>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData.processedOrdersCount}</p>
                                    <p className="text-xs text-gray-500 mt-2">Completed successfully</p>
                                </div>

                                {/* Pending Orders */}
                                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                            <Clock className="w-6 h-6 text-yellow-600" />
                                        </div>
                                        <div className="text-yellow-600 font-semibold">
                                            {dashboardData.pendingOrdersCount > 0 ? 'Action needed' : 'Clear'}
                                        </div>
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{dashboardData.pendingOrdersCount}</p>
                                    <p className="text-xs text-gray-500 mt-2">Awaiting processing</p>
                                </div>

                                {/* Total Revenue */}
                                <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div className="text-purple-600 font-semibold">Revenue</div>
                                    </div>
                                    <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">
                                        ${(dashboardData.processedOrdersValue + dashboardData.pendingOrdersValue).toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-2">Combined value</p>
                                </div>
                            </div>

                            {/* Detailed Stats */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Order Values Breakdown */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                        <DollarSign className="w-5 h-5 text-gray-600" />
                                        Order Values Breakdown
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">Processed Orders Value</p>
                                                <p className="text-sm text-gray-600">Completed transactions</p>
                                            </div>
                                            <p className="text-xl font-bold text-green-600">
                                                ${dashboardData.processedOrdersValue.toFixed(2)}
                                            </p>
                                        </div>
                                        <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900">Pending Orders Value</p>
                                                <p className="text-sm text-gray-600">Awaiting processing</p>
                                            </div>
                                            <p className="text-xl font-bold text-yellow-600">
                                                ${dashboardData.pendingOrdersValue.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Order Status Overview */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                        <BarChart3 className="w-5 h-5 text-gray-600" />
                                        Order Status Overview
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm font-medium text-gray-700">Completion Rate</span>
                                                <span className="text-sm font-bold text-gray-900">
                                                    {dashboardData.totalOrders > 0
                                                        ? Math.round((dashboardData.processedOrdersCount / dashboardData.totalOrders) * 100)
                                                        : 0}%
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className="bg-green-600 h-2.5 rounded-full"
                                                    style={{
                                                        width: `${dashboardData.totalOrders > 0
                                                            ? (dashboardData.processedOrdersCount / dashboardData.totalOrders) * 100
                                                            : 0}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="pt-4 grid grid-cols-2 gap-4">
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <p className="text-2xl font-bold text-gray-900">{dashboardData.processedOrdersCount}</p>
                                                <p className="text-sm text-gray-600">Processed</p>
                                            </div>
                                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                                <p className="text-2xl font-bold text-gray-900">{dashboardData.pendingOrdersCount}</p>
                                                <p className="text-sm text-gray-600">Pending</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <button
                                        onClick={() => window.location.href = 'staff-claim-code'}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <CheckCircle2 className="w-6 h-6 text-blue-600 mb-2" />
                                        <p className="font-medium text-gray-900">Process Claim</p>
                                        <p className="text-sm text-gray-600">Verify and complete orders</p>
                                    </button>
                                    <button
                                        onClick={() => window.location.href = '/staff-processed-orders'}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <FileText className="w-6 h-6 text-green-600 mb-2" />
                                        <p className="font-medium text-gray-900">View Processed Orders</p>
                                        <p className="text-sm text-gray-600">See completed transactions</p>
                                    </button>
                                    <button
                                        onClick={fetchDashboardData}
                                        className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <RefreshCw className="w-6 h-6 text-purple-600 mb-2" />
                                        <p className="font-medium text-gray-900">Refresh Data</p>
                                        <p className="text-sm text-gray-600">Update dashboard metrics</p>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}