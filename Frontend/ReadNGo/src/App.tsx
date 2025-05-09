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


export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Start />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/books" element={<Books />} />
                <Route path="/create-order" element={<CreateOrderPage />} />
                <Route path="/User-Get-Books" element={<AdminGetBooks />} />\
                <Route path="/edit-book/:id" element={<EditBookPage />} />

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
                    path="/Admin-Get-Books"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <AdminGetBooks />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/Admin-Add-Books"
                    element={
                        <ProtectedRoute allowedRoles={["Admin"]}>
                            <AdminAddBooks />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}
