import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "@/api/apiConfig"; // Import your API call

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        setMessage("");
        try {
            const result = await loginUser({ email, password });
            if (result.success) {
                setMessage("Login successful!");
                // Optionally navigate to a protected route, e.g., dashboard
                 navigate("/Register");
                setEmail("");
                setPassword("");
            } else {
                setMessage(`Login failed: ${result.error}`);
            }
        } catch (error) {
            setMessage("An unexpected error occurred");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-[300px] space-y-4">
                <h1 className="text-xl font-semibold text-center">Login</h1>
                {message && (
                    <div className={message.includes("successful") ? "success-message" : "error-message"}>
                        {message}
                    </div>
                )}
                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="w-full" onClick={handleLogin} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>
                <Link to="/">
                    <Button className="w-full">Return Home</Button>
                </Link>
            </div>
        </div>
    );
}
