import { NextResponse } from "next/server";
import { cookie_name } from "@/lib/auth";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/admin/login", req.url), 303);
  res.cookies.set(cookie_name, "", { path: "/", maxAge: 0 });
  return res;
}
