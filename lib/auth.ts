// Работает и в middleware (edge), и в node: только Web Crypto.
export const cookie_name = "admin_session";
const session_ms = 7 * 24 * 3600 * 1000;
const enc = new TextEncoder();

async function hmac_hex(secret: string, data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safe_equal(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function create_session() {
  const exp = String(Date.now() + session_ms);
  return `${exp}.${await hmac_hex(process.env.ADMIN_SECRET!, exp)}`;
}

export async function verify_session(token?: string) {
  const secret = process.env.ADMIN_SECRET;
  if (!token || !secret) return false;
  const [exp, sig] = token.split(".");
  if (!exp || !sig || Number(exp) < Date.now()) return false;
  return safe_equal(sig, await hmac_hex(secret, exp));
}

export async function check_password(input: string) {
  const secret = process.env.ADMIN_SECRET;
  const password = process.env.ADMIN_PASSWORD;
  if (!secret || !password) return false;
  return safe_equal(await hmac_hex(secret, input), await hmac_hex(secret, password));
}

export const session_max_age = session_ms / 1000;
