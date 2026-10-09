import { get_list } from "@/lib/content";
import type { Secret } from "@/lib/types";
import SecretsView from "@/components/secrets_view/secrets_view";

export const dynamic = "force-dynamic";

export default async function SecretsPage() {
  const secrets = await get_list("secrets");
  return <SecretsView secrets={secrets as Secret[]} />;
}
