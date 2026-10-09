import { get_list } from "@/lib/content";
import WheelGame, { type WheelOption } from "@/components/wheel_game/wheel_game";

export const dynamic = "force-dynamic";

export default async function WheelPage() {
  const storedOptions = await get_list("wheel_options");
  const options: WheelOption[] = storedOptions.flatMap((item, index) => {
    if (typeof item.label !== "string" || !item.label.trim()) return [];
    return [{
      id: typeof item.id === "string" ? item.id : `wheel-${index}`,
      label: item.label,
      weight: typeof item.weight === "number" ? Math.max(1, Math.min(100, item.weight)) : 1,
    }];
  });

  return <WheelGame initialOptions={options} />;
}
