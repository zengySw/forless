import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminNavigation from "@/components/admin/admin_navigation";
import { cookie_name, verify_session } from "@/lib/auth";
import { collections } from "@/lib/schema";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const token = (await cookies()).get(cookie_name)?.value;
  if (!(await verify_session(token))) redirect("/admin/login");

  return (
    <div className="adm_shell">
      <aside className="adm_side">
        <Link className="adm_brand" href="/admin" aria-label="ForLess, панель управления">
          <span className="adm_brand_mark" aria-hidden="true">💗</span>
          <span className="adm_brand_copy">
            <strong>ForLess</strong>
            <small>ПАНЕЛЬ УПРАВЛЕНИЯ</small>
          </span>
        </Link>
        <div className="adm_nav_heading">СОДЕРЖАНИЕ</div>
        <AdminNavigation
          items={[
            { href: "/admin", icon: "⌂", label: "Обзор" },
            ...collections.map((collection) => ({
              href: `/admin/${collection.key}`,
              icon: collection.icon,
              label: collection.title,
            })),
          ]}
        />
        <div className="adm_side_bottom">
          <Link className="adm_external" href="/" target="_blank" rel="noopener noreferrer">
            <span aria-hidden="true">↗</span> Открыть сайт
          </Link>
          <form action="/api/admin/logout" method="post">
            <button className="adm_logout" type="submit">
              <span aria-hidden="true">⇥</span> Выйти
            </button>
          </form>
        </div>
      </aside>
      <div className="adm_workspace">
        <header className="adm_topbar">
          <div>
            <span className="adm_topbar_kicker">FORLESS <span aria-hidden="true">/</span> УПРАВЛЕНИЕ</span>
            <span className="adm_topbar_title">Редактор сайта</span>
          </div>
          <div className="adm_profile">
            <span className="adm_profile_dot" aria-hidden="true" />
            <span>Администратор</span>
          </div>
        </header>
        <main className="adm_main">{children}</main>
      </div>
    </div>
  );
}
