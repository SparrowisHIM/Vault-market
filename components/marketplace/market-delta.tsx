import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { formatMarketDelta } from "@/lib/marketplace/format";
import { cn } from "@/lib/utils";

type MarketDeltaProps = {
  value?: number;
  compact?: boolean;
};

export function MarketDelta({ value, compact = false }: MarketDeltaProps) {
  const isPositive = value !== undefined && value > 0;
  const isNegative = value !== undefined && value < 0;
  const Icon = isPositive ? ArrowUpRight : isNegative ? ArrowDownRight : ArrowRight;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[5px] border font-mono font-medium",
        isPositive &&
          "border-[rgba(47,113,88,0.24)] bg-[rgba(47,113,88,0.08)] text-[#235844]",
        isNegative &&
          "border-[rgba(154,62,53,0.24)] bg-[rgba(154,62,53,0.08)] text-[#7e332c]",
        !isPositive &&
          !isNegative &&
          "border-[rgba(17,19,15,0.12)] bg-[rgba(17,19,15,0.045)] text-vault-steel",
        compact ? "px-1.5 py-1 text-[0.66rem]" : "px-2 py-1 text-[0.72rem]",
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {formatMarketDelta(value)}
    </span>
  );
}
