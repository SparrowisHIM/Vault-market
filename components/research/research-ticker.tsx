type ResearchTickerProps = {
  items: string[];
};

export function ResearchTicker({ items }: ResearchTickerProps) {
  if (items.length === 0) return null;

  const loop = [...items, ...items];

  return (
    <div className="research-ticker border-t border-white/10 bg-[rgba(12,14,11,0.55)]">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-10 bg-[linear-gradient(90deg,rgba(17,19,15,0.95),transparent)]" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-10 bg-[linear-gradient(270deg,rgba(17,19,15,0.95),transparent)]" />
      <div className="research-ticker-track flex items-center gap-10 py-2.5 pl-4 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-vault-paper/58">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="shrink-0 text-vault-paper/72">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
