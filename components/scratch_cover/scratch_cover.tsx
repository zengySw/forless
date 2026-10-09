"use client";

import { useEffect, useRef } from "react";
import styles from "./cn.module.css";

type Point = { x: number; y: number };

function draw_cover(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const r = canvas.getBoundingClientRect();
  canvas.width = Math.max(1, Math.round(r.width * dpr));
  canvas.height = Math.max(1, Math.round(r.height * dpr));
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  g.addColorStop(0, "#d9d6ea");
  g.addColorStop(0.35, "#f6c9dc");
  g.addColorStop(0.7, "#cfd8f2");
  g.addColorStop(1, "#e9cdea");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${16 * dpr}px system-ui, sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (let i = 0; i < 22; i++) {
    ctx.globalAlpha = 0.35;
    ctx.fillText(["♥", "✦", "♡"][i % 3], Math.random() * canvas.width, Math.random() * canvas.height);
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#8a5a78";
  ctx.font = `800 ${18 * dpr}px system-ui, sans-serif`;
  ctx.fillText("СТИРАЙ ПАЛЬЦЕМ ✨", canvas.width / 2, canvas.height / 2);
}

export default function ScratchCover({ revealed, on_reveal }: { revealed: boolean; on_reveal: () => void }) {
  const canvas_ref = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<Point | null>(null);
  const moves = useRef(0);
  const done = useRef(false);

  useEffect(() => {
    if (canvas_ref.current) draw_cover(canvas_ref.current);
  }, []);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = e.currentTarget;
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * canvas.width) / r.width,
      y: ((e.clientY - r.top) * canvas.height) / r.height,
    };
  };

  const scratch = (canvas: HTMLCanvasElement, a: Point, b: Point) => {
    const ctx = canvas.getContext("2d")!;
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 36 * (window.devicePixelRatio || 1);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };

  const check = (canvas: HTMLCanvasElement) => {
    if (done.current) return;
    const ctx = canvas.getContext("2d")!;
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < d.length; i += 64) {
      total++;
      if (d[i] < 40) clear++;
    }
    if (clear / total > 0.5) {
      done.current = true;
      on_reveal();
    }
  };

  return (
    <canvas
      ref={canvas_ref}
      className={[styles["cover"], revealed && styles["gone"]].filter(Boolean).join(" ")}
      role="button"
      tabIndex={revealed ? -1 : 0}
      aria-label="Сотри защитный слой, чтобы открыть купон"
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && !done.current) {
          e.preventDefault();
          done.current = true;
          on_reveal();
        }
      }}
      onPointerDown={(e) => {
        drawing.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
        last.current = pos(e);
        scratch(e.currentTarget, last.current, last.current);
      }}
      onPointerMove={(e) => {
        if (!drawing.current || !last.current) return;
        const p = pos(e);
        scratch(e.currentTarget, last.current, p);
        last.current = p;
        if (++moves.current % 10 === 0) check(e.currentTarget);
      }}
      onPointerUp={(e) => {
        if (drawing.current) {
          drawing.current = false;
          check(e.currentTarget);
        }
      }}
      onPointerCancel={() => {
        drawing.current = false;
      }}
    />
  );
}
