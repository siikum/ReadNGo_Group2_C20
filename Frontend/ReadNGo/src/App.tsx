import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Start from "./pages/start"
import Login from "./pages/login"
import Register from "./pages/register"
import Books from "./pages/Books"
import AdminDashboard from "./pages/AdminDashboard"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />  
        <Route path="/books" element={<Books />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}
