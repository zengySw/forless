"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Coupon, Settings } from "@/lib/types";
import { confetti, spawn_heart } from "@/lib/effects";
import CouponTicket from "@/components/coupon_ticket/coupon_ticket";
import styles from "./cn.module.css";

type CouponState = { open?: boolean; uses?: number };
type BoardState = Record<string, CouponState>;

const storeKey = "love_coupons_v1";

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
    const id = window.setInterval(() => spawn_heart(container, styles["heart"]), 1100);
    return () => window.clearInterval(id);
  }, []);

  const opened = coupons.filter((coupon) => state[coupon.id]?.open).length;
  const progress = coupons.length ? (opened / coupons.length) * 100 : 0;

  const handleOpen = (id: string) => {
    if (state[id]?.open) return;
    setState((previous) => ({ ...previous, [id]: { ...previous[id], open: true } }));
    if (opened + 1 === coupons.length && coupons.length > 0) window.setTimeout(() => confetti(styles["conf"]), 500);
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
      <div className={styles["hearts"]} ref={heartsRef} aria-hidden="true" />
      <main className={styles["board"]}>
        <Link className={styles.boardBack} href="/">← К выбору игр</Link>
        <header className={styles.boardHeader}>
          <div className={styles["mascot"]} aria-hidden="true">🎟️</div>
          <h1 className={styles.boardTitle}>
            {settings.title}
            {settings.for_whom ? ` для ${settings.for_whom}` : ""}
          </h1>
          <p className={styles["lead"]}>{settings.lead}</p>
          <div className={styles["progress"]} aria-label={`Открыто купонов: ${opened} из ${coupons.length}`}>
            <div className={styles["bar"]}><i style={{ width: `${progress}%` }} /></div>
            <div className={styles["count"]}>Открыто {opened} из {coupons.length}</div>
          </div>
        </header>

        {coupons.length ? (
          <section aria-label="Купоны">
            {loaded && coupons.map((coupon, index) => (
              <CouponTicket
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
          <p className={styles.emptyState}>Купоны скоро появятся 💌</p>
        )}

        <div className={[styles["finale"], coupons.length > 0 && opened === coupons.length && styles["on"]].filter(Boolean).join(" ")}>
          Ты открыла все купоны! 🥰
          <br />
          Пользуйся ими, когда захочешь 💌
        </div>
        <button className={styles["reset"]} type="button" onClick={handleReset}>Начать заново</button>
      </main>
    </>
  );
}
