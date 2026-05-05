import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Crosshair, Layers3 } from "lucide-react";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { formatCurrency, getVaultStatusLabel } from "@/lib/marketplace/format";
import type { VaultListing } from "@/lib/marketplace/types";
import { buildListingHref } from "@/lib/navigation/listing-links";
import { cn } from "@/lib/utils";

type ResearchCompFeedProps = {
  listings: VaultListing[];
  maxAbsDelta: number;
};

function signalFillPercent(delta: number | undefined, maxAbs: number) {
  const v = Math.abs(delta ?? 0);
  if (maxAbs <= 0) return 12;
  return Math.min(100, 12 + (v / maxAbs) * 88);
}

function compSpreadPercent(listing: VaultListing) {
  const lastComp = listing.lastCompCents ?? listing.priceCents;
  const high = Math.max(lastComp, listing.priceCents, 1);
  const low = Math.min(lastComp, listing.priceCents);
  return Math.max(10, Math.round((low / high) * 100));
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

function SignalBar({
  listing,
  maxAbsDelta,
}: {
  listing: VaultListing;
  maxAbsDelta: number;
}) {
  const positive = (listing.marketDeltaPercent ?? 0) >= 0;

  return (
    <div className="grid gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <MarketDelta value={listing.marketDeltaPercent} compact />
        <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
          Signal
        </span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(17,19,15,0.07)]" aria-hidden="true">
        <div
          className={cn(
            "h-full rounded-full",
            positive
              ? "bg-[linear-gradient(90deg,rgba(47,113,88,0.38),rgba(47,113,88,0.82))]"
              : "bg-[linear-gradient(90deg,rgba(154,62,53,0.38),rgba(154,62,53,0.78))]",
          )}
          style={{
            width: `${signalFillPercent(listing.marketDeltaPercent, maxAbsDelta)}%`,
          }}
        />
      </div>
    </div>
  );
}

export function ResearchCompFeed({ listings, maxAbsDelta }: ResearchCompFeedProps) {
  return (
    <div className="overflow-hidden rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-card)]">
      <div className="border-b border-white/10 bg-[linear-gradient(180deg,rgba(17,19,15,0.94)_0%,rgba(24,26,22,0.97)_100%)] px-4 py-4 text-vault-paper">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-vault-paper/48">
              Registry comps
            </p>
            <h2 className="mt-1 text-xl font-semibold text-vault-paper">
              Comparable sales desk
            </h2>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-vault-paper/62">
              Last comp versus current ask, custody posture, and live signal for each line.
            </p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/72">
            <Layers3 className="h-3.5 w-3.5" aria-hidden="true" />
            {listings.length} lines
          </span>
        </div>
      </div>

      <div className="grid gap-3 p-3 sm:p-4">
        {listings.map((listing, index) => {
          const compSpread = compSpreadPercent(listing);

          return (
            <article
              key={listing.id}
              className={cn(
                "group relative overflow-hidden rounded-[10px] border border-[var(--border-soft)] bg-white/[0.46] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(47,94,124,0.22)] hover:bg-white/72",
                index % 2 === 0 ? "research-comp-band-a" : "research-comp-band-b",
              )}
            >
              <div className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-r-full bg-[linear-gradient(180deg,rgba(47,94,124,0.38),rgba(47,113,88,0.42))]" />
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.95fr)_minmax(190px,0.58fr)] lg:items-center">
                <div className="min-w-0 pl-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-[rgba(17,19,15,0.12)] bg-white/54 px-2 py-1 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="rounded-full border border-[rgba(47,94,124,0.16)] bg-[rgba(47,94,124,0.07)] px-2 py-1 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-[#244f69]">
                      {listing.gradingCompany} {listing.grade}
                    </span>
                  </div>
                  <h3 className="mt-2 text-base font-semibold leading-snug text-vault-ink">
                    <AssetLink listing={listing} />
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-vault-steel">
                    {listing.year} / {listing.franchise} / {listing.setName}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[8px] border border-[rgba(17,19,15,0.09)] bg-white/42 p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                      Last comp
                    </p>
                    <p className="mt-1 text-xl font-semibold text-vault-ink">
                      {formatCurrency(listing.lastCompCents ?? 0)}
                    </p>
                  </div>
                  <div className="rounded-[8px] border border-[rgba(17,19,15,0.09)] bg-white/42 p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                      Current ask
                    </p>
                    <p className="mt-1 text-xl font-semibold text-vault-ink">
                      {formatCurrency(listing.priceCents)}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                        Comp proximity
                      </span>
                      <span className="font-mono text-[0.62rem] font-semibold text-vault-graphite">
                        {compSpread}%
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[rgba(17,19,15,0.07)]" aria-hidden="true">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,rgba(166,111,31,0.28),rgba(47,94,124,0.58))]"
                        style={{ width: `${compSpread}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 rounded-[8px] border border-[rgba(17,19,15,0.09)] bg-white/36 p-3">
                  <SignalBar listing={listing} maxAbsDelta={maxAbsDelta} />
                  <div className="flex items-center justify-between gap-3 border-t border-[rgba(17,19,15,0.08)] pt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-vault-steel">
                      <BadgeCheck className="h-3.5 w-3.5 text-vault-registry" aria-hidden="true" />
                      {getVaultStatusLabel(listing.vaultStatus)}
                    </span>
                    <Link
                      href={buildListingHref(listing.slug, "/research")}
                      className="inline-flex h-8 items-center justify-center gap-1.5 rounded-[6px] border border-[var(--border-soft)] bg-white/58 px-2.5 text-xs font-semibold text-vault-graphite transition hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                    >
                      Inspect
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2 pl-2 text-xs text-vault-steel">
                <Crosshair className="h-3.5 w-3.5 text-vault-registry" aria-hidden="true" />
                <span>Comp line aligned to current ask and custody signal.</span>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
