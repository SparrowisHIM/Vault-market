import { Gavel, Gem, Tag } from "lucide-react";
import { getListingTypeLabel } from "@/lib/marketplace/format";
import type { ListingType } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type ListingTypeBadgeProps = {
  type: ListingType;
  compact?: boolean;
};

const typeStyles: Record<ListingType, string> = {
  buy_now: "border-[rgba(47,94,124,0.24)] bg-[rgba(47,94,124,0.08)] text-[#244f69]",
  auction: "border-[rgba(166,111,31,0.3)] bg-[rgba(166,111,31,0.09)] text-[#744e18]",
  premier: "border-[rgba(17,19,15,0.22)] bg-[rgba(17,19,15,0.07)] text-vault-graphite",
};

const typeIcons = {
  buy_now: Tag,
  auction: Gavel,
  premier: Gem,
};

export function ListingTypeBadge({ type, compact = false }: ListingTypeBadgeProps) {
  const Icon = typeIcons[type];

  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-[5px] border font-mono font-semibold uppercase tracking-[0.1em]",
        typeStyles[type],
        compact ? "px-1.5 py-1 text-[0.58rem]" : "px-2 py-1 text-[0.64rem]",
      )}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="truncate">{getListingTypeLabel(type)}</span>
    </span>
  );
}
