import { collections } from "@/lib/schema";
import { get_list } from "@/lib/content";
import { get_storage_mode } from "@/lib/db";
import AdminDashboard from "@/components/admin_dashboard/admin_dashboard";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const [counts, storageMode] = await Promise.all([
    Promise.all(collections.map(async (collection) => collection.kind === "list" ? (await get_list(collection.key)).length : null)),
    get_storage_mode(),
  ]);
  const storageName = storageMode === "redis" ? "Upstash Redis" : storageMode === "postgres" ? "PostgreSQL" : "Локальный файл";
  return <AdminDashboard collections={collections} counts={counts} storageName={storageName} databaseMissingOnVercel={storageMode === "file" && !!process.env.VERCEL} />;
}
