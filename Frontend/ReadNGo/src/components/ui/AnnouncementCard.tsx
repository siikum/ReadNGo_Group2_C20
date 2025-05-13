// src/components/ui/AnnouncementCard.tsx
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarIcon } from "lucide-react";

type AnnouncementProps = {
    title: string;
    message: string;
    startTime: string;
    endTime: string;
};

export const AnnouncementCard = ({ title, message, startTime, endTime }: AnnouncementProps) => {
    // Format dates for display
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Alert className="bg-blue-50 border-blue-200 mb-4">
            <AlertTitle className="text-blue-800 font-semibold flex items-center gap-2">
                {title}
            </AlertTitle>
            <AlertDescription className="mt-2">
                <p className="text-gray-700">{message}</p>
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <CalendarIcon className="h-3 w-3" />
                    <span>Valid from {formatDate(startTime)} to {formatDate(endTime)}</span>
                </div>
            </AlertDescription>
        </Alert>
    );
};