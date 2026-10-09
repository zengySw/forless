import { get_list } from "@/lib/content";
import type { Achievement, Album, Letter, Photo, Secret } from "@/lib/types";
import ProfileView from "@/components/profile_view/profile_view";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const [letters, secrets, achievements, photos, albums] = await Promise.all([
    get_list("letters"), get_list("secrets"), get_list("achievements"), get_list("photos"), get_list("albums"),
  ]);
  return <ProfileView
    user={{ id: "site_guest", name: "Любимая" }}
    letters={letters as Letter[]}
    secrets={secrets as Secret[]}
    achievements={achievements as Achievement[]}
    photos={photos as Photo[]}
    albums={albums as Album[]}
  />;
}
