import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, loginStaff } from "@/api/apiConfig";
import { jwtDecode } from "jwt-decode";

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
        setLoading(true);
        setMessage("");

        try {
            // First try user login (Admin/Member)
            const result = await loginUser({ email, password });

            if (result.success && result.data?.token) {
                const token = result.data.token;
                localStorage.setItem("token", token);

                // Decode the token to get the role
                const decoded = jwtDecode<JwtPayload>(token);
                const userRole = decoded.role;
                setMessage("Login successful!");

                // Navigate based on role
                if (userRole === "Admin") {
                    navigate("/dashboard");
                } else if (userRole === "Staff") {
                    navigate("/staff-dashboard");
                } else if (userRole === "Member") {
                    navigate("/homepage");
                } else {
                    navigate("/");
                }

                // Reset fields
                setEmail("");
                setPassword("");
            } else {
                // If user login failed, try staff login
                const staffResult = await loginStaff({ email, password });

                if (staffResult.success && staffResult.data?.token) {
                    // Store staff token
                    localStorage.setItem("staffToken", staffResult.data.token);
                    localStorage.setItem("token", staffResult.data.token); // Also store as regular token
                    localStorage.setItem("staffRole", staffResult.data.role);
                    localStorage.setItem("staffEmail", staffResult.data.email);
                    localStorage.setItem("staffName", staffResult.data.fullName);

                    setMessage("Staff login successful!");
                    navigate("/staff-dashboard");

                    // Reset fields
                    setEmail("");
                    setPassword("");
                } else {
                    // Both logins failed
                    setMessage("Invalid email or password");
                }
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
                />

                <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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