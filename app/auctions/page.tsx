import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarClock,
  CircleDollarSign,
  Gavel,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { ListingTypeBadge } from "@/components/marketplace/listing-type-badge";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { SlabArtImage } from "@/components/marketplace/slab-art-image";
import { SlabCard } from "@/components/marketplace/slab-card";
import { formatCurrency, formatEstimateRange, formatPopulation } from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";
import type { VaultListing } from "@/lib/marketplace/types";
import { buildListingHref } from "@/lib/navigation/listing-links";
import { cn } from "@/lib/utils";

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

const reviewRail = [
  {
    label: "Catalog review",
    detail: `${auctionLots.length} curated lots`,
    tone: "blue",
  },
  {
    label: "Custody check",
    detail: `${vaultReadyLots.length} vault ready`,
    tone: "green",
  },
  {
    label: "Estimate read",
    detail: formatEstimateRange(leadLot.estimatedRangeCents),
    tone: "amber",
  },
  {
    label: "Access gate",
    detail: "Controlled room",
    tone: "dark",
  },
];

function DisabledBidButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-disabled="true"
      title="Bidding is held behind controlled auction-room access."
      className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-[rgba(166,111,31,0.24)] bg-[rgba(166,111,31,0.08)] px-4 text-sm font-semibold text-[#744e18] shadow-[inset_0_1px_0_rgba(255,255,255,0.52)] transition hover:bg-[rgba(166,111,31,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
    >
      <LockKeyhole className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  fill,
}: {
  icon: typeof Gavel;
  label: string;
  value: string;
  detail: string;
  fill: number;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[10px] border border-[rgba(17,19,15,0.12)] bg-[rgba(249,248,243,0.82)] p-4 shadow-[var(--shadow-slab)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(47,94,124,0.22)] hover:bg-[rgba(255,254,249,0.92)] hover:shadow-[var(--shadow-slab-hover)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold leading-none text-vault-ink">{value}</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/56 text-vault-registry">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[rgba(17,19,15,0.07)]" aria-hidden="true">
        <div
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(166,111,31,0.36),rgba(47,94,124,0.58),rgba(47,113,88,0.42))]"
          style={{ width: `${fill}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-5 text-vault-steel">{detail}</p>
    </div>
  );
}

function AuctionRow({ listing, index }: { listing: VaultListing; index: number }) {
  return (
    <li>
      <Link
        href={buildListingHref(listing.slug, "/auctions")}
        className="group grid gap-3 rounded-[10px] border border-[var(--border-soft)] bg-white/[0.42] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.64)] transition hover:-translate-y-0.5 hover:border-[rgba(47,94,124,0.22)] hover:bg-white/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded-[6px] border border-[var(--border-soft)] bg-white/58 font-mono text-[0.58rem] font-semibold text-vault-steel">
                {String(index + 1).padStart(2, "0")}
              </span>
              <ListingTypeBadge type={listing.listingType} compact />
              <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                {listing.year} / {listing.franchise}
              </span>
            </div>
            <p className="mt-2 text-base font-semibold text-vault-ink">{listing.title}</p>
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
        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                Estimate position
              </span>
              <span className="font-mono text-[0.62rem] font-semibold text-vault-graphite">
                {formatEstimateRange(listing.estimatedRangeCents)}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[rgba(17,19,15,0.07)]" aria-hidden="true">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,rgba(166,111,31,0.38),rgba(47,94,124,0.55))]"
                style={{ width: listing.listingType === "premier" ? "86%" : "58%" }}
              />
            </div>
          </div>
          <ArrowUpRight
            className="hidden h-4 w-4 text-vault-registry transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block"
            aria-hidden="true"
          />
        </div>
      </Link>
    </li>
  );
}

export default function AuctionsPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="overflow-hidden rounded-[12px] border border-[rgba(17,19,15,0.22)] shadow-[0_22px_70px_rgba(17,19,15,0.14)]">
          <div className="auction-session-console relative overflow-hidden bg-[linear-gradient(135deg,rgba(14,15,12,0.98)_0%,rgba(30,27,22,0.99)_50%,rgba(13,15,12,0.98)_100%)] text-vault-paper">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(244,241,233,0.03)_1px,transparent_1px),linear-gradient(rgba(244,241,233,0.024)_1px,transparent_1px)] bg-[length:44px_44px]" />
            <div className="auction-session-sweep pointer-events-none absolute inset-0" />
            <div className="relative grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.43fr)] lg:items-stretch">
              <div className="grid min-h-[23rem] gap-5 rounded-[10px] border border-white/10 bg-black/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5">
                    <Gavel className="h-4 w-4 text-[#e0b56c]" aria-hidden="true" />
                    <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-vault-paper/62">
                      VaultMarket / Auction room
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(224,181,108,0.24)] bg-[rgba(166,111,31,0.12)] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#e0b56c]">
                    <span className="auction-access-pulse h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                    Access review
                  </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
                  <div>
                    <h1 className="max-w-3xl text-3xl font-semibold leading-[1.03] text-vault-paper sm:text-5xl">
                      Curated auction and premier-lot review
                    </h1>
                    <p className="mt-4 max-w-2xl text-sm leading-relaxed text-vault-paper/64 sm:text-[0.95rem]">
                      A curated room for auction and premier inventory, focused on custody,
                      estimate context, scarce populations, and inspection links.
                    </p>
                  </div>

                  <div className="mx-auto w-full max-w-[14rem]">
                    <div className="relative h-48 overflow-hidden rounded-[14px] border border-white/10 bg-[linear-gradient(155deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02)_42%,rgba(0,0,0,0.22))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_24px_48px_rgba(0,0,0,0.24)]">
                      <div className="absolute inset-x-5 bottom-4 h-8 rounded-full bg-black/35 blur-xl" />
                      <div className="absolute inset-x-4 bottom-5 h-8 rounded-[50%] border border-[rgba(224,181,108,0.18)] bg-[linear-gradient(180deg,rgba(224,181,108,0.2),rgba(0,0,0,0.08))]" />
                      <div className="absolute right-3 top-3 rounded-full border border-[rgba(224,181,108,0.24)] bg-[rgba(224,181,108,0.1)] px-2 py-1 font-mono text-[0.52rem] font-semibold uppercase tracking-[0.13em] text-[#e0b56c]">
                        Staged
                      </div>
                      <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-2 py-1 font-mono text-[0.52rem] font-semibold uppercase tracking-[0.13em] text-vault-paper/54">
                        <Gavel className="h-3 w-3 text-[#e0b56c]" aria-hidden="true" />
                        Lot 01
                      </div>
                      <div className="relative mx-auto mt-8 w-[7.1rem] rotate-[-3deg] rounded-[12px] border border-white/70 bg-[#f3efe6] p-1.5 shadow-[0_18px_34px_rgba(0,0,0,0.34)]">
                        <div className="relative aspect-[5/7] overflow-hidden rounded-[8px] border border-[rgba(17,19,15,0.24)] bg-[var(--surface-inset)]">
                          <SlabArtImage
                            image={leadLot.image}
                            sizes="120px"
                            priority
                            className="p-1"
                          />
                          <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.34),transparent_38%,rgba(255,255,255,0.2)_48%,transparent_58%)]" />
                        </div>
                        <div className="mt-1.5 rounded-[6px] border border-[rgba(17,19,15,0.12)] bg-white/80 px-1.5 py-1">
                          <p className="truncate text-[0.55rem] font-semibold leading-none text-vault-ink">
                            {leadLot.title}
                          </p>
                          <p className="mt-0.5 font-mono text-[0.47rem] font-semibold uppercase tracking-[0.1em] text-vault-steel">
                            PSA {leadLot.grade} / {formatPopulation(leadLot.population)}
                          </p>
                        </div>
                      </div>
                      <div className="absolute inset-x-3 bottom-3 grid grid-cols-[1fr_auto] items-center gap-2 rounded-[8px] border border-white/10 bg-black/25 px-2 py-1.5 backdrop-blur-sm">
                        <span className="font-mono text-[0.52rem] font-semibold uppercase tracking-[0.13em] text-vault-paper/48">
                          Estimate read
                        </span>
                        <span className="font-mono text-[0.55rem] font-semibold uppercase tracking-[0.08em] text-vault-paper/72">
                          {formatEstimateRange(leadLot.estimatedRangeCents)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[9px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Lead lot
                    </p>
                    <p className="mt-2 truncate text-2xl font-semibold text-vault-paper">
                      {leadLot.title}
                    </p>
                  </div>
                  <div className="rounded-[9px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Lot book
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-vault-paper">
                      {formatCurrency(totalAuctionAsk)}
                    </p>
                  </div>
                  <div className="rounded-[9px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Scarcity mark
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-vault-paper">
                      {formatPopulation(scarceLot.population)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-[10px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/48">
                      Lot review rail
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-vault-paper">Session control</h2>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-[8px] border border-white/10 bg-white/[0.06] text-[#e0b56c]">
                    <CalendarClock className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="grid gap-3">
                  {reviewRail.map((step, index) => (
                    <div key={step.label} className="grid grid-cols-[auto_1fr] items-start gap-3">
                      <span
                        className={cn(
                          "grid h-8 w-8 place-items-center rounded-full border font-mono text-[0.62rem] font-semibold",
                          step.tone === "amber"
                            ? "border-[rgba(166,111,31,0.28)] bg-[rgba(166,111,31,0.12)] text-[#e0b56c]"
                            : step.tone === "green"
                              ? "border-[rgba(130,199,169,0.28)] bg-[rgba(47,113,88,0.12)] text-[#a7ddc4]"
                              : step.tone === "blue"
                                ? "border-[rgba(47,94,124,0.34)] bg-[rgba(47,94,124,0.14)] text-[#9bc2dc]"
                                : "border-white/12 bg-white/[0.06] text-vault-paper/72",
                        )}
                      >
                        {index + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-vault-paper">{step.label}</span>
                        <span className="mt-0.5 block text-xs leading-5 text-vault-paper/48">{step.detail}</span>
                      </span>
                    </div>
                  ))}
                </div>
                <div className="rounded-[8px] border border-white/10 bg-black/[0.12] p-3">
                  <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/48">
                    Locked room
                  </p>
                  <p className="mt-1 text-sm leading-6 text-vault-paper/62">
                    Auction participation is represented as a controlled access surface for review only.
                  </p>
                  <div className="mt-3">
                    <DisabledBidButton label="Bidding access required" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section aria-label="Auction summary" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            icon={CalendarClock}
            label="Upcoming lots"
            value={`${auctionLots.length}`}
            detail="Auction and premier inventory staged for review."
            fill={74}
          />
          <SummaryCard
            icon={ShieldCheck}
            label="Vault ready"
            value={`${vaultReadyLots.length}`}
            detail="Lots with custody already confirmed."
            fill={Math.max(12, Math.round((vaultReadyLots.length / auctionLots.length) * 100))}
          />
          <SummaryCard
            icon={TrendingUp}
            label="Lot book"
            value={formatCurrency(totalAuctionAsk)}
            detail="Ask value across the auction room."
            fill={88}
          />
          <SummaryCard
            icon={CircleDollarSign}
            label="Lead estimate"
            value={formatEstimateRange(leadLot.estimatedRangeCents)}
            detail={leadLot.title}
            fill={92}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] xl:items-start">
          <article className="auction-lot-spotlight rounded-[10px] border border-[rgba(166,111,31,0.18)] bg-[linear-gradient(180deg,rgba(255,254,249,0.9),rgba(249,248,243,0.72))] p-4 shadow-[var(--shadow-card)] xl:sticky xl:top-28">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-registry">
                  Presented lot
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-vault-ink">{leadLot.title}</h2>
                <p className="mt-2 text-sm leading-6 text-vault-steel">{leadLot.provenanceNotes}</p>
              </div>
              <DisabledBidButton label="Bidding access required" />
            </div>

            <dl className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
                <dt className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-vault-steel">
                  Estimate
                </dt>
                <dd className="mt-1 text-sm font-semibold text-vault-ink">
                  {formatEstimateRange(leadLot.estimatedRangeCents)}
                </dd>
              </div>
              <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
                <dt className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-vault-steel">
                  Scarcity
                </dt>
                <dd className="mt-1 text-sm font-semibold text-vault-ink">
                  {scarceLot.title} / {formatPopulation(scarceLot.population)}
                </dd>
              </div>
              <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
                <dt className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-vault-steel">
                  Condition desk
                </dt>
                <dd className="mt-1 text-sm font-semibold text-vault-ink">
                  {leadLot.inspectionHighlights[0]}
                </dd>
              </div>
            </dl>

            <div className="mt-4 rounded-[10px] border border-[rgba(166,111,31,0.16)] bg-[rgba(166,111,31,0.045)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)]">
              <div className="mb-2 flex items-center justify-between gap-3 px-1">
                <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[#744e18]">
                  Event room staging
                </span>
                <span className="rounded-full border border-[rgba(166,111,31,0.2)] bg-white/42 px-2 py-0.5 font-mono text-[0.56rem] font-semibold uppercase tracking-[0.12em] text-[#744e18]">
                  Access reviewed
                </span>
              </div>
              <SlabCard listing={leadLot} sourceHref="/auctions" />
            </div>
          </article>

          <section className="grid gap-5">
            <article className="rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-vault-ink">Premier session</h2>
                  <p className="mt-1 text-sm text-vault-steel">
                    Higher-value lots staged for specialist review.
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border-soft)] bg-white/44 px-3 py-1 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                  {sessionLots.premier.length} lots
                </span>
              </div>
              <ul className="mt-4 grid gap-3">
                {sessionLots.premier.map((listing, index) => (
                  <AuctionRow key={listing.id} listing={listing} index={index} />
                ))}
              </ul>
            </article>

            <article className="rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-vault-ink">Weekly auction candidates</h2>
                  <p className="mt-1 text-sm text-vault-steel">
                    Scarce graded cards prepared for auction-style review.
                  </p>
                </div>
                <span className="rounded-full border border-[var(--border-soft)] bg-white/44 px-3 py-1 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                  {sessionLots.weekly.length} lots
                </span>
              </div>
              <ul className="mt-4 grid gap-3">
                {sessionLots.weekly.map((listing, index) => (
                  <AuctionRow key={listing.id} listing={listing} index={index} />
                ))}
              </ul>
            </article>

            <article className="rounded-[10px] border border-[rgba(17,19,15,0.18)] bg-[rgba(17,19,15,0.9)] p-4 text-vault-paper shadow-[0_24px_70px_rgba(17,19,15,0.2)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/50">
                    Auction access gate
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-vault-paper">
                    Review surface only
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-vault-paper/62">
                    The auction room highlights lots, estimates, custody posture, and inspection paths without live participation controls.
                  </p>
                </div>
                <KeyRound className="h-5 w-5 shrink-0 text-[#e0b56c]" aria-hidden="true" />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/marketplace?type=auction"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-white/14 bg-vault-paper px-4 text-sm font-semibold text-vault-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Inspect auction lots
                </Link>
                <DisabledBidButton label="Bidding access required" />
              </div>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
