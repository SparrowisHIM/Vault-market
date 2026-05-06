"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, createScope, stagger } from "animejs";
import {
  ArrowRight,
  BookOpen,
  Landmark,
  Search,
  Sparkles,
} from "lucide-react";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { SlabArtImage } from "@/components/marketplace/slab-art-image";
import { formatCurrency } from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";
import type { VaultListing } from "@/lib/marketplace/types";
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

      animate(".hero-stack-card", {
        opacity: [0, 1],
        filter: ["blur(5px)", "blur(0px)"],
        delay: stagger(90),
        duration: 620,
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
      transform: `perspective(1100px) rotateX(${y * -3.5}deg) rotateY(${x * 4.5}deg)`,
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
              className="hero-slab-motion relative mx-auto h-[520px] max-w-[640px] overflow-visible transition-transform duration-150 sm:h-[600px] lg:h-[640px]"
              style={tiltStyle}
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setTiltStyle({ transform: "perspective(1100px)" })}
            >
              <div className="absolute left-1/2 top-1/2 -z-10 h-[72%] w-[84%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.5),rgba(111,158,172,0.16)_36%,rgba(166,111,31,0.1)_58%,transparent_74%)] blur-2xl" aria-hidden="true" />
              <div className="absolute inset-x-8 bottom-[2.4rem] -z-10 h-28 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,19,15,0.32),rgba(17,19,15,0.15)_42%,transparent_72%)] blur-xl" aria-hidden="true" />
              <div className="absolute inset-x-16 bottom-[4.7rem] -z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(17,19,15,0.22),transparent)]" aria-hidden="true" />

              {heroStackListings.map((listing, index) => {
                const transforms = [
                  "left-1/2 top-[49%] z-40 w-[55%] -translate-x-1/2 -translate-y-1/2 rotate-0",
                  "left-[19%] top-[47%] z-30 w-[45%] -translate-y-1/2 -rotate-[15deg]",
                  "right-[19%] top-[46%] z-20 w-[45%] -translate-y-1/2 rotate-[15deg]",
                  "left-[8%] top-[55%] z-10 w-[38%] -translate-y-1/2 -rotate-[27deg] opacity-[0.84]",
                  "right-[8%] top-[55%] z-0 w-[38%] -translate-y-1/2 rotate-[27deg] opacity-[0.84]",
                ];
                const isActive = index === 0;

                return (
                  <div
                    key={listing.id}
                    className={cn(
                      "hero-stack-card absolute block rounded-[18px] border border-[rgba(17,19,15,0.24)] bg-[rgba(249,248,243,0.94)] p-2 shadow-[0_34px_82px_rgba(17,19,15,0.32),inset_0_2px_0_rgba(255,255,255,0.72)]",
                      transforms[index],
                      isActive && "border-[rgba(17,19,15,0.38)] shadow-[0_48px_120px_rgba(17,19,15,0.42),0_0_0_1px_rgba(255,255,255,0.42)_inset]",
                    )}
                    aria-label={listing.title}
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
                  </div>
                );
              })}
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
