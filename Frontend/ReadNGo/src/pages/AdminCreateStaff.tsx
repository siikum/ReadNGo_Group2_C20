import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createStaff } from "@/api/apiConfig";

export default function AdminCreateStaff() {
    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        setLoading(true);

        const response = await createStaff(form);

        if (response.success) {
            setStatus("✅ Staff created successfully.");
            setForm({ fullName: "", email: "", password: "" });
        } else {
            setStatus(`❌ ${response.error}`);
        }

        setLoading(false);
    };

    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Create Staff Account</h1>
                <p className="text-gray-600 mb-6">Fill in the details below to create a staff user.</p>

                <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Full Name</label>
                        <Input
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            placeholder="Enter full name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter email"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <Input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Minimum 6 characters"
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating..." : "Create Staff"}
                    </Button>

                    {status && (
                        <div className={`text-sm mt-2 ${status.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
                            {status}
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
}
