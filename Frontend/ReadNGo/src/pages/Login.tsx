import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, loginStaff } from "@/api/apiConfig";
import { getUserRole } from "@/lib/auth";
export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    // Password and email validation
    const validate = () => {
        let isValid = true;
        setEmailError("");
        setPasswordError("");

        // Validate email
        if (!email.includes("@")) {
            setEmailError("Please enter a valid email address with '@'.");
            isValid = false;
        }

        // Validate password
        const passwordRegex = /^(?=.*[A-Z])(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError("Password must be at least 8 characters long, contain one uppercase letter, and one symbol.");
            isValid = false;
        }

        return isValid;
    };

    const handleLogin = async () => {
        if (!validate()) {
            return; // Stop the function if validation fails
        }

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
                    // Clear any regular user tokens to prevent conflicts
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("userRole");
                    localStorage.removeItem("userEmail");
                    localStorage.removeItem("userName");

                    // Then set staff token
                    localStorage.setItem("staffToken", staffResult.data.token);
                    localStorage.setItem("staffRole", staffResult.data.role);
                    localStorage.setItem("staffEmail", staffResult.data.email);
                    localStorage.setItem("staffName", staffResult.data.fullName);

                    setMessage("Staff login successful!");
                    navigate("/staff-dashboard");

                    // Reset fields
                    setEmail("");
                    setPassword("");
                } else {
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
                    <div className={message.includes("successful") ? "text-green-600 text-center" : "text-red-600 text-center"}>
                        {message}
                    </div>
                )}

                <Input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {emailError && <div className="text-red-600 text-xs">{emailError}</div>}

                <Input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                {passwordError && <div className="text-red-600 text-xs">{passwordError}</div>}

                <Button className="w-full" onClick={handleLogin} disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </Button>

                <Link to="/register">
                    <Button className="w-full">Register</Button>
                </Link>
            </div>
        </div>
    );
}