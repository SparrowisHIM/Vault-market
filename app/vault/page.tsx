import { ArrowUpRight, BadgeCheck, Box, LockKeyhole, PackageCheck, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { SlabCard } from "@/components/marketplace/slab-card";
import {
  formatCurrency,
  getVaultStatusLabel,
  getVerificationStatusLabel,
} from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";
import type { VaultListing } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Vault",
  description: "Preview VaultMarket portfolio custody and value tracking.",
};

const vaultAssets = mockListings.filter((listing) => listing.vaultStatus !== "seller_held");
const vaultHeldAssets = mockListings.filter((listing) => listing.vaultStatus === "vault_held");
const intakeAssets = mockListings.filter((listing) => listing.vaultStatus === "intake_pending");
const verifiedAssets = mockListings.filter(
  (listing) => listing.verificationStatus === "vault_verified",
);

const totalVaultValue = vaultAssets.reduce((total, listing) => total + listing.priceCents, 0);
const verifiedValue = verifiedAssets.reduce((total, listing) => total + listing.priceCents, 0);

const futureActions = [
  "Submit assets",
  "Request withdrawal",
  "List from vault",
];

const statusTone: Record<VaultListing["vaultStatus"], string> = {
  vault_held: "border-[rgba(47,113,88,0.28)] bg-[rgba(47,113,88,0.08)] text-[#235844]",
  intake_pending: "border-[rgba(166,111,31,0.3)] bg-[rgba(166,111,31,0.09)] text-[#744e18]",
  seller_held: "border-[rgba(17,19,15,0.14)] bg-[rgba(17,19,15,0.045)] text-vault-steel",
};

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof ShieldCheck;
}) {
  return (
    <div className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold text-vault-ink">{value}</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/40 text-vault-registry">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-sm leading-6 text-vault-steel">{detail}</p>
    </div>
  );
}

export default function VaultPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5">
        <header className="grid gap-4 border-b border-[var(--border-soft)] pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-vault-registry">
              VaultMarket / Portfolio preview
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-normal text-vault-ink sm:text-4xl">
              Vault custody and asset value desk
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-vault-steel sm:text-base">
              A mock portfolio view for vaulted and intake-pending graded cards, shaped by the
              trust, custody, and market-value patterns we liked from Alt, Goldin, PSA Vault,
              and Fanatics Collect.
            </p>
          </div>

          <div className="grid gap-2 rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] sm:grid-cols-3">
            {futureActions.map((action) => (
              <button
                key={action}
                type="button"
                aria-disabled="true"
                title={`${action} is coming later`}
                className="inline-flex h-10 items-center justify-center rounded-[6px] border border-[var(--border-soft)] bg-white/38 px-3 text-sm font-semibold text-vault-steel opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                {action}
              </button>
            ))}
          </div>
        </header>

        <section aria-label="Vault summary" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Vault value"
            value={formatCurrency(totalVaultValue)}
            detail="Mock ask value across vault-held and intake-pending assets."
            icon={LockKeyhole}
          />
          <StatCard
            label="Vault held"
            value={`${vaultHeldAssets.length}`}
            detail="Assets with simulated custody already confirmed."
            icon={PackageCheck}
          />
          <StatCard
            label="Intake"
            value={`${intakeAssets.length}`}
            detail="Assets awaiting final review before full vault status."
            icon={Box}
          />
          <StatCard
            label="Verified value"
            value={formatCurrency(verifiedValue)}
            detail="Value tied to vault-verified mock assets."
            icon={BadgeCheck}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
          <div className="grid gap-3">
            <div>
              <h2 className="text-lg font-semibold text-vault-ink">Vault assets</h2>
              <p className="mt-1 text-sm text-vault-steel">
                Compact asset cards from the existing mock inventory.
              </p>
            </div>
            <div className="grid gap-3">
              {vaultAssets.map((listing) => (
                <SlabCard key={listing.id} listing={listing} variant="compact" />
              ))}
            </div>
          </div>

          <aside className="grid gap-3 self-start">
            <section className="rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-4">
              <h2 className="text-lg font-semibold text-vault-ink">Custody ledger</h2>
              <p className="mt-1 text-sm leading-6 text-vault-steel">
                This is simulated with mock data. Real custody, insurance, intake,
                and withdrawal events will come after auth and backend work.
              </p>

              <div className="mt-4 grid gap-2">
                {vaultAssets.map((listing) => (
                  <Link
                    key={`${listing.id}-ledger`}
                    href={`/marketplace/${listing.slug}`}
                    className="grid gap-2 rounded-[7px] border border-[var(--border-soft)] bg-white/38 p-3 transition hover:bg-white/64 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-vault-ink">{listing.title}</p>
                        <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.12em] text-vault-steel">
                          {listing.gradingCompany} {listing.grade} / {listing.certNumber}
                        </p>
                      </div>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-vault-registry" aria-hidden="true" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={cn(
                          "rounded-[5px] border px-2 py-1 text-xs font-semibold",
                          statusTone[listing.vaultStatus],
                        )}
                      >
                        {getVaultStatusLabel(listing.vaultStatus)}
                      </span>
                      <span className="rounded-[5px] border border-[var(--border-soft)] bg-white/42 px-2 py-1 text-xs font-semibold text-vault-graphite">
                        {getVerificationStatusLabel(listing.verificationStatus)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
