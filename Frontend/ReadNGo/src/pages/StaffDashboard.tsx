import StaffSidebar from "../components/ui/StaffSidebar"

export default function StaffDashboard() {
    return (
        <div className="flex">
            <StaffSidebar />
            <div className="p-8 w-full">
                <h1 className="text-2xl font-bold mb-4">Claim Code</h1>
                <p>This is your static dashboard. Data will be fetched from ASP.NET API soon.</p>
            </div>
        </div>
    )
}
