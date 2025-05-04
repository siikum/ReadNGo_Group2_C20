import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="space-y-4 text-center">
        <h1 className="text-2xl font-bold mb-6">Welcome</h1>
        <div className="flex flex-col gap-3">
          <Link to="/login">
            <Button className="w-40">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="w-40">Register</Button>
          </Link>
          <Link to="/dashboard">
            <Button className="w-40">Admin</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
