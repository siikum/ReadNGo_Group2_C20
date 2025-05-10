import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Start from "./pages/start";
import Login from "./pages/login";
import Register from "./pages/register";
import Books from "./pages/Books";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAddBooks from "./pages/AdminAddBooks";
import CreateOrderPage from "./pages/Order";
import AdminGetBooks from "./pages/AdminGetBooks";
import EditBookPage from "./pages/EditBookPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminCreateStaff from "./pages/AdminCreateStaff";
import AdminCreateAnnouncement from "./pages/AdminCreateAnnouncement";
import StaffDashboard from "./pages/StaffDashboard"; // Add this import

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Start />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/books" element={<Books />} />
                <Route path="/create-order" element={<CreateOrderPage />} />
                <Route path="/User-Get-Books" element={<AdminGetBooks />} />

                {/* Protected routes for both Admin and Staff */}
                <Route
                    path="/Admin-Get-Books"
                    element={
                        <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
                            <AdminGetBooks />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/Admin-Add-Books"
                    element={
                        <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
                            <AdminAddBooks />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/edit-book/:id"
                    element={
                        <ProtectedRoute allowedRoles={["Admin", "Staff"]}>
                            <EditBookPage />
                        </ProtectedRoute>
                    }
                />

                {/* Protected admin-only routes */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <AdminDashboard />
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
            </Routes>
        </Router>
    );
}