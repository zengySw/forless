"use client";

import { useState, useEffect } from "react";
import { get_collection, type Collection, type Field, type Item } from "@/lib/schema";

type FieldComponentProps = { 
  value: any; 
  onChange: (v: any) => void; 
  hint?: string; 
  max?: number; 
  min?: number; 
  placeholder?: string 
};

const fieldComponents: Record<Field["type"], React.FC<FieldComponentProps>> = {
  text: ({ value, onChange, placeholder }) => (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-[var(--bg1)] rounded border"
    />
  ),
  textarea: ({ value, onChange }) => (
    <textarea
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-[var(--bg1)] rounded border h-24 resize-none"
      placeholder="Введите текст..."
    />
  ),
  emoji: ({ value, onChange }) => {
    const defaultEmoji = "💖";
    const selectedEmoji = value || defaultEmoji;
    return (
      <div className="relative w-full px-3 py-2 bg-[var(--bg1)] rounded border">
        <span className="text-2xl selected-emoji">{selectedEmoji}</span>
        <input
          type="text"
          value={value ?? defaultEmoji}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0"
        />
      </div>
    );
  },
  number: ({ value, onChange, min, max, placeholder }) => (
    <input
      type="number"
      value={value ?? (min ?? 0)}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      min={min ?? undefined}
      max={max ?? undefined}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-[var(--bg1)] rounded border"
    />
  ),
  date: ({ value, onChange }) => (
    <input
      type="date"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 bg-[var(--bg1)] rounded border"
    />
  ),
  image: ({ value, onChange, hint }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => onChange(e.target?.result as string || "");
        reader.readAsDataURL(file);
      }
    };
    return (
      <div className="relative w-full px-3 py-2 bg-[var(--bg1)] rounded border">
        {value ? (
          <img src={value} alt="preview" className="w-full h-24 object-cover rounded" />
        ) : (
          <div className="w-full h-24 bg-gray-300 rounded flex items-center justify-center text-opacity-50">
            {hint || "Изображение"}
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </div>
    );
  },
  toggle: ({ value, onChange }) => (
    <div className="relative w-full px-3 py-2 bg-[var(--bg1)] rounded border">
      <input
        type="checkbox"
        checked={value === true}
        onChange={(e) => onChange(e.target.checked)}
        className="absolute inset-0 opacity-0 cursor-pointer"
      />
      <span className="relative cursor-pointer">{value === true ? "Да" : "Нет"}</span>
    </div>
  ),
};

export type { Field, Collection };

interface CollectionEditorProps {
  collection_key: string;
  initial: Item[] | Item;
}

export default function CollectionEditor({ collection_key, initial }: CollectionEditorProps) {
  const [collection, setCollection] = useState<Item[] | Item>(initial);
  const def = get_collection(collection_key);

  if (!def) {
    return <div>Коллекция не найдена</div>;
  }

  const isSingle = def.kind === "single";
  const items = isSingle ? [collection as Item] : (collection as Item[]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const renderField = (field: Field, value: any, itemIndex: number) => {
    const Component = fieldComponents[field.type];
    if (!Component) return <div key={field.key}>Тип поля не поддерживается: {field.type}</div>;

    return (
      <div key={field.key} className="grid grid-cols-2 gap-4 mb-4">
        <label className="text-sm opacity-80">{field.label}</label>
        <div className="col-span-2">
          <Component
            value={value}
            onChange={(v) => {
              const updatedItem = { ...(items[itemIndex] as Item), [field.key]: v };
              if (isSingle) {
                setCollection(updatedItem);
              } else {
                setCollection((prev: Item[] | Item) => {
                  const arr = Array.isArray(prev) ? prev : [prev];
                  return arr.map((it, i) => (i === itemIndex ? updatedItem : it));
                });
              }
            }}
            hint={field.hint}
            max={field.max}
            min={field.min}
            placeholder={field.placeholder}
          />
        </div>
      </div>
    );
  };

  const addItem = () => {
    if (isSingle) return;
    const newItem: Item = {};
    def.fields.forEach((field) => {
      if (field.default !== undefined) {
        newItem[field.key] = field.default;
      }
    });
    setCollection((prev: Item[] | Item) => {
      const arr = Array.isArray(prev) ? prev : [prev];
      return [...arr, newItem];
    });
  };

  const deleteItem = (id: string) => {
    if (isSingle) return;
    setCollection((prev: Item[] | Item) => {
      const arr = Array.isArray(prev) ? prev : [prev];
      return arr.filter((item) => String(item.id ?? "") !== id);
    });
  };

  return (
    <div className="p-6">
      <h1 className="adm_h1">
        {def.icon} {def.title}
      </h1>
      {def.description && <p className="adm_muted">{def.description}</p>}

      {isSingle ? (
        <div className="grid grid-cols-1 gap-6 mb-8">
          {def.fields.map((field) => {
            const initialValue = (collection as Item)[field.key];
            return renderField(field, initialValue, 0);
          })}
        </div>
      ) : (
        <>
          <div className="mb-6">
            <button
              onClick={addItem}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors text-sm font-medium"
            >
              + Добавить запись
            </button>
          </div>

          {items.map((item, index) => {
            const itemId = String(item.id ?? `item-${index}`);
            return (
              <div
                key={itemId}
                className="bg-[var(--card)] rounded-xl p-6 border-l-4 border-[var(--pink)] transition-colors hover:bg-[var(--soft)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-lg font-medium">{item.title || `Запись #${index + 1}`}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(itemId)}
                      className="px-2 py-1 bg-[var(--pink)] text-white rounded text-xs"
                    >
                      Редактировать
                    </button>
                    <button
                      onClick={() => deleteItem(itemId)}
                      className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                    >
                      Удалить
                    </button>
                  </div>
                </div>

                {editingId === itemId && (
                  <form
                    className="grid grid-cols-2 gap-6 mb-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setEditingId(null);
                    }}
                  >
                    {def.fields.map((field) => {
                      const initialValue = (item as Item)[field.key];
                      return renderField(field, initialValue, index);
                    })}
                    <div className="col-span-2">
                      <button
                        type="submit"
                        className="w-full py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors"
                      >
                        Сохранить изменения
                      </button>
                    </div>
                  </form>
                )}

                <div className="mt-6 pt-6 border-t border-opacity-20">
                  <p className="text-xs opacity-60 mb-2">Поля:</p>
                  <div className="flex flex-wrap gap-2">
                    {def.fields.map((field) => (
                      <span
                        key={field.key}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[var(--soft)] rounded"
                      >
                        {field.type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <p className="text-opacity-60 mb-4">Здесь пока пусто. Добавьте первую запись.</p>
          )}
        </>
      )}
    </div>
  );
}