"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./cn.module.css";

type NavigationItem = { href: string; icon: string; label: string };
export default function AdminNavigation({ items }: { items: NavigationItem[] }) {
  const pathname = usePathname();
  return <nav className={styles.nav} aria-label="Разделы админки">{items.map((item) => {
    const active = item.href === "/admin" ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);
    return <Link key={item.href} href={item.href} className={styles.link} aria-current={active ? "page" : undefined}>
      <span className={styles.icon} aria-hidden="true">{item.icon}</span><span>{item.label}</span>{active && <span className={styles.dot} aria-hidden="true" />}
    </Link>;
  })}</nav>;
}
