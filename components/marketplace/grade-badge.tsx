import type { GradingCompany } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type GradeBadgeProps = {
  company: GradingCompany;
  grade: string;
  compact?: boolean;
};

const companyStyles: Record<GradingCompany, string> = {
  PSA: "border-[#cf3f3a]/35 bg-[#fff8f7] text-[#842a28]",
  BGS: "border-[#b08b35]/40 bg-[#fff8e8] text-[#71551e]",
  CGC: "border-[#2f5e7c]/35 bg-[#f1f7f9] text-[#264f68]",
  SGC: "border-[#252822]/30 bg-[#f4f3ef] text-[#20231e]",
};

export function GradeBadge({ company, grade, compact = false }: GradeBadgeProps) {
  return (
    <div
      className={cn(
        "grid shrink-0 grid-cols-[auto_1fr] overflow-hidden rounded-[6px] border font-mono shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]",
        companyStyles[company],
        compact ? "min-w-[92px]" : "min-w-[112px]",
      )}
      aria-label={`${company} grade ${grade}`}
    >
      <span
        className={cn(
          "flex items-center border-r border-current/20 bg-white/46 px-2 font-semibold tracking-[0.12em]",
          compact ? "py-1 text-[0.62rem]" : "py-1.5 text-[0.7rem]",
        )}
      >
        {company}
      </span>
      <span
        className={cn(
          "flex items-center justify-center px-2 font-semibold leading-none",
          compact ? "text-lg" : "text-2xl",
        )}
      >
        {grade}
      </span>
    </div>
  );
}
