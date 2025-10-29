import { prisma } from "@/lib/prisma";
import { Client } from "@/lib/types/interfaces";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse<Client[]>> {
  const clients: Client[] = await prisma.clients.findMany();
  return NextResponse.json(clients);
}
