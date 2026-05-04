import Link from "next/link";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { formatCurrency, getVaultStatusLabel } from "@/lib/marketplace/format";
import type { VaultListing } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type ResearchCompFeedProps = {
  listings: VaultListing[];
  maxAbsDelta: number;
};

function AssetLink({ listing }: { listing: VaultListing }) {
  return (
    <Link
      href={`/marketplace/${listing.slug}`}
      className="rounded-[5px] font-semibold text-vault-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
    >
      {listing.title}
    </Link>
  );
}

function signalFillPercent(delta: number | undefined, maxAbs: number) {
  const v = Math.abs(delta ?? 0);
  if (maxAbs <= 0) return 12;
  return Math.min(100, 12 + (v / maxAbs) * 88);
}

export function ResearchCompFeed({ listings, maxAbsDelta }: ResearchCompFeedProps) {
  return (
    <div className="research-comp-shell overflow-hidden rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-card)]">
      <div className="flex flex-col gap-2 border-b border-[var(--border-soft)] bg-[linear-gradient(180deg,rgba(17,19,15,0.92)_0%,rgba(24,26,22,0.96)_100%)] px-4 py-4 text-vault-paper sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-vault-paper/48">
            Registry comps
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight text-vault-paper">
            Comparable sales desk
          </h2>
          <p className="mt-1 max-w-xl text-sm leading-relaxed text-vault-paper/62">
            Last comp versus current ask, custody posture, and live signal for each line.
          </p>
        </div>
        <span className="w-fit rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/72">
          {listings.length} lines
        </span>
      </div>

      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="research-comp-table w-full min-w-[720px] border-collapse text-left text-sm">
            <caption className="sr-only">
              Comparable sales with asset, grade, last comp, ask, market signal, and custody.
            </caption>
            <thead>
              <tr className="border-b border-white/8 bg-[rgba(17,19,15,0.88)] font-mono text-[0.6rem] uppercase tracking-[0.16em] text-vault-paper/55">
                <th scope="col" className="px-4 py-3 font-semibold text-vault-paper/80">
                  Asset
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-vault-paper/80">
                  Grade
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-vault-paper/80">
                  Last comp
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-vault-paper/80">
                  Ask
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-vault-paper/80">
                  Signal
                </th>
                <th scope="col" className="px-4 py-3 font-semibold text-vault-paper/80">
                  Custody
                </th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing, index) => (
                <tr
                  key={listing.id}
                  className={cn(
                    "research-comp-row border-b border-[var(--border-soft)] align-top transition-colors duration-200 hover:bg-white/52",
                    index % 2 === 0 ? "bg-white/[0.38]" : "bg-[rgba(249,248,243,0.35)]",
                  )}
                >
                  <td className="px-4 py-4">
                    <AssetLink listing={listing} />
                    <p className="mt-1 text-xs text-vault-steel">
                      {listing.year} / {listing.franchise} / {listing.setName}
                    </p>
                  </td>
                  <td className="px-4 py-4 font-mono text-sm font-semibold text-vault-graphite">
                    {listing.gradingCompany} {listing.grade}
                  </td>
                  <td className="px-4 py-4 font-semibold text-vault-ink">
                    {formatCurrency(listing.lastCompCents ?? 0)}
                  </td>
                  <td className="px-4 py-4 font-semibold text-vault-ink">
                    {formatCurrency(listing.priceCents)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="grid gap-1.5">
                      <MarketDelta value={listing.marketDeltaPercent} compact />
                      <div
                        className="h-1 max-w-[7rem] overflow-hidden rounded-full bg-[rgba(17,19,15,0.08)]"
                        aria-hidden="true"
                      >
                        <div
                          className={cn(
                            "h-full rounded-full",
                            (listing.marketDeltaPercent ?? 0) >= 0
                              ? "bg-[linear-gradient(90deg,rgba(47,113,88,0.35),rgba(47,113,88,0.75))]"
                              : "bg-[linear-gradient(90deg,rgba(154,62,53,0.35),rgba(154,62,53,0.72))]",
                          )}
                          style={{
                            width: `${signalFillPercent(listing.marketDeltaPercent, maxAbsDelta)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-vault-steel">
                    {getVaultStatusLabel(listing.vaultStatus)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden">
        <ul className="divide-y divide-[var(--border-soft)] px-3 py-2">
          {listings.map((listing) => (
            <li
              key={listing.id}
              className="rounded-[8px] px-2 py-3 odd:bg-white/[0.28] even:bg-white/[0.14]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <AssetLink listing={listing} />
                  <p className="mt-1 text-xs text-vault-steel">
                    {listing.year} / {listing.franchise}
                  </p>
                </div>
                <MarketDelta value={listing.marketDeltaPercent} compact />
              </div>
              <div
                className="mt-2 h-1 overflow-hidden rounded-full bg-[rgba(17,19,15,0.07)]"
                aria-hidden="true"
              >
                <div
                  className={
                    (listing.marketDeltaPercent ?? 0) >= 0
                      ? "h-full rounded-full bg-[linear-gradient(90deg,rgba(47,113,88,0.4),rgba(47,113,88,0.85))]"
                      : "h-full rounded-full bg-[linear-gradient(90deg,rgba(154,62,53,0.4),rgba(154,62,53,0.8))]"
                  }
                  style={{
                    width: `${signalFillPercent(listing.marketDeltaPercent, maxAbsDelta)}%`,
                  }}
                />
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                <div>
                  <dt className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                    Grade
                  </dt>
                  <dd className="mt-0.5 font-mono font-semibold text-vault-graphite">
                    {listing.gradingCompany} {listing.grade}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                    Custody
                  </dt>
                  <dd className="mt-0.5 text-vault-steel">{getVaultStatusLabel(listing.vaultStatus)}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                    Last comp
                  </dt>
                  <dd className="mt-0.5 font-semibold text-vault-ink">
                    {formatCurrency(listing.lastCompCents ?? 0)}
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                    Ask
                  </dt>
                  <dd className="mt-0.5 font-semibold text-vault-ink">
                    {formatCurrency(listing.priceCents)}
                  </dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
