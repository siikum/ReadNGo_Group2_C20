import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { adminCreateAnnouncement } from "@/api/apiConfig";
import { toast } from "sonner";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function AdminCreateAnnouncement() {
    const [form, setForm] = useState({
        title: "",
        message: "",
        startTime: "",
        endTime: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const start = new Date(form.startTime);
        const end = new Date(form.endTime);

        // Validate time range
        if (start >= end) {
            toast.error("Invalid Time Range", {
                description: "Start time must be earlier than end time.",
            });
            return;
        }

        // Validate the announcement is not in the past
        if (start < new Date()) {
            toast.error("Invalid Start Time", {
                description: "Start time cannot be in the past.",
            });
            return;
        }

        setLoading(true);

        // Show loading toast
        const loadingId = toast.loading("Publishing Announcement", {
            description: "Please wait while we publish your announcement...",
        });

        try {
            // Convert to ISO string
            const payload = {
                title: form.title,
                message: form.message,
                startTime: start.toISOString(),
                endTime: end.toISOString()
            };

            const response = await adminCreateAnnouncement(payload);

            // Dismiss loading toast
            toast.dismiss(loadingId);

            if (response.success) {
                toast.success("Success!", {
                    description: `Announcement "${form.title}" has been created successfully.`,
                });

                // Reset form
                setForm({ title: "", message: "", startTime: "", endTime: "" });
            } else {
                // Handle error - extract error message properly
                let errorMessage = "Failed to create announcement.";

                if (typeof response.error === 'string') {
                    errorMessage = response.error;
                } else if (response.error?.message) {
                    errorMessage = response.error.message;
                } else if (response.error && typeof response.error === 'object') {
                    errorMessage = JSON.stringify(response.error);
                }

                toast.error("Failed to Create Announcement", {
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
                        <CardTitle>Create Announcement</CardTitle>
                        <CardDescription>
                            Publish a platform-wide announcement with a defined time range.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={form.title}
                                    onChange={handleChange}
                                    placeholder="Enter announcement title"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Enter your announcement message here..."
                                    rows={5}
                                    className="resize-none"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="startTime">Start Time</Label>
                                    <Input
                                        id="startTime"
                                        name="startTime"
                                        type="datetime-local"
                                        value={form.startTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="endTime">End Time</Label>
                                    <Input
                                        id="endTime"
                                        name="endTime"
                                        type="datetime-local"
                                        value={form.endTime}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={loading}
                            >
                                {loading ? "Publishing..." : "Create Announcement"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}