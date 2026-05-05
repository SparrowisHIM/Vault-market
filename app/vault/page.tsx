import {
  ArrowUpRight,
  BadgeCheck,
  Box,
  CircuitBoard,
  KeyRound,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
  Vault,
  Waves,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { VaultAssetCard } from "@/components/vault/vault-asset-card";
import {
  formatCurrency,
  getVaultStatusLabel,
  getVerificationStatusLabel,
} from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";
import type { VaultListing } from "@/lib/marketplace/types";
import { buildListingHref } from "@/lib/navigation/listing-links";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Vault",
  description: "Track VaultMarket portfolio custody and value for graded trading cards.",
};

const vaultAssets = mockListings.filter((listing) => listing.vaultStatus !== "seller_held");
const vaultHeldAssets = mockListings.filter((listing) => listing.vaultStatus === "vault_held");
const intakeAssets = mockListings.filter((listing) => listing.vaultStatus === "intake_pending");
const verifiedAssets = mockListings.filter(
  (listing) => listing.verificationStatus === "vault_verified",
);

const totalVaultValue = vaultAssets.reduce((total, listing) => total + listing.priceCents, 0);
const verifiedValue = verifiedAssets.reduce((total, listing) => total + listing.priceCents, 0);
const intakeValue = intakeAssets.reduce((total, listing) => total + listing.priceCents, 0);
const custodyCoverage = vaultAssets.length
  ? Math.round((verifiedAssets.length / vaultAssets.length) * 100)
  : 0;
const intakeProgress = vaultAssets.length
  ? Math.round((vaultHeldAssets.length / vaultAssets.length) * 100)
  : 0;

const futureActions = ["Submit assets", "Request withdrawal", "List from vault"];

const statusTone: Record<VaultListing["vaultStatus"], string> = {
  vault_held: "border-[rgba(47,113,88,0.28)] bg-[rgba(47,113,88,0.08)] text-[#235844]",
  intake_pending: "border-[rgba(166,111,31,0.3)] bg-[rgba(166,111,31,0.09)] text-[#744e18]",
  seller_held: "border-[rgba(17,19,15,0.14)] bg-[rgba(17,19,15,0.045)] text-vault-steel",
};

const timelineSteps = [
  {
    label: "Intake scan",
    value: `${intakeAssets.length}`,
    detail: "Assets in review",
    tone: "amber",
  },
  {
    label: "Custody lock",
    value: `${vaultHeldAssets.length}`,
    detail: "Assets held",
    tone: "green",
  },
  {
    label: "Verification",
    value: `${verifiedAssets.length}`,
    detail: "Assets cleared",
    tone: "blue",
  },
  {
    label: "Portfolio value",
    value: formatCurrency(totalVaultValue),
    detail: "Desk exposure",
    tone: "dark",
  },
];

function metricPercent(value: number, total: number) {
  if (total <= 0) return 8;
  return Math.min(100, Math.max(8, Math.round((value / total) * 100)));
}

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  bandPercent,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof ShieldCheck;
  bandPercent: number;
}) {
  const ticks = Array.from({ length: 10 }, (_, index) => index);

  return (
    <div className="group relative overflow-hidden rounded-[10px] border border-[rgba(17,19,15,0.12)] bg-[rgba(249,248,243,0.82)] p-4 shadow-[var(--shadow-slab)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(47,94,124,0.22)] hover:bg-[rgba(255,254,249,0.92)] hover:shadow-[var(--shadow-slab-hover)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(47,94,124,0.34),rgba(47,113,88,0.25),transparent)]" />
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
            {label}
          </p>
          <p className="mt-2 text-2xl font-semibold leading-none text-vault-ink">{value}</p>
        </div>
        <span className="grid h-9 w-9 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/56 text-vault-registry">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4 flex items-end gap-1" aria-hidden="true">
        {ticks.map((tick) => {
          const active = (tick + 1) * 10 <= bandPercent;
          return (
            <span
              key={tick}
              className={cn(
                "flex-1 rounded-[2px]",
                active
                  ? "h-5 bg-[linear-gradient(180deg,rgba(47,113,88,0.58),rgba(47,94,124,0.32))]"
                  : "h-3 bg-[rgba(17,19,15,0.075)]",
              )}
            />
          );
        })}
      </div>
      <p className="mt-3 text-sm leading-6 text-vault-steel">{detail}</p>
    </div>
  );
}

function CustodyPill({ listing }: { listing: VaultListing }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        statusTone[listing.vaultStatus],
      )}
    >
      <span className="vault-status-pulse h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {getVaultStatusLabel(listing.vaultStatus)}
    </span>
  );
}

export default function VaultPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto grid w-full max-w-7xl gap-5">
        <header className="overflow-hidden rounded-[12px] border border-[rgba(17,19,15,0.22)] shadow-[0_22px_70px_rgba(17,19,15,0.14)]">
          <div className="vault-custody-console relative overflow-hidden bg-[linear-gradient(135deg,rgba(13,15,12,0.98)_0%,rgba(25,29,24,0.99)_52%,rgba(12,14,11,0.98)_100%)] text-vault-paper">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(244,241,233,0.033)_1px,transparent_1px),linear-gradient(rgba(244,241,233,0.026)_1px,transparent_1px)] bg-[length:46px_46px]" />
            <div className="vault-custody-sweep pointer-events-none absolute inset-0" />
            <div className="relative grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.42fr)] lg:items-stretch">
              <div className="grid min-h-[23rem] gap-5 rounded-[10px] border border-white/10 bg-black/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5">
                    <Vault className="h-4 w-4 text-[#a7ddc4]" aria-hidden="true" />
                    <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-vault-paper/62">
                      VaultMarket / Custody desk
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(130,199,169,0.22)] bg-[rgba(47,113,88,0.1)] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#a7ddc4]">
                    <span className="vault-status-pulse h-1.5 w-1.5 rounded-full bg-[#82c7a9]" />
                    Custody aligned
                  </span>
                </div>

                <div>
                  <h1 className="max-w-3xl text-3xl font-semibold leading-[1.03] text-vault-paper sm:text-5xl">
                    Vault custody and asset value desk
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-relaxed text-vault-paper/64 sm:text-[0.95rem]">
                    A custody and portfolio desk for vaulted and intake-pending graded cards,
                    shaped around trust, custody, and market-value context.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-[9px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Portfolio value
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-vault-paper">
                      {formatCurrency(totalVaultValue)}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
                      <div className="h-full w-[86%] rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.58),rgba(130,199,169,0.72))]" />
                    </div>
                  </div>
                  <div className="rounded-[9px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Intake value
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-vault-paper">
                      {formatCurrency(intakeValue)}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,rgba(166,111,31,0.45),rgba(47,94,124,0.52))]"
                        style={{ width: `${metricPercent(intakeValue, totalVaultValue)}%` }}
                      />
                    </div>
                  </div>
                  <div className="rounded-[9px] border border-white/10 bg-white/[0.05] p-3">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Coverage
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-vault-paper">{custodyCoverage}%</p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
                      <div
                        className="h-full rounded-full bg-[linear-gradient(90deg,rgba(47,113,88,0.5),rgba(130,199,169,0.72))]"
                        style={{ width: `${custodyCoverage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 rounded-[10px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/48">
                      Intake rail
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-vault-paper">Custody movement</h2>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-[8px] border border-white/10 bg-white/[0.06] text-[#a7ddc4]">
                    <CircuitBoard className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="grid gap-3">
                  {timelineSteps.map((step, index) => (
                    <div key={step.label} className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
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
                        <span className="mt-0.5 block text-xs text-vault-paper/48">{step.detail}</span>
                      </span>
                      <span className="font-mono text-sm font-semibold text-vault-paper">{step.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-1 rounded-[8px] border border-white/10 bg-black/[0.12] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/48">
                      Intake progress
                    </span>
                    <span className="font-mono text-xs font-semibold text-[#a7ddc4]">{intakeProgress}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
                    <div
                      className="vault-progress-flow h-full rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.55),rgba(130,199,169,0.78),rgba(47,113,88,0.58))]"
                      style={{ width: `${intakeProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <section aria-label="Vault summary" className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Vault value"
            value={formatCurrency(totalVaultValue)}
            detail="Ask value across vault-held and intake-pending assets."
            icon={LockKeyhole}
            bandPercent={86}
          />
          <StatCard
            label="Vault held"
            value={`${vaultHeldAssets.length}`}
            detail="Assets with custody status already confirmed."
            icon={PackageCheck}
            bandPercent={metricPercent(vaultHeldAssets.length, vaultAssets.length)}
          />
          <StatCard
            label="Intake"
            value={`${intakeAssets.length}`}
            detail="Assets awaiting final review before full vault status."
            icon={Box}
            bandPercent={metricPercent(intakeAssets.length, vaultAssets.length)}
          />
          <StatCard
            label="Verified value"
            value={formatCurrency(verifiedValue)}
            detail="Value tied to vault-verified assets."
            icon={BadgeCheck}
            bandPercent={metricPercent(verifiedValue, totalVaultValue)}
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
          <div className="grid gap-3">
            <div className="flex flex-col gap-3 rounded-[10px] border border-[var(--border-soft)] bg-[rgba(249,248,243,0.72)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)] sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
                  Asset bay
                </p>
                <h2 className="mt-1 text-xl font-semibold text-vault-ink">Vault assets</h2>
                <p className="mt-1 text-sm text-vault-steel">
                  Vault-linked graded cards with custody status.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(47,113,88,0.22)] bg-[rgba(47,113,88,0.08)] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#235844]">
                  <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
                  {vaultHeldAssets.length} held
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(166,111,31,0.24)] bg-[rgba(166,111,31,0.08)] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-[#744e18]">
                  <Waves className="h-3.5 w-3.5" aria-hidden="true" />
                  {intakeAssets.length} intake
                </span>
              </div>
            </div>
            <div className="grid gap-3">
              {vaultAssets.map((listing) => (
                <VaultAssetCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>

          <aside className="grid gap-3 self-start">
            <section className="overflow-hidden rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] shadow-[var(--shadow-card)]">
              <div className="border-b border-[var(--border-soft)] bg-[linear-gradient(90deg,rgba(47,94,124,0.08),rgba(47,113,88,0.04),transparent)] px-4 py-4">
                <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
                  Custody ledger
                </p>
                <h2 className="mt-1 text-lg font-semibold text-vault-ink">Status chain</h2>
                <p className="mt-1 text-sm leading-6 text-vault-steel">
                  Custody events show intake, verification, storage, and transfer status
                  for each asset.
                </p>
              </div>

              <div className="grid gap-2 p-3">
                {vaultAssets.map((listing, index) => (
                  <Link
                    key={`${listing.id}-ledger`}
                    href={buildListingHref(listing.slug, "/vault")}
                    className="group grid gap-3 rounded-[9px] border border-[var(--border-soft)] bg-white/[0.42] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.64)] transition hover:-translate-y-0.5 hover:border-[rgba(47,94,124,0.22)] hover:bg-white/72 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-[6px] border border-[var(--border-soft)] bg-white/58 font-mono text-[0.58rem] font-semibold text-vault-steel">
                            {index + 1}
                          </span>
                          <p className="truncate text-sm font-semibold text-vault-ink">{listing.title}</p>
                        </div>
                        <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-vault-steel">
                          {listing.gradingCompany} {listing.grade} / {listing.certNumber}
                        </p>
                      </div>
                      <ArrowUpRight
                        className="h-4 w-4 shrink-0 text-vault-registry transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <CustodyPill listing={listing} />
                      <span className="rounded-full border border-[var(--border-soft)] bg-white/48 px-2.5 py-1 text-xs font-semibold text-vault-graphite">
                        {getVerificationStatusLabel(listing.verificationStatus)}
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(17,19,15,0.07)]" aria-hidden="true">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          listing.vaultStatus === "vault_held"
                            ? "bg-[linear-gradient(90deg,rgba(47,113,88,0.38),rgba(47,113,88,0.78))]"
                            : "bg-[linear-gradient(90deg,rgba(166,111,31,0.42),rgba(47,94,124,0.52))]",
                        )}
                        style={{ width: listing.vaultStatus === "vault_held" ? "100%" : "58%" }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section className="rounded-[10px] border border-[var(--border-soft)] bg-[rgba(17,19,15,0.9)] p-4 text-vault-paper shadow-[0_24px_70px_rgba(17,19,15,0.2)]">
              <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/50">
                Custody controls
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
                {futureActions.map((action) => (
                  <button
                    key={action}
                    type="button"
                    aria-disabled="true"
                    title={`${action} requires verified collector access`}
                    className="inline-flex h-10 items-center justify-center rounded-[6px] border border-white/12 bg-white/[0.06] px-3 text-sm font-semibold text-vault-paper/68 transition hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </section>
          </aside>
        </section>
      </div>
    </main>
  );
}
