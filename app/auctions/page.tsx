import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, Gavel, LockKeyhole, ShieldCheck, TrendingUp } from "lucide-react";
import { ListingTypeBadge } from "@/components/marketplace/listing-type-badge";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { SlabCard } from "@/components/marketplace/slab-card";
import { formatCurrency, formatEstimateRange } from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";
import type { VaultListing } from "@/lib/marketplace/types";

export const metadata: Metadata = {
  title: "Auctions",
  description: "Explore curated auction and premier graded card lots on VaultMarket.",
};

const auctionLots = mockListings.filter(
  (listing) => listing.listingType === "auction" || listing.listingType === "premier",
);
const vaultReadyLots = auctionLots.filter((listing) => listing.vaultStatus === "vault_held");
const totalAuctionAsk = auctionLots.reduce((total, listing) => total + listing.priceCents, 0);
const leadLot = [...auctionLots].sort((a, b) => b.priceCents - a.priceCents)[0];
const scarceLot = [...auctionLots]
  .filter((listing) => listing.population !== undefined)
  .sort((a, b) => (a.population ?? Infinity) - (b.population ?? Infinity))[0];
const sessionLots = {
  premier: auctionLots.filter((listing) => listing.listingType === "premier"),
  weekly: auctionLots.filter((listing) => listing.listingType === "auction"),
};

function DisabledBidButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-disabled="true"
      title="Bidding requires controlled auction access."
      className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-[var(--border-soft)] bg-white/34 px-4 text-sm font-semibold text-vault-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
    >
      <LockKeyhole className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function AuctionRow({ listing }: { listing: VaultListing }) {
  return (
    <li className="rounded-[8px] border border-[var(--border-soft)] bg-white/36 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ListingTypeBadge type={listing.listingType} compact />
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              {listing.year} / {listing.franchise}
            </span>
          </div>
          <Link
            href={`/marketplace/${listing.slug}`}
            className="mt-2 block w-fit rounded-[5px] text-base font-semibold text-vault-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {listing.title}
          </Link>
          <p className="mt-1 text-sm text-vault-steel">
            {listing.gradingCompany} {listing.grade} / {listing.setName}
          </p>
        </div>

        <div className="grid gap-2 sm:min-w-48 sm:justify-items-end">
          <p className="text-xl font-semibold text-vault-ink">
            {formatCurrency(listing.priceCents)}
          </p>
          <MarketDelta value={listing.marketDeltaPercent} compact />
        </div>
      </div>
    </li>
  );
}

export default function AuctionsPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="grid gap-4 border-b border-[var(--border-soft)] pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-vault-registry">
              VaultMarket / Auction room
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-normal text-vault-ink sm:text-4xl">
              Curated auction and premier-lot review
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-vault-steel sm:text-base">
              A curated room for auction and premier inventory, focused on custody,
              estimate context, scarce populations, and inspection links.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href="/marketplace?type=auction"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-vault-graphite bg-vault-ink px-4 text-sm font-semibold text-vault-paper transition hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
            >
              <Gavel className="h-4 w-4" aria-hidden="true" />
              Browse auction lots
            </Link>
            <DisabledBidButton label="Bidding access required" />
          </div>
        </header>

        <section
          aria-label="Auction summary"
          className="grid gap-3 md:grid-cols-2 xl:grid-cols-4"
        >
          <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <CalendarClock className="h-5 w-5 text-vault-registry" aria-hidden="true" />
            <p className="mt-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              Upcoming lots
            </p>
            <p className="mt-1 text-2xl font-semibold text-vault-ink">{auctionLots.length}</p>
          </div>
          <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <ShieldCheck className="h-5 w-5 text-vault-registry" aria-hidden="true" />
            <p className="mt-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              Vault ready
            </p>
            <p className="mt-1 text-2xl font-semibold text-vault-ink">{vaultReadyLots.length}</p>
          </div>
          <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <TrendingUp className="h-5 w-5 text-vault-registry" aria-hidden="true" />
            <p className="mt-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              Lot book
            </p>
            <p className="mt-1 text-2xl font-semibold text-vault-ink">
              {formatCurrency(totalAuctionAsk)}
            </p>
          </div>
          <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <Gavel className="h-5 w-5 text-vault-registry" aria-hidden="true" />
            <p className="mt-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              Lead lot
            </p>
            <p className="mt-1 line-clamp-1 text-2xl font-semibold text-vault-ink">
              {leadLot.title}
            </p>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
          <article className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-registry">
                  Featured premier lot
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal text-vault-ink">
                  {leadLot.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-vault-steel">
                  {leadLot.provenanceNotes}
                </p>
              </div>
              <DisabledBidButton label="Bidding access required" />
            </div>

            <dl className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/38 p-3">
                <dt className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-vault-steel">
                  Estimate
                </dt>
                <dd className="mt-1 text-sm font-semibold text-vault-ink">
                  {formatEstimateRange(leadLot.estimatedRangeCents)}
                </dd>
              </div>
              <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/38 p-3">
                <dt className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-vault-steel">
                  Scarcity
                </dt>
                <dd className="mt-1 text-sm font-semibold text-vault-ink">
                  {scarceLot.title} / Pop {scarceLot.population}
                </dd>
              </div>
              <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/38 p-3">
                <dt className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-vault-steel">
                  Condition desk
                </dt>
                <dd className="mt-1 text-sm font-semibold text-vault-ink">
                  {leadLot.inspectionHighlights[0]}
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              <SlabCard listing={leadLot} />
            </div>
          </article>

          <section className="grid gap-5">
            <article className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-normal text-vault-ink">
                    Premier session
                  </h2>
                  <p className="mt-1 text-sm text-vault-steel">
                    Higher-value lots staged for specialist review.
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border-soft)] bg-white/44 px-3 py-1 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                  {sessionLots.premier.length} lots
                </span>
              </div>
              <ul className="mt-4 grid gap-3">
                {sessionLots.premier.map((listing) => (
                  <AuctionRow key={listing.id} listing={listing} />
                ))}
              </ul>
            </article>

            <article className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-normal text-vault-ink">
                    Weekly auction candidates
                  </h2>
                  <p className="mt-1 text-sm text-vault-steel">
                    Scarce graded cards prepared for auction-style review.
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border-soft)] bg-white/44 px-3 py-1 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                  {sessionLots.weekly.length} lots
                </span>
              </div>
              <ul className="mt-4 grid gap-3">
                {sessionLots.weekly.map((listing) => (
                  <AuctionRow key={listing.id} listing={listing} />
                ))}
              </ul>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
