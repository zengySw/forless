"use client";

import Link from "next/link";
import { useState } from "react";
import type { Secret } from "@/lib/types";
import styles from "./cn.module.css";

export default function SecretsView({ secrets }: { secrets: Secret[] }) {
  const [foundSecrets, setFoundSecrets] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<Record<string, string>>({});
  const progress = secrets.length ? Math.round((foundSecrets.length / secrets.length) * 100) : 0;

  const checkCondition = (condition: string) => {
    const visitMatch = condition.match(/visit_count\s*>=\s*(\d+)/);
    if (visitMatch) return 10 >= Number(visitMatch[1]);
    const secretMatch = condition.match(/secret_found\s*=\s*(\w+)/);
    if (secretMatch) return foundSecrets.includes(secretMatch[1]);
    if (/^(achievement_unlocked|letter_opened)\s*=/.test(condition)) return false;
    return false;
  };

  const handleFindSecret = (secret: Secret) => {
    if (foundSecrets.includes(secret.id)) return;
    if (checkCondition(secret.condition)) {
      setFoundSecrets((previous) => [...previous, secret.id]);
      setFeedback((previous) => ({ ...previous, [secret.id]: "Ты нашла секрет!" }));
    } else {
      setFeedback((previous) => ({ ...previous, [secret.id]: "Пока не получилось. Загляни в подсказку и попробуй ещё раз." }));
    }
  };

  return (
    <main className={styles.page}>
      <Link className={styles.back} href="/">← Назад</Link>

      <header className={styles.header}>
        <div className={styles.heroIcon} aria-hidden="true">🔐</div>
        <span className={styles.eyebrow}>ТИХОЕ МЕСТО ДЛЯ СЕКРЕТОВ</span>
        <h1>Тайные послания</h1>
        <p>Некоторые вещи открываются не сразу. Замечай подсказки — и маленькие тайны станут твоими.</p>
        <div className={styles.progressCard}>
          <div className={styles.progressTop}>
            <span>Найдено секретов</span>
            <strong>{foundSecrets.length}<small> / {secrets.length}</small></strong>
          </div>
          <div className={styles.progressTrack} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
            <span style={{ width: `${progress}%` }} />
          </div>
        </div>
      </header>

      {secrets.length > 0 ? (
        <section className={styles.secretGrid} aria-label="Тайные послания">
          {secrets.map((secret, index) => {
            const found = foundSecrets.includes(secret.id);
            return (
              <article className={`${styles.secretCard} ${found ? styles.foundCard : ""}`} key={secret.id}>
                <div className={styles.cardTop}>
                  <span className={styles.secretIcon} aria-hidden="true">{found ? "✨" : secret.emoji || "🔒"}</span>
                  <span className={found ? styles.foundBadge : styles.hiddenBadge}>{found ? "Открыто" : "Пока тайна"}</span>
                  <span className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <h2>{secret.title}</h2>
                <p className={styles.description}>{secret.description}</p>

                {secret.hint && (
                  <div className={styles.hint}>
                    <span aria-hidden="true">☼</span>
                    <p><strong>Подсказка</strong>{secret.hint}</p>
                  </div>
                )}

                {feedback[secret.id] && (
                  <p className={found ? styles.successMessage : styles.feedbackMessage} role="status">{feedback[secret.id]}</p>
                )}

                {found && (secret.reveal_content || secret.reveal_id) ? (
                  <div className={styles.reveal}>
                    <span className={styles.revealLabel}>ТВОЯ НАГРАДА</span>
                    <p>{secret.reveal_content}{secret.reveal_content && secret.reveal_id ? ": " : ""}{secret.reveal_id}</p>
                  </div>
                ) : !found ? (
                  <button className={styles.findButton} type="button" onClick={() => handleFindSecret(secret)}>
                    Проверить секрет <span aria-hidden="true">→</span>
                  </button>
                ) : null}
              </article>
            );
          })}
        </section>
      ) : (
        <div className={styles.emptyState}>
          <span aria-hidden="true">🗝️</span>
          <h2>Пока всё спрятано</h2>
          <p>Тайные послания появятся здесь после настройки в админке.</p>
        </div>
      )}

      <p className={styles.footerNote}>Некоторые находки особенно приятно обнаружить случайно <span aria-hidden="true">♡</span></p>
    </main>
  );
}
