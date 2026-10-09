"use client";

import Link from "next/link";
import { useState } from "react";
import type { Letter } from "@/lib/types";
import styles from "./cn.module.css";

export default function LettersView({ letters }: { letters: Letter[] }) {
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const openedCount = letters.filter((letter) => letter.opened).length;

  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/">← К страницам</Link>

      <header className={styles.header}>
        <div className={styles.headerIcon} aria-hidden="true">💌</div>
        <div>
          <span className={styles.eyebrow}>ЛИЧНО ДЛЯ ТЕБЯ</span>
          <h1>Письма «Открой, когда…»</h1>
          <p>Небольшие слова поддержки для любого дня и настроения.</p>
        </div>
        <span className={styles.headerSparkle} aria-hidden="true">✦</span>
      </header>

      <section className={styles.stats} aria-label="Статистика писем">
        <div className={styles.stat}>
          <span className={styles.statIcon} aria-hidden="true">✉</span>
          <span><strong>{letters.length}</strong><small>всего писем</small></span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statIcon} aria-hidden="true">💗</span>
          <span><strong>{openedCount}</strong><small>уже открыто</small></span>
        </div>
        <div className={styles.statNote}>Выбирай письмо по настроению</div>
      </section>

      {letters.length > 0 ? (
        <section className={styles.letterGrid} aria-label="Список писем">
          {letters.map((letter, index) => (
            <article className={styles.letterCard} key={letter.id}>
              <div className={styles.cardTop}>
                <span className={styles.letterEmoji} aria-hidden="true">{letter.emoji || "💌"}</span>
                <span className={letter.opened ? styles.openedBadge : styles.closedBadge}>
                  {letter.opened ? "Прочитано" : "Для особого момента"}
                </span>
                <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <span className={styles.cardEyebrow}>ОТКРОЙ, КОГДА</span>
              <h2>{letter.condition}</h2>
              <p className={styles.teaser}>
                {letter.opened ? "Это письмо уже открыто. Его можно перечитать." : "Внутри тебя ждут тёплые слова 💗"}
              </p>
              <button className={styles.openButton} type="button" onClick={() => setSelectedLetter(letter)}>
                {letter.opened ? "Перечитать письмо" : "Открыть письмо"}
                <span aria-hidden="true">→</span>
              </button>
            </article>
          ))}
        </section>
      ) : (
        <div className={styles.emptyState}>
          <span aria-hidden="true">🕊️</span>
          <h2>Письма пока не добавлены</h2>
          <p>Когда они появятся, здесь будут ждать свои особые моменты.</p>
        </div>
      )}

      <p className={styles.footerNote}><span aria-hidden="true">♡</span> Все письма бережно собраны для тебя</p>

      {selectedLetter && (
        <div className={styles.modalBackdrop} onMouseDown={(event) => {
          if (event.target === event.currentTarget) setSelectedLetter(null);
        }}>
          <section className={styles.letterModal} role="dialog" aria-modal="true" aria-labelledby="letter-title">
            <button className={styles.closeButton} type="button" onClick={() => setSelectedLetter(null)} aria-label="Закрыть письмо">×</button>
            <div className={styles.modalEmoji} aria-hidden="true">{selectedLetter.emoji || "💌"}</div>
            <span className={styles.eyebrow}>ОТКРОЙ, КОГДА</span>
            <h2 id="letter-title">{selectedLetter.condition}</h2>
            <div className={styles.letterText}>{selectedLetter.text}</div>
            <p className={styles.signoff}>Обнимаю 💗</p>
            <button className={styles.modalDone} type="button" onClick={() => setSelectedLetter(null)}>Закрыть письмо</button>
          </section>
        </div>
      )}
    </main>
  );
}
