import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { CartProvider } from "@/context/CartContext"
import Start from "./pages/start"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Books from "./pages/Books"
import AdminDashboard from "./pages/AdminDashboard"
import CreateOrderPage from "./pages/Order"
import AdminAddBooks from "./pages/AdminAddBooks"
import UserGetBooks from "./pages/UserGetBooks"
import { Homepage } from "@/pages/HomePage"
import { CartPage } from "./pages/CartPage"

export default function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Start />} />  
          <Route path="/books" element={<Books />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/create-order" element={<CreateOrderPage />} />
          <Route path="/Admin-Add-Books" element={<AdminAddBooks />} />
          <Route path="/User-Get-Books" element={<UserGetBooks />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </CartProvider>
  )
}