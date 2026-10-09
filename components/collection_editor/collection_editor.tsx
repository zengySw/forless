"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { get_collection, type Field, type Item } from "@/lib/schema";
import styles from "./cn.module.css";

type Value = string | number | boolean;
function make_item(fields: Field[]): Item {
  const id = globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2);
  const item: Item = { id };
  for (const field of fields) item[field.key] = field.key === "id" ? id : field.default ?? (field.type === "number" ? (field.min ?? 0) : field.type === "toggle" ? false : "");
  return item;
}
function FieldInput({ field, value, onChange }: { field: Field; value: Value | undefined; onChange: (value: Value) => void }) {
  if (field.type === "toggle") return <label className={styles.toggle}><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} /><span>{field.label}</span></label>;
  const common = { placeholder: field.placeholder, maxLength: field.max, value: String(value ?? ""), onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(event.target.value) };
  if (field.type === "textarea") return <textarea {...common} rows={5} />;
  if (field.type === "number") return <input type="number" min={field.min} max={field.max} value={Number(value ?? 0)} onChange={(event) => onChange(event.target.value === "" ? "" : Number(event.target.value))} />;
  if (field.type === "date") return <input type="date" {...common} />;
  if (field.type === "image") return <div className={styles.imageField}><input type="url" placeholder="https://example.com/image.jpg" {...common} />{typeof value === "string" && value && <img src={value} alt="Предпросмотр изображения" />}</div>;
  return <input type="text" {...common} />;
}

export default function CollectionEditor({ collection_key, initial }: { collection_key: string; initial: Item[] | Item }) {
  const definition = get_collection(collection_key)!;
  const isList = definition.kind === "list";
  const [items, setItems] = useState<Item[]>(isList ? initial as Item[] : [initial as Item]);
  const [selected, setSelected] = useState(0);
  const [search, setSearch] = useState("");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null);
  useEffect(() => {
    if (!dirty) return;
    const onLeave = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [dirty]);
  const visibleItems = useMemo(() => items.map((item, index) => ({ item, index })).filter(({ item, index }) => {
    const title = String((definition.title_key && item[definition.title_key]) || "Без названия");
    return `${title} ${index + 1}`.toLocaleLowerCase().includes(search.toLocaleLowerCase());
  }), [definition.title_key, items, search]);
  const selectedItem = items[selected];
  const titleOf = (item: Item, index: number) => String((definition.title_key && item[definition.title_key]) || `Новая запись ${index + 1}`);
  function change(next: Item[]) { setItems(next); setDirty(true); setStatus(null); }
  function update(key: string, value: Value) { change(items.map((item, index) => index === selected ? { ...item, [key]: value } : item)); }
  function add() { const next = [...items, make_item(definition.fields)]; change(next); setSelected(next.length - 1); setSearch(""); }
  function remove() {
    if (!selectedItem || !window.confirm(`Удалить запись «${titleOf(selectedItem, selected)}»? Это действие сохранится после нажатия «Сохранить».`)) return;
    change(items.filter((_, index) => index !== selected)); setSelected(Math.max(0, selected - 1));
  }
  function move(direction: -1 | 1) {
    const target = selected + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items]; [next[selected], next[target]] = [next[target], next[selected]]; change(next); setSelected(target);
  }
  async function save() {
    setSaving(true); setStatus(null);
    try {
      const response = await fetch(`/api/admin/${definition.key}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data: isList ? items : items[0] }) });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) throw new Error(result.error || "Не удалось сохранить изменения");
      const saved = isList ? result.data as Item[] : [result.data as Item];
      setItems(saved); setSelected((index) => Math.min(index, Math.max(0, saved.length - 1))); setDirty(false); setStatus({ ok: true, text: "Изменения сохранены" });
    } catch (error) { setStatus({ ok: false, text: error instanceof Error ? error.message : "Нет связи с сервером" }); }
    finally { setSaving(false); }
  }
  return <div className={`${styles.editor} ${!isList ? styles.single : ""}`}>
    {isList && <aside className={styles.listPanel}>
      <div className={styles.listHeader}><div><span className={styles.panelLabel}>СОДЕРЖИМОЕ</span><strong>{items.length} записей</strong></div><button type="button" className={styles.addButton} onClick={add} aria-label="Добавить запись">＋</button></div>
      <label className={styles.search}><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Найти запись" /></label>
      <div className={styles.recordList}>{visibleItems.map(({ item, index }) => <button type="button" key={`${item.id ?? "record"}-${index}`} className={`${styles.record} ${selected === index ? styles.recordActive : ""}`} onClick={() => setSelected(index)}><span className={styles.recordNumber}>{String(index + 1).padStart(2, "0")}</span><span className={styles.recordText}><strong>{titleOf(item, index)}</strong><small>{definition.fields.length} полей</small></span><span className={styles.recordArrow} aria-hidden="true">›</span></button>)}{visibleItems.length === 0 && <p className={styles.emptyList}>{items.length ? "Ничего не найдено" : "Пока записей нет. Добавьте первую."}</p>}</div>
    </aside>}
    <section className={styles.detail}>
      <div className={styles.detailHeader}><div><span className={styles.panelLabel}>{isList ? `ЗАПИСЬ ${String(selected + 1).padStart(2, "0")} ИЗ ${String(items.length).padStart(2, "0")}` : "ОБЩИЕ ПАРАМЕТРЫ"}</span><h2>{selectedItem ? titleOf(selectedItem, selected) : "Новая запись"}</h2><p>{isList ? "Заполните поля и сохраните изменения." : "Эти значения используются на страницах сайта."}</p></div>{isList && selectedItem && <div className={styles.recordActions}><button type="button" onClick={() => move(-1)} disabled={selected === 0} aria-label="Переместить выше">↑</button><button type="button" onClick={() => move(1)} disabled={selected === items.length - 1} aria-label="Переместить ниже">↓</button><button type="button" className={styles.deleteButton} onClick={remove}>Удалить</button></div>}</div>
      {selectedItem ? <div className={styles.fields}>{definition.fields.map((field) => <div className={`${styles.field} ${field.type === "textarea" ? styles.wide : ""}`} key={field.key}>{field.type !== "toggle" && <label>{field.label}</label>}<FieldInput field={field} value={selectedItem[field.key]} onChange={(value) => update(field.key, value)} />{field.hint && <small>{field.hint}</small>}</div>)}</div> : <div className={styles.noSelection}><span>✦</span><strong>Раздел пока пуст</strong><p>Создайте первую запись, чтобы добавить сюда содержимое.</p><button type="button" onClick={add}>＋ Добавить запись</button></div>}
    </section>
    <footer className={styles.savebar}><span className={status ? status.ok ? styles.success : styles.error : styles.saveMessage}>{status ? status.text : dirty ? "Есть несохранённые изменения" : "Все изменения сохранены"}</span><button type="button" onClick={save} disabled={saving || !dirty}>{saving ? "Сохраняем…" : "Сохранить изменения"}</button></footer>
  </div>;
}
