import Link from "next/link";
import { ArrowUpRight, BadgeCheck, ScanLine, ShieldCheck } from "lucide-react";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { SlabArtImage } from "@/components/marketplace/slab-art-image";
import {
  formatCertNumber,
  formatCurrency,
  formatPopulation,
  getVaultStatusLabel,
  getVerificationStatusLabel,
} from "@/lib/marketplace/format";
import type { VaultListing } from "@/lib/marketplace/types";
import { buildListingHref } from "@/lib/navigation/listing-links";
import { cn } from "@/lib/utils";

const custodyTone: Record<VaultListing["vaultStatus"], string> = {
  vault_held: "border-[rgba(47,113,88,0.28)] bg-[rgba(47,113,88,0.08)] text-[#235844]",
  intake_pending: "border-[rgba(166,111,31,0.3)] bg-[rgba(166,111,31,0.09)] text-[#744e18]",
  seller_held: "border-[rgba(17,19,15,0.14)] bg-[rgba(17,19,15,0.045)] text-vault-steel",
};

type VaultAssetCardProps = {
  listing: VaultListing;
};

export function VaultAssetCard({ listing }: VaultAssetCardProps) {
  return (
    <article className="group relative overflow-hidden rounded-[10px] border border-[var(--border-soft)] bg-[rgba(249,248,243,0.82)] p-3 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(47,94,124,0.22)] hover:bg-[rgba(255,254,249,0.94)] hover:shadow-[var(--shadow-slab-hover)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(47,94,124,0.34),rgba(47,113,88,0.24),transparent)]"
        aria-hidden="true"
      />
      <div className="grid gap-3 md:grid-cols-[118px_minmax(0,1fr)]">
        <div className="grid gap-2">
          <div className="relative aspect-[5/7] overflow-hidden rounded-[8px] border border-[rgba(17,19,15,0.18)] bg-[var(--surface-inset)] shadow-[inset_0_1px_10px_rgba(17,19,15,0.08)]">
            <SlabArtImage
              image={listing.image}
              sizes="(min-width: 1024px) 118px, 38vw"
              className="transition duration-300 group-hover:scale-[1.025]"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18),transparent_36%,rgba(255,255,255,0.16)_45%,transparent_55%)] opacity-55"
              aria-hidden="true"
            />
          </div>
          <span
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-[6px] border px-2 py-1 text-xs font-semibold",
              custodyTone[listing.vaultStatus],
            )}
          >
            <span className="vault-status-pulse h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
            {getVaultStatusLabel(listing.vaultStatus)}
          </span>
        </div>

        <div className="grid min-w-0 gap-3">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-[6px] border border-[var(--border-soft)] bg-white/54 px-2.5 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                  {listing.year} / {listing.franchise}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-[6px] border border-[rgba(47,94,124,0.18)] bg-[rgba(47,94,124,0.07)] px-2.5 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#244f69]">
                  <BadgeCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  {getVerificationStatusLabel(listing.verificationStatus)}
                </span>
              </div>
              <h3 className="mt-2 text-xl font-semibold leading-tight text-vault-ink">
                {listing.title}
              </h3>
              <p className="mt-1 text-sm leading-5 text-vault-steel">
                {listing.setName}
                {listing.cardNumber ? ` / ${listing.cardNumber}` : ""}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 lg:min-w-52">
              <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/50 p-2.5">
                <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                  Grade
                </p>
                <p className="mt-1 text-lg font-semibold text-vault-ink">
                  {listing.gradingCompany} {listing.grade}
                </p>
              </div>
              <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/50 p-2.5">
                <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                  Cert
                </p>
                <p className="mt-1 font-mono text-sm font-semibold text-vault-graphite">
                  {formatCertNumber(listing.certNumber)}
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
              <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                Portfolio value
              </p>
              <p className="mt-1 text-2xl font-semibold text-vault-ink">
                {formatCurrency(listing.priceCents)}
              </p>
            </div>
            <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
              <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                Market signal
              </p>
              <div className="mt-2">
                <MarketDelta value={listing.marketDeltaPercent} compact />
              </div>
            </div>
            <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
              <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                Population
              </p>
              <p className="mt-1 text-lg font-semibold text-vault-ink">
                {formatPopulation(listing.population)}
              </p>
            </div>
          </div>

          <div className="grid gap-3 border-t border-[var(--border-soft)] pt-3 sm:grid-cols-[1fr_auto] sm:items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-vault-registry" aria-hidden="true" />
                <p className="truncate text-sm font-semibold text-vault-graphite">
                  {listing.seller.name}
                </p>
              </div>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-vault-steel">
                <ScanLine className="h-3.5 w-3.5" aria-hidden="true" />
                Custody record aligned to cert and market value.
              </p>
            </div>
            <Link
              href={buildListingHref(listing.slug, "/vault")}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[7px] border border-vault-graphite bg-vault-ink px-4 text-sm font-semibold text-vault-paper transition hover:-translate-y-0.5 hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
            >
              Inspect slab
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
