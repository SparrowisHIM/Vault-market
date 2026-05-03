import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgeCheck,
  Handshake,
  Landmark,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ListingTypeBadge } from "@/components/marketplace/listing-type-badge";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { SlabCard } from "@/components/marketplace/slab-card";
import {
  formatCurrency,
  formatEstimateRange,
  formatPopulation,
} from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";
import type { VaultListing } from "@/lib/marketplace/types";

export const metadata: Metadata = {
  title: "Private Desk",
  description: "Private sales and specialist advisory workflows on VaultMarket.",
};

const deskCandidates = mockListings
  .filter(
    (listing) =>
      listing.listingType === "premier" ||
      listing.priceCents >= 750000 ||
      (listing.population !== undefined && listing.population <= 100),
  )
  .sort((a, b) => b.priceCents - a.priceCents);
const leadCandidate = deskCandidates[0];
const deskValue = deskCandidates.reduce((total, listing) => total + listing.priceCents, 0);
const vaultReadyCandidates = deskCandidates.filter(
  (listing) => listing.vaultStatus === "vault_held",
);

const serviceTracks = [
  {
    label: "Private sale review",
    detail: "Route exceptional slabs to discreet buyer matching instead of open browse.",
    icon: Handshake,
  },
  {
    label: "Specialist valuation",
    detail: "Combine comps, population, estimate ranges, eye appeal, and custody posture.",
    icon: BadgeCheck,
  },
  {
    label: "Vault-backed transfer",
    detail: "Prepare high-trust custody paths for expensive cards before money moves.",
    icon: ShieldCheck,
  },
];

const deferredControls = [
  "Specialist access required",
  "Offer access required",
  "Desk messaging access required",
];

function DisabledDeskButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-disabled="true"
      title={`${label} requires private desk access.`}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-[var(--border-soft)] bg-white/34 px-4 text-sm font-semibold text-vault-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
    >
      <LockKeyhole className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function CandidateRow({ listing }: { listing: VaultListing }) {
  return (
    <li className="rounded-[8px] border border-[var(--border-soft)] bg-white/36 p-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <ListingTypeBadge type={listing.listingType} compact />
            <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              {listing.gradingCompany} {listing.grade} / {formatPopulation(listing.population)}
            </span>
          </div>
          <Link
            href={`/marketplace/${listing.slug}`}
            className="mt-2 block w-fit rounded-[5px] text-base font-semibold text-vault-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
          >
            {listing.title}
          </Link>
          <p className="mt-1 text-sm text-vault-steel">
            {listing.year} / {listing.franchise} / {listing.setName}
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

export default function PrivateDeskPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="grid gap-4 border-b border-[var(--border-soft)] pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-vault-registry">
              VaultMarket / Private desk
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-normal text-vault-ink sm:text-4xl">
              Discreet review for rare, expensive, or relationship-led deals
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-vault-steel sm:text-base">
              A high-touch desk for cards that need specialist context, vault
              confidence, and discreet buyer matching.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/marketplace/${leadCandidate.slug}`}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-vault-graphite bg-vault-ink px-4 text-sm font-semibold text-vault-paper transition hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Inspect lead card
            </Link>
            <DisabledDeskButton label="Desk access required" />
          </div>
        </header>

        <section
          aria-label="Private desk summary"
          className="grid gap-3 md:grid-cols-3"
        >
          <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <Landmark className="h-5 w-5 text-vault-registry" aria-hidden="true" />
            <p className="mt-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              Desk candidates
            </p>
            <p className="mt-1 text-2xl font-semibold text-vault-ink">
              {deskCandidates.length}
            </p>
          </div>
          <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <ShieldCheck className="h-5 w-5 text-vault-registry" aria-hidden="true" />
            <p className="mt-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              Vault ready
            </p>
            <p className="mt-1 text-2xl font-semibold text-vault-ink">
              {vaultReadyCandidates.length}
            </p>
          </div>
          <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <Handshake className="h-5 w-5 text-vault-registry" aria-hidden="true" />
            <p className="mt-3 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
              Desk book
            </p>
            <p className="mt-1 text-2xl font-semibold text-vault-ink">
              {formatCurrency(deskValue)}
            </p>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)]">
          <article className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-registry">
                  Lead desk candidate
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-normal text-vault-ink">
                  {leadCandidate.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-vault-steel">
                  {leadCandidate.provenanceNotes}
                </p>
              </div>
              <DisabledDeskButton label="Specialist access required" />
            </div>

            <dl className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/38 p-3">
                <dt className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-vault-steel">
                  Desk range
                </dt>
                <dd className="mt-1 text-sm font-semibold text-vault-ink">
                  {formatEstimateRange(leadCandidate.estimatedRangeCents)}
                </dd>
              </div>
              <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/38 p-3">
                <dt className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-vault-steel">
                  Rarity
                </dt>
                <dd className="mt-1 text-sm font-semibold text-vault-ink">
                  {formatPopulation(leadCandidate.population)}
                </dd>
              </div>
              <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/38 p-3">
                <dt className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-vault-steel">
                  Trust posture
                </dt>
                <dd className="mt-1 text-sm font-semibold text-vault-ink">
                  {leadCandidate.seller.name}
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              <SlabCard listing={leadCandidate} />
            </div>
          </article>

          <section className="grid gap-5">
            <article className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-normal text-vault-ink">
                    Specialist tracks
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-vault-steel">
                    The private desk coordinates specialist review, discreet buyer
                    matching, and vault-backed transfer paths.
                  </p>
                </div>
                <MessageSquareText
                  className="h-5 w-5 shrink-0 text-vault-registry"
                  aria-hidden="true"
                />
              </div>

              <ul className="mt-4 grid gap-3">
                {serviceTracks.map((track) => {
                  const Icon = track.icon;

                  return (
                    <li
                      key={track.label}
                      className="grid grid-cols-[auto_1fr] gap-3 rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-3"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/48 text-vault-registry">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-semibold text-vault-ink">{track.label}</p>
                        <p className="mt-1 text-sm leading-5 text-vault-steel">
                          {track.detail}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </article>

            <article className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold tracking-normal text-vault-ink">
                    Desk candidate queue
                  </h2>
                  <p className="mt-1 text-sm text-vault-steel">
                    High-value, premier, or scarce listings selected for private desk review.
                  </p>
                </div>
                <span className="w-fit rounded-full border border-[var(--border-soft)] bg-white/44 px-3 py-1 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                  Desk queue
                </span>
              </div>

              <ul className="mt-4 grid gap-3">
                {deskCandidates.map((listing) => (
                  <CandidateRow key={listing.id} listing={listing} />
                ))}
              </ul>
            </article>
          </section>
        </section>

        <section
          aria-label="Private desk actions"
          className="grid gap-2 rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-2 shadow-[var(--shadow-card)] sm:grid-cols-3"
        >
          {deferredControls.map((control) => (
            <DisabledDeskButton key={control} label={control} />
          ))}
        </section>
      </div>
    </main>
  );
}
