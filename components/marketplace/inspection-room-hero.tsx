"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { animate, createScope, stagger } from "animejs";
import { BadgeCheck, ScanLine, ShieldCheck } from "lucide-react";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { QuickActions } from "@/components/marketplace/quick-actions";
import {
  formatCertNumber,
  formatCurrency,
  formatEstimateRange,
  formatPopulation,
  getVerificationStatusLabel,
} from "@/lib/marketplace/format";
import type { VaultListing } from "@/lib/marketplace/types";

type InspectionRoomHeroProps = {
  listing: VaultListing;
};

export function InspectionRoomHero({ listing }: InspectionRoomHeroProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const slabRef = useRef<HTMLDivElement | null>(null);
  const sweepRef = useRef<HTMLDivElement | null>(null);
  const boundsRef = useRef<DOMRect | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const scope = createScope({ root }).add(() => {
      animate(".inspection-reveal", {
        opacity: [0, 1],
        translateY: [18, 0],
        delay: stagger(65),
        duration: 620,
        ease: "outExpo",
      });

      animate(".inspection-pulse", {
        opacity: [0.26, 0.62, 0.26],
        scale: [0.94, 1.08, 0.94],
        delay: stagger(160),
        duration: 2600,
        loop: true,
        ease: "inOutSine",
      });
    });

    return () => scope.revert();
  }, []);

  function prefersReducedMotion() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function runSweep() {
    if (!sweepRef.current || prefersReducedMotion()) return;

    animate(sweepRef.current, {
      translateX: ["-140%", "140%"],
      opacity: [0, 0.9, 0],
      duration: 780,
      ease: "outExpo",
    });
  }

  function handlePointerEnter(event: React.PointerEvent<HTMLDivElement>) {
    boundsRef.current = event.currentTarget.getBoundingClientRect();
    runSweep();
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const slab = slabRef.current;
    const bounds = boundsRef.current;
    if (!slab || !bounds || prefersReducedMotion()) return;

    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    slab.style.transform = `perspective(1200px) rotateX(${y * -7}deg) rotateY(${x * 9}deg) translate3d(0,-5px,0)`;
  }

  function resetTilt() {
    boundsRef.current = null;
    if (slabRef.current) {
      slabRef.current.style.transform = "";
    }
  }

  return (
    <aside ref={rootRef} className="lg:sticky lg:top-32 lg:self-start">
      <div className="inspection-reveal relative overflow-hidden rounded-[12px] border border-[var(--border-medium)] bg-[rgba(17,19,15,0.92)] p-3 text-vault-paper shadow-[0_32px_90px_rgba(17,19,15,0.28)] sm:p-4">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="inspection-pulse absolute -right-16 top-10 h-44 w-44 rounded-full border border-white/10" />
          <div className="inspection-pulse absolute -bottom-20 left-8 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute inset-x-0 top-0 h-px bg-white/25" />
        </div>

        <div className="relative z-10 grid gap-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/62">
                Inspection room
              </p>
              <p className="mt-1 text-sm font-semibold text-vault-paper">
                {listing.gradingCompany} cert {formatCertNumber(listing.certNumber)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.06] px-3 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-vault-paper/76">
              <ShieldCheck className="h-3.5 w-3.5 text-[#82c7a9]" aria-hidden="true" />
              {getVerificationStatusLabel(listing.verificationStatus)}
            </span>
          </div>

          <div
            ref={slabRef}
            onPointerEnter={handlePointerEnter}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
            onFocusCapture={runSweep}
            className="inspection-slab-plane relative mx-auto aspect-[5/7] w-full max-w-[500px] overflow-hidden rounded-[10px] border border-white/15 bg-[rgba(244,241,233,0.08)] shadow-[inset_0_1px_18px_rgba(255,255,255,0.08),0_18px_50px_rgba(0,0,0,0.3)]"
          >
            <Image
              src={listing.imageUrl}
              alt={listing.imageAlt}
              fill
              sizes="(min-width: 1024px) 40vw, 92vw"
              unoptimized
              priority
              className="object-cover"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.2),transparent_34%,rgba(255,255,255,0.16)_42%,transparent_52%)] opacity-60"
              aria-hidden="true"
            />
            <div
              ref={sweepRef}
              className="pointer-events-none absolute inset-y-[-12%] left-0 w-1/2 -translate-x-[140%] rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.48),transparent)] opacity-0"
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute inset-x-4 bottom-4 grid gap-1 rounded-[8px] border border-white/10 bg-black/30 p-3 backdrop-blur-sm">
              <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/58">
                Slab signal
              </p>
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-vault-paper">
                <span>{formatPopulation(listing.population)}</span>
                <span className="text-vault-paper/34">/</span>
                <span>{listing.inspectionHighlights.length} notes</span>
              </div>
            </div>
          </div>

          <div className="grid gap-2 rounded-[10px] border border-white/10 bg-white/[0.06] p-3">
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <div>
                <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/58">
                  Ask
                </p>
                <p className="mt-1 text-3xl font-semibold text-vault-paper">
                  {formatCurrency(listing.priceCents)}
                </p>
              </div>
              <div className="grid content-end justify-items-end gap-2">
                <MarketDelta value={listing.marketDeltaPercent} compact />
                <span className="rounded-[5px] border border-white/10 bg-white/[0.06] px-2 py-1 font-mono text-[0.68rem] font-semibold text-vault-paper/70">
                  Last comp{" "}
                  {listing.lastCompCents ? formatCurrency(listing.lastCompCents) : "pending"}
                </span>
              </div>
            </div>
            <div className="grid gap-2 rounded-[8px] border border-white/10 bg-black/12 p-3">
              <div className="flex items-center gap-2">
                <ScanLine className="h-4 w-4 text-[#82c7a9]" aria-hidden="true" />
                <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/58">
                  Desk estimate
                </p>
              </div>
              <p className="text-sm font-semibold text-vault-paper">
                {formatEstimateRange(listing.estimatedRangeCents)}
              </p>
            </div>
          </div>

          <div className="rounded-[10px] border border-white/10 bg-[rgba(244,241,233,0.92)] p-3 text-vault-ink">
            <div className="mb-3 flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-vault-registry" aria-hidden="true" />
              <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                Collector actions
              </p>
            </div>
            <QuickActions listingSlug={listing.slug} listingTitle={listing.title} />
          </div>
        </div>
      </div>
    </aside>
  );
}
