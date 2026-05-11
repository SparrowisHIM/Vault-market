import type { Metadata } from "next";
import {
  Activity,
  BarChart3,
  Gem,
  Gauge,
  Radar,
  Radio,
  ScanLine,
} from "lucide-react";
import { ResearchCompFeed } from "@/components/research/research-comp-feed";
import { ResearchConfidenceTile } from "@/components/research/research-confidence-tile";
import { ResearchIntelligenceSidebar } from "@/components/research/research-intelligence-sidebar";
import { ResearchPageMotion } from "@/components/research/research-page-motion";
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
  `ASK BOOK / ${formatCurrency(totalAskBook)}`,
  `NET SIGNAL / ${formatSignedPercent(averageDelta)}`,
  `LEAD ASK / ${formatCurrency(highestValue.priceCents)}`,
  `STRONGEST MOVE / ${formatSignedPercent(strongestSignal.marketDeltaPercent ?? 0)}`,
  `RARITY ANCHOR / ${formatPopulation(lowestPopulation.population)}`,
];

const confidenceArcSignals = [
  {
    label: "Momentum",
    value: bandAverageSignal,
  },
  {
    label: "Ask weight",
    value: bandTopAsk,
  },
  {
    label: "Scarcity",
    value: bandRarestPop,
  },
];

const researchTitleWords = "Market context before a collector opens the slab".split(" ");

export default function ResearchPage() {
  return (
    <main className="min-h-screen px-4 py-5 sm:px-6 lg:px-8">
      <ResearchPageMotion>
        <section className="research-terminal-shell overflow-hidden rounded-[12px] border border-[rgba(17,19,15,0.22)] shadow-[0_22px_70px_rgba(17,19,15,0.14)] motion-safe:opacity-0">
          <div className="research-terminal relative overflow-hidden bg-[linear-gradient(135deg,rgba(13,15,12,0.98)_0%,rgba(24,28,23,0.99)_48%,rgba(12,14,11,0.98)_100%)] text-vault-paper">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(244,241,233,0.035)_1px,transparent_1px),linear-gradient(rgba(244,241,233,0.028)_1px,transparent_1px)] bg-[length:42px_42px]" />
            <div className="research-terminal-sweep pointer-events-none absolute inset-0" />
            <div className="relative grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.46fr)] lg:items-stretch">
              <div className="grid min-h-[25rem] gap-5 rounded-[10px] border border-white/10 bg-black/10 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="research-terminal-kicker inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5 motion-safe:opacity-0">
                    <Radio className="h-4 w-4 text-[#82c7a9]" aria-hidden="true" />
                    <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-vault-paper/62">
                      Signal terminal / RV-1
                    </span>
                  </div>
                  <span className="research-terminal-kicker inline-flex items-center gap-2 rounded-full border border-[rgba(130,199,169,0.22)] bg-[rgba(47,113,88,0.1)] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-[#a7ddc4] motion-safe:opacity-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#82c7a9] shadow-[0_0_16px_rgba(130,199,169,0.8)]" />
                    Feed aligned
                  </span>
                </div>

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px] lg:items-end">
                  <div>
                    <h1 className="max-w-3xl text-3xl font-semibold leading-[1.03] text-vault-paper sm:text-5xl">
                      {researchTitleWords.map((word, index) => (
                        <span key={`${word}-${index}`} className="research-title-word inline-block motion-safe:opacity-0">
                          {word}
                          {index < researchTitleWords.length - 1 ? "\u00a0" : ""}
                        </span>
                      ))}
                    </h1>
                    <p className="research-terminal-copy mt-4 max-w-2xl text-sm leading-relaxed text-vault-paper/64 motion-safe:opacity-0 sm:text-[0.95rem]">
                      A focused readout of asking prices, last comps, rarity, custody status,
                      and momentum signals using the current marketplace listings.
                    </p>
                  </div>
                  <div className="research-confidence-panel grid gap-3 rounded-[9px] border border-white/10 bg-white/[0.045] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] motion-safe:opacity-0">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/48">
                        Confidence arc
                      </span>
                      <ScanLine className="h-4 w-4 text-vault-paper/54" aria-hidden="true" />
                    </div>
                    {confidenceArcSignals.map((signal) => (
                      <div key={signal.label} className="grid gap-1.5">
                        <div className="flex items-center justify-between gap-3">
                          <span className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/46">
                            {signal.label}
                          </span>
                          <span className="font-mono text-[0.58rem] font-semibold tabular-nums text-vault-paper/58">
                            {signal.value}%
                          </span>
                        </div>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
                          <div
                            className="h-full rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.52),rgba(130,199,169,0.72))]"
                            style={{ width: `${signal.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="research-hero-stat rounded-[9px] border border-white/10 bg-white/[0.05] p-3 motion-safe:opacity-0">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Lead ask
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-vault-paper">
                      {formatCurrency(highestValue.priceCents)}
                    </p>
                    <p className="mt-1 truncate text-xs text-vault-paper/50">{highestValue.title}</p>
                  </div>
                  <div className="research-hero-stat rounded-[9px] border border-white/10 bg-white/[0.05] p-3 motion-safe:opacity-0">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Net signal
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-vault-paper">
                      {formatSignedPercent(averageDelta)}
                    </p>
                    <p className="mt-1 truncate text-xs text-vault-paper/50">{strongestSignal.title}</p>
                  </div>
                  <div className="research-hero-stat rounded-[9px] border border-white/10 bg-white/[0.05] p-3 motion-safe:opacity-0">
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/45">
                      Rarity anchor
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-vault-paper">
                      {formatPopulation(lowestPopulation.population)}
                    </p>
                    <p className="mt-1 truncate text-xs text-vault-paper/50">{lowestPopulation.title}</p>
                  </div>
                </div>
              </div>

              <div className="research-scan-panel grid gap-3 rounded-[10px] border border-white/10 bg-white/[0.045] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] motion-safe:opacity-0">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/48">
                      Desk scan
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-vault-paper">
                      Collector intelligence
                    </h2>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-[8px] border border-white/10 bg-white/[0.06] text-[#a7ddc4]">
                    <Radar className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
                <div className="grid gap-2">
                  {marketMovers.slice(0, 4).map((listing, index) => (
                    <div
                      key={listing.id}
                      className="research-scan-row grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[8px] border border-white/10 bg-black/[0.12] p-2.5 motion-safe:opacity-0"
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-[6px] border border-white/10 bg-white/[0.055] font-mono text-[0.62rem] font-semibold text-vault-paper/54">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold text-vault-paper">
                          {listing.title}
                        </span>
                        <span className="mt-0.5 block font-mono text-[0.6rem] uppercase tracking-[0.12em] text-vault-paper/42">
                          {listing.gradingCompany} {listing.grade}
                        </span>
                      </span>
                      <span className="font-mono text-xs font-semibold text-[#a7ddc4]">
                        {formatSignedPercent(listing.marketDeltaPercent ?? 0)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <ResearchTicker items={tickerItems} />
          </div>
        </section>

        <section aria-label="Research summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="research-summary-card motion-safe:opacity-0">
            <ResearchConfidenceTile
              icon={BarChart3}
              label="Ask book"
              value={formatCurrency(totalAskBook)}
              detail={`${mockListings.length} graded card listings in the current market set.`}
              bandPercent={bandAskBook}
            />
          </div>
          <div className="research-summary-card motion-safe:opacity-0">
            <ResearchConfidenceTile
              icon={Activity}
              label="Average signal"
              value={formatSignedPercent(averageDelta)}
              detail={`Strongest current read: ${strongestSignal.title}.`}
              bandPercent={bandAverageSignal}
            />
          </div>
          <div className="research-summary-card motion-safe:opacity-0">
            <ResearchConfidenceTile
              icon={Gem}
              label="Top ask"
              value={formatCurrency(highestValue.priceCents)}
              detail={`${highestValue.title} leads the premium desk inventory.`}
              bandPercent={bandTopAsk}
            />
          </div>
          <div className="research-summary-card motion-safe:opacity-0">
            <ResearchConfidenceTile
              icon={Gauge}
              label="Rarest pop"
              value={formatPopulation(lowestPopulation.population)}
              detail={`${lowestPopulation.title} has the lowest listed population count.`}
              bandPercent={bandRarestPop}
            />
          </div>
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
      </ResearchPageMotion>
    </main>
  );
}
