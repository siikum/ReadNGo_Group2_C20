import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from "./pages/start";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Books from "./pages/Books";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddBooks from "./pages/AdminAddBooks";
import CreateOrderPage from "./pages/Order";
import AdminGetBooks from "./pages/AdminGetBooks";
import EditBookPage from "./pages/EditBookPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCreateStaff from "./pages/AdminCreateStaff";
import AdminCreateAnnouncement from "./pages/AdminCreateAnnouncement";

import HomePage from "./pages/HomePage";
import Cart from "./pages/CartPage";
import { CartProvider } from '@/context/CartContext';
import BookDetail from "./pages/BookDetail";
import Wishlist from "./pages/Wishlist";
import Orders from "./components/Order";
import StaffProcessedOrders from "./pages/StaffProcessedOrders";
import StaffClaimCode from "./pages/StaffClaimCode";
import StaffDashboard from "./pages/StaffDashboard";

export default function App() {
    return (
        
        <CartProvider>
        <Router>
            
            <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/homepage" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/books" element={<Books />} />
                <Route path="/create-order" element={<CreateOrderPage />} />
                {/*<Route path="/User-Get-Books" element={<AdminGetBooks />} />\*/}
                    <Route path="/edit-book/:id" element={<EditBookPage />} />


                 <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/orders" element={<Orders />} />
                {/*<Route path="admin-create-staff" element={<AdminCreateStaff />} />*/}

                <Route path="/homepage" element={<HomePage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/books/:id" element={<BookDetail />} />

                {/* ✅ Protected admin routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/Admin-add-books"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <AdminAddBooks />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/Admin-get-books"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <AdminGetBooks />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/Admin-Create-Staff"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <AdminCreateStaff />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/Admin-Create-Announcement"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <AdminCreateAnnouncement />
                        </ProtectedRoute>
                    }
                />

                    {/* Protected staff routes */}
                    <Route
                        path="/staff-dashboard"
                        element={
                            <ProtectedRoute allowedRoles={["Staff"]}>
                                <StaffDashboard />
                            </ProtectedRoute>
                        }
                    />
                <Route
                    path="/staff-claim-code"
                    element={
                        <ProtectedRoute allowedRoles={["Staff"]}>
                            <StaffClaimCode />
                        </ProtectedRoute>
                    }
                    />
                    <Route
                        path="/staff-processed-orders"
                        element={
                            <ProtectedRoute allowedRoles={["Staff"]}>
                                <StaffProcessedOrders />
                            </ProtectedRoute>
                        }
                    />
            </Routes>
        </Router>
        
        </CartProvider>
        
    );
}