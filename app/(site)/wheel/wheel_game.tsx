"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type WheelOption = { id: string; label: string; weight: number };

export default function WheelGame({ initialOptions }: { initialOptions: WheelOption[] }) {
  const [wheelOptions, setWheelOptions] = useState(initialOptions);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const center = canvas.width / 2;
    const radius = center - 10;
    const totalWeight = wheelOptions.reduce((sum, item) => sum + item.weight, 0);
    let angle = -Math.PI / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    wheelOptions.forEach((option, index) => {
      const slice = (option.weight / totalWeight) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, angle, angle + slice);
      ctx.closePath();
      ctx.fillStyle = `hsl(${index * 360 / wheelOptions.length} 72% 64%)`;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle + slice / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px Nunito, sans-serif";
      ctx.fillText(option.label, radius - 15, 5, 128);
      ctx.restore();
      angle += slice;
    });
    ctx.beginPath();
    ctx.arc(center, center, 33, 0, Math.PI * 2);
    ctx.fillStyle = "#fff8fb";
    ctx.fill();
    ctx.strokeStyle = "#ff5c8a";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#e0356a";
    ctx.font = "bold 11px Nunito, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("КРУТИ", center, center + 4);
  }, [wheelOptions]);

  const updateOption = (index: number, patch: Partial<WheelOption>) => {
    setWheelOptions((items) => items.map((item, i) => i === index ? { ...item, ...patch } : item));
  };

  const addOption = () => setWheelOptions((items) => [...items, { id: crypto.randomUUID(), label: "Новый вариант", weight: 1 }]);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const startRotation = rotation;
    const targetRotation = rotation + (5 + Math.random() * 5) * 360 + Math.random() * 360;
    const startedAt = performance.now();
    const duration = 4000;

    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setRotation(startRotation + (targetRotation - startRotation) * eased);
      if (progress < 1) {
        requestAnimationFrame(animate);
        return;
      }

      const finalRotation = ((targetRotation % 360) + 360) % 360;
      const pointerAngle = ((360 - finalRotation) % 360);
      const totalWeight = wheelOptions.reduce((sum, item) => sum + item.weight, 0);
      let cursor = 0;
      let winner = wheelOptions[0].label;
      for (const option of wheelOptions) {
        const segment = option.weight / totalWeight * 360;
        if (pointerAngle >= cursor && pointerAngle < cursor + segment) {
          winner = option.label;
          break;
        }
        cursor += segment;
      }
      setRotation(targetRotation);
      setResult(winner);
      setHistory((items) => [winner, ...items].slice(0, 8));
      setSpinning(false);
    };
    requestAnimationFrame(animate);
  };

  return (
    <main className="mini_game">
      <Link className="mini_game_back" href="/">← К выбору игр</Link>
      <header className="mini_game_header">
        <span className="game_eyebrow">ПУСТЬ РЕШИТ СЛУЧАЙ</span>
        <h1>Колесо случайностей 🎡</h1>
        <p>Крути колесо и узнай, чем займёмся вместе.</p>
      </header>
      <section className="mini_game_panel wheel_panel">
        <div className="wheel_controls">
          <button className="wheel_edit_toggle" type="button" onClick={() => setSettingsOpen((open) => !open)} aria-expanded={settingsOpen}>
            {settingsOpen ? "Скрыть настройки" : "⚙️ Настроить варианты"}
          </button>
          {settingsOpen && <div className="wheel_editor">
            <p>Измени список для этого запуска. Вес определяет вероятность: чем он выше, тем чаще выпадает вариант.</p>
            {wheelOptions.map((option, index) => <div className="wheel_edit_row" key={option.id}>
              <label className="sr_only" htmlFor={`wheel-label-${option.id}`}>Название варианта {index + 1}</label>
              <input id={`wheel-label-${option.id}`} value={option.label} maxLength={80} onChange={(event) => updateOption(index, { label: event.target.value })} />
              <label className="sr_only" htmlFor={`wheel-weight-${option.id}`}>Вес варианта {index + 1}</label>
              <input id={`wheel-weight-${option.id}`} type="number" min={1} max={100} value={option.weight} onChange={(event) => updateOption(index, { weight: Math.max(1, Math.min(100, Number(event.target.value) || 1)) })} />
              <button type="button" className="wheel_remove" aria-label={`Удалить ${option.label}`} onClick={() => setWheelOptions((items) => items.filter((_, i) => i !== index))}>×</button>
            </div>)}
            <button type="button" className="wheel_add" onClick={addOption}>＋ Добавить вариант</button>
            {wheelOptions.length < 2 && <span className="wheel_editor_hint">Для вращения нужно хотя бы два варианта.</span>}
          </div>}
        </div>
        <div className="wheel_wrap">
          <span className="wheel_pointer" aria-hidden="true" />
          <canvas ref={canvasRef} width={340} height={340} className="wheel_canvas" style={{ transform: `rotate(${rotation}deg)` }} aria-label="Колесо вариантов" />
        </div>
        <button className="mini_game_primary wheel_button" onClick={spin} disabled={spinning || wheelOptions.length < 2 || wheelOptions.some((item) => !item.label.trim())}>
          {spinning ? "🎡 Крутится…" : "Крутить колесо"}
        </button>
        {result && <div className="wheel_result" aria-live="polite"><span>Выпало</span><strong>{result}</strong></div>}
        {history.length > 0 && <div className="wheel_history"><h2>Недавние результаты</h2><div>{history.map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}</div></div>}
      </section>
    </main>
  );
}
