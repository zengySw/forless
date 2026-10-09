"use client";

import Link from "next/link";
import { useState } from "react";

const options = {
  place: ["Кино", "Ресторан", "Пляж", "Прогулка", "Поездка"],
  time: ["Утро", "День", "Вечер", "Ночь"],
  mood: ["Спокойно", "Весело", "Романтично", "Спонтанно"],
};
const stages = [
  { key: "place", title: "Куда отправимся?", icon: "📍" },
  { key: "time", title: "Когда устроим свидание?", icon: "🌙" },
  { key: "mood", title: "Какое будет настроение?", icon: "✨" },
] as const;

export default function DateChoicePage() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({ place: "", time: "", mood: "" });
  const [complete, setComplete] = useState(false);
  const stage = stages[step];

  const choose = (value: string) => {
    setSelections((current) => ({ ...current, [stage.key]: value }));
    if (step === stages.length - 1) setComplete(true);
    else setStep((current) => current + 1);
  };

  const restart = () => { setStep(0); setSelections({ place: "", time: "", mood: "" }); setComplete(false); };

  return (
    <main className="mini_game">
      <Link className="mini_game_back" href="/">← К выбору игр</Link>
      <header className="mini_game_header">
        <span className="game_eyebrow">НАШ СЛЕДУЮЩИЙ ВЕЧЕР</span>
        <h1>Выбери наше свидание 🌹</h1>
        <p>Собери план, который понравится нам обоим.</p>
      </header>
      <section className="mini_game_panel">
        {complete ? (
          <div className="mini_game_result">
            <span className="mini_game_result_icon">💞</span>
            <span className="game_eyebrow">ПЛАН ГОТОВ</span>
            <h2>Наше свидание</h2>
            <div className="date_summary">
              <p><span>📍</span><strong>{selections.place}</strong></p>
              <p><span>🌙</span><strong>{selections.time}</strong></p>
              <p><span>✨</span><strong>{selections.mood}</strong></p>
            </div>
            <p>Уже не терпится провести это время вместе 💗</p>
            <button className="mini_game_primary" onClick={restart}>Собрать другой план</button>
          </div>
        ) : (
          <>
            <div className="mini_game_progress_row"><span>Шаг {step + 1} из {stages.length}</span><span>{Math.round((step / stages.length) * 100)}%</span></div>
            <div className="mini_game_progress"><span style={{ width: `${(step / stages.length) * 100}%` }} /></div>
            <h2 className="mini_game_question"><span>{stage.icon}</span> {stage.title}</h2>
            <div className="mini_game_choices">
              {options[stage.key].map((option) => <button className="mini_game_choice" key={option} onClick={() => choose(option)}><span className="mini_game_choice_letter">♡</span>{option}<span className="mini_game_choice_mark">→</span></button>)}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
