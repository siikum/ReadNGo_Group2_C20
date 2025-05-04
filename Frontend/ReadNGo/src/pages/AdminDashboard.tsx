import Sidebar from "@/components/sidebar"

export default function AdminDashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="p-8 w-full">
        <h1 className="text-2xl font-bold mb-4">Welcome Admin</h1>
        <p>This is your static dashboard. Data will be fetched from ASP.NET API soon.</p>
      </div>
    </div>
  )
}
