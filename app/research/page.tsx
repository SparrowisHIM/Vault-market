import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Gem,
  Gauge,
  Search,
} from "lucide-react";
import { ListingTypeBadge } from "@/components/marketplace/listing-type-badge";
import { MarketDelta } from "@/components/marketplace/market-delta";
import {
  formatCurrency,
  formatPopulation,
  getVaultStatusLabel,
} from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";
import type { VaultListing } from "@/lib/marketplace/types";

export const metadata: Metadata = {
  title: "Research",
  description: "Review comps, market signals, and rarity context on VaultMarket.",
};

const totalAskBook = mockListings.reduce(
  (total, listing) => total + listing.priceCents,
  0,
);
const averageDelta =
  mockListings.reduce((total, listing) => total + (listing.marketDeltaPercent ?? 0), 0) /
  mockListings.length;
const highestValue = [...mockListings].sort((a, b) => b.priceCents - a.priceCents)[0];
const strongestSignal = [...mockListings].sort(
  (a, b) => (b.marketDeltaPercent ?? 0) - (a.marketDeltaPercent ?? 0),
)[0];
const lowestPopulation = [...mockListings]
  .filter((listing) => listing.population !== undefined)
  .sort((a, b) => (a.population ?? Infinity) - (b.population ?? Infinity))[0];
const recentComps = mockListings
  .filter((listing) => listing.lastCompCents !== undefined)
  .sort((a, b) => (b.lastCompCents ?? 0) - (a.lastCompCents ?? 0));
const marketMovers = [...mockListings].sort(
  (a, b) => (b.marketDeltaPercent ?? 0) - (a.marketDeltaPercent ?? 0),
);
const rarityWatch = [...mockListings]
  .filter((listing) => listing.population !== undefined)
  .sort((a, b) => (a.population ?? Infinity) - (b.population ?? Infinity));

function formatSignedPercent(value: number) {
  const sign = value > 0 ? "+" : "";

  return `${sign}${value.toFixed(1)}%`;
}

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-normal text-vault-ink">
            {value}
          </p>
        </div>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/48 text-vault-registry">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-5 text-vault-steel">{detail}</p>
    </div>
  );
}

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

export default function ResearchPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="grid gap-4 border-b border-[var(--border-soft)] pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-vault-registry">
              VaultMarket / Research desk
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-normal text-vault-ink sm:text-4xl">
              Market context before a collector opens the slab
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-vault-steel sm:text-base">
              A focused readout of asking prices, last comps, rarity, custody status,
              and momentum signals using the current marketplace listings.
            </p>
          </div>

          <div className="rounded-[8px] border border-[var(--border-soft)] bg-[rgba(255,255,255,0.42)] px-4 py-3">
            <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              Data status
            </p>
            <p className="mt-1 text-sm font-semibold text-vault-ink">Market signal feed</p>
            <p className="mt-1 text-xs leading-5 text-vault-steel">
              Comp context, grader signals, and watch alerts are organized for desk
              review.
            </p>
          </div>
        </header>

        <section
          aria-label="Research summary"
          className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            icon={BarChart3}
            label="Ask book"
            value={formatCurrency(totalAskBook)}
            detail={`${mockListings.length} graded card listings in the current market set.`}
          />
          <StatCard
            icon={Activity}
            label="Average signal"
            value={formatSignedPercent(averageDelta)}
            detail={`Strongest current read: ${strongestSignal.title}.`}
          />
          <StatCard
            icon={Gem}
            label="Top ask"
            value={formatCurrency(highestValue.priceCents)}
            detail={`${highestValue.title} leads the premium desk inventory.`}
          />
          <StatCard
            icon={Gauge}
            label="Rarest pop"
            value={formatPopulation(lowestPopulation.population)}
            detail={`${lowestPopulation.title} has the lowest listed population count.`}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.75fr)]">
          <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-2 border-b border-[var(--border-soft)] p-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold tracking-normal text-vault-ink">
                  Recent comparable sales
                </h2>
                <p className="mt-1 text-sm text-vault-steel">
                  Last comp versus current ask for listings with comp data.
                </p>
              </div>
              <span className="w-fit rounded-full border border-[var(--border-soft)] bg-white/44 px-3 py-1 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                {recentComps.length} comps
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <caption className="sr-only">
                  Recent comparable sales with asset, grade, last comp, ask, and market
                  signal.
                </caption>
                <thead>
                  <tr className="border-b border-[var(--border-soft)] font-mono text-[0.65rem] uppercase tracking-[0.14em] text-vault-steel">
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Asset
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Grade
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Last comp
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Ask
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Signal
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold">
                      Custody
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-soft)]">
                  {recentComps.map((listing) => (
                    <tr key={listing.id} className="align-top">
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
                        <MarketDelta value={listing.marketDeltaPercent} compact />
                      </td>
                      <td className="px-4 py-4 text-vault-steel">
                        {getVaultStatusLabel(listing.vaultStatus)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <aside className="grid gap-5">
            <section className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-normal text-vault-ink">
                    Market movers
                  </h2>
                  <p className="mt-1 text-sm text-vault-steel">
                    Sorted by strongest signal versus comp.
                  </p>
                </div>
                <Activity className="h-5 w-5 text-vault-registry" aria-hidden="true" />
              </div>

              <ul className="mt-4 grid gap-3">
                {marketMovers.slice(0, 4).map((listing) => (
                  <li key={listing.id}>
                    <Link
                      href={`/marketplace/${listing.slug}`}
                      className="group block rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-3 transition hover:bg-white/64 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-panel)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-vault-ink">
                            {listing.title}
                          </p>
                          <p className="mt-1 text-xs text-vault-steel">
                            {listing.gradingCompany} {listing.grade} /{" "}
                            {formatCurrency(listing.priceCents)}
                          </p>
                        </div>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-vault-steel transition group-hover:text-vault-ink"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <ListingTypeBadge type={listing.listingType} compact />
                        <MarketDelta value={listing.marketDeltaPercent} compact />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-normal text-vault-ink">
                    Rarity watch
                  </h2>
                  <p className="mt-1 text-sm text-vault-steel">
                    Low-pop assets that deserve closer inspection.
                  </p>
                </div>
                <Search className="h-5 w-5 text-vault-registry" aria-hidden="true" />
              </div>

              <ul className="mt-4 divide-y divide-[var(--border-soft)]">
                {rarityWatch.slice(0, 5).map((listing) => (
                  <li key={listing.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <AssetLink listing={listing} />
                        <p className="mt-1 text-xs text-vault-steel">
                          {listing.gradingCompany} {listing.grade} /{" "}
                          {listing.franchise}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-[5px] border border-[var(--border-soft)] bg-white/42 px-2 py-1 font-mono text-[0.68rem] font-semibold text-vault-graphite">
                        {formatPopulation(listing.population)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
