import { get_list } from "@/lib/content";
import type { TimelineEvent } from "@/lib/types";
import MemoriesView from "@/components/memories_view/memories_view";

export const dynamic = "force-dynamic";

export default async function MemoriesPage() {
  const timeline = await get_list("timeline");
  return <MemoriesView timeline={timeline as unknown as TimelineEvent[]} />;
}
