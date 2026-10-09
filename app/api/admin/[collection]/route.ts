import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { cookie_name, verify_session } from "@/lib/auth";
import { get_collection } from "@/lib/schema";
import { get_list, get_single, sanitize } from "@/lib/content";
import { db_set } from "@/lib/db";

type Ctx = { params: Promise<{ collection: string }> };

async function guard() {
  const token = (await cookies()).get(cookie_name)?.value;
  return (await verify_session(token)) ? null : NextResponse.json({ ok: false }, { status: 401 });
}

export async function GET(_req: Request, { params }: Ctx) {
  const denied = await guard();
  if (denied) return denied;
  const def = get_collection((await params).collection);
  if (!def) return NextResponse.json({ ok: false }, { status: 404 });
  const data = def.kind === "list" ? await get_list(def.key) : await get_single(def.key);
  return NextResponse.json({ ok: true, data });
}

export async function PUT(req: Request, { params }: Ctx) {
  const denied = await guard();
  if (denied) return denied;
  const def = get_collection((await params).collection);
  if (!def) return NextResponse.json({ ok: false }, { status: 404 });

  let body: { data?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Некорректный запрос" }, { status: 400 });
  }

  const data = sanitize(def, body.data);
  try {
    await db_set(def.key, data);
  } catch (e) {
    console.error("db write failed", e);
    return NextResponse.json(
      { ok: false, error: "Не удалось сохранить данные. Проверь подключение к базе данных." },
      { status: 500 },
    );
  }
  revalidatePath("/");
  return NextResponse.json({ ok: true, data });
}
