"use client";

import Link from "next/link";
import { useState } from "react";

const questions = [
  { question: "Какой мой любимый цвет?", options: ["Красный", "Синий", "Зелёный", "Розовый"], answer: 3, note: "Розовый — мой самый любимый цвет! 💗" },
  { question: "Какое блюдо я никогда не откажусь съесть?", options: ["Пицца", "Суши", "Паста", "Бургер"], answer: 0, note: "Пицца — это любовь! 🍕" },
  { question: "Какой мой идеальный вечер?", options: ["Фильм и попкорн", "Прогулка под звёздами", "Игры на консоли", "Чтение книги"], answer: 1, note: "Прогулка под звёздами — лучшее! ✨" },
  { question: "Какой суперспособностью я бы хотел(а) обладать?", options: ["Читать мысли", "Телепортироваться", "Становиться невидимым", "Находить потерянные вещи"], answer: 3, note: "Главный талант — находить всё потерянное! 🔎" },
  { question: "Какое моё любимое время года?", options: ["Весна", "Лето", "Осень", "Зима"], answer: 0, note: "Весна — время тепла и новых впечатлений 🌷" },
];

export default function GamesPage() {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const current = questions[index];

  const choose = (answer: number) => {
    if (selected !== null) return;
    setSelected(answer);
    if (answer === current.answer) setScore((value) => value + 1);
  };

  const next = () => {
    if (index === questions.length - 1) setComplete(true);
    else { setIndex((value) => value + 1); setSelected(null); }
  };

  const restart = () => { setIndex(0); setScore(0); setSelected(null); setComplete(false); };

  return (
    <main className="mini_game">
      <Link className="mini_game_back" href="/">← К выбору игр</Link>
      <header className="mini_game_header">
        <span className="game_eyebrow">МАЛЕНЬКАЯ ВИКТОРИНА</span>
        <h1>Хорошо ли ты меня знаешь? 💌</h1>
        <p>Пять вопросов — посмотрим, сколько ответов совпадёт.</p>
      </header>

      <section className="mini_game_panel">
        {complete ? (
          <div className="mini_game_result">
            <span className="mini_game_result_icon">{score === questions.length ? "🥰" : score >= 3 ? "💖" : "💕"}</span>
            <span className="game_eyebrow">ТВОЙ РЕЗУЛЬТАТ</span>
            <h2>{score} из {questions.length}</h2>
            <p>{score === questions.length ? "Ты знаешь меня на все сто!" : score >= 3 ? "Как же хорошо ты меня знаешь!" : "Есть повод узнать друг друга ещё лучше 💗"}</p>
            <button className="mini_game_primary" onClick={restart}>Сыграть ещё раз</button>
          </div>
        ) : (
          <>
            <div className="mini_game_progress_row"><span>Вопрос {index + 1} из {questions.length}</span><span>{Math.round((index / questions.length) * 100)}%</span></div>
            <div className="mini_game_progress"><span style={{ width: `${(index / questions.length) * 100}%` }} /></div>
            <h2 className="mini_game_question">{current.question}</h2>
            <div className="mini_game_choices">
              {current.options.map((option, answer) => {
                const isCorrect = selected !== null && answer === current.answer;
                const isWrong = selected === answer && answer !== current.answer;
                return <button key={option} className={`mini_game_choice${isCorrect ? " is_correct" : ""}${isWrong ? " is_wrong" : ""}`} onClick={() => choose(answer)} disabled={selected !== null}>
                  <span className="mini_game_choice_letter">{String.fromCharCode(65 + answer)}</span>{option}<span className="mini_game_choice_mark">{isCorrect ? "✓" : isWrong ? "×" : ""}</span>
                </button>;
              })}
            </div>
            {selected !== null && <div className={`mini_game_feedback${selected === current.answer ? " good" : ""}`}>
              <p>{selected === current.answer ? "Правильно! 💗" : "Почти! Правильный ответ подсвечен."} {current.note}</p>
              <button className="mini_game_primary" onClick={next}>{index === questions.length - 1 ? "Узнать результат" : "Следующий вопрос →"}</button>
            </div>}
          </>
        )}
      </section>
    </main>
  );
}
