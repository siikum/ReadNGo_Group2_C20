import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, loginStaff } from "@/api/apiConfig";
import { jwtDecode } from "jwt-decode";
import { getUserRole } from "@/lib/auth";

interface JwtPayload {
    email: string;
    role: string;
    exp: number;
}

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!email || !password) {
            setMessage("Please enter both email and password");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            // First try user login (Admin/Member)
            const result = await loginUser({ email, password });

            if (result.success && result.data?.token) {
                // Login successful
                setMessage("Login successful!");

                // Get user role
                const role = getUserRole();

                // Navigate based on role
                if (role === "Admin") {
                    navigate("/dashboard");
                } else if (role === "Member") {
                    navigate("/homepage");
                } else {
                    // If role is not Admin or Member, try staff login
                    const staffResult = await loginStaff({ email, password });

                    if (staffResult.success && staffResult.data?.token) {
                        setMessage("Staff login successful!");
                        navigate("/staff-dashboard");
                    } else {
                        setMessage("Login failed: Unknown user role");
                    }
                }

                // Reset fields
                setEmail("");
                setPassword("");
            } else {
                // If user login failed, try staff login
                const staffResult = await loginStaff({ email, password });

                if (staffResult.success && staffResult.data?.token) {
                    setMessage("Staff login successful!");
                    navigate("/staff-dashboard");

                    // Reset fields
                    setEmail("");
                    setPassword("");
                } else {
                    // Both logins failed
                    setMessage(result.error || staffResult.error || "Invalid email or password");
                }
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage("An unexpected error occurred");
        } finally {
            setLoading(false);
        }
    };

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-[300px] space-y-4">
                <h1 className="text-xl font-semibold text-center">Login</h1>

                {message && (
                    <div className={
                        message.includes("successful")
                            ? "text-green-600 text-center"
                            : "text-red-600 text-center"
                    }>
                        {message}
                    </div>
                )}

                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />

                <Button
                    className="w-full"
                    onClick={handleLogin}
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </Button>

                <Link to="/">
                    <Button className="w-full">Return Home</Button>
                </Link>
            </div>
        </div>
    );
}