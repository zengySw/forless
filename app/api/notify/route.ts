import { NextResponse } from "next/server";
import { coupons } from "@/lib/coupons";

export const runtime = "nodejs";

const recent = new Map<string, number>();

export async function POST(req: Request) {
  let body: { type?: string; id?: number } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const { type, id } = body;
  const coupon = coupons[Number(id)];
  if (!coupon || (type !== "open" && type !== "use")) {
    return NextResponse.json({ ok: false }, { status: 400 });
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
