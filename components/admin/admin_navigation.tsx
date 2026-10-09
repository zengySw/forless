"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavigationItem = { href: string; icon: string; label: string };

export default function AdminNavigation({ items }: { items: NavigationItem[] }) {
  const pathname = usePathname();

  return (
    <nav className="adm_nav" aria-label="Разделы админки">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className="adm_nav_link"
            aria-current={active ? "page" : undefined}
          >
            <span className="adm_nav_icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
            {active && <span className="adm_nav_dot" aria-hidden="true" />}
          </Link>
        );
      })}
    </nav>
  );
}
