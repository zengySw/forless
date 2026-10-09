import { get_list } from "@/lib/content";
import type { Achievement, Letter, Secret } from "@/lib/types";
import ExploreView from "@/components/explore_view/explore_view";

export const dynamic = "force-dynamic";

export default async function ExplorePage() {
  const [letters, secrets, achievements] = await Promise.all([
    get_list("letters"), get_list("secrets"), get_list("achievements"),
  ]);
  return <ExploreView letters={letters as Letter[]} secrets={secrets as Secret[]} achievements={achievements as Achievement[]} />;
}
