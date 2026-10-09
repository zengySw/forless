"use client";

import { useState, useEffect } from "react";
import { get_list, get_single } from "@/lib/content";
import type { Memory, TimelineEvent, Settings } from "@/lib/types";

export default function MemoriesPage() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
  const [newEvent, setNewEvent] = useState<TimelineEvent | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const [timelineRaw, settingsRaw] = await Promise.all([
        get_list("timeline"),
        get_single("settings"),
      ]);
      setTimeline(timelineRaw as unknown as TimelineEvent[]);
      setSettings(settingsRaw as Settings);
    };
    loadData();
  }, []);

  const handleSave = (event: TimelineEvent) => {
    setShowModal(false);
    setEditingEvent(null);
    // Would save to DB
    if (soundEnabled) {
      // Would play save sound
    }
  };

  const handleDelete = (id: string) => {
    // Would delete event
    setShowModal(false);
  };

  return (
    <main className="min-h-screen bg-[var(--bg1)] text-[var(--ink)] font-sans">
      {/* Header */}
      <header className="p-6 mb-8 border-b">
        <h1 className="text-2xl font-bold">Наша история 🕰️</h1>
        <p className="text-opacity-80">Воспоминания с датами и фото</p>
      </header>

      {/* Add memory button */}
      <div className="mb-8">
        <button 
          onClick={() => { setEditingEvent(null); setShowModal(true); }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors"
        >
          + Добавить воспоминание
        </button>
      </div>

      {/* Timeline */}
      <div className="max-w-4xl mx-auto">
        {timeline.map((event: any, index) => (
          <div 
            key={event.id}
            className="p-6 mb-4 bg-[var(--card)] rounded-xl border-l-4 border-[var(--pink)] transition-colors hover:bg-[var(--soft)]"
          >
            <div className="flex items-start gap-4">
              {/* Date badge */}
              <div className="w-12 h-12 flex-shrink-0 bg-[var(--pink)] text-white rounded flex items-center justify-center flex-none min-w-12">
                <div className="text-sm font-bold">{new Date(event.date).getDate()}</div>
                <div className="text-xs">{new Date(event.date).toLocaleDateString("ru", { month: "short" })}</div>
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-lg">{event.title}</h3>
                <p className="text-sm opacity-80 line-clamp-2">{event.text.substring(0, 150)}{event.text.length > 150 ? "..." : ""}</p>
              </div>
              
              {/* Actions menu */}
              <div className="ml-4 flex-shrink-0">
                <button 
                  className="text-[var(--pink)] text-sm hover:underline"
                >
                  Подробнее
                </button>
              </div>
            </div>
            
            {/* Related content tags */}
            <div className="mt-4 pt-4 border-t border-opacity-20">
              <p className="text-xs opacity-60 mb-2">Связано с:</p>
              <div className="flex flex-wrap gap-2">
                {event.related_memories?.map((related: any) => (
                  <span 
                    key={related.id}
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[var(--soft)] rounded"
                  >
                    {related.type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {timeline.length === 0 && (
        <div className="p-12 text-center opacity-60">
          <p>Пока здесь пусто. Добавь первое воспоминание!</p>
        </div>
      )}

      {/* Modal for adding/editing */}
      {editingEvent && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur z-50 flex items-center justify-center"
        >
          <div 
            className="bg-[var(--card)] rounded-xl p-8 w-full max-w-md border"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2 className="text-2xl font-bold mb-4">{editingEvent.id ? "Редактировать воспоминание" : "Добавить воспоминание"}</h2>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div>
                <label className="block text-sm opacity-80 mb-2">Дата</label>
                <input 
                  type="date"
                  value={editingEvent?.date || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })}
                  className="w-full px-4 py-2 bg-[var(--bg1)] rounded border"
                />
              </div>
              
              <div>
                <label className="block text-sm opacity-80 mb-2">Название</label>
                <input 
                  value={editingEvent?.title || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })}
                  className="w-full px-4 py-2 bg-[var(--bg1)] rounded border"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm opacity-80 mb-2">Описание</label>
                <textarea 
                  value={editingEvent?.text || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, text: e.target.value })}
                  className="w-full px-4 py-2 bg-[var(--bg1)] rounded border h-32 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm opacity-80 mb-2">Фото (ссылка)</label>
                <input 
                  value={editingEvent?.image || ""}
                  onChange={(e) => setEditingEvent({ ...editingEvent, image: e.target.value })}
                  className="w-full px-4 py-2 bg-[var(--bg1)] rounded border"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button 
                onClick={() => {
                  handleSave(editingEvent!);
                  setEditingEvent(null);
                }}
                className="flex-1 py-2 bg-[var(--pink)] text-white rounded hover:bg-[var(--pink_d)] transition-colors font-medium"
              >
                Сохранить
              </button>
              <button 
                onClick={() => setEditingEvent(null)}
                className="flex-1 py-2 bg-transparent text-[var(--pink)] rounded hover:bg-[var(--soft)] transition-colors font-medium"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}