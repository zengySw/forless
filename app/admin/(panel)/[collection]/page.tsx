import { notFound } from "next/navigation";
import { get_collection } from "@/lib/schema";
import { get_list, get_single } from "@/lib/content";
import CollectionEditor from "@/components/collection_editor/collection_editor";

export const dynamic = "force-dynamic";

export default async function CollectionPage({ params }: { params: Promise<{ collection: string }> }) {
  const def = get_collection((await params).collection);
  if (!def) notFound();
  const data = def.kind === "list" ? await get_list(def.key) : await get_single(def.key);

  return (
    <>
      <div className="adm_page_intro">
        <div>
          <span className="adm_eyebrow">РЕДАКТИРОВАНИЕ РАЗДЕЛА</span>
          <h1 className="adm_h1">{def.icon} {def.title}</h1>
          {def.description && <p className="adm_page_subtitle">{def.description}</p>}
        </div>
      </div>
      <CollectionEditor key={def.key} collection_key={def.key} initial={data} />
    </>
  );
}
