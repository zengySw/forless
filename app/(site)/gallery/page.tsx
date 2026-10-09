import { get_list } from "@/lib/content";
import type { Album, Photo } from "@/lib/types";
import GalleryView from "@/components/gallery_view/gallery_view";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [photos, albums] = await Promise.all([get_list("photos"), get_list("albums")]);
  return <GalleryView photos={photos as Photo[]} albums={albums as Album[]} />;
}
