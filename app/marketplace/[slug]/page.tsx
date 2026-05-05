import {
  BadgeCheck,
  ClipboardCheck,
  Landmark,
  ScanLine,
  ShieldCheck,
  TrendingUp,
  Warehouse,
} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GradeBadge } from "@/components/marketplace/grade-badge";
import { InspectionRoomHero } from "@/components/marketplace/inspection-room-hero";
import { ListingTypeBadge } from "@/components/marketplace/listing-type-badge";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { SellerTrustBadge } from "@/components/marketplace/seller-trust-badge";
import { SlabCard } from "@/components/marketplace/slab-card";
import { SmartBackButton } from "@/components/site/smart-back-button";
import {
  formatCertNumber,
  formatCurrency,
  formatEstimateRange,
  formatPopulation,
  getEyeAppealLabel,
  getVaultStatusLabel,
  getVerificationStatusLabel,
} from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";
import { getListingBackLabel, getListingBackTarget, getSafeInternalPath } from "@/lib/navigation/listing-links";
import { cn } from "@/lib/utils";

type ListingDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams?: Promise<{
    from?: string | string[];
  }>;
};

const statusStyles = {
  active: "border-[rgba(47,113,88,0.28)] text-[#235844]",
  reserved: "border-[rgba(166,111,31,0.32)] text-[#744e18]",
  sold: "border-[rgba(17,19,15,0.18)] text-vault-steel",
};

function DecisionChip({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof BadgeCheck;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.62)]">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 shrink-0 text-vault-registry" aria-hidden="true" />
        <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
          {label}
        </p>
      </div>
      <p className="mt-1 truncate text-sm font-semibold text-vault-ink">{value}</p>
    </div>
  );
}

function findListing(slug: string) {
  return mockListings.find((listing) => listing.slug === slug);
}

export function generateStaticParams() {
  return mockListings.map((listing) => ({
    slug: listing.slug,
  }));
}

export async function generateMetadata({
  params,
}: ListingDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const listing = findListing(slug);

  if (!listing) {
    return {
      title: "Listing Not Found",
    };
  }

  return {
    title: `${listing.title} ${listing.gradingCompany} ${listing.grade}`,
    description: `Inspect ${listing.year} ${listing.setName} ${listing.title}, cert ${listing.certNumber}, on VaultMarket.`,
  };
}

export default async function ListingDetailPage({
  params,
  searchParams,
}: ListingDetailPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const listing = findListing(slug);

  if (!listing) {
    notFound();
  }

  const relatedListings = mockListings
    .filter(
      (item) =>
        item.id !== listing.id &&
        (item.franchise === listing.franchise ||
          item.gradingCompany === listing.gradingCompany),
    )
    .slice(0, 2);
  const sourcePath = getSafeInternalPath(resolvedSearchParams?.from);
  const backTarget = getListingBackTarget(sourcePath);
  const backLabel = getListingBackLabel(backTarget);

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5">
        <SmartBackButton
          fallbackHref={backTarget}
          preferFallback={Boolean(sourcePath)}
          className="inline-flex w-fit items-center gap-2 rounded-[6px] border border-[var(--border-soft)] bg-white/46 px-3 py-2 text-sm font-semibold text-vault-graphite transition hover:bg-white/78 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
        >
          {backLabel}
        </SmartBackButton>

        <section className="grid gap-5 lg:grid-cols-[minmax(320px,0.78fr)_minmax(0,1fr)]">
          <InspectionRoomHero listing={listing} />

          <div className="grid gap-4">
            <header className="relative overflow-hidden rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] sm:p-5">
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(47,94,124,0.45),transparent)]"
                aria-hidden="true"
              />
              <div className="grid gap-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-vault-registry">
                      Inspection dossier / {listing.year} / {listing.franchise}
                    </p>
                    <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight text-vault-ink sm:text-4xl">
                      {listing.title}
                    </h1>
                    <p className="mt-2 text-sm font-medium text-vault-steel">
                      {listing.setName}
                      {listing.cardNumber ? ` / ${listing.cardNumber}` : ""}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "rounded-full border bg-white/38 px-3 py-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em]",
                      statusStyles[listing.status],
                    )}
                  >
                    {listing.status}
                  </span>
                </div>

                <div className="grid gap-3 rounded-[9px] border border-[var(--border-soft)] bg-white/28 p-3 lg:grid-cols-[auto_1fr] lg:items-center">
                  <div className="flex flex-wrap items-center gap-3">
                    <GradeBadge company={listing.gradingCompany} grade={listing.grade} />
                    <ListingTypeBadge type={listing.listingType} />
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    <DecisionChip
                      icon={ClipboardCheck}
                      label="Cert visible"
                      value={formatCertNumber(listing.certNumber)}
                    />
                    <DecisionChip
                      icon={Warehouse}
                      label="Custody"
                      value={getVaultStatusLabel(listing.vaultStatus)}
                    />
                    <DecisionChip
                      icon={ShieldCheck}
                      label="Seller trust"
                      value={`${listing.seller.completedSales} sales`}
                    />
                    <DecisionChip
                      icon={BadgeCheck}
                      label="Notes"
                      value={`${listing.inspectionHighlights.length} inspection notes`}
                    />
                  </div>
                </div>
              </div>
            </header>

            <section
              aria-labelledby="market-context-heading"
              className="overflow-hidden rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-card)]"
            >
              <div className="border-b border-[var(--border-soft)] bg-[linear-gradient(90deg,rgba(47,94,124,0.08),rgba(47,113,88,0.04),transparent)] px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
                      Decision strip
                    </p>
                    <h2 id="market-context-heading" className="mt-1 text-lg font-semibold text-vault-ink">
                      Price, comp, and scarcity read
                    </h2>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-soft)] bg-white/44 px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                    <TrendingUp className="h-3.5 w-3.5 text-vault-registry" aria-hidden="true" />
                    Evaluation ready
                  </span>
                </div>
              </div>

              <div className="grid gap-2 p-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/44 p-4">
                  <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-vault-registry">
                    Current ask
                  </p>
                  <p className="mt-2 text-3xl font-semibold tabular-nums text-vault-ink">
                    {formatCurrency(listing.priceCents)}
                  </p>
                </div>
                <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/44 p-4">
                  <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                    Desk estimate
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-vault-ink">
                    {formatEstimateRange(listing.estimatedRangeCents)}
                  </p>
                </div>
                <div className="rounded-[8px] border border-[rgba(17,19,15,0.2)] bg-[rgba(17,19,15,0.9)] p-4 text-vault-paper shadow-[0_18px_46px_rgba(17,19,15,0.16)]">
                  <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/60">
                    Market context
                  </p>
                  <div className="mt-2">
                    <MarketDelta value={listing.marketDeltaPercent} />
                  </div>
                  <p className="mt-2 text-sm font-medium text-vault-paper/78">
                    Last comp{" "}
                    {listing.lastCompCents
                      ? formatCurrency(listing.lastCompCents)
                      : "pending"}
                  </p>
                </div>
                <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/44 p-4">
                  <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                    Population
                  </p>
                  <p className="mt-2 text-xl font-semibold tabular-nums text-vault-ink">
                    {formatPopulation(listing.population)}
                  </p>
                </div>
              </div>
            </section>

            <section
              aria-labelledby="vault-verification-heading"
              className="rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2
                    id="vault-verification-heading"
                    className="text-lg font-semibold text-vault-ink"
                  >
                    Vault & verification
                  </h2>
                  <p className="mt-1 text-sm text-vault-steel">
                    Custody, review state, and presentation signals for this lot.
                  </p>
                </div>
                <p className="rounded-[6px] border border-[var(--border-soft)] bg-white/42 px-3 py-2 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-vault-graphite">
                  {getEyeAppealLabel(listing.eyeAppeal)}
                </p>
              </div>

              <div className="mt-4 rounded-[9px] border border-[var(--border-soft)] bg-[rgba(17,19,15,0.88)] p-3 text-vault-paper shadow-[0_18px_44px_rgba(17,19,15,0.14)]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/50">
                      Review readiness rail
                    </p>
                    <p className="mt-1 text-sm font-semibold text-vault-paper">
                      Identity, price, custody, and trust are aligned for desk review.
                    </p>
                  </div>
                  <Landmark className="h-5 w-5 text-[#9bc2dc]" aria-hidden="true" />
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-4">
                  {[
                    ["01", "Slab identity", `${listing.gradingCompany} ${listing.grade}`],
                    ["02", "Price range", formatEstimateRange(listing.estimatedRangeCents)],
                    ["03", "Custody", getVaultStatusLabel(listing.vaultStatus)],
                    ["04", "Trust", `${listing.seller.completedSales} sales`],
                  ].map(([step, label, value]) => (
                    <div
                      key={label}
                      className="rounded-[7px] border border-white/10 bg-white/[0.055] p-2.5"
                    >
                      <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/42">
                        {step} / {label}
                      </p>
                      <p className="mt-1 truncate text-xs font-semibold text-vault-paper/82">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/40 p-3">
                  <Warehouse className="h-4 w-4 text-vault-registry" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-vault-graphite">
                    {getVaultStatusLabel(listing.vaultStatus)}
                  </p>
                </div>
                <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/40 p-3">
                  <ClipboardCheck className="h-4 w-4 text-vault-verified" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-vault-graphite">
                    {getVerificationStatusLabel(listing.verificationStatus)}
                  </p>
                </div>
                <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/40 p-3">
                  <BadgeCheck className="h-4 w-4 text-vault-amber" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-vault-graphite">
                    {listing.inspectionHighlights.length} inspection notes
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
                {listing.provenanceNotes && (
                  <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-3">
                    <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                      Provenance notes
                    </p>
                    <p className="mt-2 text-sm leading-6 text-vault-graphite">
                      {listing.provenanceNotes}
                    </p>
                  </div>
                )}
                <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-3">
                  <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                    Inspection highlights
                  </p>
                  <ul className="mt-2 grid gap-2">
                    {listing.inspectionHighlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-sm text-vault-graphite">
                        <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-vault-verified" aria-hidden="true" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section
              aria-labelledby="seller-trust-heading"
              className="rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[var(--shadow-card)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 id="seller-trust-heading" className="text-lg font-semibold text-vault-ink">
                    Seller trust
                  </h2>
                  <p className="mt-1 text-sm text-vault-steel">
                    {listing.seller.name} / {listing.seller.location}
                  </p>
                </div>
                <SellerTrustBadge
                  tier={listing.seller.trustTier}
                  completedSales={listing.seller.completedSales}
                />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/40 p-3">
                  <BadgeCheck className="h-4 w-4 text-vault-registry" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-vault-graphite">
                    Cert visible
                  </p>
                </div>
                <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/40 p-3">
                  <ShieldCheck className="h-4 w-4 text-vault-verified" aria-hidden="true" />
                  <p className="mt-2 text-sm font-semibold text-vault-graphite">
                    Seller checked
                  </p>
                </div>
                <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/40 p-3">
                  <p className="font-mono text-xl font-semibold text-vault-ink">
                    {listing.seller.completedSales}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-vault-graphite">
                    Completed sales
                  </p>
                </div>
              </div>
              <div className="mt-4 rounded-[9px] border border-[rgba(47,94,124,0.18)] bg-[linear-gradient(90deg,rgba(47,94,124,0.08),rgba(47,113,88,0.05))] p-3">
                <div className="flex items-start gap-3">
                  <ScanLine className="mt-0.5 h-5 w-5 shrink-0 text-vault-registry" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-vault-ink">
                      Trust clears the path to specialist review
                    </p>
                    <p className="mt-1 text-sm leading-6 text-vault-steel">
                      Seller history, cert visibility, and custody status are ready for
                      the private desk context in the slab panel.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </section>

        {relatedListings.length > 0 && (
          <section
            aria-labelledby="related-listings-heading"
            className="grid gap-3 border-t border-[var(--border-soft)] pt-5"
          >
            <div>
              <h2 id="related-listings-heading" className="text-lg font-semibold text-vault-ink">
                Related slabs
              </h2>
              <p className="mt-1 text-sm text-vault-steel">
                Same franchise or grader from the current market set.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
              {relatedListings.map((item) => (
                <SlabCard
                  key={item.id}
                  listing={item}
                  variant="compact"
                  sourceHref={backTarget}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
