"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Coupon, Settings } from "@/lib/types";
import { burst, confetti, spawn_heart } from "@/lib/effects";
import ScratchCover from "./scratch_cover";

type CouponState = { open?: boolean; uses?: number };
type BoardState = Record<string, CouponState>;

const storeKey = "love_coupons_v1";
const pad = (n: number) => String(n).padStart(2, "0");

async function notify(type: "open" | "use", id: string): Promise<void> {
  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });
  } catch {
    // Coupon actions stay usable when optional notifications are unavailable.
  }
}

function Ticket({
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
    if (rect) burst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    onOpen(coupon.id);
    void notify("open", coupon.id);
    window.setTimeout(() => setShowCover(false), 600);
  };

  const handleUse = () => {
    if (!state.open || busy) return;
    setBusy(true);
    const rect = ticketRef.current?.getBoundingClientRect();
    if (rect) burst(rect.left + 60, rect.top + rect.height / 2);
    onUse(coupon.id);
    setLabel("Купон использован 💌");
    void notify("use", coupon.id);
    window.setTimeout(() => {
      setLabel("Использовать 💝");
      setBusy(false);
    }, 2200);
  };

  return (
    <div className="ticket_wrap">
      <article
        ref={ticketRef}
        className={`ticket${state.open ? " open" : ""}${uses ? " used" : ""}`}
        style={{ "--h": coupon.hue } as React.CSSProperties}
      >
        <div className="stub" aria-hidden="true">
          <span className="num">№{pad(index + 1)}</span>
          <span className="ico">{state.open ? coupon.emoji : "❔"}</span>
        </div>
        <div className="body">
          <h2>{coupon.title}</h2>
          <p>{coupon.text}</p>
          <button className="use_btn" type="button" disabled={!state.open || busy} onClick={handleUse}>
            {label}
          </button>
          {uses > 0 && <span className="stamp">Использовано ×{uses}</span>}
          {showCover && <ScratchCover revealed={!!state.open} on_reveal={handleReveal} />}
        </div>
      </article>
    </div>
  );
}

export default function CouponBoard({ coupons, settings }: { coupons: Coupon[]; settings: Settings }) {
  const [state, setState] = useState<BoardState>({});
  const [loaded, setLoaded] = useState(false);
  const [resetCount, setResetCount] = useState(0);
  const heartsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storeKey) || "{}");
      if (saved && typeof saved === "object" && !Array.isArray(saved)) setState(saved);
    } catch {
      // Ignore malformed or unavailable browser storage and use an empty board.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(storeKey, JSON.stringify(state));
    } catch {
      // The board still works for this visit if browser storage is unavailable.
    }
  }, [state, loaded]);

  useEffect(() => {
    const container = heartsRef.current;
    if (!container) return;
    const id = window.setInterval(() => spawn_heart(container), 1100);
    return () => window.clearInterval(id);
  }, []);

  const opened = coupons.filter((coupon) => state[coupon.id]?.open).length;
  const progress = coupons.length ? (opened / coupons.length) * 100 : 0;

  const handleOpen = (id: string) => {
    if (state[id]?.open) return;
    setState((previous) => ({ ...previous, [id]: { ...previous[id], open: true } }));
    if (opened + 1 === coupons.length && coupons.length > 0) window.setTimeout(confetti, 500);
  };

  const handleUse = (id: string) => {
    setState((previous) => ({
      ...previous,
      [id]: { ...previous[id], uses: (previous[id]?.uses ?? 0) + 1 },
    }));
  };

  const handleReset = () => {
    if (!window.confirm("Сбросить все купоны и начать заново?")) return;
    setState({});
    setResetCount((count) => count + 1);
  };

  return (
    <>
      <div id="hearts" ref={heartsRef} aria-hidden="true" />
      <main>
        <Link className="board_back" href="/">← К выбору игр</Link>
        <header>
          <div className="mascot" aria-hidden="true">🎟️</div>
          <h1>
            {settings.title}
            {settings.for_whom ? ` для ${settings.for_whom}` : ""}
          </h1>
          <p className="lead">{settings.lead}</p>
          <div className="progress" aria-label={`Открыто купонов: ${opened} из ${coupons.length}`}>
            <div className="bar"><i style={{ width: `${progress}%` }} /></div>
            <div id="count">Открыто {opened} из {coupons.length}</div>
          </div>
        </header>

        {coupons.length ? (
          <section aria-label="Купоны">
            {loaded && coupons.map((coupon, index) => (
              <Ticket
                key={`${coupon.id}-${resetCount}`}
                index={index}
                coupon={coupon}
                state={state[coupon.id] ?? {}}
                onOpen={handleOpen}
                onUse={handleUse}
              />
            ))}
          </section>
        ) : (
          <p className="empty_state">Купоны скоро появятся 💌</p>
        )}

        <div id="finale" className={coupons.length > 0 && opened === coupons.length ? "on" : ""}>
          Ты открыла все купоны! 🥰
          <br />
          Пользуйся ими, когда захочешь 💌
        </div>
        <button id="reset" type="button" onClick={handleReset}>Начать заново</button>
      </main>
    </>
  );
}
