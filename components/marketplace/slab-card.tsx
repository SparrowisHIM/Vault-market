"use client";

import { useRef } from "react";
import { animate } from "animejs";
import { SlabArtImage } from "@/components/marketplace/slab-art-image";
import { formatCertNumber, formatCurrency, formatPopulation } from "@/lib/marketplace/format";
import type { SlabCardVariant, VaultListing } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";
import { GradeBadge } from "./grade-badge";
import { ListingTypeBadge } from "./listing-type-badge";
import { MarketDelta } from "./market-delta";
import { QuickActions } from "./quick-actions";
import { SellerTrustBadge } from "./seller-trust-badge";

type SlabCardProps = {
  listing: VaultListing;
  variant?: SlabCardVariant;
  sourceHref?: string;
  compareQueued?: boolean;
  onCompareToggle?: (listing: VaultListing, nextCompared: boolean) => boolean | void;
};

const statusStyles = {
  active: "border-[rgba(47,113,88,0.28)] text-[#235844]",
  reserved: "border-[rgba(166,111,31,0.32)] text-[#744e18]",
  sold: "border-[rgba(17,19,15,0.18)] text-vault-steel",
};

export function SlabCard({
  listing,
  variant = "default",
  sourceHref,
  compareQueued,
  onCompareToggle,
}: SlabCardProps) {
  const compact = variant === "compact";
  const rootRef = useRef<HTMLElement | null>(null);
  const slabImageRef = useRef<HTMLDivElement | null>(null);
  const sweepRef = useRef<HTMLDivElement | null>(null);
  const cardSweepRef = useRef<HTMLDivElement | null>(null);
  const gradeRef = useRef<HTMLDivElement | null>(null);
  const authBandRef = useRef<HTMLDivElement | null>(null);
  const certRef = useRef<HTMLParagraphElement | null>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const reduceMotionRef = useRef(false);

  function syncReducedMotionPreference() {
    reduceMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function runInspectionSweep() {
    syncReducedMotionPreference();
    if (reduceMotionRef.current) return;

    if (sweepRef.current) {
      animate(sweepRef.current, {
        translateX: ["-140%", "140%"],
        opacity: [0, 0.86, 0],
        duration: 680,
        ease: "outExpo",
      });
    }

    if (cardSweepRef.current) {
      animate(cardSweepRef.current, {
        translateX: ["-125%", "125%"],
        opacity: [0, 0.42, 0],
        duration: 780,
        ease: "outExpo",
      });
    }

    if (gradeRef.current) {
      animate(gradeRef.current, {
        scale: [1, 1.035, 1],
        duration: 420,
        ease: "outExpo",
      });
    }

    if (authBandRef.current) {
      animate(authBandRef.current, {
        backgroundColor: [
          "rgba(255,255,255,0.32)",
          "rgba(255,255,255,0.5)",
          "rgba(255,255,255,0.32)",
        ],
        boxShadow: [
          "inset 0 1px 0 rgba(255,255,255,0.55), 0 0 0 0 rgba(47,94,124,0)",
          "inset 0 1px 0 rgba(255,255,255,0.72), 0 0 0 1px rgba(47,94,124,0.2), 0 10px 24px rgba(47,94,124,0.1)",
          "inset 0 1px 0 rgba(255,255,255,0.55), 0 0 0 0 rgba(47,94,124,0)",
        ],
        duration: 620,
        ease: "outExpo",
      });
    }

    if (certRef.current) {
      animate(certRef.current, {
        color: ["#232620", "#2f5e7c", "#232620"],
        translateX: [0, 0.5, 0],
        duration: 440,
        ease: "outExpo",
      });
    }
  }

  function handlePointerEnter(event: React.PointerEvent<HTMLElement>) {
    boundsRef.current = event.currentTarget.getBoundingClientRect();
    runInspectionSweep();
  }

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    syncReducedMotionPreference();
    const root = rootRef.current;
    const image = slabImageRef.current;
    const bounds = boundsRef.current;

    if (!root || !image || !bounds || reduceMotionRef.current) return;

    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    const rotateX = compact ? y * -3 : y * -5;
    const rotateY = compact ? x * 4 : x * 7;

    root.style.transform = `translate3d(0,-4px,0) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    image.style.transform = `translate3d(${x * 7}px, ${y * 7}px, 0) scale(1.035)`;
  }

  function resetTilt() {
    const root = rootRef.current;
    const image = slabImageRef.current;

    boundsRef.current = null;
    if (root) root.style.transform = "";
    if (image) image.style.transform = "";
  }

  return (
    <article
      ref={rootRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onFocusCapture={runInspectionSweep}
      onBlurCapture={resetTilt}
      className={cn(
        "slab-motion-card group relative isolate overflow-hidden rounded-[8px] border border-[var(--border-medium)] bg-[var(--surface-panel)] shadow-slab backdrop-blur transition duration-200 hover:border-[rgba(47,94,124,0.26)] hover:shadow-slab-hover focus-within:border-[rgba(47,94,124,0.3)] focus-within:shadow-slab-hover",
        compact ? "p-2.5" : "p-3 sm:p-4",
      )}
    >
      <div className="slab-depth-ring pointer-events-none absolute inset-0 rounded-[8px]" aria-hidden="true" />
      <div
        ref={cardSweepRef}
        className="pointer-events-none absolute inset-y-[-18%] left-0 z-10 w-1/3 -translate-x-[125%] rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent)] opacity-0"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-5 top-0 h-px bg-white/80"
        aria-hidden="true"
      />
      <div
        className={cn(
          "grid min-w-0 gap-3",
          compact ? "grid-cols-[82px_1fr]" : "grid-cols-[minmax(112px,0.8fr)_1fr] sm:grid-cols-[minmax(132px,0.72fr)_1fr]",
        )}
      >
          <div
            ref={slabImageRef}
            className={cn(
            "slab-image-plane relative overflow-hidden rounded-[7px] border border-[rgba(17,19,15,0.2)] bg-[var(--surface-inset)] shadow-[inset_0_1px_10px_rgba(17,19,15,0.08)] transition duration-200",
            compact ? "aspect-[5/7]" : "aspect-[5/7]",
          )}
        >
          <SlabArtImage
            image={listing.image}
            sizes={compact ? "82px" : "(min-width: 1280px) 150px, (min-width: 768px) 28vw, 34vw"}
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.2),transparent_34%,rgba(255,255,255,0.16)_42%,transparent_52%)] opacity-55"
            aria-hidden="true"
          />
          <div
            ref={sweepRef}
            className="pointer-events-none absolute inset-y-[-12%] left-0 w-1/2 -translate-x-[140%] rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.48),transparent)] opacity-0"
            aria-hidden="true"
          />
        </div>

        <div className="flex min-w-0 flex-col justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <ListingTypeBadge type={listing.listingType} compact={compact} />
                  <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-vault-steel">
                    {listing.year} / {listing.franchise}
                  </p>
                </div>
                <h2
                  className={cn(
                    "mt-1 line-clamp-2 font-semibold leading-tight text-vault-ink",
                    compact ? "text-sm" : "text-lg",
                  )}
                >
                  {listing.title}
                </h2>
              </div>
              <span
                className={cn(
                  "shrink-0 rounded-full border bg-white/38 px-2 py-0.5 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em]",
                  statusStyles[listing.status],
                )}
              >
                {listing.status}
              </span>
            </div>

            <div
              ref={authBandRef}
              className={cn(
                "slab-auth-band flex flex-wrap items-center gap-2 transition duration-200",
                compact && "gap-1.5",
              )}
            >
              <div ref={gradeRef} className="origin-center">
                <GradeBadge
                  company={listing.gradingCompany}
                  grade={listing.grade}
                  compact={compact}
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-vault-graphite">
                  {listing.setName}
                  {listing.cardNumber ? ` / ${listing.cardNumber}` : ""}
                </p>
                <p
                  ref={certRef}
                  className="font-mono text-[0.68rem] font-bold tabular-nums tracking-[0.04em] text-vault-graphite"
                >
                  Cert {formatCertNumber(listing.certNumber)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div
              className={cn(
                "grid gap-2 rounded-[7px] border border-[rgba(17,19,15,0.1)] bg-[rgba(255,255,255,0.44)]",
                compact ? "p-2" : "grid-cols-[1fr_auto] p-3",
              )}
            >
              <div>
                <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                  Ask
                </p>
                <p className={cn("font-semibold text-vault-ink", compact ? "text-lg" : "text-2xl")}>
                  {formatCurrency(listing.priceCents)}
                </p>
              </div>
              <div className={cn("flex flex-wrap items-end gap-1.5", !compact && "justify-end")}>
                <MarketDelta value={listing.marketDeltaPercent} compact={compact} />
                <span
                  className={cn(
                    "rounded-[5px] border border-[rgba(17,19,15,0.1)] bg-[rgba(17,19,15,0.035)] px-2 py-1 font-mono font-medium text-vault-steel",
                    compact ? "text-[0.66rem]" : "text-[0.72rem]",
                  )}
                >
                  {formatPopulation(listing.population)}
                </span>
              </div>
            </div>

            <div className="flex min-w-0 flex-wrap items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-vault-graphite">
                  {listing.seller.name}
                </p>
                {!compact && (
                  <p className="truncate text-xs text-vault-steel">{listing.seller.location}</p>
                )}
              </div>
              <SellerTrustBadge
                tier={listing.seller.trustTier}
                completedSales={listing.seller.completedSales}
                compact={compact}
              />
            </div>

            <QuickActions
              listingSlug={listing.slug}
              listingTitle={listing.title}
              sourceHref={sourceHref}
              compact={compact}
              compareQueued={compareQueued}
              onCompareToggle={
                onCompareToggle
                  ? (nextCompared) => onCompareToggle(listing, nextCompared)
                  : undefined
              }
            />
          </div>
        </div>
      </div>
    </article>
  );
}
