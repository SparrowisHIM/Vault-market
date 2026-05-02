import { ShieldCheck } from "lucide-react";

export default function Loading() {
  return (
    <main
      className="grid min-h-[calc(100svh-118px)] place-items-center px-4 py-12"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-md rounded-[12px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-[8px] border border-[var(--border-medium)] bg-vault-ink text-vault-paper">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-vault-steel">
              VaultMarket
            </p>
            <h1 className="mt-1 text-lg font-semibold text-vault-ink">
              Preparing market desk
            </h1>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-full border border-[var(--border-soft)] bg-white/42 p-1">
          <div className="vault-loader-bar h-2 rounded-full bg-[linear-gradient(90deg,var(--vault-registry),var(--vault-amber),var(--vault-verified))]" />
        </div>

        <p className="mt-4 text-sm leading-6 text-vault-steel">
          Loading listings, market signals, and inspection context.
        </p>
      </div>
    </main>
  );
}
