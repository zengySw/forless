import { NextResponse } from "next/server";
import { get_list, sanitize } from "@/lib/content";
import { get_collection, type Item } from "@/lib/schema";
import { db_set } from "@/lib/db";

export const dynamic = "force-dynamic";

function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос." }, { status: 400 });
  }

  if (body.answer !== "accepted" && body.answer !== "declined") {
    return NextResponse.json({ ok: false, error: "Неизвестный ответ." }, { status: 400 });
  }

  const selectedActivities = Array.isArray(body.activities)
    ? body.activities.filter((value): value is string => typeof value === "string").map((value) => value.trim().slice(0, 80)).filter(Boolean).slice(0, 10)
    : [];
  const date = cleanText(body.date, 10);
  const time = cleanText(body.time, 5);
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ ok: false, error: "Проверь дату." }, { status: 400 });
  }
  if (time && !/^\d{2}:\d{2}$/.test(time)) {
    return NextResponse.json({ ok: false, error: "Проверь время." }, { status: 400 });
  }

  const collection = get_collection("date_choice_responses");
  if (!collection) return NextResponse.json({ ok: false, error: "Раздел ответов не настроен." }, { status: 500 });

  const cleaned = sanitize(collection, [{
    answer: body.answer,
    activities: selectedActivities.join(", "),
    custom_activity: cleanText(body.custom_activity, 120),
    date,
    time,
    place: cleanText(body.place, 160),
    submitted_at: new Date().toISOString(),
  }]) as Item[];
  const entry = cleaned[0];

  try {
    const previous = await get_list("date_choice_responses");
    await db_set("date_choice_responses", [...previous.slice(-199), entry]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Не удалось сохранить ответ. Попробуй ещё раз." }, { status: 503 });
  }
}
