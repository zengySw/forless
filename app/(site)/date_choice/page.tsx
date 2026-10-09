import { get_single } from "@/lib/content";
import DateChoiceInvite from "@/components/date_choice_invite/date_choice_invite";

export const dynamic = "force-dynamic";

export default async function DateChoicePage() {
  const config = await get_single("date_choice");
  const activityOptions = typeof config.activity_options === "string"
    ? config.activity_options.split("\n").map((option) => option.trim()).filter(Boolean).slice(0, 24)
    : [];

  return <DateChoiceInvite config={{
    title: typeof config.title === "string" ? config.title : "Пойдёшь со мной на свидание?",
    hint: typeof config.hint === "string" ? config.hint : "Я очень постарался с этим приглашением 🥺",
    yesLabel: typeof config.yes_label === "string" ? config.yes_label : "Да 💖",
    noLabel: typeof config.no_label === "string" ? config.no_label : "Нет",
    activityOptions,
    telegramUsername: typeof config.telegram_username === "string" ? config.telegram_username.replace(/^@/, "").trim() : "",
  }} />;
}
