import { CheckCircle2, Clock3, ShieldCheck } from "lucide-react";
import { getTrustDescription, getTrustLabel } from "@/lib/marketplace/format";
import type { SellerTrustTier } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type SellerTrustBadgeProps = {
  tier: SellerTrustTier;
  completedSales: number;
  compact?: boolean;
};

const tierStyles: Record<SellerTrustTier, string> = {
  vault: "border-[rgba(47,113,88,0.28)] bg-[rgba(47,113,88,0.09)] text-[#235844]",
  verified: "border-[rgba(47,94,124,0.28)] bg-[rgba(47,94,124,0.09)] text-[#244f69]",
  new: "border-[rgba(166,111,31,0.32)] bg-[rgba(166,111,31,0.09)] text-[#744e18]",
};

const tierIcons = {
  vault: ShieldCheck,
  verified: CheckCircle2,
  new: Clock3,
};

export function SellerTrustBadge({
  tier,
  completedSales,
  compact = false,
}: SellerTrustBadgeProps) {
  const Icon = tierIcons[tier];
  const label = getTrustLabel(tier);
  const description = getTrustDescription(tier, completedSales);

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-[5px] border font-medium",
        tierStyles[tier],
        compact ? "px-1.5 py-1 text-[0.68rem]" : "px-2 py-1.5 text-xs",
      )}
      title={description}
      aria-label={description}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="truncate">{label}</span>
    </span>
  );
}
