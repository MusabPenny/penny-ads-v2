import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { fetchImagesFromDB } from "@/lib/db/images"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const location = searchParams.get("location") || undefined

    const images = await fetchImagesFromDB(location)
    return NextResponse.json(images)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userRoles = request.headers.get("x-user-roles")?.split(",") || []

    if (!userRoles.includes("admin") && !userRoles.includes("writer")) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get("id")

    if (!imageId) {
      return NextResponse.json({ error: "Image ID is required" }, { status: 400 })
    }

    // Soft delete - mark as inactive
    await prisma.images.update({
      where: { id: Number.parseInt(imageId) },
      data: { isActive: false },
    })

    return NextResponse.json({ message: "Image deleted successfully" })
  } catch (error) {
    console.error("Delete image error:", error)
    return NextResponse.json({ error: "Failed to delete image" }, { status: 500 })
  }
}
