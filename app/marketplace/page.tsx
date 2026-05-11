import type { Metadata } from "next";
import {
  MarketplaceBrowser,
  type MarketplaceQueryParams,
} from "@/components/marketplace/marketplace-browser";
import { MarketplacePageHero } from "@/components/marketplace/marketplace-page-hero";
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
        <MarketplacePageHero
          activeCount={activeCount}
          vaultHeldCount={vaultHeldCount}
          totalMarketValue={formatCurrency(totalMarketValue)}
        />

        <MarketplaceBrowser listings={mockListings} initialQueryParams={initialQueryParams} />
      </div>
    </main>
  );
}
