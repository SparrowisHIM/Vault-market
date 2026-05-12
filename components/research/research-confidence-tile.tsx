import type { LucideIcon } from "lucide-react";

type ResearchConfidenceTileProps = {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
  /** 0-100 strength of desk confidence signal for the bar accent */
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
  const ticks = Array.from({ length: 12 }, (_, index) => index);

  return (
    <div className="group relative overflow-hidden rounded-[10px] border border-[rgba(17,19,15,0.12)] bg-[rgba(249,248,243,0.82)] p-4 shadow-[var(--shadow-slab)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(47,94,124,0.22)] hover:bg-[rgba(255,254,249,0.92)] hover:shadow-[var(--shadow-slab-hover)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(47,94,124,0.35),rgba(47,113,88,0.26),transparent)]" />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
            {label}
          </p>
          <p className="summary-meter-value mt-2 text-2xl font-semibold leading-none text-vault-ink" data-summary-value={value}>
            {value}
          </p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/56 text-vault-registry transition group-hover:border-[rgba(47,94,124,0.28)] group-hover:bg-white/80">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 grid gap-1.5" aria-hidden="true">
        <div className="flex items-end gap-1">
          {ticks.map((tick) => {
            const active = (tick + 1) * (100 / ticks.length) <= width;
            return (
              <span
                key={tick}
                className={
                  active
                    ? "summary-meter-tick-active h-5 flex-1 origin-bottom rounded-[2px] bg-[linear-gradient(180deg,rgba(47,113,88,0.58),rgba(47,94,124,0.32))]"
                    : "summary-meter-tick-idle h-3 flex-1 origin-bottom rounded-[2px] bg-[rgba(17,19,15,0.075)]"
                }
              />
            );
          })}
        </div>
        <div className="h-1 overflow-hidden rounded-full bg-[rgba(17,19,15,0.06)]">
          <div
            className="summary-meter-fill h-full rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.38),rgba(47,113,88,0.5),rgba(166,111,31,0.34))]"
            style={{ width: `${width}%` }}
          />
        </div>
      </div>

      <p className="mt-3 text-sm leading-5 text-vault-steel">{detail}</p>
    </div>
  );
}
