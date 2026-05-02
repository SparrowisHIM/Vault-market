import type { Metadata } from "next";
import {
  MarketplaceBrowser,
  type MarketplaceQueryParams,
} from "@/components/marketplace/marketplace-browser";
import { mockListings } from "@/lib/marketplace/mock-listings";
import { formatCurrency } from "@/lib/marketplace/format";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse graded trading card listings on VaultMarket.",
};

const totalMarketValue = mockListings.reduce(
  (total, listing) => total + listing.priceCents,
  0,
);
const vaultHeldCount = mockListings.filter(
  (listing) => listing.seller.trustTier === "vault",
).length;
const activeCount = mockListings.filter((listing) => listing.status === "active").length;

type MarketplacePageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function MarketplacePage({ searchParams }: MarketplacePageProps) {
  const params = (await searchParams) ?? {};
  const initialQueryParams: MarketplaceQueryParams = {
    q: firstParam(params.q),
    type: firstParam(params.type),
    franchise: firstParam(params.franchise),
    grader: firstParam(params.grader),
    trust: firstParam(params.trust),
    status: firstParam(params.status),
    sort: firstParam(params.sort),
  };

  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-5">
        <header className="grid gap-4 border-b border-[var(--border-soft)] pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-vault-registry">
              VaultMarket / Graded cards only
            </p>
            <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-normal text-vault-ink sm:text-4xl">
              Inspection-grade marketplace browse
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-vault-steel sm:text-base">
              Serious listings with grade, cert, seller trust, market context, and
              watch actions visible before opening the full inspection view.
            </p>
          </div>

          <dl className="grid grid-cols-3 gap-2 rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)]">
            <div className="rounded-[6px] bg-white/40 p-3">
              <dt className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                Active
              </dt>
              <dd className="mt-1 text-xl font-semibold text-vault-ink">{activeCount}</dd>
            </div>
            <div className="rounded-[6px] bg-white/40 p-3">
              <dt className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                Vault
              </dt>
              <dd className="mt-1 text-xl font-semibold text-vault-ink">{vaultHeldCount}</dd>
            </div>
            <div className="rounded-[6px] bg-white/40 p-3">
              <dt className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                Ask book
              </dt>
              <dd className="mt-1 text-xl font-semibold text-vault-ink">
                {formatCurrency(totalMarketValue)}
              </dd>
            </div>
          </dl>
        </header>

        <MarketplaceBrowser listings={mockListings} initialQueryParams={initialQueryParams} />
      </div>
    </main>
  );
}
