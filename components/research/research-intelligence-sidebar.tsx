import Link from "next/link";
import { Activity, ArrowUpRight, Gem, Search } from "lucide-react";
import { ListingTypeBadge } from "@/components/marketplace/listing-type-badge";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { formatCurrency, formatPopulation } from "@/lib/marketplace/format";
import type { VaultListing } from "@/lib/marketplace/types";
import { buildListingHref } from "@/lib/navigation/listing-links";
import { cn } from "@/lib/utils";

type ResearchIntelligenceSidebarProps = {
  marketMovers: VaultListing[];
  rarityWatch: VaultListing[];
  maxAbsDelta: number;
  minPop: number;
  maxPop: number;
};

function moverBarPercent(delta: number | undefined, maxAbs: number) {
  const v = Math.abs(delta ?? 0);
  if (maxAbs <= 0) return 22;
  return Math.min(100, 18 + (v / maxAbs) * 82);
}

function rarityBarPercent(pop: number | undefined, minP: number, maxP: number) {
  if (pop === undefined) return 20;
  if (maxP <= minP) return 60;
  const t = (maxP - pop) / (maxP - minP);
  return Math.min(100, 22 + t * 78);
}

function AssetLink({ listing }: { listing: VaultListing }) {
  return (
    <Link
      href={buildListingHref(listing.slug, "/research")}
      className="rounded-[5px] font-semibold text-vault-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
    >
      {listing.title}
    </Link>
  );
}

export function ResearchIntelligenceSidebar({
  marketMovers,
  rarityWatch,
  maxAbsDelta,
  minPop,
  maxPop,
}: ResearchIntelligenceSidebarProps) {
  return (
    <aside className="grid gap-5">
      <section className="research-sidebar-panel overflow-hidden rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-card)] motion-safe:opacity-0">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border-soft)] bg-[linear-gradient(90deg,rgba(47,94,124,0.08),rgba(47,113,88,0.04),transparent)] px-4 py-4">
          <div>
            <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
              Live momentum
            </p>
            <h2 className="mt-1 text-lg font-semibold text-vault-ink">Market movers</h2>
            <p className="mt-1 text-sm text-vault-steel">Strongest signal versus comp, desk-ranked.</p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-[var(--border-soft)] bg-white/54 text-vault-registry">
            <Activity className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <ul className="grid gap-2 p-3">
          {marketMovers.slice(0, 4).map((listing, index) => (
            <li key={listing.id} className="research-sidebar-row motion-safe:opacity-0">
              <Link
                href={buildListingHref(listing.slug, "/research")}
                className="group block rounded-[9px] border border-[var(--border-soft)] bg-white/[0.42] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(47,94,124,0.22)] hover:bg-white/74 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-panel)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] border border-[var(--border-soft)] bg-white/58 font-mono text-[0.58rem] font-semibold text-vault-steel">
                        {index + 1}
                      </span>
                      <p className="truncate font-semibold text-vault-ink">{listing.title}</p>
                    </div>
                    <p className="mt-1 font-mono text-[0.62rem] text-vault-steel">
                      {listing.gradingCompany} {listing.grade} / {formatCurrency(listing.priceCents)}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 text-vault-steel transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-vault-ink"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <ListingTypeBadge type={listing.listingType} compact />
                  <MarketDelta value={listing.marketDeltaPercent} compact />
                </div>
                <div
                  className="mt-3 h-1.5 overflow-hidden rounded-full bg-[rgba(17,19,15,0.07)]"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.25),rgba(47,113,88,0.68))]"
                    style={{ width: `${moverBarPercent(listing.marketDeltaPercent, maxAbsDelta)}%` }}
                  />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="research-sidebar-panel overflow-hidden rounded-[10px] border border-[rgba(166,111,31,0.18)] bg-[linear-gradient(180deg,rgba(252,249,241,0.76),rgba(249,248,243,0.56))] shadow-[var(--shadow-card)] motion-safe:opacity-0">
        <div className="flex items-start justify-between gap-3 border-b border-[rgba(166,111,31,0.14)] bg-[linear-gradient(135deg,rgba(166,111,31,0.12),rgba(47,94,124,0.035),transparent)] px-4 py-4">
          <div>
            <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
              Rarity intelligence
            </p>
            <h2 className="mt-1 text-lg font-semibold text-vault-ink">Rarity watch</h2>
            <p className="mt-1 text-sm text-vault-steel">Low-population lines flagged for inspection priority.</p>
          </div>
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-[rgba(166,111,31,0.2)] bg-[rgba(166,111,31,0.08)] text-vault-amber">
            <Search className="h-5 w-5" aria-hidden="true" />
          </span>
        </div>

        <ul className="grid gap-2.5 p-3">
          {rarityWatch.slice(0, 5).map((listing, index) => (
            <li key={listing.id} className="research-sidebar-row motion-safe:opacity-0">
              <div
                className={cn(
                  "rounded-[9px] border border-[var(--border-soft)] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.62)]",
                  index === 0
                    ? "border-[rgba(166,111,31,0.22)] bg-[rgba(255,255,255,0.58)]"
                    : index % 2 === 0
                      ? "bg-white/[0.38]"
                      : "bg-white/[0.25]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Gem className="h-4 w-4 shrink-0 text-vault-amber" aria-hidden="true" />
                      <AssetLink listing={listing} />
                    </div>
                    <p className="mt-1 text-xs text-vault-steel">
                      {listing.gradingCompany} {listing.grade} / {listing.franchise}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-[6px] border border-[var(--border-soft)] bg-white/54 px-2 py-1 font-mono text-[0.65rem] font-semibold text-vault-graphite">
                    {formatPopulation(listing.population)}
                  </span>
                </div>
                <div className="mt-3" aria-hidden="true">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                      Scarcity read
                    </span>
                    <span className="font-mono text-[0.62rem] font-semibold text-vault-graphite">
                      {index + 1}/5
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[rgba(17,19,15,0.07)]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,rgba(166,111,31,0.42),rgba(47,94,124,0.48))]"
                      style={{
                        width: `${rarityBarPercent(listing.population, minPop, maxPop)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
