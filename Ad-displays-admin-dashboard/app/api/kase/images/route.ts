import { fetchPosImagesFromDB } from "@/lib/db/images";

export async function GET(request: Request) {
  try {
    const images = await fetchPosImagesFromDB();
    return new Response(JSON.stringify(images), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch images" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}