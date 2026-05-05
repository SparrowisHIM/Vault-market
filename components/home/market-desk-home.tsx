"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, createScope, stagger } from "animejs";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  BriefcaseBusiness,
  Gavel,
  Landmark,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { formatCurrency, formatPopulation } from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";
import type { VaultListing } from "@/lib/marketplace/types";
import { buildListingHref } from "@/lib/navigation/listing-links";
import { cn } from "@/lib/utils";

const deskLinks = [
  {
    href: "/marketplace",
    label: "Marketplace",
    detail: "Browse graded-card slabs with cert, seller trust, and market signal.",
    icon: Search,
  },
  {
    href: "/vault",
    label: "Vault",
    detail: "Track custody, portfolio value, and intake status.",
    icon: ShieldCheck,
  },
  {
    href: "/auctions",
    label: "Auctions",
    detail: "Curated auction and premier-lot staging room.",
    icon: Gavel,
  },
  {
    href: "/research",
    label: "Research",
    detail: "Comps, rarity, ask book, and signal readouts.",
    icon: BookOpen,
  },
  {
    href: "/sell",
    label: "Sell",
    detail: "Verified seller intake for graded cards.",
    icon: BriefcaseBusiness,
  },
  {
    href: "/private-desk",
    label: "Private Desk",
    detail: "Specialist review for rare, expensive, relationship-led deals.",
    icon: Landmark,
  },
];

const tapeItems = mockListings.map((listing) => ({
  label: `${listing.gradingCompany} ${listing.grade} ${listing.title}`,
  value: formatCurrency(listing.priceCents),
  delta: listing.marketDeltaPercent,
}));

function CommandListingResult({ listing }: { listing: VaultListing }) {
  return (
    <Link
      href={buildListingHref(listing.slug, "/")}
      className="command-result group grid grid-cols-[1fr_auto] gap-3 rounded-[8px] border border-white/10 bg-white/[0.055] p-3 transition hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
    >
      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-vault-paper">
          {listing.title}
        </span>
        <span className="mt-1 block font-mono text-[0.64rem] uppercase tracking-[0.12em] text-vault-paper/52">
          {listing.gradingCompany} {listing.grade} / {listing.franchise} /{" "}
          {formatCurrency(listing.priceCents)}
        </span>
      </span>
      <span className="grid justify-items-end gap-1">
        <MarketDelta value={listing.marketDeltaPercent} compact />
        <ArrowRight
          className="h-4 w-4 text-vault-paper/38 transition group-hover:translate-x-0.5 group-hover:text-vault-paper"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}

export function MarketDeskHome() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const commandRef = useRef<HTMLDivElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState({ transform: "perspective(1100px)" });
  const [deskQuery, setDeskQuery] = useState("");
  const leadListing = useMemo(
    () => [...mockListings].sort((a, b) => b.priceCents - a.priceCents)[0],
    [],
  );
  const featuredListings = useMemo(
    () => [...mockListings].sort((a, b) => (b.marketDeltaPercent ?? 0) - (a.marketDeltaPercent ?? 0)).slice(0, 3),
    [],
  );
  const askBook = useMemo(
    () => mockListings.reduce((total, listing) => total + listing.priceCents, 0),
    [],
  );
  const commandResults = useMemo(() => {
    const normalizedQuery = deskQuery.trim().toLowerCase();
    const rankedListings = [...mockListings].sort((a, b) => b.priceCents - a.priceCents);

    if (!normalizedQuery) return rankedListings.slice(0, 3);

    return rankedListings
      .filter((listing) =>
        [
          listing.title,
          listing.franchise,
          listing.setName,
          listing.gradingCompany,
          listing.grade,
          listing.certNumber,
          listing.seller.name,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery),
      )
      .slice(0, 3);
  }, [deskQuery]);
  const routeSuggestions = useMemo(() => {
    const normalizedQuery = deskQuery.trim().toLowerCase();

    if (!normalizedQuery) return deskLinks.slice(0, 3);

    return deskLinks
      .filter((link) => `${link.label} ${link.detail}`.toLowerCase().includes(normalizedQuery))
      .slice(0, 3);
  }, [deskQuery]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const scope = createScope({ root }).add(() => {
      animate(".desk-reveal", {
        opacity: [0, 1],
        y: [26, 0],
        delay: stagger(70),
        duration: 760,
        ease: "outExpo",
      });

      animate(".signal-node", {
        opacity: [0.16, 0.54, 0.28],
        scale: [0.96, 1.08, 1],
        delay: stagger(140),
        duration: 2600,
        loop: 2,
        ease: "inOutSine",
      });

      animate(".hero-slab-motion", {
        rotateZ: [-0.8, 0.8],
        y: [-3, 3],
        duration: 9200,
        alternate: true,
        loop: true,
        ease: "inOutSine",
      });
    });

    return () => scope.revert();
  }, []);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;

    setTiltStyle({
      transform: `perspective(1100px) rotateX(${y * -8}deg) rotateY(${x * 10}deg) translate3d(0,-4px,0)`,
    });
  }

  function animateCommandResults() {
    const root = commandRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    animate(root.querySelectorAll(".command-result"), {
      opacity: [0, 1],
      translateY: [10, 0],
      delay: stagger(45),
      duration: 340,
      ease: "outExpo",
    });
  }

  useEffect(() => {
    animateCommandResults();
  }, [commandResults, routeSuggestions]);

  function marketplaceSearchHref(query: string) {
    const trimmedQuery = query.trim();
    return trimmedQuery ? `/marketplace?q=${encodeURIComponent(trimmedQuery)}` : "/marketplace";
  }

  return (
    <main ref={rootRef} className="overflow-hidden">
      <section className="relative min-h-[calc(100svh-118px)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="vault-orbit vault-orbit-one" />
          <div className="vault-orbit vault-orbit-two" />
          <div className="vault-scanline" />
          <div className="signal-node absolute left-[7%] top-[18%] h-2 w-2 rounded-full bg-vault-registry" />
          <div className="signal-node absolute right-[14%] top-[28%] h-2 w-2 rounded-full bg-vault-amber" />
          <div className="signal-node absolute bottom-[18%] left-[41%] h-2 w-2 rounded-full bg-vault-verified" />
        </div>

        <div className="mx-auto grid min-h-[calc(100svh-166px)] w-full max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,0.72fr)] lg:items-center">
          <div className="desk-reveal flex flex-col gap-5">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(17,19,15,0.16)] bg-white/42 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
              <Sparkles className="h-4 w-4 text-vault-registry" aria-hidden="true" />
              <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-vault-steel">
                Trust-first graded card market desk
              </span>
            </div>

            <div>
              <h1 className="max-w-4xl text-[clamp(3.15rem,8vw,7.4rem)] font-semibold leading-[0.86] tracking-normal text-vault-ink">
                Inspect the slab. Read the market. Move with confidence.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-vault-steel sm:text-lg">
                VaultMarket is a premium marketplace and vault interface for verified,
                graded trading cards. Start with the public marketplace, inspect each
                slab, then route exceptional cards through the private desk when specialist
                review matters.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[auto_auto_1fr] sm:items-center">
              <Link
                href="/marketplace"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-[7px] border border-vault-graphite bg-vault-ink px-5 text-sm font-semibold text-vault-paper shadow-[0_18px_44px_rgba(17,19,15,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
              >
                Browse graded cards
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                href="/private-desk"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[7px] border border-[var(--border-soft)] bg-white/46 px-5 text-sm font-semibold text-vault-graphite transition duration-200 hover:-translate-y-0.5 hover:bg-white/78 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
              >
                Private desk access
                <Landmark className="h-4 w-4" aria-hidden="true" />
              </Link>
              <div className="hidden h-px bg-[linear-gradient(90deg,rgba(17,19,15,0.22),transparent)] sm:block" />
            </div>

            <div
              ref={commandRef}
              className="desk-reveal overflow-hidden rounded-[12px] border border-[rgba(17,19,15,0.16)] bg-[rgba(17,19,15,0.9)] p-3 text-vault-paper shadow-[0_26px_70px_rgba(17,19,15,0.24)]"
            >
              <div className="grid gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/58">
                      Market command
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-vault-paper">
                      Search marketplace slabs
                    </h2>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/62">
                    {commandResults.length} slab matches
                  </span>
                </div>

                <form action="/marketplace" className="grid gap-2 sm:grid-cols-[1fr_auto]">
                  <label htmlFor="desk-command-search" className="sr-only">
                    Search VaultMarket marketplace
                  </label>
                  <div className="relative">
                    <Search
                      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-vault-paper/44"
                      aria-hidden="true"
                    />
                    <input
                      id="desk-command-search"
                      name="q"
                      type="search"
                      value={deskQuery}
                      onChange={(event) => setDeskQuery(event.target.value)}
                      autoComplete="off"
                      placeholder="Try Black Lotus, PSA 10, Charizard, cert number..."
                      className="h-12 w-full rounded-[8px] border border-white/12 bg-white/[0.07] px-10 text-sm font-semibold text-vault-paper outline-none transition placeholder:text-vault-paper/34 focus:border-white/28 focus:ring-2 focus:ring-white/18"
                    />
                  </div>
                  <Link
                    href={marketplaceSearchHref(deskQuery)}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-[8px] border border-white/16 bg-vault-paper px-4 text-sm font-semibold text-vault-ink transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
                  >
                    Execute search
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </form>

                <div className="grid gap-2 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="grid gap-2">
                    {commandResults.length > 0 ? (
                      commandResults.map((listing) => (
                        <CommandListingResult key={listing.id} listing={listing} />
                      ))
                    ) : (
                      <div className="command-result rounded-[8px] border border-white/10 bg-white/[0.055] p-3 text-sm text-vault-paper/68">
                        No slab matches yet. Try a title, grader, cert, franchise, or seller.
                      </div>
                    )}
                  </div>

                  <div className="grid gap-2">
                    {routeSuggestions.map((item) => {
                      const Icon = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="command-result group grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[8px] border border-white/10 bg-white/[0.055] p-3 transition hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
                        >
                          <span className="grid h-9 w-9 place-items-center rounded-[7px] border border-white/10 bg-white/[0.07] text-vault-paper/76">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-vault-paper">
                              {item.label}
                            </span>
                            <span className="mt-0.5 block truncate text-xs text-vault-paper/52">
                              {item.detail}
                            </span>
                          </span>
                          <ArrowRight
                            className="h-4 w-4 text-vault-paper/38 transition group-hover:translate-x-0.5 group-hover:text-vault-paper"
                            aria-hidden="true"
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <p className="sr-only" role="status" aria-live="polite">
                  {commandResults.length} matching slabs shown.
                </p>
              </div>
            </div>

            <dl className="desk-reveal grid gap-2 sm:grid-cols-3">
              <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/36 p-3">
                <dt className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                  Ask book
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-vault-ink">{formatCurrency(askBook)}</dd>
              </div>
              <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/36 p-3">
                <dt className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                  Live modules
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-vault-ink">{deskLinks.length}</dd>
              </div>
              <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/36 p-3">
                <dt className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                  Lead rarity
                </dt>
                <dd className="mt-1 text-2xl font-semibold text-vault-ink">
                  {formatPopulation(leadListing.population)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="desk-reveal">
            <div
              className="hero-slab-motion group relative mx-auto max-w-[430px] rounded-[28px] border border-[rgba(17,19,15,0.2)] bg-[linear-gradient(145deg,rgba(255,255,255,0.72),rgba(255,255,255,0.22))] p-4 shadow-[0_34px_90px_rgba(17,19,15,0.24),inset_0_1px_0_rgba(255,255,255,0.84)] transition-transform duration-150"
              style={tiltStyle}
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setTiltStyle({ transform: "perspective(1100px)" })}
            >
              <div className="absolute -inset-1 -z-10 rounded-[30px] bg-[conic-gradient(from_180deg,rgba(47,94,124,0.2),rgba(166,111,31,0.2),rgba(47,113,88,0.16),rgba(47,94,124,0.2))] opacity-70 blur-xl" />
              <div className="relative overflow-hidden rounded-[20px] border border-[rgba(17,19,15,0.22)] bg-vault-ink p-3">
                <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.16)_38%,transparent_56%)] opacity-0 transition duration-500 group-hover:translate-x-16 group-hover:opacity-100" />
                <div className="grid gap-3 rounded-[15px] bg-[var(--surface-panel)] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-steel">
                        Lead desk slab
                      </p>
                      <h2 className="mt-1 text-xl font-semibold leading-tight text-vault-ink">
                        {leadListing.title}
                      </h2>
                    </div>
                    <span className="rounded-full border border-[rgba(47,113,88,0.24)] bg-[rgba(47,113,88,0.08)] px-2 py-1 font-mono text-[0.64rem] font-semibold uppercase tracking-[0.12em] text-[#235844]">
                      Verified
                    </span>
                  </div>
                  <div className="relative aspect-[5/7] overflow-hidden rounded-[14px] border border-[rgba(17,19,15,0.18)]">
                    <Image
                      src={leadListing.imageUrl}
                      alt={leadListing.imageAlt}
                      fill
                      unoptimized
                      sizes="(min-width: 1024px) 390px, 86vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-[1fr_auto] gap-3">
                    <div>
                      <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                        Ask
                      </p>
                      <p className="text-3xl font-semibold text-vault-ink">
                        {formatCurrency(leadListing.priceCents)}
                      </p>
                    </div>
                    <div className="grid content-end justify-items-end gap-2">
                      <MarketDelta value={leadListing.marketDeltaPercent} compact />
                      <span className="rounded-[5px] border border-[var(--border-soft)] bg-white/46 px-2 py-1 font-mono text-[0.68rem] font-semibold text-vault-steel">
                        {leadListing.gradingCompany} {leadListing.grade}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Market tape" className="border-y border-[var(--border-soft)] bg-vault-ink py-3 text-vault-paper">
        <div className="vault-tape-track flex gap-3 whitespace-nowrap">
          {[...tapeItems, ...tapeItems].map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.055] px-4 py-2"
            >
              <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/72">
                {item.label}
              </span>
              <span className="text-sm font-semibold">{item.value}</span>
              <span className={cn("font-mono text-[0.68rem]", (item.delta ?? 0) >= 0 ? "text-[#82c7a9]" : "text-[#e1968c]")}>
                {(item.delta ?? 0) > 0 ? "+" : ""}
                {(item.delta ?? 0).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-3">
          {deskLinks.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="desk-reveal group relative overflow-hidden rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-5 shadow-[var(--shadow-card)] transition duration-200 hover:-translate-y-1 hover:border-[rgba(47,94,124,0.3)] hover:bg-[var(--surface-raised)] hover:shadow-slab-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="absolute right-4 top-4 opacity-0 transition duration-200 group-hover:opacity-100">
                  <ArrowRight className="h-4 w-4 text-vault-registry" aria-hidden="true" />
                </div>
                <span className="grid h-10 w-10 place-items-center rounded-[8px] border border-[var(--border-soft)] bg-white/46 text-vault-registry">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h2 className="mt-4 text-xl font-semibold text-vault-ink">{item.label}</h2>
                <p className="mt-2 text-sm leading-6 text-vault-steel">{item.detail}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="px-4 pb-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-[10px] border border-[var(--border-soft)] bg-[rgba(17,19,15,0.9)] p-4 text-vault-paper shadow-[0_30px_90px_rgba(17,19,15,0.26)]">
          <div className="grid gap-3 lg:grid-cols-[auto_1fr] lg:items-center">
            <div className="flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-[#82c7a9]" aria-hidden="true" />
              <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/72">
                Signal watch
              </p>
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {featuredListings.map((listing) => (
                <Link
                  key={listing.id}
                  href={buildListingHref(listing.slug, "/")}
                  className="group rounded-[8px] border border-white/10 bg-white/[0.055] p-3 transition duration-200 hover:bg-white/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{listing.title}</p>
                      <p className="mt-1 font-mono text-[0.66rem] uppercase tracking-[0.12em] text-vault-paper/58">
                        {listing.gradingCompany} {listing.grade} / {formatCurrency(listing.priceCents)}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-vault-paper/44 transition group-hover:translate-x-0.5 group-hover:text-vault-paper" aria-hidden="true" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
