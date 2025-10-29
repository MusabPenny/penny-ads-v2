import { DevicesClient } from "@/components/devices-client"
import { getAllClients } from "@/lib/fetchingData/clients"
import { Client } from "@/lib/types/interfaces"

export default async function DevicesPage() {
const clients: Client[] = await getAllClients()

  return (
    <DevicesClient clients={clients} />
  )
}
