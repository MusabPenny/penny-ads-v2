import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const files = formData.getAll("files") as File[]
    const groupName = formData.get("groupName") as string
    const selectedLocation = formData.get("selectedLocation") as string
    const posLocation = formData.get("posLocation") === "true"
    const endDate = formData.get("endDate") as string

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 })
    }

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "images")
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

     const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || `${request.nextUrl.protocol}//${request.headers.get("host")}`

    const uploadedImages = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        continue
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Generate filename
      const fileExtension = file.name.split(".").pop()
      const fileName =
        files.length > 1 && groupName
          ? `${groupName}-${i + 1}.${fileExtension}`
          : `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`

      // Save file to public/images
      const filePath = join(uploadDir, fileName)
      await writeFile(filePath, buffer)


      const fullUrl = `${baseUrl}/images/${fileName}`
      // Save to database
      const imageRecord = await prisma.images.create({
        data: {
          filename: fileName,
          originalName: file.name,
          groupName: files.length > 1 && groupName ? groupName : null,
          fileType: file.type.startsWith("image/") ? "image" : "video",
          fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          isActive: true,
          expirationDate: endDate ? new Date(endDate) : null,
          isImageForAllLocations: !posLocation && !selectedLocation,
          isImageForAllPos: posLocation || false,
          imageUrl: fullUrl,
        },
      })

      // Link to specific client if location is selected
      if (selectedLocation) {
        const client = await prisma.clients.findFirst({
          where: { client_location: selectedLocation },
        })

        if (client) {
          await prisma.images_clients.create({
            data: {
              image_id: imageRecord.id,
              client_id: client.id,
              isClientImageActive: true,
            },
          })
        }
      }

      uploadedImages.push({
        id: imageRecord.id.toString(),
        name: fileName,
        url: `/images/${fileName}`,
        location: selectedLocation || "All Locations",
        uploadDate: imageRecord.createdAt,
        endDate: imageRecord.expirationDate,
        size: imageRecord.fileSize,
        type: imageRecord.fileType,
      })
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      images: uploadedImages,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 })
  }
}
