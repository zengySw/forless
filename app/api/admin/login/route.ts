import { NextResponse } from "next/server";
import { check_password, cookie_name, create_session, session_max_age } from "@/lib/auth";

const attempts = new Map<string, { n: number; t: number }>();
const window_ms = 10 * 60 * 1000;

export async function POST(req: Request) {
  if (!process.env.ADMIN_PASSWORD || !process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Не заданы ADMIN_PASSWORD и ADMIN_SECRET" }, { status: 500 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "local";
  const now = Date.now();
  const prev = attempts.get(ip);
  const fresh = prev && now - prev.t < window_ms ? prev : null;
  if (fresh && fresh.n >= 5) {
    return NextResponse.json({ error: "Слишком много попыток, подожди 10 минут" }, { status: 429 });
  }

  let password = "";
  try {
    password = String((await req.json()).password ?? "");
  } catch {}

  if (!(await check_password(password))) {
    attempts.set(ip, { n: (fresh?.n ?? 0) + 1, t: fresh?.t ?? now });
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Неверный пароль" }, { status: 401 });
  }

  attempts.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie_name, await create_session(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session_max_age,
  });
  return res;
}
