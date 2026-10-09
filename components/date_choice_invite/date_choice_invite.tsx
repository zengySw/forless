"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type PointerEvent, type TouchEvent } from "react";
import styles from "./cn.module.css";
import InviteSummary from "@/components/invite_summary/invite_summary";

type InviteConfig = {
  title: string;
  hint: string;
  yesLabel: string;
  noLabel: string;
  activityOptions: string[];
  telegramUsername: string;
};

const emojis = ["🎬", "🍿", "🎤", "🎳", "🎨", "📸", "🎮", "🎲", "🧩", "🍕", "🍣", "🍰", "☕", "🌳", "🌅", "🌊", "🏖️", "⛺", "🚲", "🧺", "🌙", "⭐", "💃", "🌸", "🎁", "💖"];
type Stage = "ask" | "plan" | "details" | "sent" | "declined";
const noButtonTexts = ["Нет", "Точно?", "Подумай ещё 🥺", "Ну пожалуйста", "Я же старался", "Не нажимай!", "Ну давай 😭"];
const noButtonHints = ["Я очень постарался с этим приглашением 🥺", "Кнопка «Нет» какая-то неуловимая...", "Может, всё-таки «Да»? 💖", "Я не сдамся 😤"];

export default function DateChoiceInvite({ config }: { config: InviteConfig }) {
  const [stage, setStage] = useState<Stage>("ask");
  const [selected, setSelected] = useState<string[]>([]);
  const [customActivity, setCustomActivity] = useState("");
  const [customEmoji, setCustomEmoji] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [place, setPlace] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noPosition, setNoPosition] = useState<{ left: number; top: number } | null>(null);
  const [hearts, setHearts] = useState<Array<{ id: number; left: number; emoji: string; duration: number; size: number }>>([]);
  const [confetti, setConfetti] = useState<Array<{ id: number; left: number; emoji: string; delay: number }>>([]);
  const [answerText, setAnswerText] = useState("");
  const [savedPlan, setSavedPlan] = useState<{ activities: string[]; date: string; time: string; place: string }>({ activities: [], date: "", time: "", place: "" });

  const minDate = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    let id = 0;
    const interval = window.setInterval(() => {
      const heart = { id: ++id, left: Math.random() * 100, emoji: ["💗", "💖", "💕", "🌸", "✨"][Math.floor(Math.random() * 5)], duration: 6 + Math.random() * 4, size: 14 + Math.random() * 18 };
      setHearts((items) => [...items.slice(-14), heart]);
      window.setTimeout(() => setHearts((items) => items.filter((item) => item.id !== heart.id)), heart.duration * 1000);
    }, 700);
    return () => window.clearInterval(interval);
  }, []);

  const celebrate = () => setConfetti(Array.from({ length: 34 }, (_, id) => ({ id, left: Math.random() * 100, emoji: ["🎉", "💖", "✨", "🌸", "💘"][id % 5], delay: Math.random() * 0.5 })));

  const saveResponse = async (answer: "accepted" | "declined") => {
    setSaving(true);
    setError("");
    const activityList = answer === "accepted" ? selected : [];
    const custom = answer === "accepted" ? `${customEmoji} ${customActivity}`.trim() : "";
    const when = date ? new Date(`${date}T00:00:00`).toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" }) + (time ? ` в ${time}` : "") : time ? `в ${time}` : "когда договоримся";
    const where = place.trim() || "решим вместе";
    const activities = [...activityList, ...(custom ? [custom] : [])];
    const plan = activities.length ? activities.join(", ") : "сюрприз 🎁";

    try {
      const response = await fetch("/api/date-choice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answer, activities: activityList, custom_activity: custom, date, time, place }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || "Не удалось сохранить ответ.");
      if (answer === "accepted") {
        const text = `Я согласна на свидание! 💖 Когда: ${when}. Куда: ${where}. Чем займёмся: ${plan}.`;
        setAnswerText(text);
        setSavedPlan({ activities: activities.length ? activities : ["Сюрприз 🎁"], date: date ? new Date(`${date}T00:00:00`).toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" }) : "Договоримся позже", time, place: where });
        setStage("sent");
        celebrate();
      } else {
        setStage("declined");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось сохранить ответ. Попробуй ещё раз.");
    } finally {
      setSaving(false);
    }
  };

  const toggleActivity = (activity: string) => setSelected((items) => items.includes(activity) ? items.filter((item) => item !== activity) : [...items, activity]);

  const dodgeNoButton = (event: PointerEvent<HTMLButtonElement> | TouchEvent<HTMLButtonElement>) => {
    if ("pointerType" in event && event.pointerType !== "mouse") return;
    if ("touches" in event) event.preventDefault();
    const button = event.currentTarget;
    const bounds = button.getBoundingClientRect();
    const yesButton = button.parentElement?.querySelector(".invite_yes")?.getBoundingClientRect();
    let left = 8;
    let top = 8;
    for (let attempt = 0; attempt < 30; attempt++) {
      left = 8 + Math.random() * Math.max(0, window.innerWidth - bounds.width - 16);
      top = 8 + Math.random() * Math.max(0, window.innerHeight - bounds.height - 16);
      const overlapsYes = yesButton && left < yesButton.right + 12 && left + bounds.width > yesButton.left - 12 && top < yesButton.bottom + 12 && top + bounds.height > yesButton.top - 12;
      if (!overlapsYes) break;
    }
    setNoCount((count) => count + 1);
    setNoPosition({ left, top });
  };

  const copyAnswer = async () => {
    try {
      await navigator.clipboard.writeText(answerText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Не удалось скопировать. Можно выделить текст ответа вручную.");
    }
  };

  return (
    <main className={styles["invite_page"]}>
      <div className={styles["invite_hearts"]} aria-hidden="true">{hearts.map((heart) => <span key={heart.id} style={{ left: `${heart.left}%`, fontSize: heart.size, animationDuration: `${heart.duration}s` }}>{heart.emoji}</span>)}</div>
      {confetti.map((item) => <span className={styles["invite_confetti"]} key={item.id} style={{ left: `${item.left}%`, animationDelay: `${item.delay}s` }} aria-hidden="true">{item.emoji}</span>)}
      <div className={styles["invite_toplink"]}><Link href="/">← К выбору игр</Link></div>
      <article className={styles["invite_card"]} aria-live="polite">
        {stage === "ask" && <section className={styles["invite_screen"]}>
          <div className={styles["invite_mascot"]} aria-hidden="true">🐻</div><span className={styles["invite_sub"]} aria-hidden="true">💌</span>
          <span className={styles["game_eyebrow"]}>ЛИЧНОЕ ПРИГЛАШЕНИЕ</span>
          <h1>{config.title}</h1>
          <p className={styles["invite_hint"]}>{noCount ? noButtonHints[Math.min(noCount - 1, noButtonHints.length - 1)] : config.hint}</p>
          <div className={styles["invite_decision"]}>
            <button className={styles["invite_yes"]} type="button" onClick={() => setStage("plan")}>{config.yesLabel}</button>
            <button className={[styles["invite_no"], noPosition && styles["is_running"]].filter(Boolean).join(" ")} type="button" onPointerEnter={dodgeNoButton} onTouchStart={dodgeNoButton} style={noPosition ?? undefined} onClick={() => void saveResponse("declined")} disabled={saving} aria-label={config.noLabel}>{saving ? "Сохраняю…" : noCount ? noButtonTexts[Math.min(noCount, noButtonTexts.length - 1)] : config.noLabel}</button>
          </div>
          {error && <p className={styles["invite_error"]} role="alert">{error}</p>}
        </section>}

        {stage === "plan" && <section className={styles["invite_screen"]}>
          <div className={styles["invite_big"]} aria-hidden="true">🥰</div>
          <span className={styles["game_eyebrow"]}>УРААА!</span>
          <h1>Чем будем заниматься?</h1>
          <p className={styles["invite_hint"]}>Выбери всё, что тебе нравится, или предложи своё.</p>
          <div className={styles["invite_chips"]}>{config.activityOptions.map((activity) => <button type="button" key={activity} className={[styles["invite_chip"], selected.includes(activity) && styles["is_selected"]].filter(Boolean).join(" ")} onClick={() => toggleActivity(activity)} aria-pressed={selected.includes(activity)}>{activity}</button>)}</div>
          <div className={styles["invite_custom"]}>
            <button type="button" className={[styles["invite_emoji_button"], emojiOpen && styles["is_open"]].filter(Boolean).join(" ")} onClick={() => setEmojiOpen((open) => !open)} aria-label="Выбрать эмодзи">{customEmoji || "+"}</button>
            <input value={customActivity} onChange={(event) => setCustomActivity(event.target.value)} maxLength={120} placeholder="Или свой вариант" aria-label="Свой вариант занятия" />
          </div>
          {emojiOpen && <div className={styles["invite_emoji_panel"]} aria-label="Выбери эмодзи">{emojis.map((emoji) => <button type="button" key={emoji} onClick={() => { setCustomEmoji(emoji); setEmojiOpen(false); }}>{emoji}</button>)}</div>}
          <button type="button" className={styles["invite_primary"]} onClick={() => setStage("details")}>Дальше 💕</button>
          <button type="button" className={styles["invite_back"]} onClick={() => setStage("ask")}>← Назад</button>
        </section>}

        {stage === "details" && <section className={styles["invite_screen"]}>
          <div className={styles["invite_big"]} aria-hidden="true">📅</div>
          <span className={styles["game_eyebrow"]}>ПОСЛЕДНИЙ ШАГ</span>
          <h1>Когда и куда?</h1>
          <p className={styles["invite_hint"]}>Можно оставить поля пустыми и договориться позже.</p>
          <div className={styles["invite_details"]}>
            <label>Когда<div className={styles["invite_when"]}><input type="date" min={minDate} value={date} onChange={(event) => setDate(event.target.value)} aria-label="Дата" /><input type="time" value={time} onChange={(event) => setTime(event.target.value)} aria-label="Время" /></div></label>
            <label htmlFor="invite-place">Куда<input id="invite-place" type="text" value={place} onChange={(event) => setPlace(event.target.value)} maxLength={160} placeholder="Кино, прогулка, кафе…" /></label>
          </div>
          {error && <p className={styles["invite_error"]} role="alert">{error}</p>}
          <button type="button" className={styles["invite_primary"]} onClick={() => void saveResponse("accepted")} disabled={saving}>{saving ? "Сохраняю…" : "Отправить ответ ✨"}</button>
          <button type="button" className={styles["invite_back"]} onClick={() => setStage("plan")}>← Назад</button>
        </section>}

        {stage === "sent" && <section className={styles["invite_screen"]}>
          <div className={styles["invite_big"]}>💞</div><span className={styles["game_eyebrow"]}>ОТВЕТ СОХРАНЁН</span>
          <h1>Договорились!</h1>
          <InviteSummary plan={savedPlan} />
          <p className={styles["invite_saved_note"]}>Я уже считаю дни до нашей встречи 💗</p>
          {config.telegramUsername && <a className={styles["invite_link_button"]} href={`https://t.me/${encodeURIComponent(config.telegramUsername)}?text=${encodeURIComponent(answerText)}`} target="_blank" rel="noopener noreferrer">Отправить ответ в Telegram ✈️</a>}
          <button type="button" className={[styles["invite_copy_button"], copied && styles["is_copied"]].filter(Boolean).join(" ")} onClick={() => void copyAnswer()}>
            <span className={styles["invite_copy_icon"]} aria-hidden="true">{copied ? "✓" : "▢"}</span>
            <span>{copied ? "Ответ скопирован" : "Скопировать ответ"}</span>
          </button>
          <Link className={[styles["invite_back"], styles["invite_home_link"]].join(" ")} href="/">Вернуться к играм</Link>
        </section>}

        {stage === "declined" && <section className={styles["invite_screen"]}>
          <div className={styles["invite_big"]}>🌷</div><span className={styles["game_eyebrow"]}>ОТВЕТ СОХРАНЁН</span>
          <h1>Спасибо, что ответила</h1>
          <p className={styles["invite_hint"]}>Всё хорошо 💗 Может быть, в другой раз.</p>
          <Link className={[styles["invite_back"], styles["invite_home_link"]].join(" ")} href="/">Вернуться к играм</Link>
        </section>}
      </article>
    </main>
  );
}
