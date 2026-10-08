"use client";

import { useEffect, useRef, useState } from "react";
import { coupons } from "@/lib/coupons";
import { burst, confetti, spawn_heart } from "@/lib/effects";
import ScratchCover from "./scratch_cover";

type Coupon_state = { open?: boolean; uses?: number };
type Board_state = Record<number, Coupon_state>;

const store_key = "love_coupons_v1";
const pad = (n: number) => String(n).padStart(2, "0");

async function notify(type: "open" | "use", id: number): Promise<boolean> {
  try {
    const r = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id }),
    });
    return r.ok;
  } catch {
    return false;
  }
}

function Ticket({
  i,
  st,
  on_open,
  on_use,
}: {
  i: number;
  st: Coupon_state;
  on_open: (i: number) => void;
  on_use: (i: number) => void;
}) {
  const ticket_ref = useRef<HTMLElement>(null);
  const [show_cover, set_show_cover] = useState(!st.open);
  const [busy, set_busy] = useState(false);
  const [label, set_label] = useState("Использовать 💝");
  const c = coupons[i];
  const uses = st.uses ?? 0;

  const handle_reveal = () => {
    const r = ticket_ref.current?.getBoundingClientRect();
    if (r) burst(r.left + r.width / 2, r.top + r.height / 2);
    on_open(i);
    setTimeout(() => set_show_cover(false), 600);
  };

  const handle_use = async () => {
    if (!st.open || busy) return;
    set_busy(true);
    const r = ticket_ref.current?.getBoundingClientRect();
    if (r) burst(r.left + 60, r.top + r.height / 2);
    const ok = await notify("use", i);
    if (ok) {
      on_use(i);
      set_label("Отправлено 💌");
    } else {
      set_label("Не вышло, попробуй позже");
    }
    setTimeout(() => {
      set_label("Использовать 💝");
      set_busy(false);
    }, 2500);
  };

  return (
    <div className="ticket_wrap">
      <article
        ref={ticket_ref}
        className={`ticket${st.open ? " open" : ""}${uses ? " used" : ""}`}
        style={{ "--h": c.hue } as React.CSSProperties}
      >
        <div className="stub">
          <span className="num">№{pad(i + 1)}</span>
          <span className="ico">{st.open ? c.emoji : "❔"}</span>
        </div>
        <div className="body">
          <h2>{c.title}</h2>
          <p>{c.text}</p>
          <button className="use_btn" type="button" disabled={busy} onClick={handle_use}>
            {label}
          </button>
          <span className="stamp">использовано ×{uses}</span>
          {show_cover && <ScratchCover revealed={!!st.open} on_reveal={handle_reveal} />}
        </div>
      </article>
    </div>
  );
}

export default function CouponBoard() {
  const [state, set_state] = useState<Board_state>({});
  const [loaded, set_loaded] = useState(false);
  const [name, set_name] = useState("");
  const [reset_count, set_reset_count] = useState(0);
  const hearts_ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      set_state(JSON.parse(localStorage.getItem(store_key) || "{}"));
    } catch {}
    set_name(new URLSearchParams(window.location.search).get("name") || "");
    set_loaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(store_key, JSON.stringify(state));
    } catch {}
  }, [state, loaded]);

  useEffect(() => {
    const el = hearts_ref.current;
    if (!el) return;
    const id = setInterval(() => spawn_heart(el), 600);
    return () => clearInterval(id);
  }, []);

  const opened = coupons.filter((_, i) => state[i]?.open).length;

  const handle_open = (i: number) => {
    if (state[i]?.open) return;
    set_state((prev) => ({ ...prev, [i]: { ...prev[i], open: true } }));
    notify("open", i);
    if (opened + 1 === coupons.length) setTimeout(confetti, 500);
  };

  const handle_use = (i: number) => {
    set_state((prev) => ({ ...prev, [i]: { ...prev[i], uses: (prev[i]?.uses ?? 0) + 1 } }));
  };

  const handle_reset = () => {
    if (!window.confirm("Сбросить все купоны?")) return;
    set_state({});
    set_reset_count((n) => n + 1);
  };

  return (
    <>
      <div id="hearts" ref={hearts_ref} />
      <main>
        <header>
          <div className="mascot">🎟️</div>
          <h1>Купоны любви{name ? ` для ${name}` : ""}</h1>
          <p className="lead">Стирай защитный слой пальцем и узнавай, что тебе подарили 💖</p>
          <div className="progress">
            <div className="bar">
              <i style={{ width: `${(opened / coupons.length) * 100}%` }} />
            </div>
            <div id="count">
              Открыто {opened} из {coupons.length}
            </div>
          </div>
        </header>

        <section>
          {loaded &&
            coupons.map((_, i) => (
              <Ticket
                key={`${i}-${reset_count}`}
                i={i}
                st={state[i] ?? {}}
                on_open={handle_open}
                on_use={handle_use}
              />
            ))}
        </section>

        <div id="finale" className={opened === coupons.length ? "on" : ""}>
          Ты открыла все купоны! 🥰
          <br />
          Пользуйся ими, когда захочешь 💌
        </div>
        <button id="reset" type="button" onClick={handle_reset}>
          сбросить
        </button>
      </main>
    </>
  );
}
