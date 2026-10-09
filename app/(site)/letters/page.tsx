import { get_list } from "@/lib/content";
import type { Letter } from "@/lib/types";
import LettersView from "@/components/letters_view/letters_view";

export const dynamic = "force-dynamic";

export default async function LettersPage() {
  const letters = await get_list("letters");
  return <LettersView letters={letters as Letter[]} />;
}
