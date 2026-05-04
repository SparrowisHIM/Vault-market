import type { Metadata } from "next";
import { Activity, BarChart3, Gem, Gauge } from "lucide-react";
import { ResearchCompFeed } from "@/components/research/research-comp-feed";
import { ResearchConfidenceTile } from "@/components/research/research-confidence-tile";
import { ResearchIntelligenceSidebar } from "@/components/research/research-intelligence-sidebar";
import { ResearchTicker } from "@/components/research/research-ticker";
import { formatCurrency, formatPopulation } from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";

export const metadata: Metadata = {
  title: "Research",
  description: "Review comps, market signals, and rarity context on VaultMarket.",
};

const totalAskBook = mockListings.reduce(
  (total, listing) => total + listing.priceCents,
  0,
);
const averageDelta =
  mockListings.reduce((total, listing) => total + (listing.marketDeltaPercent ?? 0), 0) /
  mockListings.length;
const highestValue = [...mockListings].sort((a, b) => b.priceCents - a.priceCents)[0];
const strongestSignal = [...mockListings].sort(
  (a, b) => (b.marketDeltaPercent ?? 0) - (a.marketDeltaPercent ?? 0),
)[0];
const lowestPopulation = [...mockListings]
  .filter((listing) => listing.population !== undefined)
  .sort((a, b) => (a.population ?? Infinity) - (b.population ?? Infinity))[0];
const recentComps = mockListings
  .filter((listing) => listing.lastCompCents !== undefined)
  .sort((a, b) => (b.lastCompCents ?? 0) - (a.lastCompCents ?? 0));
const marketMovers = [...mockListings].sort(
  (a, b) => (b.marketDeltaPercent ?? 0) - (a.marketDeltaPercent ?? 0),
);
const rarityWatch = [...mockListings]
  .filter((listing) => listing.population !== undefined)
  .sort((a, b) => (a.population ?? Infinity) - (b.population ?? Infinity));

const maxAbsDelta = Math.max(
  1,
  ...mockListings.map((listing) => Math.abs(listing.marketDeltaPercent ?? 0)),
);

const raritySidebar = rarityWatch.slice(0, 5);
const rarityPops = raritySidebar
  .map((listing) => listing.population)
  .filter((n): n is number => n !== undefined);
const rarityMinPop = rarityPops.length ? Math.min(...rarityPops) : 0;
const rarityMaxPop = rarityPops.length ? Math.max(...rarityPops) : 1;

function formatSignedPercent(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

const bandAskBook = Math.min(100, Math.round(50 + mockListings.length * 4.5));
const bandAverageSignal = Math.min(
  100,
  Math.round(36 + (Math.abs(averageDelta) / maxAbsDelta) * 58),
);
const bandTopAsk = Math.min(
  100,
  Math.max(24, Math.round((highestValue.priceCents / Math.max(totalAskBook, 1)) * 195)),
);
const popN = lowestPopulation.population ?? 200;
const bandRarestPop = Math.min(100, Math.round(32 + (720 / Math.min(Math.max(popN, 1), 720)) * 26));

const tickerItems = [
  `ASK BOOK ${formatCurrency(totalAskBook)}`,
  `NET SIGNAL ${formatSignedPercent(averageDelta)}`,
  `LEAD ASK ${highestValue.title.slice(0, 32)}${highestValue.title.length > 32 ? "…" : ""} · ${formatCurrency(highestValue.priceCents)}`,
  `STRONGEST MOVE ${strongestSignal.title.slice(0, 28)}${strongestSignal.title.length > 28 ? "…" : ""} · ${formatSignedPercent(strongestSignal.marketDeltaPercent ?? 0)}`,
  `RARITY ANCHOR ${lowestPopulation.title.slice(0, 28)}${lowestPopulation.title.length > 28 ? "…" : ""} · ${formatPopulation(lowestPopulation.population)}`,
  ...mockListings.slice(0, 4).map(
    (listing) =>
      `${listing.gradingCompany} ${listing.grade} · ${listing.title.slice(0, 26)}${listing.title.length > 26 ? "…" : ""} · ${formatCurrency(listing.priceCents)}`,
  ),
];

export default function ResearchPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-[12px] border border-[rgba(17,19,15,0.22)] shadow-[0_22px_70px_rgba(17,19,15,0.14)]">
          <div className="relative overflow-hidden bg-[linear-gradient(135deg,rgba(17,19,15,0.97)_0%,rgba(28,32,26,0.98)_42%,rgba(17,19,15,0.96)_100%)] text-vault-paper">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.06)_48%,transparent_58%)] opacity-70" />
            <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] lg:items-end">
              <div>
                <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-vault-paper/45">
                  Signal terminal / RV-1
                </p>
                <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight text-vault-paper sm:text-4xl">
                  Market context before a collector opens the slab
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-vault-paper/62 sm:text-[0.95rem]">
                  A focused readout of asking prices, last comps, rarity, custody status,
                  and momentum signals using the current marketplace listings.
                </p>
              </div>
              <div className="rounded-[9px] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/48">
                  Feed status
                </p>
                <p className="mt-2 text-sm font-semibold text-vault-paper">Market signal feed</p>
                <p className="mt-1 text-xs leading-relaxed text-vault-paper/55">
                  Comp context, grader signals, and watch alerts are organized for desk review.
                </p>
              </div>
            </div>
            <ResearchTicker items={tickerItems} />
          </div>
        </section>

        <section aria-label="Research summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <ResearchConfidenceTile
            icon={BarChart3}
            label="Ask book"
            value={formatCurrency(totalAskBook)}
            detail={`${mockListings.length} graded card listings in the current market set.`}
            bandPercent={bandAskBook}
          />
          <ResearchConfidenceTile
            icon={Activity}
            label="Average signal"
            value={formatSignedPercent(averageDelta)}
            detail={`Strongest current read: ${strongestSignal.title}.`}
            bandPercent={bandAverageSignal}
          />
          <ResearchConfidenceTile
            icon={Gem}
            label="Top ask"
            value={formatCurrency(highestValue.priceCents)}
            detail={`${highestValue.title} leads the premium desk inventory.`}
            bandPercent={bandTopAsk}
          />
          <ResearchConfidenceTile
            icon={Gauge}
            label="Rarest pop"
            value={formatPopulation(lowestPopulation.population)}
            detail={`${lowestPopulation.title} has the lowest listed population count.`}
            bandPercent={bandRarestPop}
          />
        </section>

        <section className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.78fr)]">
          <ResearchCompFeed listings={recentComps} maxAbsDelta={maxAbsDelta} />
          <ResearchIntelligenceSidebar
            marketMovers={marketMovers}
            rarityWatch={rarityWatch}
            maxAbsDelta={maxAbsDelta}
            minPop={rarityMinPop}
            maxPop={rarityMaxPop}
          />
        </section>
      </div>
    </main>
  );
}
