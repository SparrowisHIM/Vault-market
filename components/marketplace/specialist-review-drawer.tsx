"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { animate, stagger } from "animejs";
import {
  BadgeCheck,
  Landmark,
  ScanLine,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { SellerTrustBadge } from "@/components/marketplace/seller-trust-badge";
import {
  formatCertNumber,
  formatCurrency,
  formatEstimateRange,
  getVaultStatusLabel,
} from "@/lib/marketplace/format";
import type { VaultListing } from "@/lib/marketplace/types";

type SpecialistReviewStatus = "review" | "success";

type SpecialistReviewDrawerProps = {
  listing: VaultListing;
  isOpen: boolean;
  status: SpecialistReviewStatus;
  onClose: () => void;
  onConfirm: () => void;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function ReviewFact({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="review-row rounded-[7px] border border-[var(--border-soft)] bg-white/44 p-3">
      <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-vault-ink">{value}</p>
    </div>
  );
}

export function SpecialistReviewDrawer({
  listing,
  isOpen,
  status,
  onClose,
  onConfirm,
}: SpecialistReviewDrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const sweepRef = useRef<HTMLDivElement | null>(null);
  const checkRef = useRef<HTMLDivElement | null>(null);
  const checkPathRef = useRef<SVGPathElement | null>(null);
  const sparkleRef = useRef<HTMLDivElement | null>(null);
  const ticketRef = useRef<HTMLDivElement | null>(null);
  const successCopyRef = useRef<HTMLDivElement | null>(null);
  const packetSweepRef = useRef<HTMLDivElement | null>(null);
  const queuedBadgeRef = useRef<HTMLSpanElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const deskTicket = `VM-DR-${listing.certNumber.replace(/\D/g, "").slice(-4) || "2048"}`;

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    restoreFocusRef.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      restoreFocusRef.current?.focus();
      restoreFocusRef.current = null;
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !panelRef.current || prefersReducedMotion()) return;

    animate(panelRef.current, {
      opacity: [0, 1],
      translateX: ["7%", "0%"],
      translateY: ["4%", "0%"],
      duration: 460,
      ease: "outExpo",
    });

    animate(panelRef.current.querySelectorAll(".review-row"), {
      opacity: [0, 1],
      translateY: [12, 0],
      delay: stagger(42, { start: 120 }),
      duration: 420,
      ease: "outExpo",
    });
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || status !== "success" || prefersReducedMotion()) return;

    if (sweepRef.current) {
      animate(sweepRef.current, {
        translateX: ["-135%", "135%"],
        opacity: [0, 0.82, 0],
        duration: 920,
        ease: "outExpo",
      });
    }

    if (checkRef.current) {
      animate(checkRef.current, {
        boxShadow: [
          "0 0 0 rgba(47,113,88,0)",
          "0 0 0 12px rgba(47,113,88,0.08)",
          "0 0 0 rgba(47,113,88,0)",
        ],
        scale: [0.86, 1.04, 1],
        rotate: [-4, 0],
        duration: 760,
        ease: "outExpo",
      });
    }

    if (checkPathRef.current) {
      animate(checkPathRef.current, {
        strokeDashoffset: [31, 0],
        duration: 680,
        delay: 80,
        ease: "outExpo",
      });
    }

    if (successCopyRef.current) {
      animate(successCopyRef.current, {
        opacity: [0, 1],
        translateY: [10, 0],
        delay: 110,
        duration: 520,
        ease: "outExpo",
      });
    }

    if (ticketRef.current) {
      animate(ticketRef.current, {
        opacity: [0, 1],
        translateY: [22, 0],
        scale: [0.97, 1],
        rotate: [-0.8, 0],
        delay: 280,
        duration: 660,
        ease: "outExpo",
      });
    }

    if (packetSweepRef.current) {
      animate(packetSweepRef.current, {
        translateX: ["-130%", "130%"],
        opacity: [0, 0.72, 0],
        delay: 430,
        duration: 820,
        ease: "outExpo",
      });
    }

    if (queuedBadgeRef.current) {
      animate(queuedBadgeRef.current, {
        scale: [0.96, 1.05, 1],
        boxShadow: [
          "0 0 0 rgba(47,113,88,0)",
          "0 0 0 8px rgba(47,113,88,0.08)",
          "0 0 0 rgba(47,113,88,0)",
        ],
        delay: 540,
        duration: 620,
        ease: "outExpo",
      });
    }

    if (sparkleRef.current) {
      animate(sparkleRef.current.querySelectorAll(".review-spark"), {
        opacity: [0, 1, 0],
        scale: [0.55, 1, 1.18],
        translateY: [4, -6],
        delay: stagger(90, { start: 220 }),
        duration: 680,
        ease: "outExpo",
      });
    }
  }, [isOpen, status]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50" role="presentation">
      <button
        type="button"
        aria-label="Close specialist review"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(17,19,15,0.46)] backdrop-blur-[3px]"
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="specialist-review-title"
        className="absolute inset-x-0 bottom-0 max-h-[90svh] overflow-hidden rounded-t-[14px] border border-[var(--border-medium)] bg-[var(--surface-panel)] text-vault-ink shadow-[0_-24px_80px_rgba(17,19,15,0.28)] md:inset-y-0 md:left-auto md:right-0 md:h-full md:max-h-none md:w-full md:max-w-[480px] md:rounded-none md:border-y-0 md:border-r-0 md:shadow-[-28px_0_90px_rgba(17,19,15,0.24)]"
      >
        <div
          ref={sweepRef}
          className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/2 -translate-x-[130%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.72),transparent)] opacity-0"
          aria-hidden="true"
        />

        <div className="flex h-full max-h-[90svh] flex-col md:max-h-none">
          <header className="border-b border-[var(--border-soft)] bg-[rgba(255,255,255,0.38)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
                  Specialist review ticket
                </p>
                <h2
                  id="specialist-review-title"
                  className="mt-2 text-2xl font-semibold leading-tight text-vault-ink"
                >
                  {status === "success"
                    ? "Specialist review requested"
                    : "Route this slab to the private desk"}
                </h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/52 text-vault-graphite transition hover:bg-white/82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                aria-label="Close specialist review panel"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4">
            {status === "success" ? (
              <div className="grid min-h-[54svh] content-center gap-5 text-center" aria-live="polite">
                <div className="relative mx-auto grid h-24 w-24 place-items-center">
                  <div
                    ref={sparkleRef}
                    className="pointer-events-none absolute inset-0"
                    aria-hidden="true"
                  >
                    <Sparkles className="review-spark absolute left-0 top-3 h-4 w-4 text-vault-amber opacity-0" />
                    <Sparkles className="review-spark absolute right-1 top-1 h-5 w-5 text-vault-registry opacity-0" />
                    <Sparkles className="review-spark absolute bottom-2 left-7 h-4 w-4 text-vault-verified opacity-0" />
                  </div>
                  <div
                    ref={checkRef}
                    className="grid h-20 w-20 place-items-center rounded-full border border-[rgba(47,113,88,0.3)] bg-[rgba(47,113,88,0.1)] text-[#235844]"
                  >
                    <svg
                      viewBox="0 0 32 32"
                      className="h-10 w-10"
                      aria-hidden="true"
                    >
                      <path
                        ref={checkPathRef}
                        d="M8.5 16.5 13.2 21 23.8 10.7"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="3"
                        style={{ strokeDasharray: 31, strokeDashoffset: 0 }}
                      />
                    </svg>
                  </div>
                </div>

                <div ref={successCopyRef} className="opacity-100">
                  <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
                    Desk queue
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-vault-ink">
                    Desk request logged
                  </h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-vault-steel">
                    This slab has been added to the specialist review queue for
                    pricing context, custody confidence, seller trust, and inspection
                    notes.
                  </p>
                </div>

                <div
                  ref={ticketRef}
                  className="relative mx-auto w-full max-w-sm overflow-hidden rounded-[9px] border border-[rgba(47,113,88,0.24)] bg-white/54 p-3 text-left opacity-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.72)]"
                >
                  <div
                    ref={packetSweepRef}
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -translate-x-[130%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.86),transparent)] opacity-0"
                    aria-hidden="true"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                        Desk ticket {deskTicket}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-vault-ink">
                        Ask, estimate, cert, custody, seller trust, and inspection context.
                      </p>
                    </div>
                    <span
                      ref={queuedBadgeRef}
                      className="rounded-[5px] border border-[rgba(47,113,88,0.24)] bg-[rgba(47,113,88,0.08)] px-2 py-1 font-mono text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-[#235844]"
                    >
                      Queued
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                <section className="review-row rounded-[9px] border border-[var(--border-soft)] bg-white/44 p-4">
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-[var(--border-soft)] bg-white/52 text-vault-registry">
                      <Landmark className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold leading-tight text-vault-ink">
                        {listing.title}
                      </h3>
                      <p className="mt-1 text-sm leading-5 text-vault-steel">
                        {listing.year} / {listing.franchise} / {listing.setName}
                      </p>
                    </div>
                  </div>
                </section>

                <section
                  aria-label="Specialist review summary"
                  className="grid gap-2 sm:grid-cols-2"
                >
                  <ReviewFact label="Grade" value={`${listing.gradingCompany} ${listing.grade}`} />
                  <ReviewFact label="Cert" value={formatCertNumber(listing.certNumber)} />
                  <ReviewFact label="Ask" value={formatCurrency(listing.priceCents)} />
                  <ReviewFact
                    label="Estimate"
                    value={formatEstimateRange(listing.estimatedRangeCents)}
                  />
                  <ReviewFact
                    label="Custody"
                    value={getVaultStatusLabel(listing.vaultStatus)}
                  />
                  <div className="review-row rounded-[7px] border border-[var(--border-soft)] bg-white/44 p-3">
                    <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                      Seller trust
                    </p>
                    <div className="mt-2">
                      <SellerTrustBadge
                        tier={listing.seller.trustTier}
                        completedSales={listing.seller.completedSales}
                      />
                    </div>
                  </div>
                </section>

                <section className="review-row rounded-[9px] border border-[var(--border-soft)] bg-[rgba(17,19,15,0.88)] p-4 text-vault-paper">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-vault-paper/58">
                        Market context
                      </p>
                      <p className="mt-2 text-sm font-semibold text-vault-paper">
                        Last comp{" "}
                        {listing.lastCompCents
                          ? formatCurrency(listing.lastCompCents)
                          : "pending"}
                      </p>
                    </div>
                    <MarketDelta value={listing.marketDeltaPercent} compact />
                  </div>
                </section>

                <section className="review-row rounded-[9px] border border-[var(--border-soft)] bg-white/44 p-4">
                  <div className="flex items-start gap-3">
                    <ScanLine className="mt-0.5 h-5 w-5 shrink-0 text-vault-registry" aria-hidden="true" />
                    <div>
                      <h3 className="text-sm font-semibold text-vault-ink">
                        Why specialist review matters
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-vault-steel">
                        A private desk review helps evaluate high-value slabs through
                        pricing context, cert confidence, custody posture, and seller
                        trust before a serious desk conversation.
                      </p>
                    </div>
                  </div>
                </section>

                <section className="review-row rounded-[9px] border border-[var(--border-soft)] bg-white/44 p-4">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="h-4 w-4 text-vault-registry" aria-hidden="true" />
                    <h3 className="text-sm font-semibold text-vault-ink">
                      Inspection notes included
                    </h3>
                  </div>
                  <ul className="mt-3 grid gap-2">
                    {listing.inspectionHighlights.slice(0, 3).map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-sm text-vault-steel">
                        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-vault-verified" aria-hidden="true" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            )}
          </div>

          <footer className="shrink-0 border-t border-[var(--border-soft)] bg-[rgba(255,255,255,0.72)] p-4 backdrop-blur-sm">
            {status === "success" ? (
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-11 w-full items-center justify-center rounded-[7px] border border-vault-graphite bg-vault-ink px-4 text-sm font-semibold text-vault-paper transition hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
              >
                Return to inspection room
              </button>
            ) : (
              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <button
                  type="button"
                  onClick={onConfirm}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[7px] border border-vault-graphite bg-vault-ink px-4 text-sm font-semibold text-vault-paper transition hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                  Confirm desk review
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 items-center justify-center rounded-[7px] border border-[var(--border-soft)] bg-white/50 px-4 text-sm font-semibold text-vault-graphite transition hover:bg-white/82 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
                >
                  Continue inspecting
                </button>
              </div>
            )}
          </footer>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
