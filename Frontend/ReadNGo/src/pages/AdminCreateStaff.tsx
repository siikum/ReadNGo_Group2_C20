import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createStaff } from "@/api/apiConfig";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AdminCreateStaff() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Client-side validation
        if (!form.email.endsWith("@gmail.com")) {
            toast.error("Invalid Email", {
                description: "Email must be a valid @gmail.com address.",
            });
            return;
        }

        if (form.password.length < 8) {
            toast.error("Invalid Password", {
                description: "Password must be at least 8 characters long.",
            });
            return;
        }

        setLoading(true);

        // Show loading toast
        const loadingId = toast.loading("Creating Staff Account", {
            description: "Please wait while we create the staff account...",
        });

        try {
            const response = await createStaff(form);

            // Dismiss loading toast
            toast.dismiss(loadingId);

            if (response.success) {
                toast.success("Success!", {
                    description: `Staff account for ${form.fullName} has been created successfully.`,
                });

                // Reset form
                setForm({ fullName: "", email: "", password: "" });
            } else {
                // Handle error - extract error message properly
                let errorMessage = "Failed to create staff account.";

                if (typeof response.error === 'string') {
                    errorMessage = response.error;
                } else if (response.error?.message) {
                    errorMessage = response.error.message;
                } else if (response.error && typeof response.error === 'object') {
                    // If error is an object, try to extract meaningful message
                    errorMessage = JSON.stringify(response.error);
                }

                toast.error("Failed to Create Staff", {
                    description: errorMessage,
                });
            }
        } catch (error) {
            // Dismiss loading toast
            toast.dismiss(loadingId);

            toast.error("Error", {
                description: "An unexpected error occurred. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-6">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Create Staff Account</CardTitle>
                        <CardDescription>
                            Fill in the details below to create a new staff user.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="Must be a @gmail.com address"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Minimum 8 characters with at least 1 number and 1 special character"
                                    required
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Creating..." : "Create Staff"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}