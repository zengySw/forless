import Link from "next/link";
import type { Collection } from "@/lib/schema";
import styles from "./cn.module.css";

export default function AdminDashboard({ collections, counts, storageName, databaseMissingOnVercel }: { collections: Collection[]; counts: (number | null)[]; storageName: string; databaseMissingOnVercel: boolean }) {
  const records = counts.reduce<number>((total, count) => total + (count ?? 0), 0);
  const listCount = counts.filter((count) => count !== null).length;
  return <>
    <div className="adm_page_intro"><div><span className="adm_eyebrow">РАБОЧЕЕ ПРОСТРАНСТВО</span><h1 className="adm_h1">Обзор</h1><p className="adm_page_subtitle">Управляйте материалами сайта и проверяйте состояние хранилища.</p></div><span className="adm_storage">Данные: {storageName}</span></div>
    {databaseMissingOnVercel && <div className="adm_error">База данных не подключена, поэтому изменения не сохраняются. Добавьте DATABASE_URL или подключите Upstash Redis.</div>}
    <section className={styles.metrics} aria-label="Сводка сайта">
      <article className={styles.metric}><span>РАЗДЕЛЫ</span><strong>{collections.length}</strong><small>доступно для управления</small></article>
      <article className={styles.metric}><span>ЗАПИСИ</span><strong>{records}</strong><small>в списках сайта</small></article>
      <article className={styles.metric}><span>ХРАНИЛИЩЕ</span><strong className={styles.storageValue}>{storageName}</strong><small>текущее подключение</small></article>
    </section>
    <div className={styles.sectionHeading}><div><span className="adm_eyebrow">КОНТЕНТ И НАСТРОЙКИ</span><h2>Разделы сайта</h2></div><span>{listCount} списков · {collections.length - listCount} настроек</span></div>
    <div className="adm_grid">{collections.map((collection, index) => <Link key={collection.key} href={`/admin/${collection.key}`} className="adm_card adm_tile"><span className="adm_tile_icon" aria-hidden="true">{collection.icon}</span><span className="adm_tile_title">{collection.title}</span><span className="adm_muted">{counts[index] === null ? "Общие параметры" : `${counts[index]} записей`}</span></Link>)}</div>
  </>;
}
