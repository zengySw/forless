import { NextResponse } from "next/server";
import { get_list, get_single } from "@/lib/content";
import type { Coupon, Settings } from "@/lib/types";

export const runtime = "nodejs";

const recent = new Map<string, number>();

export async function POST(req: Request) {
  let body: { type?: string; id?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { type, id } = body;
  if ((type !== "open" && type !== "use") || typeof id !== "string") {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const [list, settings_raw] = await Promise.all([get_list("coupons"), get_single("settings")]);
  const coupon = (list as unknown as Coupon[]).find((c) => c.id === id);
  const settings = settings_raw as unknown as Settings;
  if (!coupon) return NextResponse.json({ ok: false }, { status: 400 });

  if ((type === "open" && !settings.notify_on_open) || (type === "use" && !settings.notify_on_use)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  // простая защита от частых повторов (в пределах одного инстанса)
  const key = `${type}:${id}`;
  const now = Date.now();
  if (now - (recent.get(key) ?? 0) < 2000) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  recent.set(key, now);

  const bot_token = process.env.BOT_TOKEN;
  const chat_id = process.env.CHAT_ID;
  if (!bot_token || !chat_id) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const text =
    type === "open"
      ? `🎟️ Открыт купон: ${coupon.emoji} ${coupon.title}`
      : `💝 Использован купон: ${coupon.emoji} ${coupon.title}\n${coupon.text}`;

  try {
    const r = await fetch(`https://api.telegram.org/bot${bot_token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text }),
    });
    return NextResponse.json({ ok: r.ok }, { status: r.ok ? 200 : 502 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 502 });
  }
}
