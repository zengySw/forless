import Link from "next/link";
import { collections } from "@/lib/schema";
import { get_list } from "@/lib/content";
import { get_storage_mode } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [counts, storageMode] = await Promise.all([
    Promise.all(collections.map(async (collection) =>
      collection.kind === "list" ? (await get_list(collection.key)).length : null,
    )),
    get_storage_mode(),
  ]);

  const storageName = storageMode === "redis"
    ? "Upstash Redis"
    : storageMode === "postgres"
      ? "PostgreSQL"
      : "Локальный файл";
  const databaseMissingOnVercel = storageMode === "file" && !!process.env.VERCEL;

  return (
    <>
      <div className="adm_page_intro">
        <div>
          <span className="adm_eyebrow">РАБОЧЕЕ ПРОСТРАНСТВО</span>
          <h1 className="adm_h1">Обзор</h1>
          <p className="adm_page_subtitle">Контент и настройки сайта — в одном месте.</p>
        </div>
        <span className="adm_storage">Данные: {storageName}</span>
      </div>

      {databaseMissingOnVercel && (
        <div className="adm_error">
          База данных не подключена, поэтому изменения не сохраняются. Добавь DATABASE_URL или подключи Upstash Redis.
        </div>
      )}

      <div className="adm_grid">
        {collections.map((collection, index) => (
          <Link key={collection.key} href={`/admin/${collection.key}`} className="adm_card adm_tile">
            <span className="adm_tile_icon" aria-hidden="true">{collection.icon}</span>
            <span className="adm_tile_title">{collection.title}</span>
            <span className="adm_muted">
              {counts[index] === null ? "Общие параметры" : `Записей: ${counts[index]}`}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
