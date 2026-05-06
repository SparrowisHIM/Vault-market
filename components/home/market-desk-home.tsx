"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, createScope, stagger } from "animejs";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Landmark,
  Search,
  Sparkles,
} from "lucide-react";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { SlabArtImage } from "@/components/marketplace/slab-art-image";
import { formatCurrency, formatPopulation, getVaultStatusLabel } from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";
import type { VaultListing } from "@/lib/marketplace/types";
import { buildListingHref } from "@/lib/navigation/listing-links";
import { cn } from "@/lib/utils";

const storySteps = [
  {
    href: "/marketplace",
    label: "Inspect",
    kicker: "Start with the slab",
    detail: "Review cert, grade, custody, seller trust, and inspection notes before the price ever becomes the point.",
    icon: Search,
  },
  {
    href: "/research",
    label: "Read the market",
    kicker: "Comps with context",
    detail: "Use market signal, last comp, population, and estimate range to separate noise from conviction.",
    icon: BookOpen,
  },
  {
    href: "/private-desk",
    label: "Route exceptional slabs",
    kicker: "Private desk",
    detail: "For cards that deserve a slower decision, send the slab into specialist review and high-touch desk handling.",
    icon: Landmark,
    exclusive: true,
  },
];

const tapeItems = mockListings.map((listing) => ({
  label: `${listing.gradingCompany} ${listing.grade} ${listing.title}`,
  value: formatCurrency(listing.priceCents),
  delta: listing.marketDeltaPercent,
}));

export function MarketDeskHome() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [tiltStyle, setTiltStyle] = useState({ transform: "perspective(1100px)" });
  const heroStackListings = useMemo(() => {
    const heroSlugs = [
      "2021-pokemon-umbreon-vmax-alt-art-psa-10",
      "1999-pokemon-base-charizard-psa-9",
      "2000-pokemon-neo-genesis-lugia-holo-psa-9",
      "2002-yugioh-blue-eyes-white-dragon-psa-9",
      "2003-pokemon-skyridge-crystal-ho-oh-psa-10",
    ];

    return heroSlugs
      .map((slug) => mockListings.find((listing) => listing.slug === slug))
      .filter(Boolean) as VaultListing[];
  }, []);
  const activeHeroListing = heroStackListings[0] ?? mockListings[0];
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

      animate(".hero-stack-card", {
        opacity: [0, 1],
        y: [32, 0],
        rotateZ: (_target: HTMLElement, index: number) => [index % 2 ? -10 : 10, 0],
        delay: stagger(90),
        duration: 820,
        ease: "outExpo",
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

        <div className="mx-auto grid min-h-[calc(100svh-166px)] w-full max-w-7xl gap-8 lg:grid-cols-[minmax(0,0.82fr)_minmax(480px,0.78fr)] lg:items-center">
          <div className="desk-reveal flex flex-col gap-6">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(17,19,15,0.16)] bg-white/42 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]">
              <Sparkles className="h-4 w-4 text-vault-registry" aria-hidden="true" />
              <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-vault-steel">
                Cert-backed collector desk
              </span>
            </div>

            <div>
              <h1 className="max-w-4xl text-[clamp(3.25rem,8vw,7.1rem)] font-semibold leading-[0.86] tracking-normal text-vault-ink">
                Built for the slabs worth slowing down for.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-vault-steel sm:text-lg">
                VaultMarket is a trust-first market desk for graded cards where
                collectors inspect, compare, and route exceptional slabs through
                specialist review.
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

            <div className="desk-reveal grid max-w-2xl gap-2 sm:grid-cols-4">
              {[
                "Cert-backed",
                "Market signal",
                "Seller trust",
                "Specialist review",
              ].map((label) => (
                <div
                  key={label}
                  className="rounded-[8px] border border-[rgba(17,19,15,0.16)] bg-white/52 px-3 py-2.5 text-center font-mono text-[0.65rem] font-bold uppercase tracking-[0.12em] text-vault-graphite shadow-[0_12px_28px_rgba(17,19,15,0.055),inset_0_1px_0_rgba(255,255,255,0.72)]"
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="desk-reveal">
            <div
              className="hero-slab-motion group relative mx-auto h-[560px] max-w-[560px] rounded-[30px] border border-[rgba(17,19,15,0.16)] bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.58),rgba(255,255,255,0.2)_38%,rgba(17,19,15,0.06)_72%),linear-gradient(180deg,rgba(255,255,255,0.5),rgba(235,230,220,0.24))] p-4 shadow-[0_34px_110px_rgba(17,19,15,0.22),inset_0_1px_0_rgba(255,255,255,0.84)] transition-transform duration-150 sm:h-[620px] lg:h-[640px]"
              style={tiltStyle}
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setTiltStyle({ transform: "perspective(1100px)" })}
            >
              <div className="absolute -inset-1 -z-10 rounded-[32px] bg-[conic-gradient(from_180deg,rgba(47,94,124,0.2),rgba(166,111,31,0.18),rgba(47,113,88,0.16),rgba(47,94,124,0.2))] opacity-70 blur-xl" />
              <div className="absolute inset-x-10 bottom-20 h-24 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,19,15,0.34),rgba(17,19,15,0.13)_42%,transparent_70%)] blur-md" aria-hidden="true" />
              <div className="absolute inset-x-8 bottom-[5.6rem] h-px bg-[linear-gradient(90deg,transparent,rgba(17,19,15,0.18),transparent)]" aria-hidden="true" />

              {heroStackListings.map((listing, index) => {
                const transforms = [
                  "left-1/2 top-[49%] z-40 w-[57%] -translate-x-1/2 -translate-y-1/2 rotate-0",
                  "left-[17%] top-[45%] z-30 w-[46%] -translate-y-1/2 -rotate-[14deg]",
                  "right-[17%] top-[44%] z-20 w-[46%] -translate-y-1/2 rotate-[14deg]",
                  "left-[9%] top-[55%] z-10 w-[39%] -translate-y-1/2 -rotate-[24deg] opacity-86",
                  "right-[8%] top-[55%] z-0 w-[39%] -translate-y-1/2 rotate-[24deg] opacity-86",
                ];
                const isActive = index === 0;

                return (
                  <Link
                    key={listing.id}
                    href={buildListingHref(listing.slug, "/")}
                    className={cn(
                      "hero-stack-card absolute block rounded-[18px] border border-[rgba(17,19,15,0.24)] bg-[rgba(249,248,243,0.94)] p-2 shadow-[0_30px_76px_rgba(17,19,15,0.3),0_2px_0_rgba(255,255,255,0.7)_inset] transition duration-300 hover:scale-[1.025] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
                      transforms[index],
                      isActive && "border-[rgba(17,19,15,0.34)] shadow-[0_42px_110px_rgba(17,19,15,0.38),0_0_0_1px_rgba(255,255,255,0.42)_inset]",
                    )}
                    aria-label={`Inspect ${listing.title}`}
                  >
                    <div className="rounded-[14px] border border-[rgba(17,19,15,0.16)] bg-vault-ink p-2">
                      <div className="relative aspect-[5/7] overflow-hidden rounded-[10px] border border-[rgba(255,255,255,0.18)] bg-[var(--surface-inset)]">
                        <SlabArtImage
                          image={listing.image}
                          sizes={isActive ? "(min-width: 1024px) 340px, 70vw" : "(min-width: 1024px) 260px, 56vw"}
                          priority={isActive}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.18),transparent_34%,rgba(255,255,255,0.12)_42%,transparent_52%)]" aria-hidden="true" />
                      </div>
                      <div className="mt-2 grid gap-1 rounded-[9px] bg-vault-paper px-2.5 py-2 text-vault-ink">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold leading-tight">{listing.title}</p>
                          <span className="shrink-0 rounded-[5px] border border-[rgba(154,62,53,0.22)] bg-[rgba(154,62,53,0.08)] px-2 py-0.5 font-mono text-[0.68rem] font-bold text-vault-loss">
                            {listing.grade}
                          </span>
                        </div>
                        {isActive && (
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
                              {listing.gradingCompany} / {listing.franchise}
                            </span>
                            <MarketDelta value={listing.marketDeltaPercent} compact />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}

              <div className="absolute inset-x-5 top-5 z-50 rounded-[14px] border border-[rgba(17,19,15,0.16)] bg-[rgba(249,248,243,0.78)] p-4 shadow-[0_18px_48px_rgba(17,19,15,0.12),inset_0_1px_0_rgba(255,255,255,0.76)] backdrop-blur">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-steel">
                      Active slab dossier
                    </p>
                    <p className="mt-1 truncate text-base font-semibold leading-tight text-vault-ink">
                      {activeHeroListing.title}
                    </p>
                  </div>
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-vault-verified" aria-hidden="true" />
                </div>
                <dl className="mt-3 grid grid-cols-4 gap-2">
                  {[
                    ["Grade", `${activeHeroListing.gradingCompany} ${activeHeroListing.grade}`],
                    ["Ask", formatCurrency(activeHeroListing.priceCents)],
                    ["Rarity", formatPopulation(activeHeroListing.population)],
                    ["Custody", getVaultStatusLabel(activeHeroListing.vaultStatus)],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-[8px] border border-[rgba(17,19,15,0.09)] bg-white/46 px-2 py-2"
                    >
                      <dt className="font-mono text-[0.56rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                        {label}
                      </dt>
                      <dd className="mt-1 truncate text-xs font-semibold text-vault-ink">{value}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                    Seller trust / market signal aligned
                  </span>
                  <MarketDelta value={activeHeroListing.marketDeltaPercent} compact />
                </div>
              </div>

              <div className="absolute inset-x-6 bottom-5 z-50 rounded-[13px] border border-white/12 bg-[rgba(17,19,15,0.88)] p-3 text-vault-paper shadow-[0_20px_60px_rgba(17,19,15,0.24)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/54">
                      Stack signal
                    </p>
                    <p className="mt-1 truncate text-sm font-semibold">
                      {heroStackListings.length} graded slabs staged for inspection
                    </p>
                  </div>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-vault-paper/58" aria-hidden="true" />
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

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
          <div className="desk-reveal">
            <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-vault-steel">
              How VaultMarket is read
            </p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight text-vault-ink sm:text-4xl">
              A slower path for faster conviction.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-6 text-vault-steel">
              The desk is organized around a simple collector workflow: inspect the slab,
              read the market, and reserve specialist attention for the cards that need it.
            </p>
          </div>

          <div className="grid gap-3">
            {storySteps.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "desk-reveal group grid gap-4 rounded-[10px] border p-5 transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)] sm:grid-cols-[auto_1fr_auto] sm:items-center",
                    item.exclusive
                      ? "border-[rgba(17,19,15,0.34)] bg-[rgba(17,19,15,0.92)] text-vault-paper shadow-[0_26px_70px_rgba(17,19,15,0.22)]"
                      : "border-[var(--border-soft)] bg-white/42 text-vault-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] hover:bg-white/64",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span
                    className={cn(
                      "grid h-11 w-11 place-items-center rounded-[8px] border",
                      item.exclusive
                        ? "border-white/12 bg-white/[0.07] text-vault-paper"
                        : "border-[var(--border-soft)] bg-white/54 text-vault-registry",
                    )}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em]",
                        item.exclusive ? "text-vault-paper/54" : "text-vault-steel",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")} / {item.kicker}
                    </span>
                    <span className="mt-1 block text-xl font-semibold">{item.label}</span>
                    <span
                      className={cn(
                        "mt-1 block text-sm leading-6",
                        item.exclusive ? "text-vault-paper/64" : "text-vault-steel",
                      )}
                    >
                      {item.detail}
                    </span>
                  </span>
                  <ArrowRight
                    className={cn(
                      "h-4 w-4 shrink-0 transition group-hover:translate-x-0.5",
                      item.exclusive ? "text-vault-paper/58" : "text-vault-registry",
                    )}
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
