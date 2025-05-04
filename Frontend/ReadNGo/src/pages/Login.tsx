import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Link } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    console.log("Logging in with:", email, password)
    // Later: Call ASP.NET API here
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-[300px] space-y-4">
        <h1 className="text-xl font-semibold text-center">Login</h1>
        <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button className="w-full" onClick={handleLogin}>Login</Button>

        {/* Temporaty code for nav*/}
        <Link to="/">
            <Button className="w-full">Return Home</Button>
        </Link>

      </div>
    </div>
  )
}
