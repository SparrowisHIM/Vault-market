"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, createScope, createTimeline, stagger } from "animejs";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Gauge,
  Handshake,
  Landmark,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { ListingTypeBadge } from "@/components/marketplace/listing-type-badge";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { SellerTrustBadge } from "@/components/marketplace/seller-trust-badge";
import { SlabArtImage } from "@/components/marketplace/slab-art-image";
import { formatCurrency, formatPopulation, getVaultStatusLabel } from "@/lib/marketplace/format";
import { mockListings } from "@/lib/marketplace/mock-listings";
import type { VaultListing } from "@/lib/marketplace/types";
import { installContainerBoundMotion } from "@/lib/motion/container-bounds";
import { cn } from "@/lib/utils";

type HeroStackLayout = "clustered" | "spread";

type HeroStackPosition = {
  x: string;
  y: string;
  rotate: number;
  zIndex: number;
};

const heroStackLayouts: Record<HeroStackLayout, HeroStackPosition[]> = {
  clustered: [
    { x: "0px", y: "-4px", rotate: 0, zIndex: 40 },
    { x: "clamp(-118px,-9vw,-72px)", y: "clamp(12px,2vw,24px)", rotate: -10, zIndex: 24 },
    { x: "clamp(72px,9vw,118px)", y: "clamp(12px,2vw,24px)", rotate: 10, zIndex: 18 },
  ],
  spread: [
    { x: "0px", y: "-8px", rotate: 0, zIndex: 40 },
    { x: "clamp(-214px,-15vw,-122px)", y: "clamp(14px,2.5vw,32px)", rotate: -16, zIndex: 24 },
    { x: "clamp(122px,15vw,214px)", y: "clamp(14px,2.5vw,32px)", rotate: 16, zIndex: 18 },
  ],
};

const HERO_STACK_TRANSITION_MS = 520;

const storySteps = [
  {
    href: "/marketplace",
    label: "Inspect",
    kicker: "Start with the slab",
    detail: "Review cert, grade, custody, seller trust, and slab notes before price becomes the only signal.",
    icon: Search,
  },
  {
    href: "/research",
    label: "Read the market",
    kicker: "Comps with context",
    detail: "Compare ask, last comp, population, rarity, and current signal to separate noise from conviction.",
    icon: BookOpen,
  },
  {
    href: "/private-desk",
    label: "Route exceptional slabs",
    kicker: "Private desk",
    detail: "Send rare or high-value cards into specialist review when the decision deserves a slower room.",
    icon: Landmark,
    exclusive: true,
  },
];

const tapeItems = mockListings.map((listing) => ({
  label: `${listing.gradingCompany} ${listing.grade} ${listing.title}`,
  value: formatCurrency(listing.priceCents),
  delta: listing.marketDeltaPercent,
}));

const heroHeadlineWords = "Built For Slabs Worth Slowing Down For.".split(" ");
const workflowHeadingWords = "Inspect First. Read The Market. Route The Exceptional.".split(" ");
const homepagePreviewListings = [
  "2003-pokemon-skyridge-crystal-ho-oh-psa-10",
  "1999-pokemon-first-edition-blastoise-psa-9",
  "2021-pokemon-umbreon-vmax-alt-art-psa-10",
]
  .map((slug) => mockListings.find((listing) => listing.slug === slug))
  .filter(Boolean) as VaultListing[];
const privateDeskCandidate =
  mockListings.find((listing) => listing.listingType === "premier") ?? mockListings[0];
const privateDeskTicketId = "VM-SR-2104";
const strongestSignalListing =
  [...mockListings].sort((a, b) => (b.marketDeltaPercent ?? 0) - (a.marketDeltaPercent ?? 0))[0] ??
  mockListings[0];
const rarestPopulationListing =
  [...mockListings].sort((a, b) => (a.population ?? Number.MAX_SAFE_INTEGER) - (b.population ?? Number.MAX_SAFE_INTEGER))[0] ??
  mockListings[0];

const marketFrictionPoints = [
  {
    label: "Price shown first",
    detail: "The number becomes the story before the card has been read.",
  },
  {
    label: "Cert hidden too deep",
    detail: "Verification sits behind clicks instead of beside the decision.",
  },
  {
    label: "Seller trust unclear",
    detail: "Collectors are left to infer reputation from thin signals.",
  },
  {
    label: "Comps disconnected",
    detail: "Market history is treated like a separate tab, not part of the read.",
  },
  {
    label: "Custody unknown",
    detail: "Where the slab sits can matter as much as what it claims to be.",
  },
];

const researchSignalPoints = [
  {
    label: "Last comp vs current ask",
    value: `${formatCurrency(strongestSignalListing.lastCompCents ?? strongestSignalListing.priceCents)} / ${formatCurrency(strongestSignalListing.priceCents)}`,
    detail: strongestSignalListing.title,
    progress: 74,
  },
  {
    label: "Population / rarity read",
    value: formatPopulation(rarestPopulationListing.population),
    detail: rarestPopulationListing.title,
    progress: 58,
  },
  {
    label: "Market movement",
    value: `${(strongestSignalListing.marketDeltaPercent ?? 0) > 0 ? "+" : ""}${(strongestSignalListing.marketDeltaPercent ?? 0).toFixed(1)}% signal`,
    detail: `${getVaultStatusLabel(strongestSignalListing.vaultStatus)} custody posture`,
    progress: 82,
  },
];

const privateDeskChecklist = [
  {
    label: "Specialist valuation",
    detail: "Estimate range, comps, rarity, and eye appeal reviewed together.",
    icon: BadgeCheck,
  },
  {
    label: "Discreet buyer matching",
    detail: "Relationship-led interest without pushing the slab into open browse pressure.",
    icon: Handshake,
  },
  {
    label: "Vault-backed transfer",
    detail: "Custody posture and seller trust carry forward into the handoff.",
    icon: ShieldCheck,
  },
];

type LandingSectionHeaderProps = {
  eyebrow: string;
  title: string;
  copy: string;
  align?: "left" | "center";
};

function LandingSectionHeader({
  eyebrow,
  title,
  copy,
  align = "left",
}: LandingSectionHeaderProps) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-vault-steel">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-semibold leading-tight text-vault-ink sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-6 text-vault-steel sm:text-base sm:leading-7">
        {copy}
      </p>
    </div>
  );
}

export function MarketDeskHome() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const stackTransitionTimeoutRef = useRef<number | null>(null);
  const [tiltStyle, setTiltStyle] = useState({ transform: "perspective(1100px)" });
  const [stackLayout, setStackLayout] = useState<HeroStackLayout>("clustered");
  const [isStackTransitioning, setIsStackTransitioning] = useState(false);
  const [shouldReduceMotion, setShouldReduceMotion] = useState(false);
  const heroStackListings = useMemo(() => {
    const heroSlugs = [
      "2021-pokemon-umbreon-vmax-alt-art-psa-10",
      "1999-pokemon-base-charizard-psa-9",
      "2000-pokemon-neo-genesis-lugia-holo-psa-9",
    ];

    return heroSlugs
      .map((slug) => mockListings.find((listing) => listing.slug === slug))
      .filter(Boolean) as VaultListing[];
  }, []);

  function setLockedStackLayout(nextLayout: HeroStackLayout) {
    if (isStackTransitioning || nextLayout === stackLayout) return;

    if (stackTransitionTimeoutRef.current !== null) {
      window.clearTimeout(stackTransitionTimeoutRef.current);
    }

    setStackLayout(nextLayout);

    if (shouldReduceMotion) return;

    setIsStackTransitioning(true);
    stackTransitionTimeoutRef.current = window.setTimeout(() => {
      stackTransitionTimeoutRef.current = null;
      setIsStackTransitioning(false);
    }, HERO_STACK_TRANSITION_MS);
  }

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setShouldReduceMotion(reduceMotion);
    if (reduceMotion) return;

    let workflowObserver: IntersectionObserver | null = null;
    let cleanupContainerBounds: (() => void) | null = null;

    const scope = createScope({ root }).add(() => {
      cleanupContainerBounds = installContainerBoundMotion(root);

      const timeline = createTimeline({
        defaults: {
          ease: "outExpo",
        },
      });

      timeline
        .add(".hero-eyebrow", {
          opacity: [0, 1],
          y: [10, 0],
          filter: ["blur(6px)", "blur(0px)"],
          duration: 520,
        })
        .add(
          ".hero-headline-word",
          {
            opacity: [0, 1],
            y: [34, 0],
            filter: ["blur(8px)", "blur(0px)"],
            delay: stagger(54),
            duration: 760,
          },
          "-=240",
        )
        .add(
          ".hero-support-copy",
          {
            opacity: [0, 1],
            y: [16, 0],
            duration: 560,
          },
          "-=420",
        )
        .add(
          ".hero-cta-row > *",
          {
            opacity: [0, 1],
            y: [14, 0],
            delay: stagger(70),
            duration: 520,
          },
          "-=300",
        )
        .add(
          ".hero-proof-item",
          {
            opacity: [0, 1],
            y: [8, 0],
            delay: stagger(58),
            duration: 420,
          },
          "-=280",
        )
        .add(
          ".hero-frame-reveal",
          {
            opacity: [0, 1],
            filter: ["blur(6px)", "blur(0px)"],
            duration: 700,
          },
          "-=920",
        )
        .add(
          ".hero-stack-card",
          {
            opacity: [0, 1],
            filter: ["blur(7px)", "blur(0px)"],
            delay: stagger(92),
            duration: 720,
          },
          "-=620",
        )
        .add(
          ".hero-stack-card-art",
          {
            scale: [0.965, 1],
            delay: stagger(92),
            duration: 680,
          },
          "<",
        )
        .add(
          ".hero-tape-reveal",
          {
            opacity: [0, 1],
            y: [12, 0],
            duration: 520,
          },
          "-=260",
        );

      animate(".signal-node", {
        opacity: [0.16, 0.54, 0.28],
        scale: [0.96, 1.08, 1],
        delay: stagger(140),
        duration: 2600,
        loop: 2,
        ease: "inOutSine",
      });
    });

    const workflowSection = root.querySelector<HTMLElement>(".workflow-section");
    if (workflowSection) {
      let hasPlayedWorkflow = false;

      workflowObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry?.isIntersecting || hasPlayedWorkflow) return;

          hasPlayedWorkflow = true;

          const workflowTimeline = createTimeline({
            defaults: {
              ease: "outExpo",
            },
          });

          workflowTimeline
            .add(workflowSection.querySelectorAll(".workflow-kicker"), {
              opacity: [0, 1],
              y: [10, 0],
              filter: ["blur(5px)", "blur(0px)"],
              duration: 460,
            })
            .add(
              workflowSection.querySelectorAll(".workflow-heading-word"),
              {
                opacity: [0, 1],
                y: [24, 0],
                filter: ["blur(7px)", "blur(0px)"],
                delay: stagger(46),
                duration: 660,
              },
              "-=220",
            )
            .add(
              workflowSection.querySelectorAll(".workflow-support-copy"),
              {
                opacity: [0, 1],
                y: [12, 0],
                duration: 520,
              },
              "-=360",
            )
            .add(
              workflowSection.querySelectorAll(".workflow-step-card"),
              {
                opacity: [0, 1],
                filter: ["blur(8px)", "blur(0px)"],
                delay: stagger(95),
                duration: 620,
              },
              "-=300",
            )
            .add(
              workflowSection.querySelectorAll(".workflow-step-icon"),
              {
                scale: [0.88, 1],
                delay: stagger(95),
                duration: 540,
              },
              "<",
            )
            .add(
              workflowSection.querySelectorAll(".workflow-step-arrow"),
              {
                opacity: [0, 1],
                x: [-8, 0],
                delay: stagger(80),
                duration: 420,
              },
              "-=430",
            );

          workflowObserver?.disconnect();
        },
        { threshold: 0.32, rootMargin: "0px 0px -12% 0px" },
      );

      workflowObserver.observe(workflowSection);
    }

    return () => {
      workflowObserver?.disconnect();
      cleanupContainerBounds?.();
      scope.revert();
    };
  }, []);

  useEffect(() => {
    return () => {
      if (stackTransitionTimeoutRef.current !== null) {
        window.clearTimeout(stackTransitionTimeoutRef.current);
      }
    };
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
      <section className="relative px-3 py-8 sm:px-5 sm:py-10 lg:min-h-[calc(100svh-154px)] lg:px-4 lg:py-0">
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="vault-orbit vault-orbit-one" />
          <div className="vault-orbit vault-orbit-two" />
          <div className="vault-scanline" />
          <div className="signal-node absolute left-[7%] top-[18%] h-2 w-2 rounded-full bg-vault-registry" />
          <div className="signal-node absolute right-[14%] top-[28%] h-2 w-2 rounded-full bg-vault-amber" />
          <div className="signal-node absolute bottom-[18%] left-[41%] h-2 w-2 rounded-full bg-vault-verified" />
        </div>

        <div className="mx-auto grid w-full max-w-[92rem] gap-8 lg:min-h-[calc(100svh-154px)] lg:grid-cols-[minmax(0,0.72fr)_minmax(520px,0.88fr)] lg:items-center">
          <div className="desk-reveal flex flex-col gap-5">
            <div className="hero-eyebrow inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(17,19,15,0.16)] bg-white/42 px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)] motion-safe:opacity-0">
              <Sparkles className="h-4 w-4 text-vault-registry" aria-hidden="true" />
              <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-vault-steel">
                Cert-backed collector desk
              </span>
            </div>

            <div>
              <h1 className="max-w-[45rem] text-[clamp(3.05rem,5.7vw,5.55rem)] font-semibold leading-[0.96] tracking-normal text-vault-ink">
                {heroHeadlineWords.map((word, index) => (
                  <span key={`${word}-${index}`} className="hero-headline-word inline-block will-change-transform motion-safe:opacity-0">
                    {word}
                    {index < heroHeadlineWords.length - 1 ? "\u00a0" : ""}
                  </span>
                ))}
              </h1>
              <p className="hero-support-copy mt-5 max-w-[39rem] text-base leading-7 text-vault-steel motion-safe:opacity-0 sm:text-lg">
                VaultMarket is a trust-first market desk for graded cards where
                collectors inspect, compare, and route exceptional slabs through
                specialist review.
              </p>
            </div>

            <div className="hero-cta-row grid max-w-[39rem] gap-3 sm:grid-cols-[auto_auto_1fr] sm:items-center">
              <Link
                href="/marketplace"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-[7px] border border-vault-graphite bg-vault-ink px-5 text-sm font-semibold text-vault-paper shadow-[0_18px_44px_rgba(17,19,15,0.22)] transition duration-200 hover:-translate-y-0.5 hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)] motion-safe:opacity-0"
              >
                Browse graded cards
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                href="/private-desk"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-[7px] border border-[var(--border-soft)] bg-white/46 px-5 text-sm font-semibold text-vault-graphite transition duration-200 hover:-translate-y-0.5 hover:bg-white/78 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)] motion-safe:opacity-0"
              >
                Private desk access
                <Landmark className="h-4 w-4" aria-hidden="true" />
              </Link>
              <div className="hidden h-px bg-[linear-gradient(90deg,rgba(17,19,15,0.16),transparent)] motion-safe:opacity-0 sm:block" />
            </div>

            <div className="desk-reveal flex max-w-[39rem] flex-wrap items-center gap-x-4 gap-y-2 border-y border-[rgba(17,19,15,0.08)] py-3">
              {[
                "Cert-backed",
                "Market signal",
                "Specialist review",
              ].map((label) => (
                <span
                  key={label}
                  className="hero-proof-item font-mono text-[0.64rem] font-bold uppercase tracking-[0.16em] text-vault-graphite motion-safe:opacity-0"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="desk-reveal">
            <div
              className="hero-slab-motion relative mx-auto h-[440px] max-w-[700px] cursor-pointer overflow-visible rounded-[24px] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)] sm:h-[540px] lg:h-[540px]"
              style={tiltStyle}
              onPointerMove={handlePointerMove}
              onPointerLeave={() => setTiltStyle({ transform: "perspective(1100px)" })}
              onClick={() => setLockedStackLayout(stackLayout === "clustered" ? "spread" : "clustered")}
              onKeyDown={(event) => {
                if (event.key !== "Enter" && event.key !== " ") return;
                event.preventDefault();
                setLockedStackLayout(stackLayout === "clustered" ? "spread" : "clustered");
              }}
              role="button"
              tabIndex={0}
              aria-label={`${stackLayout === "clustered" ? "Open" : "Close"} the graded slab stack`}
              aria-pressed={stackLayout === "spread"}
            >
              <div className="hero-frame-reveal hero-inspection-frame pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[72%] w-[78%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[26px] border border-[rgba(47,94,124,0.12)] bg-[linear-gradient(145deg,rgba(249,248,243,0.14),rgba(255,255,255,0.04)_48%,rgba(47,94,124,0.05))] shadow-[inset_0_1px_0_rgba(255,255,255,0.34),0_22px_72px_rgba(47,94,124,0.08)] motion-safe:opacity-0" aria-hidden="true">
                <div className="absolute inset-6 rounded-[20px] border border-[rgba(47,94,124,0.08)]" />
                <div className="absolute inset-x-16 top-1/2 h-px bg-[linear-gradient(90deg,transparent,rgba(47,94,124,0.16),transparent)]" />
                <div className="hero-inspection-sweep absolute inset-y-[-20%] left-[-32%] w-[28%] rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.26),rgba(155,194,220,0.1),transparent)] opacity-0" />
              </div>
              <div className="absolute left-1/2 top-1/2 -z-10 h-[62%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.46),rgba(111,158,172,0.12)_38%,rgba(166,111,31,0.06)_58%,transparent_74%)] blur-2xl" aria-hidden="true" />
              <div className="absolute inset-x-12 bottom-[3.1rem] -z-10 h-24 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(17,19,15,0.26),rgba(17,19,15,0.1)_44%,transparent_72%)] blur-xl" aria-hidden="true" />
              <div className="absolute inset-x-20 bottom-[5.2rem] -z-10 h-px bg-[linear-gradient(90deg,transparent,rgba(17,19,15,0.16),transparent)]" aria-hidden="true" />
              {heroStackListings.map((listing, index) => {
                const position = heroStackLayouts[stackLayout][index] ?? heroStackLayouts.clustered[0];
                return (
                  <div
                    key={listing.id}
                    className={cn(
                      "hero-stack-card absolute left-1/2 top-[49%] block w-[clamp(214px,28vw,300px)] rounded-[18px] drop-shadow-[0_32px_40px_rgba(17,19,15,0.28)] will-change-[opacity,filter] motion-safe:opacity-0",
                      shouldReduceMotion ? "" : "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    )}
                    style={{
                      zIndex: position.zIndex,
                      transform: `translate(-50%, -50%) translate3d(${position.x}, ${position.y}, 0) rotate(${position.rotate}deg)`,
                    }}
                    aria-label={listing.title}
                  >
                    <div className="hero-stack-card-art relative aspect-[5/7] overflow-hidden rounded-[14px] will-change-transform">
                      <SlabArtImage
                        image={listing.image}
                        sizes="(min-width: 1024px) 300px, 72vw"
                        priority={index === 0}
                      />
                      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.16),transparent_33%,rgba(255,255,255,0.1)_43%,transparent_54%)]" aria-hidden="true" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Market tape" className="hero-tape-reveal relative z-10 border-y border-[rgba(244,241,233,0.08)] bg-vault-ink py-3 text-vault-paper shadow-[0_-18px_48px_rgba(17,19,15,0.08)] motion-safe:opacity-0">
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

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative">
            <div className="pointer-events-none absolute -left-4 top-2 hidden h-28 w-px bg-[linear-gradient(180deg,rgba(47,94,124,0),rgba(47,94,124,0.34),rgba(47,94,124,0))] lg:block" aria-hidden="true" />
            <LandingSectionHeader
              eyebrow="Market friction"
              title="Most marketplaces ask for a decision before showing the evidence."
              copy="VaultMarket slows the browse down. Grade, cert, custody, seller trust, population, and market signal appear before the full inspection view, so collectors are not forced to judge the slab from price alone."
            />
            <div className="mt-8 flex max-w-xl flex-wrap gap-2">
              {["Cert", "Custody", "Seller trust", "Population", "Comps", "Market signal"].map((label) => (
                <span
                  key={label}
                  className="rounded-full border border-[rgba(47,94,124,0.16)] bg-white/38 px-3 py-1.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-vault-steel shadow-[inset_0_1px_0_rgba(255,255,255,0.62)]"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[16px] border border-[rgba(17,19,15,0.12)] bg-[linear-gradient(145deg,rgba(255,255,255,0.56),rgba(244,241,233,0.4))] p-3 shadow-[0_24px_70px_rgba(17,19,15,0.08),inset_0_1px_0_rgba(255,255,255,0.72)]">
            <div className="rounded-[12px] border border-[rgba(17,19,15,0.1)] bg-[rgba(17,19,15,0.92)] p-4 text-vault-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-5">
              <div className="mb-5 flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                  <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/42">
                    Missing context stack
                  </p>
                  <p className="mt-1 text-sm text-vault-paper/62">
                    What gets buried before conviction forms.
                  </p>
                </div>
                <span className="h-2 w-2 rounded-full bg-[#9bc4b2] shadow-[0_0_18px_rgba(155,196,178,0.44)]" aria-hidden="true" />
              </div>

              <div className="space-y-2">
                {marketFrictionPoints.map((item, index) => (
                  <div
                    key={item.label}
                    className="grid gap-3 rounded-[9px] border border-white/8 bg-white/[0.045] p-3 sm:grid-cols-[2.5rem_0.9fr_1.1fr] sm:items-center"
                  >
                    <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#9bc4b2]/72">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm font-semibold text-vault-paper">{item.label}</span>
                    <span className="text-sm leading-6 text-vault-paper/56">{item.detail}</span>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-[10px] border border-[#9bc4b2]/20 bg-[linear-gradient(90deg,rgba(155,196,178,0.14),rgba(47,94,124,0.12),rgba(255,255,255,0.04))] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-[#9bc4b2]">
                    VaultMarket
                  </span>
                  <span className="text-sm font-semibold text-vault-paper">
                    Context before conviction
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="workflow-section px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.58fr_1.42fr] lg:items-center">
          <div>
            <p className="workflow-kicker font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-vault-steel motion-safe:opacity-0">
              VaultMarket method
            </p>
            <h2 className="mt-3 max-w-md text-3xl font-semibold leading-tight text-vault-ink sm:text-4xl">
              {workflowHeadingWords.map((word, index) => (
                <span key={`${word}-${index}`} className="workflow-heading-word inline-block motion-safe:opacity-0">
                  {word}
                  {index < workflowHeadingWords.length - 1 ? "\u00a0" : ""}
                </span>
              ))}
            </h2>
            <p className="workflow-support-copy mt-4 max-w-md text-sm leading-6 text-vault-steel motion-safe:opacity-0">
              The desk is organized around a collector workflow: inspect the slab,
              read the market, and reserve specialist attention for the cards that need it.
            </p>
          </div>

          <div className="relative rounded-[16px] border border-[rgba(17,19,15,0.12)] bg-white/36 p-3 shadow-[0_24px_70px_rgba(17,19,15,0.07),inset_0_1px_0_rgba(255,255,255,0.68)]">
            <div className="pointer-events-none absolute left-[2.2rem] right-[2.2rem] top-[4.4rem] hidden h-px bg-[linear-gradient(90deg,rgba(47,94,124,0.18),rgba(155,196,178,0.36),rgba(17,19,15,0.28))] lg:block" aria-hidden="true" />
            <div className="grid gap-3 lg:grid-cols-3">
            {storySteps.map((item, index) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "workflow-step-card group relative overflow-hidden rounded-[12px] border p-5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)] motion-safe:opacity-0 motion-safe:transition-transform motion-safe:hover:-translate-y-0.5",
                    item.exclusive
                      ? "border-[rgba(17,19,15,0.42)] bg-[linear-gradient(145deg,rgba(17,19,15,0.96),rgba(38,42,34,0.94))] text-vault-paper shadow-[0_26px_70px_rgba(17,19,15,0.22)] hover:border-[#9bc4b2]/28"
                      : "border-[var(--border-soft)] bg-[rgba(255,255,255,0.54)] text-vault-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.64)] hover:border-[rgba(47,94,124,0.24)] hover:bg-white/70",
                  )}
                >
                  <span className={cn("pointer-events-none absolute inset-x-4 top-0 h-px opacity-70 transition-opacity duration-300 group-hover:opacity-100", item.exclusive ? "bg-[linear-gradient(90deg,transparent,rgba(155,196,178,0.55),transparent)]" : "bg-[linear-gradient(90deg,transparent,rgba(47,94,124,0.28),transparent)]")} aria-hidden="true" />
                  <span className={cn("mb-5 flex items-center justify-between gap-4 border-b pb-4", item.exclusive ? "border-white/10" : "border-[rgba(17,19,15,0.08)]")}>
                    <span
                      className={cn(
                        "workflow-step-icon grid h-11 w-11 place-items-center rounded-[8px] border will-change-transform motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-0.5",
                        item.exclusive
                          ? "border-white/12 bg-white/[0.07] text-vault-paper shadow-[0_0_26px_rgba(155,196,178,0.12)]"
                          : "border-[var(--border-soft)] bg-white/58 text-vault-registry",
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span
                      className={cn(
                        "font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em]",
                        item.exclusive ? "text-vault-paper/54" : "text-vault-steel",
                      )}
                    >
                      {String(index + 1).padStart(2, "0")} / {item.kicker}
                    </span>
                  </span>
                  <span className="block min-w-0">
                    <span className="block text-xl font-semibold">{item.label}</span>
                    <span
                      className={cn(
                        "mt-3 block text-sm leading-6",
                        item.exclusive ? "text-vault-paper/64" : "text-vault-steel",
                      )}
                    >
                      {item.detail}
                    </span>
                  </span>
                  <span className={cn("mt-5 block h-1 overflow-hidden rounded-full", item.exclusive ? "bg-white/10" : "bg-[rgba(17,19,15,0.08)]")}>
                    <span
                      className={cn(
                        "block h-full rounded-full transition-all duration-300 motion-reduce:transition-none",
                        item.exclusive
                          ? "w-4/5 bg-[linear-gradient(90deg,rgba(155,196,178,0.42),rgba(244,241,233,0.72))] group-hover:w-full"
                          : "w-3/5 bg-[linear-gradient(90deg,rgba(47,94,124,0.42),rgba(155,196,178,0.58))] group-hover:w-4/5",
                      )}
                    />
                  </span>
                  <span className={cn("mt-5 inline-flex items-center gap-2 text-sm font-semibold", item.exclusive ? "text-vault-paper/74" : "text-vault-registry")}>
                    Continue
                    <ArrowRight
                      className="workflow-step-arrow h-4 w-4 shrink-0 transition motion-safe:group-hover:translate-x-0.5 motion-safe:opacity-0"
                      aria-hidden="true"
                    />
                  </span>
                </Link>
              );
            })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <LandingSectionHeader
              eyebrow="Marketplace preview"
              title="Browse the book before opening the slab."
              copy="Listings surface grade, cert, seller trust, custody posture, ask, and market movement before the collector enters the full inspection room."
            />
            <Link
              href="/marketplace"
              className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-[7px] border border-[var(--border-soft)] bg-white/48 px-4 text-sm font-semibold text-vault-graphite transition duration-200 hover:-translate-y-0.5 hover:bg-white/74 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
            >
              Open marketplace
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {homepagePreviewListings.map((listing) => (
              <article
                key={listing.id}
                className="group relative overflow-hidden rounded-[14px] border border-[rgba(17,19,15,0.12)] bg-[linear-gradient(145deg,rgba(255,255,255,0.58),rgba(244,241,233,0.42))] p-3 shadow-[0_24px_70px_rgba(17,19,15,0.08),inset_0_1px_0_rgba(255,255,255,0.72)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(47,94,124,0.22)]"
              >
                <div className="relative overflow-hidden rounded-[11px] border border-[rgba(17,19,15,0.1)] bg-[rgba(17,19,15,0.92)] p-4">
                  <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(155,196,178,0.42),transparent)]" aria-hidden="true" />
                  <div className="relative mx-auto aspect-[5/7] w-full max-w-[210px] overflow-hidden rounded-[10px] shadow-[0_24px_42px_rgba(0,0,0,0.26)] transition duration-300 group-hover:scale-[1.015] motion-reduce:transition-none">
                    <SlabArtImage image={listing.image} sizes="(min-width: 1024px) 210px, 62vw" />
                  </div>
                </div>

                <div className="px-1 pb-2 pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <ListingTypeBadge type={listing.listingType} compact />
                    <MarketDelta value={listing.marketDeltaPercent} compact />
                  </div>
                  <h3 className="mt-3 min-h-[3.25rem] text-lg font-semibold leading-6 text-vault-ink">
                    {listing.title}
                  </h3>

                  <div className="mt-4 grid grid-cols-2 gap-2 border-y border-[rgba(17,19,15,0.08)] py-3">
                    <div>
                      <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                        Grade
                      </p>
                      <p className="mt-1 text-sm font-semibold text-vault-ink">
                        {listing.gradingCompany} {listing.grade}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                        Ask
                      </p>
                      <p className="mt-1 text-sm font-semibold text-vault-ink">
                        {formatCurrency(listing.priceCents)}
                      </p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                        Cert
                      </p>
                      <p className="mt-1 text-sm font-semibold text-vault-ink">{listing.certNumber}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                        Pop
                      </p>
                      <p className="mt-1 text-sm font-semibold text-vault-ink">
                        {formatPopulation(listing.population).replace("Pop ", "")}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <SellerTrustBadge
                      tier={listing.seller.trustTier}
                      completedSales={listing.seller.completedSales}
                      compact
                    />
                    <span className="rounded-[5px] border border-[rgba(47,94,124,0.18)] bg-[rgba(47,94,124,0.07)] px-1.5 py-1 font-mono text-[0.66rem] font-medium text-[#244f69]">
                      {getVaultStatusLabel(listing.vaultStatus)}
                    </span>
                  </div>

                  <Link
                    href={`/marketplace/${listing.slug}`}
                    className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-[7px] border border-vault-graphite bg-vault-ink px-4 text-sm font-semibold text-vault-paper transition duration-200 hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
                  >
                    Inspect slab
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[18px] border border-[rgba(17,19,15,0.16)] bg-[linear-gradient(135deg,rgba(13,15,12,0.98),rgba(25,29,23,0.98)_48%,rgba(12,14,11,0.98))] p-4 text-vault-paper shadow-[0_28px_90px_rgba(17,19,15,0.22)] sm:p-6 lg:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(244,241,233,0.03)_1px,transparent_1px),linear-gradient(rgba(244,241,233,0.024)_1px,transparent_1px)] bg-[length:38px_38px]" aria-hidden="true" />
          <div className="relative grid gap-6 rounded-[12px] border border-white/10 bg-white/[0.035] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] sm:p-5 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.055] px-3 py-1.5">
                <LineChart className="h-4 w-4 text-[#9bc4b2]" aria-hidden="true" />
                <span className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/58">
                  Research signal
                </span>
              </div>
              <h2 className="mt-5 max-w-xl text-3xl font-semibold leading-tight text-vault-paper sm:text-4xl">
                Market context before conviction.
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-6 text-vault-paper/64 sm:text-base sm:leading-7">
                Comparable sales, current ask, rarity, custody posture, and live signal help collectors understand the slab before making a move.
              </p>
              <Link
                href="/research"
                className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-[7px] border border-white/12 bg-white/[0.075] px-4 text-sm font-semibold text-vault-paper transition duration-200 hover:-translate-y-0.5 hover:border-[#9bc4b2]/32 hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9bc4b2] focus-visible:ring-offset-2 focus-visible:ring-offset-vault-ink"
              >
                Research desk
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-3 lg:grid-cols-[0.86fr_1.14fr]">
              <div className="rounded-[11px] border border-white/10 bg-black/[0.14] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/46">
                    Confidence arc
                  </span>
                  <Gauge className="h-4 w-4 text-vault-paper/48" aria-hidden="true" />
                </div>
                <div className="mx-auto mt-5 grid h-36 w-36 place-items-center rounded-full bg-[conic-gradient(from_215deg,rgba(155,196,178,0.9)_0deg,rgba(47,94,124,0.72)_218deg,rgba(255,255,255,0.08)_219deg_360deg)] p-2 shadow-[0_0_38px_rgba(47,94,124,0.14)]">
                  <div className="grid h-full w-full place-items-center rounded-full border border-white/10 bg-[rgba(17,19,15,0.94)] text-center">
                    <span>
                      <span className="block text-3xl font-semibold text-vault-paper">82</span>
                      <span className="mt-1 block font-mono text-[0.56rem] font-semibold uppercase tracking-[0.15em] text-vault-paper/46">
                        Signal read
                      </span>
                    </span>
                  </div>
                </div>
                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
                  <div className="live-progress-fill h-full rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.56),rgba(155,196,178,0.78))]" style={{ width: "82%" }} />
                </div>
                <p className="mt-3 text-center text-xs leading-5 text-vault-paper/50">
                  Ask, comps, rarity, and custody aligned for a cleaner read.
                </p>
              </div>

              <div className="grid gap-2">
                {researchSignalPoints.map((item, index) => (
                  <article
                    key={item.label}
                    className="research-scan-row group rounded-[10px] border border-white/10 bg-white/[0.055] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.07)] transition duration-200 hover:border-[#9bc4b2]/24 hover:bg-white/[0.075]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/44">
                          {String(index + 1).padStart(2, "0")} / {item.label}
                        </p>
                        <h3 className="mt-1 text-sm font-semibold text-vault-paper sm:text-base">
                          {item.value}
                        </h3>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-[#9bc4b2] opacity-70 shadow-[0_0_18px_rgba(155,196,178,0.42)] transition group-hover:opacity-100" aria-hidden="true" />
                    </div>
                    <p className="mt-2 truncate text-sm text-vault-paper/56">{item.detail}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/[0.08]" aria-hidden="true">
                      <div
                        className="live-progress-fill h-full rounded-full bg-[linear-gradient(90deg,rgba(47,94,124,0.52),rgba(155,196,178,0.74))]"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.86fr_1.14fr] lg:items-center">
          <div>
            <LandingSectionHeader
              eyebrow="Private desk handoff"
              title="Exceptional slabs deserve a slower room."
              copy="Rare, expensive, or relationship-led cards can move from inspection into a discreet specialist review path with valuation, custody posture, comps, and seller trust carried forward."
            />
            <Link
              href="/private-desk"
              className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-[7px] border border-vault-graphite bg-vault-ink px-5 text-sm font-semibold text-vault-paper shadow-[0_18px_44px_rgba(17,19,15,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
            >
              Enter Private Desk
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="private-desk-console relative overflow-hidden rounded-[18px] border border-[rgba(17,19,15,0.22)] bg-[linear-gradient(135deg,rgba(13,15,12,0.98),rgba(26,29,31,0.98)_52%,rgba(13,15,12,0.98))] p-4 text-vault-paper shadow-[0_30px_92px_rgba(17,19,15,0.24)] sm:p-5">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(244,241,233,0.03)_1px,transparent_1px),linear-gradient(rgba(244,241,233,0.024)_1px,transparent_1px)] bg-[length:42px_42px]" aria-hidden="true" />
            <div className="private-desk-sweep pointer-events-none absolute inset-0" aria-hidden="true" />
            <div className="relative grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <article className="rounded-[13px] border border-white/10 bg-white/[0.055] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/48">
                      Lead candidate
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-6 text-vault-paper">
                      {privateDeskCandidate.title}
                    </h3>
                  </div>
                  <span className="grid h-10 w-10 place-items-center rounded-[8px] border border-white/10 bg-white/[0.07] text-[#9bc2dc]">
                    <Landmark className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/42">
                      Grade
                    </p>
                    <p className="mt-1 text-sm font-semibold text-vault-paper">
                      {privateDeskCandidate.gradingCompany} {privateDeskCandidate.grade}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/42">
                      Ask
                    </p>
                    <p className="mt-1 text-sm font-semibold text-vault-paper">
                      {formatCurrency(privateDeskCandidate.priceCents)}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/42">
                      Custody
                    </p>
                    <p className="mt-1 text-sm font-semibold text-vault-paper">
                      {getVaultStatusLabel(privateDeskCandidate.vaultStatus)}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/42">
                      Signal
                    </p>
                    <p className="mt-1 text-sm font-semibold text-vault-paper">
                      +{(privateDeskCandidate.marketDeltaPercent ?? 0).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </article>

              <article className="relative overflow-hidden rounded-[13px] border border-[rgba(155,194,220,0.18)] bg-[linear-gradient(145deg,rgba(255,255,255,0.1),rgba(255,255,255,0.045))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                <div className="absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(155,194,220,0.58),transparent)]" aria-hidden="true" />
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/46">
                      Desk ticket
                    </p>
                    <p className="mt-2 font-mono text-2xl font-semibold tracking-[0.08em] text-vault-paper">
                      {privateDeskTicketId}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(155,194,220,0.2)] bg-[rgba(47,94,124,0.14)] px-3 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-[#9bc2dc]">
                    <span className="private-desk-pulse h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
                    Verified path
                  </span>
                </div>

                <div className="mt-5 grid gap-2">
                  {privateDeskChecklist.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="grid grid-cols-[auto_1fr] gap-3 rounded-[9px] border border-white/10 bg-black/[0.14] p-3"
                      >
                        <span className="grid h-9 w-9 place-items-center rounded-[7px] border border-white/10 bg-white/[0.06] text-[#9bc2dc]">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span>
                          <span className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/42">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className="mt-1 block text-sm font-semibold text-vault-paper">
                            {item.label}
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-vault-paper/52">
                            {item.detail}
                          </span>
                        </span>
                      </div>
                    );
                  })}
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <LandingSectionHeader
            eyebrow="Final entry"
            title="Enter the desk with context."
            copy="Browse the market, compare the signal, or move directly into private review when the slab calls for more time."
            align="center"
          />
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/marketplace"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[7px] border border-vault-graphite bg-vault-ink px-5 text-sm font-semibold text-vault-paper shadow-[0_18px_44px_rgba(17,19,15,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
            >
              Browse graded cards
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/private-desk"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-[7px] border border-[var(--border-soft)] bg-white/50 px-5 text-sm font-semibold text-vault-graphite transition duration-200 hover:-translate-y-0.5 hover:bg-white/78 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
            >
              Private desk access
              <Landmark className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
