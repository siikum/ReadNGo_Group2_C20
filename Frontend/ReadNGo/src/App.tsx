import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Start from "./pages/start"
import Login from "./pages/login"
import Register from "./pages/register"
import Books from "./pages/Books"
import AdminDashboard from "./pages/AdminDashboard"
import CreateOrderPage from "./pages/Order"
import AdminAddBooks from "./pages/AdminAddBooks"
import UserGetBooks from "./pages/UserGetBooks"

export default function App() {
  return (
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


      </Routes>
    </Router>
  )
}
