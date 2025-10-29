import Kase from "@/components/kase/Kasa";
import { fetchPosImagesFromDB } from "@/lib/db/images";

export default async function KasePage() {
  const initialImages = await fetchPosImagesFromDB();
  return <Kase initialImages={initialImages} />;
}
