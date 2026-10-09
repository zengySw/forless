"use client";

import { useRef, useState } from "react";
import type { Coupon } from "@/lib/types";
import { burst } from "@/lib/effects";
import ScratchCover from "@/components/scratch_cover/scratch_cover";
import styles from "./cn.module.css";

type CouponState = { open?: boolean; uses?: number };

async function notify(type: "open" | "use", id: string) {
  try {
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });
    const result = await response.json().catch(() => null);
    if (result?.sent === false || !response.ok) {
      console.warn("Coupon Telegram notification was not sent:", result?.reason ?? result?.error ?? response.status);
    }
  } catch (error) {
    console.warn("Coupon Telegram notification request failed:", error);
  }
}

export default function CouponTicket({
  index,
  coupon,
  state,
  onOpen,
  onUse,
}: {
  index: number;
  coupon: Coupon;
  state: CouponState;
  onOpen: (id: string) => void;
  onUse: (id: string) => void;
}) {
  const ticketRef = useRef<HTMLElement>(null);
  const [showCover, setShowCover] = useState(!state.open);
  const [busy, setBusy] = useState(false);
  const [label, setLabel] = useState("Использовать 💝");
  const uses = state.uses ?? 0;

  const handleReveal = () => {
    const rect = ticketRef.current?.getBoundingClientRect();
    if (rect) burst(rect.left + rect.width / 2, rect.top + rect.height / 2, styles.popOut);
    onOpen(coupon.id);
    void notify("open", coupon.id);
    window.setTimeout(() => setShowCover(false), 600);
  };

  const handleUse = () => {
    if (!state.open || busy) return;
    setBusy(true);
    const rect = ticketRef.current?.getBoundingClientRect();
    if (rect) burst(rect.left + 60, rect.top + rect.height / 2, styles.popOut);
    onUse(coupon.id);
    setLabel("Купон использован 💌");
    void notify("use", coupon.id);
    window.setTimeout(() => {
      setLabel("Использовать 💝");
      setBusy(false);
    }, 2200);
  };

  return (
    <div className={styles.wrap}>
      <article
        ref={ticketRef}
        className={[styles.ticket, state.open && styles.open, uses > 0 && styles.used].filter(Boolean).join(" ")}
        style={{ "--h": coupon.hue } as React.CSSProperties}
      >
        <div className={styles.stub} aria-hidden="true">
          <span className={styles.number}>№{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.icon}>{state.open ? coupon.emoji : "❔"}</span>
        </div>
        <div className={styles.content}>
          <h2>{coupon.title}</h2>
          <p>{coupon.text}</p>
          <button className={styles.useButton} type="button" disabled={!state.open || busy} onClick={handleUse}>{label}</button>
          {uses > 0 && <span className={styles.stamp}>Использовано ×{uses}</span>}
          {showCover && <ScratchCover revealed={!!state.open} on_reveal={handleReveal} />}
        </div>
      </article>
    </div>
  );
}
