import type { LucideIcon } from "lucide-react";

type ResearchConfidenceTileProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  /** 0–100 strength of desk confidence signal for the bar accent */
  bandPercent: number;
};

export function ResearchConfidenceTile({
  icon: Icon,
  label,
  value,
  detail,
  bandPercent,
}: ResearchConfidenceTileProps) {
  const width = Math.min(100, Math.max(8, bandPercent));

  return (
    <div className="group relative overflow-hidden rounded-[9px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)] transition duration-200 hover:border-[rgba(47,94,124,0.22)] hover:shadow-[0_14px_40px_rgba(17,19,15,0.08)]">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-left bg-[linear-gradient(90deg,rgba(47,94,124,0.55),rgba(47,113,88,0.45))] opacity-80 transition-[transform,opacity] duration-500 group-hover:opacity-100"
        style={{ transform: `scaleX(${width / 100})` }}
        aria-hidden="true"
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-vault-ink">{value}</p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/48 text-vault-registry transition group-hover:border-[rgba(47,94,124,0.28)] group-hover:bg-white/72">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-vault-steel">{detail}</p>
      <div
        className="mt-3 h-1.5 overflow-hidden rounded-full bg-[rgba(17,19,15,0.06)]"
        role="presentation"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.35),rgba(47,113,88,0.42),rgba(47,94,124,0.28))]"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
