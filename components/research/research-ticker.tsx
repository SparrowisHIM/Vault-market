type ResearchTickerProps = {
  items: string[];
};

export function ResearchTicker({ items }: ResearchTickerProps) {
  if (items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <div className="research-ticker border-t border-white/10 bg-[rgba(12,14,11,0.58)]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-14 bg-[linear-gradient(90deg,rgba(17,19,15,0.95),transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-14 bg-[linear-gradient(270deg,rgba(17,19,15,0.95),transparent)]" />
      <div className="research-ticker-track flex items-center gap-5 py-3 pl-5 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/54">
        {loop.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="shrink-0 rounded-full border border-white/10 bg-white/[0.035] px-3.5 py-1.5 text-vault-paper/68 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
