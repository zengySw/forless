"use client";

import { useEffect, useState } from "react";
import { get_collection, type Field, type Item } from "@/lib/schema";

type Value = string | number | boolean;

function make_item(fields: Field[]): Item {
  const item: Item = { id: Math.random().toString(36).slice(2, 10) };
  for (const f of fields) {
    item[f.key] = f.default ?? (f.type === "number" ? (f.min ?? 0) : f.type === "toggle" ? false : "");
  }
  return item;
}

function Input({ f, value, on_change }: { f: Field; value: Value | undefined; on_change: (v: Value) => void }) {
  switch (f.type) {
    case "textarea":
      return (
        <textarea
          rows={4}
          maxLength={f.max}
          placeholder={f.placeholder}
          value={String(value ?? "")}
          onChange={(e) => on_change(e.target.value)}
        />
      );
    case "number":
      return (
        <input
          type="number"
          min={f.min}
          max={f.max}
          value={Number(value ?? 0)}
          onChange={(e) => on_change(Number(e.target.value))}
        />
      );
    case "date":
      return <input type="date" value={String(value ?? "")} onChange={(e) => on_change(e.target.value)} />;
    case "toggle":
      return (
        <label className="adm_toggle">
          <input type="checkbox" checked={!!value} onChange={(e) => on_change(e.target.checked)} />
          <span>{f.label}</span>
        </label>
      );
    case "image":
      return (
        <>
          <input
            type="url"
            placeholder="https://…"
            value={String(value ?? "")}
            onChange={(e) => on_change(e.target.value)}
          />
          {value ? <img className="adm_preview" src={String(value)} alt="" /> : null}
        </>
      );
    default:
      return (
        <input
          type="text"
          maxLength={f.max}
          placeholder={f.placeholder}
          value={String(value ?? "")}
          onChange={(e) => on_change(e.target.value)}
        />
      );
  }
}

export default function CollectionEditor({ collection_key, initial }: { collection_key: string; initial: Item[] | Item }) {
  const def = get_collection(collection_key)!;
  const is_list = def.kind === "list";
  const [items, set_items] = useState<Item[]>(is_list ? (initial as Item[]) : [initial as Item]);
  const [dirty, set_dirty] = useState(false);
  const [saving, set_saving] = useState(false);
  const [status, set_status] = useState<{ ok: boolean; text: string } | null>(null);

  useEffect(() => {
    if (!dirty) return;
    const on_leave = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", on_leave);
    return () => window.removeEventListener("beforeunload", on_leave);
  }, [dirty]);

  const change = (next: Item[]) => {
    set_items(next);
    set_dirty(true);
    set_status(null);
  };
  const update = (idx: number, key: string, value: Value) =>
    change(items.map((it, i) => (i === idx ? { ...it, [key]: value } : it)));
  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[idx], next[j]] = [next[j], next[idx]];
    change(next);
  };
  const remove = (idx: number) => {
    if (window.confirm("Удалить запись?")) change(items.filter((_, i) => i !== idx));
  };

  async function save() {
    set_saving(true);
    set_status(null);
    try {
      const r = await fetch(`/api/admin/${def.key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: is_list ? items : items[0] }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.ok) {
        set_items(is_list ? d.data : [d.data]);
        set_dirty(false);
        set_status({ ok: true, text: "Сохранено ✓" });
      } else {
        set_status({ ok: false, text: d.error || "Не удалось сохранить" });
      }
    } catch {
      set_status({ ok: false, text: "Нет связи с сервером" });
    }
    set_saving(false);
  }

  return (
    <>
      {items.map((it, idx) => (
        <section className="adm_card adm_item" key={String(it.id ?? idx)}>
          {is_list && (
            <div className="adm_item_head">
              <strong>
                {idx + 1}. {String(def.title_key ? it[def.title_key] : "") || "Без названия"}
              </strong>
              <span className="adm_actions">
                <button type="button" className="adm_btn small" onClick={() => move(idx, -1)} disabled={idx === 0}>
                  ↑
                </button>
                <button
                  type="button"
                  className="adm_btn small"
                  onClick={() => move(idx, 1)}
                  disabled={idx === items.length - 1}
                >
                  ↓
                </button>
                <button type="button" className="adm_btn small danger" onClick={() => remove(idx)}>
                  ✕
                </button>
              </span>
            </div>
          )}
          {def.fields.map((f) => (
            <div className="adm_field" key={f.key}>
              {f.type !== "toggle" && <label>{f.label}</label>}
              <Input f={f} value={it[f.key]} on_change={(v) => update(idx, f.key, v)} />
              {f.hint && <div className="adm_muted small">{f.hint}</div>}
            </div>
          ))}
        </section>
      ))}

      {is_list && items.length === 0 && <p className="adm_muted">Пока пусто.</p>}

      <div className="adm_bar">
        {is_list && (
          <button type="button" className="adm_btn" onClick={() => change([...items, make_item(def.fields)])}>
            + Добавить
          </button>
        )}
        <span className={status ? (status.ok ? "adm_ok" : "adm_error_text") : "adm_muted"}>
          {status ? status.text : dirty ? "Есть несохранённые изменения" : ""}
        </span>
        <button type="button" className="adm_btn primary" onClick={save} disabled={saving || !dirty}>
          {saving ? "Сохраняем…" : "Сохранить"}
        </button>
      </div>
    </>
  );
}
