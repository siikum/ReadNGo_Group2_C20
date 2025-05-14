import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/api/apiConfig";

export default function CreateOrderPage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleCreateOrder = async () => {
        setLoading(true);
        setMessage("");

        
        const orderData = {
            userId: 1, 
            bookIds: [1] 
        };

        const response = await createOrder(orderData);
        if (response.success) {
            setMessage("Order created successfully!");
        } else {
            setMessage(`Error: ${response.error}`);
        }

        setLoading(false);
    };

    return (
        <div className="flex">
            <main className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Order Page</h1>
                <Button onClick={handleCreateOrder} disabled={loading}>
                    {loading ? "Creating..." : "Create Order"}
                </Button>
                {message && <p className="mt-4 text-sm">{message}</p>}
            </main>
        </div>
    );
}
