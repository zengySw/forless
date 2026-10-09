import { get_collection, type Collection, type Item } from "./schema";
import { db_get } from "./db";

export async function get_list(key: string): Promise<Item[]> {
  const def = get_collection(key)!;
  try {
    const stored = await db_get(key);
    if (Array.isArray(stored)) return stored as Item[];
  } catch (e) {
    console.error("db read failed", e);
  }
  return def.defaults as Item[];
}

export async function get_single(key: string): Promise<Item> {
  const def = get_collection(key)!;
  try {
    const stored = await db_get(key);
    if (stored && typeof stored === "object" && !Array.isArray(stored)) {
      return { ...(def.defaults as Item), ...(stored as Item) };
    }
  } catch (e) {
    console.error("db read failed", e);
  }
  return def.defaults as Item;
}

function clean_item(def: Collection, raw: unknown, used_ids: Set<string>): Item {
  const src = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: Item = {};
  if (def.kind === "list") {
    let id = typeof src.id === "string" && /^[\w-]{1,40}$/.test(src.id) ? src.id : "";
    if (!id || used_ids.has(id)) id = crypto.randomUUID().slice(0, 8);
    used_ids.add(id);
    out.id = id;
  }
  for (const f of def.fields) {
    const v = src[f.key];
    switch (f.type) {
      case "number": {
        const n = Number(v);
        out[f.key] = Number.isFinite(n)
          ? Math.min(f.max ?? 1e6, Math.max(f.min ?? 0, n))
          : Number(f.default ?? f.min ?? 0);
        break;
      }
      case "toggle":
        out[f.key] = v === true;
        break;
      case "date":
        out[f.key] = typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : "";
        break;
      case "image": {
        const s = typeof v === "string" ? v.trim().slice(0, 500) : "";
        out[f.key] = /^(https?:\/\/|\/(?!\/))/.test(s) ? s : "";
        break;
      }
      default:
        out[f.key] = (typeof v === "string" ? v : "").slice(0, f.max ?? (f.type === "textarea" ? 4000 : 200));
    }
  }
  return out;
}

export function sanitize(def: Collection, raw: unknown): Item[] | Item {
  const used_ids = new Set<string>();
  if (def.kind === "single") return clean_item(def, raw, used_ids);
  return (Array.isArray(raw) ? raw : []).slice(0, 200).map((it) => clean_item(def, it, used_ids));
}
