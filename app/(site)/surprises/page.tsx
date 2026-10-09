import { get_list } from "@/lib/content";
import type { Surprise } from "@/lib/types";
import SurprisesView from "@/components/surprises_view/surprises_view";

export const dynamic = "force-dynamic";

export default async function SurprisesPage() {
  const surprises = await get_list("surprises");
  return <SurprisesView surprises={surprises as Surprise[]} />;
}
