import GamesPage from "@/components/games_page/games_page";
import { get_list, get_single } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function GamesRoute() {
  const [questions, settings] = await Promise.all([get_list("game_questions"), get_single("quiz_settings")]);
  return <GamesPage questions={questions} settings={settings} />;
}
