import { prisma } from "../prisma";
import { Client } from "../types/interfaces";


export async function getAllClients () {
    const clients: Client[] = await prisma.clients.findMany();
      return clients;
}
