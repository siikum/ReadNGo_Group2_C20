import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "@/api/apiConfig"; // ✅ use the shared API call

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    });

    const validateEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 6 && /[A-Z]/.test(password) && /[a-z]/.test(password);
    };

    const handleRegister = async () => {
        const newErrors = { email: "", password: "", confirmPassword: "" };

        if (!validateEmail(email)) {
            newErrors.email = "Invalid email format";
        }

        if (!validatePassword(password)) {
            newErrors.password = "Password must be at least 6 characters with upper and lower case letters";
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);

        const hasErrors = Object.values(newErrors).some((err) => err !== "");
        if (hasErrors) return;

        setLoading(true);
        setMessage("");

        try {
            const result = await registerUser({
                fullName: name,
                email,
                password,
            });

            if (result.success) {
                setMessage("Registration successful!");
                setName("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
                setErrors({ email: "", password: "", confirmPassword: "" });
            } else {
                setMessage(`Registration failed: ${result.error}`);
            }
        } catch (error: any) {
            console.error("Registration failed:", error);
            setMessage("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-[300px] space-y-4">
                <h1 className="text-xl font-semibold text-center">Register</h1>

                {message && (
                    <div
                        className={`text-sm text-center ${message.includes("successful") ? "text-green-500" : "text-red-500"
                            }`}
                    >
                        {message}
                    </div>
                )}

                <Input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <div className="space-y-1">
                    <Input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Input
                        placeholder="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">{errors.password}</p>
                    )}
                </div>

                <div className="space-y-1">
                    <Input
                        placeholder="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
                    )}
                </div>

                <Button className="w-full" onClick={handleRegister} disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </Button>

                <Link to="/">
                    <Button className="w-full">Return Home</Button>
                </Link>
            </div>
        </div>
    );
}
