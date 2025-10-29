import { prisma } from "@/lib/prisma";
import type { ImageData } from "@/lib/types/interfaces";

export async function fetchImagesFromDB(
  location?: string
): Promise<ImageData[]> {
  let images;

  if (location && location !== "all") {
    images = await prisma.images.findMany({
      where: {
        isActive: true,
        isImageForAllLocations: true,
        OR: [
          {
            images_clients: {
              some: {
                client: { client_location: location },
                isClientImageActive: true,
              },
            },
          },
        ],
      },
      include: {
        images_clients: { include: { client: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } else {
    images = await prisma.images.findMany({
      where: { isActive: true, isImageForAllLocations: true },
      include: { images_clients: { include: { client: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  return images.map((image) => ({
    id: image.id.toString(),
    name: image.filename,
    url: `/images/${image.filename}`,
    location: image.isImageForAllLocations
      ? "All Locations"
      : image.images_clients[0]?.client.client_location || "Unassigned",
    uploadDate: image.createdAt,
    endDate: image.expirationDate || undefined,
    size: image.fileSize || "0 MB",
    type: image.fileType as "image" | "video",
    groupName: image.groupName ?? undefined,
    imageUrl: image.imageUrl ?? "",
  }));
}

export async function fetchPosImagesFromDB(): Promise<ImageData[]> {
  const images = await prisma.images.findMany({
    where: {
      isActive: true,
      isImageForAllPos: true,
    },
    include: { images_clients: { include: { client: true } } },
    orderBy: { createdAt: "desc" },
  });

  return images.map((image) => ({
    id: image.id.toString(),
    name: image.filename,
    url: `/images/${image.filename}`,
    location: image.isImageForAllLocations
      ? "All Locations"
      : image.images_clients[0]?.client.client_location || "Unassigned",
    uploadDate: image.createdAt,
    endDate: image.expirationDate || undefined,
    size: image.fileSize || "0 MB",
    type: image.fileType as "image" | "video",
    groupName: image.groupName ?? undefined,
    imageUrl: image.imageUrl ?? "",
  }));
}

export async function deleteImageFromDB(imageId: string): Promise<void> {
  await prisma.images.delete({
    where: { id: Number(imageId) },
  });
}

export async function updateImageEndDateInDB(
  imageId: string,
  endDate?: Date
): Promise<void> {
  await prisma.images.update({
    where: { id: Number(imageId) },
    data: { expirationDate: endDate || null },
  });
}

export async function getImageById(imageId: string) {
  return await prisma.images.findUnique({
    where: { id: Number(imageId) },
  });
}
