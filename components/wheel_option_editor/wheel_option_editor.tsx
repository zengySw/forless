"use client";

import { useState } from "react";
import type { WheelOption } from "@/components/wheel_game/wheel_game";
import styles from "./cn.module.css";

export default function WheelOptionEditor({ options, onChange, disabled }: {
  options: WheelOption[];
  onChange: (options: WheelOption[]) => void;
  disabled: boolean;
}) {
  const [open, setOpen] = useState(false);
  const update = (index: number, patch: Partial<WheelOption>) => onChange(options.map((item, i) => i === index ? { ...item, ...patch } : item));
  const add = () => onChange([...options, { id: crypto.randomUUID(), label: "Новый вариант", weight: 1 }]);

  return (
    <div className={styles.controls}>
      <button className={styles.toggle} type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} disabled={disabled}>
        {open ? "Скрыть настройки" : "⚙️ Настроить варианты"}
      </button>
      {open && <div className={styles.editor}>
        <p>Измени список для этого запуска. Вес определяет вероятность: чем он выше, тем чаще выпадает вариант.</p>
        {options.map((option, index) => <div className={styles.row} key={option.id}>
          <label className={styles.visuallyHidden} htmlFor={`wheel-label-${option.id}`}>Название варианта {index + 1}</label>
          <input id={`wheel-label-${option.id}`} value={option.label} maxLength={80} disabled={disabled} onChange={(event) => update(index, { label: event.target.value })} />
          <label className={styles.visuallyHidden} htmlFor={`wheel-weight-${option.id}`}>Вес варианта {index + 1}</label>
          <input id={`wheel-weight-${option.id}`} type="number" min={1} max={100} value={option.weight} disabled={disabled} onChange={(event) => update(index, { weight: Math.max(1, Math.min(100, Number(event.target.value) || 1)) })} />
          <button type="button" className={styles.remove} aria-label={`Удалить ${option.label}`} disabled={disabled} onClick={() => onChange(options.filter((_, i) => i !== index))}>×</button>
        </div>)}
        <button type="button" className={styles.add} onClick={add} disabled={disabled}>＋ Добавить вариант</button>
        {options.length < 2 && <span className={styles.hint}>Для вращения нужно хотя бы два варианта.</span>}
      </div>}
    </div>
  );
}
