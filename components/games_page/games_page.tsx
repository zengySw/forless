"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import QuizQuestion from "@/components/quiz_question/quiz_question";
import { questions, result_tiers } from "./quiz_data";
import styles from "./cn.module.css";

const back_href = "/";

type Phase = "intro" | "play" | "result";

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 28 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.4 + Math.random() * 2,
        emoji: ["💖", "✨", "💗", "🌸", "🎉"][i % 5],
      })),
    [],
  );
  return (
    <div className={styles.confetti} aria-hidden>
      {pieces.map((p, i) => (
        <span key={i} style={{ left: `${p.left}vw`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` }}>
          {p.emoji}
        </span>
      ))}
    </div>
  );
}

export default function QuizPage() {
  const [phase, set_phase] = useState<Phase>("intro");
  const [index, set_index] = useState(0);
  const [picked, set_picked] = useState<(number | null)[]>(() => questions.map(() => null));
  const next_ref = useRef<HTMLButtonElement>(null);

  const total = questions.length;
  const current = questions[index];
  const selected = picked[index];
  const is_last = index === total - 1;
  const is_right = selected === current.answer;
  const score = picked.filter((p, i) => p === questions[i].answer).length;
  const tier = result_tiers.find((t) => score / total >= t.ratio) ?? result_tiers[result_tiers.length - 1];

  const choose = (option: number) => {
    if (phase !== "play" || selected !== null) return;
    set_picked((prev) => prev.map((p, i) => (i === index ? option : p)));
  };
  const next = () => (is_last ? set_phase("result") : set_index((v) => v + 1));
  const restart = () => {
    set_picked(questions.map(() => null));
    set_index(0);
    set_phase("play");
  };

  // после ответа фокус на «Дальше», чтобы работал Enter
  useEffect(() => {
    if (selected !== null) next_ref.current?.focus();
  }, [selected]);

  // клавиши 1–4 и A–D
  useEffect(() => {
    if (phase !== "play") return;
    const on_key = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      const key = e.key.toLowerCase();
      const option = "1234".includes(key) ? "1234".indexOf(key) : "abcd".indexOf(key);
      if (option >= 0 && option < current.options.length) choose(option);
    };
    window.addEventListener("keydown", on_key);
    return () => window.removeEventListener("keydown", on_key);
  }, [phase, index, selected]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <main className={styles.quiz}>
      <Link className={styles.back} href={back_href}>
        ← К выбору игр
      </Link>

      {phase === "intro" && (
        <section className={`${styles.panel} ${styles.intro}`}>
          <div className={styles.mascot}>🐻</div>
          <span className={styles.eyebrow}>Маленькая викторина</span>
          <h1 className={styles.title}>Хорошо ли ты меня знаешь? 💌</h1>
          <p className={styles.lead}>{total} вопросов обо мне. Подсказки не работают, я проверял 😏</p>
          <ul className={styles.rules}>
            <li>🎯 {total} вопросов</li>
            <li>💗 один ответ верный</li>
            <li>⏱️ без таймера</li>
          </ul>
          <button type="button" className={styles.primary} onClick={() => set_phase("play")}>
            Начать
          </button>
        </section>
      )}

      {phase === "play" && (
        <section className={styles.panel}>
          <div className={styles.top}>
            <ol className={styles.hearts} aria-label="Прогресс">
              {questions.map((q, i) => {
                const p = picked[i];
                const state = p === null ? (i === index ? "now" : "todo") : p === q.answer ? "ok" : "bad";
                return (
                  <li key={i} className={`${styles.heart} ${styles[`heart_${state}`]}`}>
                    {state === "ok" ? "💗" : state === "bad" ? "💔" : "🤍"}
                  </li>
                );
              })}
            </ol>
            <span className={styles.counter}>
              {index + 1} / {total}
            </span>
          </div>

          <div key={index} className={styles.stage}>
            <QuizQuestion
              question={current.question}
              options={current.options}
              answer={current.answer}
              selected={selected}
              onSelect={choose}
            />
            {selected !== null && (
              <div className={`${styles.bubble} ${is_right ? styles.bubble_good : styles.bubble_bad}`} role="status">
                <span className={styles.bubble_bear}>🐻</span>
                <p>
                  <strong>{is_right ? "В точку! 💗" : "Почти! 🙈"}</strong> {current.note}
                </p>
                <button ref={next_ref} type="button" className={styles.primary} onClick={next}>
                  {is_last ? "Узнать результат" : "Дальше →"}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {phase === "result" && (
        <>
          {score / total >= 0.8 && <Confetti />}
          <section className={`${styles.panel} ${styles.result}`}>
            <span className={styles.result_icon}>{tier.icon}</span>
            <span className={styles.eyebrow}>Твой результат</span>
            <div className={styles.score}>
              {score}
              <small> / {total}</small>
            </div>
            <h2 className={styles.title}>{tier.title}</h2>
            <p className={styles.lead}>{tier.text}</p>

            <ul className={styles.review}>
              {questions.map((q, i) => {
                const p = picked[i];
                const ok = p === q.answer;
                return (
                  <li key={i}>
                    <span className={ok ? styles.review_ok : styles.review_bad}>{ok ? "✓" : "×"}</span>
                    <div>
                      <b>{q.question}</b>
                      <small>
                        {ok
                          ? q.options[q.answer]
                          : `Ты ответила: ${p !== null ? q.options[p] : "—"} · Верно: ${q.options[q.answer]}`}
                      </small>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className={styles.actions}>
              <button type="button" className={styles.primary} onClick={restart}>
                Сыграть ещё раз
              </button>
              <Link className={styles.secondary} href={back_href}>
                К играм
              </Link>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
