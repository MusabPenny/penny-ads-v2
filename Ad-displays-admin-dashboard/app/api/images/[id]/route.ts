import {
  deleteImageFromDB,
  getImageById,
  updateImageEndDateInDB,
} from "@/lib/db/images";
import fs from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";

export async function DELETE(
  req: Request,
  { params }: { params: { id: Promise<string> } } // second argument contains params
) {
  const id = await params?.id; // optional chaining just in case
  if (!id) {
    return NextResponse.json({ error: "Missing image id" }, { status: 400 });
  }

  const image = await getImageById(id);
  if (!image) {
    return NextResponse.json({ error: "Image not found" }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), "public/images", image.filename);

  try {
    await fs.unlink(filePath);
    console.log(`Deleted file: ${filePath}`);
  } catch (err: any) {
    console.warn(`File not found or already deleted: ${filePath}`);
  }

  await deleteImageFromDB(id);
  return NextResponse.json({ message: "Image deleted" }, { status: 200 });
}

export async function PUT(
  request: Request,
  { params }: { params: { id: Promise<string> } }
) {
  const id = await params.id;
  const { endDate } = await request.json();
  await updateImageEndDateInDB(id, endDate);
  return NextResponse.json({ message: "Image updated" }, { status: 200 });
}
