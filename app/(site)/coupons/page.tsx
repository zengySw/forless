import { get_list, get_single } from "@/lib/content";
import type { Coupon, Settings } from "@/lib/types";
import CouponBoard from "@/components/coupon_board";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const [coupons, settings] = await Promise.all([
    get_list("coupons"),
    get_single("settings"),
  ]);

  return (
    <CouponBoard
      coupons={(coupons ?? []) as Coupon[]}
      settings={(settings ?? {}) as Settings}
    />
  );
}
