import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminCreateAnnouncement } from "@/api/apiConfig";

export default function AdminCreateAnnouncement() {
    const [form, setForm] = useState({
        title: "",
        message: "",
        startTime: "",
        endTime: ""
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<string | null>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus(null);
        setLoading(true);

        const start = new Date(form.startTime);
        const end = new Date(form.endTime);

        // ✅ Validate time range
        if (start >= end) {
            setStatus("❌ Start time must be earlier than end time.");
            setLoading(false);
            return;
        }

        // ✅ Convert to ISO string
        const payload = {
            title: form.title,
            message: form.message,
            startTime: start.toISOString(),
            endTime: end.toISOString()
        };

        const response = await adminCreateAnnouncement(payload);

        if (response.success) {
            setStatus("✅ Announcement created successfully.");
            setForm({ title: "", message: "", startTime: "", endTime: "" });
        } else {
            setStatus(`❌ ${response.error}`);
        }

        setLoading(false);
    };


    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Create Announcement</h1>
                <p className="text-gray-600 mb-6">
                    Publish a platform-wide announcement with a defined time range.
                </p>

                <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <Input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="Announcement title"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Message</label>
                        <textarea
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            placeholder="Detailed message"
                            rows={4}
                            className="w-full border rounded p-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <Input
                            name="startTime"
                            type="datetime-local"
                            value={form.startTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <Input
                            name="endTime"
                            type="datetime-local"
                            value={form.endTime}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Publishing..." : "Create Announcement"}
                    </Button>

                    {status && (
                        <div
                            className={`text-sm mt-2 ${status.startsWith("✅")
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                        >
                            {status}
                        </div>
                    )}
                </form>
            </main>
        </div>
    );
}
