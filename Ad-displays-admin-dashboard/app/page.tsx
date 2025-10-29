import { DashboardClient } from "@/components/dashboard-client"
import { AuthProvider } from "@/lib/contexts/auth-context"
import { fetchImagesFromDB } from "@/lib/db/images"
import { getAllClients } from "@/lib/fetchingData/clients"

export default async function AdminDashboard() {
  const images = await fetchImagesFromDB()
  const locations = await getAllClients()

  return (
    <div className="min-h-screen bg-background flex">
      <AuthProvider>
        <DashboardClient initialImages={images} locations={locations} />
      </AuthProvider>
    </div>
  )
}
