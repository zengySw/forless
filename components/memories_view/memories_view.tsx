"use client";

import Link from "next/link";
import { useState } from "react";
import type { TimelineEvent } from "@/lib/types";
import styles from "./cn.module.css";

function parseDate(value: string) {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDate(value: string) {
  const date = parseDate(value);
  return date ? new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long", year: "numeric" }).format(date) : "Дата не указана";
}

export default function MemoriesView({ timeline }: { timeline: TimelineEvent[] }) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const events = timeline.slice().sort((a, b) => {
    const first = parseDate(a.date)?.getTime() ?? 0;
    const second = parseDate(b.date)?.getTime() ?? 0;
    return first - second;
  });

  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/">← Назад</Link>

      <header className={styles.header}>
        <div className={styles.headerIcon} aria-hidden="true">🕰️</div>
        <span className={styles.eyebrow}>МГНОВЕНИЯ, КОТОРЫЕ С НАМИ</span>
        <h1>Наша история</h1>
        <p>Листай назад и вперёд — у каждого важного момента есть своё место.</p>
        <div className={styles.headerFooter}>
          <span><strong>{events.length}</strong> {events.length === 1 ? "воспоминание" : "воспоминаний"}</span>
          <span className={styles.headerLine} />
          <span>собрано с любовью ♡</span>
        </div>
      </header>

      {events.length ? (
        <section className={styles.timeline} aria-label="Хронология воспоминаний">
          {events.map((event, index) => {
            const date = parseDate(event.date);
            return (
              <article className={styles.timelineItem} key={event.id}>
                <div className={styles.dateColumn}>
                  <span className={styles.day}>{date ? String(date.getDate()).padStart(2, "0") : "—"}</span>
                  <span className={styles.month}>{date ? new Intl.DateTimeFormat("ru-RU", { month: "short" }).format(date).replace(".", "") : ""}</span>
                </div>
                <span className={styles.timelineMarker} aria-hidden="true">{index === 0 ? "♡" : "✦"}</span>
                <div className={styles.memoryCard}>
                  {event.image && <div className={styles.memoryImage}><img src={event.image} alt="" loading="lazy" /></div>}
                  <div className={styles.memoryContent}>
                    <span className={styles.memoryDate}>{formatDate(event.date)}</span>
                    <h2>{event.title}</h2>
                    <p>{event.text.length > 190 ? `${event.text.slice(0, 190).trimEnd()}…` : event.text}</p>
                    {!!event.related_memories?.length && (
                      <div className={styles.tags} aria-label="Связанные материалы">
                        {event.related_memories.map((related) => <span key={related.id}>{related.type}</span>)}
                      </div>
                    )}
                    {event.text.length > 190 && (
                      <button className={styles.readMore} type="button" onClick={() => setSelectedEvent(event)}>Читать историю <span aria-hidden="true">→</span></button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      ) : (
        <div className={styles.emptyState}>
          <span aria-hidden="true">🌷</span>
          <h2>История только начинается</h2>
          <p>Здесь будут появляться важные события и маленькие моменты, которые хочется сохранить.</p>
        </div>
      )}

      <p className={styles.footerNote}>И это только начало <span aria-hidden="true">♡</span></p>

      {selectedEvent && (
        <div className={styles.modalBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedEvent(null);
        }}>
          <section className={styles.eventModal} role="dialog" aria-modal="true" aria-labelledby="memory-title">
            <button className={styles.closeButton} type="button" onClick={() => setSelectedEvent(null)} aria-label="Закрыть">×</button>
            {selectedEvent.image && <img className={styles.modalImage} src={selectedEvent.image} alt="" />}
            <div className={styles.modalContent}>
              <span className={styles.eyebrow}>{formatDate(selectedEvent.date)}</span>
              <h2 id="memory-title">{selectedEvent.title}</h2>
              <p>{selectedEvent.text}</p>
              <button className={styles.modalDone} type="button" onClick={() => setSelectedEvent(null)}>Закрыть воспоминание</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
