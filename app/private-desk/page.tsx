import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Handshake,
  KeyRound,
  Landmark,
  LockKeyhole,
  MessageSquareText,
  ShieldCheck,
  UserRoundCheck,
} from "lucide-react";
import { ListingTypeBadge } from "@/components/marketplace/listing-type-badge";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { SlabCard } from "@/components/marketplace/slab-card";
import { SpecialistReviewHandoff } from "@/components/private-desk/specialist-review-handoff";
import {
  formatCurrency,
  formatEstimateRange,
  formatPopulation,
  getVaultStatusLabel,
} from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";
import type { VaultListing } from "@/lib/marketplace/types";
import { buildListingHref } from "@/lib/navigation/listing-links";
import { cn } from "@/lib/utils";

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
const specialistTicket = `VM-SR-${leadCandidate.certNumber.replace(/\D/g, "").slice(-4)}`;

const serviceTracks = [
  {
    label: "Specialist valuation",
    detail: "Comps, population, estimate range, eye appeal, and custody posture are reviewed together.",
    icon: BadgeCheck,
  },
  {
    label: "Discreet buyer matching",
    detail: "Exceptional slabs are positioned for relationship-led review instead of open browse pressure.",
    icon: Handshake,
  },
  {
    label: "Vault-backed transfer",
    detail: "High-value cards can route through custody confidence before any transfer path.",
    icon: ShieldCheck,
  },
];

const lockedControls = [
  "Specialist access required",
  "Offer access required",
  "Desk message access required",
];

const reviewPath = [
  {
    label: "Candidate intake",
    detail: `${deskCandidates.length} high-value cards`,
    tone: "blue",
  },
  {
    label: "Valuation desk",
    detail: formatEstimateRange(leadCandidate.estimatedRangeCents),
    tone: "amber",
  },
  {
    label: "Custody posture",
    detail: `${vaultReadyCandidates.length} vault ready`,
    tone: "green",
  },
  {
    label: "Specialist ticket",
    detail: specialistTicket,
    tone: "dark",
  },
];

function DisabledDeskButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      aria-disabled="true"
      title={`${label} requires private desk access.`}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-[var(--border-soft)] bg-white/34 px-4 text-sm font-semibold text-vault-steel transition hover:bg-white/48 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
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
  icon: typeof Landmark;
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
          className="h-full rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.38),rgba(47,113,88,0.5),rgba(166,111,31,0.34))]"
          style={{ width: `${fill}%` }}
        />
      </div>
      <p className="mt-3 text-sm leading-5 text-vault-steel">{detail}</p>
    </div>
  );
}

function CandidateCard({ listing, index }: { listing: VaultListing; index: number }) {
  return (
    <li>
      <Link
        href={buildListingHref(listing.slug, "/private-desk")}
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
                {listing.gradingCompany} {listing.grade} / {formatPopulation(listing.population)}
              </span>
            </div>
            <p className="mt-2 text-base font-semibold text-vault-ink">{listing.title}</p>
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
        <div className="grid gap-2 sm:grid-cols-[1fr_auto] sm:items-center">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                Specialist fit
              </span>
              <span className="font-mono text-[0.62rem] font-semibold text-vault-graphite">
                {getVaultStatusLabel(listing.vaultStatus)}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[rgba(17,19,15,0.07)]" aria-hidden="true">
              <div
                className={cn(
                  "h-full rounded-full",
                  listing.vaultStatus === "vault_held"
                    ? "bg-[linear-gradient(90deg,rgba(47,113,88,0.4),rgba(47,94,124,0.58))]"
                    : "bg-[linear-gradient(90deg,rgba(166,111,31,0.42),rgba(47,94,124,0.48))]",
                )}
                style={{
                  width:
                    listing.vaultStatus === "vault_held"
                      ? "92%"
                      : listing.listingType === "premier"
                        ? "78%"
                        : "62%",
                }}
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

export default function PrivateDeskPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="overflow-hidden rounded-[12px] border border-[rgba(17,19,15,0.22)] shadow-[0_22px_70px_rgba(17,19,15,0.14)]">
          <div className="private-desk-console relative overflow-hidden bg-[linear-gradient(135deg,rgba(13,15,12,0.98)_0%,rgba(25,27,30,0.99)_50%,rgba(13,15,12,0.98)_100%)] text-vault-paper">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(244,241,233,0.03)_1px,transparent_1px),linear-gradient(rgba(244,241,233,0.024)_1px,transparent_1px)] bg-[length:44px_44px]" />
            <div className="private-desk-sweep pointer-events-none absolute inset-0" />
            <div className="relative grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.43fr)] lg:items-stretch">
              <div className="grid min-h-[23rem] gap-5 rounded-[10px] border border-white/10 bg-black/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5">
                    <Landmark className="h-4 w-4 text-[#9bc2dc]" aria-hidden="true" />
                    <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-vault-paper/62">
                      VaultMarket / Private desk
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(155,194,220,0.24)] bg-[rgba(47,94,124,0.14)] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#9bc2dc]">
                    <span className="private-desk-pulse h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                    Specialist queue
                  </span>
                </div>

                <div>
                  <h1 className="max-w-3xl text-3xl font-semibold leading-[1.03] text-vault-paper sm:text-5xl">
                    Discreet specialist review for rare, expensive, relationship-led deals
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-vault-paper/64 sm:text-[0.95rem]">
                    A high-touch desk for cards that need specialist context, vault
                    confidence, and discreet buyer matching.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[9px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Lead candidate
                    </p>
                    <p className="mt-2 truncate text-2xl font-semibold text-vault-paper">
                      {leadCandidate.title}
                    </p>
                  </div>
                  <div className="rounded-[9px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Desk book
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-vault-paper">
                      {formatCurrency(deskValue)}
                    </p>
                  </div>
                  <div className="rounded-[9px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Specialist ticket
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-vault-paper">
                      {specialistTicket}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-[10px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/48">
                      Discreet review path
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-vault-paper">Specialist control</h2>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-[8px] border border-white/10 bg-white/[0.06] text-[#9bc2dc]">
                    <UserRoundCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="grid gap-3">
                  {reviewPath.map((step, index) => (
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
                    Locked desk module
                  </p>
                  <p className="mt-1 text-sm leading-6 text-vault-paper/62">
                    Specialist review access is presented as a controlled desk action tied to listing inspection.
                  </p>
                  <div className="mt-3">
                    <DisabledDeskButton label="Specialist access required" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section aria-label="Private desk summary" className="grid gap-3 md:grid-cols-3">
          <SummaryCard
            icon={Landmark}
            label="Desk candidates"
            value={`${deskCandidates.length}`}
            detail="Rare, premier, or high-value cards selected for specialist review."
            fill={82}
          />
          <SummaryCard
            icon={ShieldCheck}
            label="Vault ready"
            value={`${vaultReadyCandidates.length}`}
            detail="Candidates with custody status already confirmed."
            fill={Math.max(12, Math.round((vaultReadyCandidates.length / deskCandidates.length) * 100))}
          />
          <SummaryCard
            icon={Handshake}
            label="Desk book"
            value={formatCurrency(deskValue)}
            detail="Value represented in the private desk queue."
            fill={92}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] xl:items-start">
          <article className="private-desk-spotlight rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)] xl:sticky xl:top-28">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-registry">
                  Lead desk candidate
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-vault-ink">{leadCandidate.title}</h2>
                <p className="mt-2 text-sm leading-6 text-vault-steel">
                  {leadCandidate.provenanceNotes}
                </p>
              </div>
              <SpecialistReviewHandoff ticketId={specialistTicket} />
            </div>

            <dl className="mt-4 grid gap-2 sm:grid-cols-3">
              <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
                <dt className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-vault-steel">
                  Valuation range
                </dt>
                <dd className="mt-1 text-sm font-semibold text-vault-ink">
                  {formatEstimateRange(leadCandidate.estimatedRangeCents)}
                </dd>
              </div>
              <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
                <dt className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-vault-steel">
                  Rarity
                </dt>
                <dd className="mt-1 text-sm font-semibold text-vault-ink">
                  {formatPopulation(leadCandidate.population)}
                </dd>
              </div>
              <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
                <dt className="font-mono text-[0.63rem] font-semibold uppercase tracking-[0.13em] text-vault-steel">
                  Transfer path
                </dt>
                <dd className="mt-1 text-sm font-semibold text-vault-ink">
                  {getVaultStatusLabel(leadCandidate.vaultStatus)}
                </dd>
              </div>
            </dl>

            <div className="mt-4">
              <SlabCard listing={leadCandidate} sourceHref="/private-desk" />
            </div>
          </article>

          <section className="grid gap-5">
            <article className="rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
                    Valuation desk panel
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-vault-ink">Specialist tracks</h2>
                  <p className="mt-1 text-sm leading-6 text-vault-steel">
                    Private desk review coordinates valuation, discreet buyer matching, and vault-backed transfer paths.
                  </p>
                </div>
                <MessageSquareText className="h-5 w-5 shrink-0 text-vault-registry" aria-hidden="true" />
              </div>

              <ul className="mt-4 grid gap-3">
                {serviceTracks.map((track, index) => {
                  const Icon = track.icon;

                  return (
                    <li
                      key={track.label}
                      className="grid grid-cols-[auto_1fr] gap-3 rounded-[9px] border border-[var(--border-soft)] bg-white/[0.42] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.64)]"
                    >
                      <span className="grid h-9 w-9 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/56 text-vault-registry">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-vault-ink">{track.label}</p>
                          <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                            {index + 1}/3
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-vault-steel">{track.detail}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </article>

            <article className="rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
                    Specialist queue
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-vault-ink">Desk candidate queue</h2>
                  <p className="mt-1 text-sm text-vault-steel">
                    High-value, premier, or scarce listings selected for private desk review.
                  </p>
                </div>
                <span className="w-fit rounded-full border border-[var(--border-soft)] bg-white/50 px-3 py-1 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                  {deskCandidates.length} cards
                </span>
              </div>

              <ul className="mt-4 grid gap-3">
                {deskCandidates.map((listing, index) => (
                  <CandidateCard key={listing.id} listing={listing} index={index} />
                ))}
              </ul>
            </article>

            <article className="rounded-[10px] border border-[rgba(17,19,15,0.18)] bg-[rgba(17,19,15,0.9)] p-4 text-vault-paper shadow-[0_24px_70px_rgba(17,19,15,0.2)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/50">
                    Locked desk modules
                  </p>
                  <h2 className="mt-1 text-lg font-semibold text-vault-paper">
                    High-touch access controls
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-vault-paper/62">
                    Specialist review, offer handling, and desk communication stay presented as private access surfaces.
                  </p>
                </div>
                <KeyRound className="h-5 w-5 shrink-0 text-[#9bc2dc]" aria-hidden="true" />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {lockedControls.map((control) => (
                  <DisabledDeskButton key={control} label={control} />
                ))}
              </div>
            </article>
          </section>
        </section>
      </div>
    </main>
  );
}
