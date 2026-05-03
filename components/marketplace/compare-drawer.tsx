"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, stagger } from "animejs";
import { ArrowRight, Layers3, Trash2, X } from "lucide-react";
import { MarketDelta } from "@/components/marketplace/market-delta";
import { SellerTrustBadge } from "@/components/marketplace/seller-trust-badge";
import {
  formatCertNumber,
  formatCurrency,
  formatEstimateRange,
  formatPopulation,
  getVaultStatusLabel,
} from "@/lib/marketplace/format";
import type { VaultListing } from "@/lib/marketplace/types";
import { cn } from "@/lib/utils";

type CompareDrawerProps = {
  listings: VaultListing[];
  isOpen: boolean;
  notice?: string | null;
  onOpen: () => void;
  onClose: () => void;
  onRemove: (listingId: string) => void;
  onClear: () => void;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function CompareField({
  label,
  children,
  dark = false,
}: {
  label: string;
  children: ReactNode;
  dark?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[7px] border p-3",
        dark
          ? "border-white/10 bg-[rgba(17,19,15,0.88)] text-vault-paper"
          : "border-[var(--border-soft)] bg-white/42 text-vault-ink",
      )}
    >
      <p
        className={cn(
          "font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em]",
          dark ? "text-vault-paper/58" : "text-vault-steel",
        )}
      >
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold">{children}</div>
    </div>
  );
}

export function CompareDrawer({
  listings,
  isOpen,
  notice,
  onOpen,
  onClose,
  onRemove,
  onClear,
}: CompareDrawerProps) {
  const trayRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const traySweepRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const [renderDrawer, setRenderDrawer] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setRenderDrawer(true);
      return;
    }

    if (!renderDrawer) return;

    if (prefersReducedMotion() || !panelRef.current) {
      setRenderDrawer(false);
      return;
    }

    animate(panelRef.current, {
      opacity: [1, 0],
      translateY: [0, 28],
      duration: 240,
      ease: "inQuad",
      onComplete: () => setRenderDrawer(false),
    });
  }, [isOpen, renderDrawer]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (listings.length === 0 || prefersReducedMotion()) return;

    if (trayRef.current) {
      animate(trayRef.current, {
        opacity: [0, 1],
        translateY: [18, 0],
        scale: [0.98, 1],
        duration: 360,
        ease: "outExpo",
      });
    }

    if (traySweepRef.current) {
      animate(traySweepRef.current, {
        translateX: ["-120%", "120%"],
        opacity: [0, 0.58, 0],
        delay: 120,
        duration: 680,
        ease: "outExpo",
      });
    }
  }, [listings.length]);

  useEffect(() => {
    if (!notice || !trayRef.current || prefersReducedMotion()) return;

    animate(trayRef.current, {
      translateX: [0, -5, 5, -3, 3, 0],
      duration: 360,
      ease: "outExpo",
    });
  }, [notice]);

  useEffect(() => {
    if (!isOpen || !panelRef.current || prefersReducedMotion()) return;

    animate(panelRef.current, {
      opacity: [0, 1],
      translateY: [34, 0],
      duration: 430,
      ease: "outExpo",
    });

    animate(panelRef.current.querySelectorAll(".compare-column"), {
      opacity: [0, 1],
      translateY: [16, 0],
      delay: stagger(55, { start: 120 }),
      duration: 420,
      ease: "outExpo",
    });
  }, [isOpen, listings.length]);

  function handleRemoveCard(listingId: string, target: HTMLElement | null) {
    if (!target || prefersReducedMotion()) {
      onRemove(listingId);
      return;
    }

    animate(target, {
      opacity: [1, 0],
      translateY: [0, 12],
      scale: [1, 0.98],
      duration: 190,
      ease: "inQuad",
      onComplete: () => onRemove(listingId),
    });
  }

  if (listings.length === 0 && !renderDrawer) return null;

  return (
    <>
      {listings.length > 0 ? (
        <div
          ref={trayRef}
          className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-5xl overflow-hidden rounded-[10px] border border-[rgba(17,19,15,0.22)] bg-[rgba(17,19,15,0.92)] p-2 text-vault-paper shadow-[0_22px_70px_rgba(17,19,15,0.28)] backdrop-blur-md"
        >
          <div
            ref={traySweepRef}
            className="pointer-events-none absolute inset-y-[-20%] left-0 w-1/3 -translate-x-[120%] rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)] opacity-0"
            aria-hidden="true"
          />
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-white/10 bg-white/[0.07] text-[#82c7a9]">
                <Layers3 className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/58">
                  Compare queue
                </p>
                <p className="truncate text-sm font-semibold">
                  {listings.length} slab{listings.length === 1 ? "" : "s"} queued
                </p>
                {notice ? (
                  <p className="mt-0.5 text-xs font-medium text-[#d9b572]">{notice}</p>
                ) : null}
              </div>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-2 sm:flex">
              <button
                type="button"
                onClick={onOpen}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[7px] border border-white/14 bg-vault-paper px-4 text-sm font-semibold text-vault-ink transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
              >
                Open compare
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex h-10 items-center justify-center rounded-[7px] border border-white/12 bg-white/[0.06] px-3 text-sm font-semibold text-vault-paper/72 transition hover:bg-white/[0.1] hover:text-vault-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {renderDrawer ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close compare desk"
            onClick={onClose}
            className="absolute inset-0 bg-[rgba(17,19,15,0.48)] backdrop-blur-[3px]"
          />
          <section
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="compare-drawer-title"
            className="absolute inset-x-0 bottom-0 max-h-[88svh] overflow-hidden rounded-t-[14px] border border-[var(--border-medium)] bg-[var(--surface-panel)] shadow-[0_-26px_90px_rgba(17,19,15,0.28)]"
          >
            <header className="flex items-start justify-between gap-3 border-b border-[var(--border-soft)] bg-white/40 p-4">
              <div>
                <p className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
                  Inspection comparison
                </p>
                <h2 id="compare-drawer-title" className="mt-1 text-2xl font-semibold text-vault-ink">
                  Compare queued slabs
                </h2>
                <p className="mt-1 text-sm text-vault-steel">
                  Review grade, ask, custody, comps, and seller trust across up to 3 slabs.
                </p>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-[7px] border border-[var(--border-soft)] bg-white/54 text-vault-graphite transition hover:bg-white/84 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                aria-label="Close compare desk"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            <div className="max-h-[calc(88svh-168px)] overflow-y-auto p-4">
              {listings.length > 0 ? (
              <div className="grid gap-3 lg:grid-cols-3">
                {listings.map((listing) => (
                  <article
                    key={listing.id}
                    className="compare-column rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-3 shadow-[var(--shadow-card)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="font-mono text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                          {listing.year} / {listing.franchise}
                        </p>
                        <h3 className="mt-1 line-clamp-2 text-lg font-semibold leading-tight text-vault-ink">
                          {listing.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={(event) =>
                          handleRemoveCard(
                            listing.id,
                            event.currentTarget.closest("article"),
                          )
                        }
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-[6px] border border-[var(--border-soft)] bg-white/46 text-vault-steel transition hover:bg-white/76 hover:text-vault-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                        aria-label={`Remove ${listing.title} from compare desk`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-3 grid gap-2">
                      <CompareField label="Grade">
                        {listing.gradingCompany} {listing.grade}
                      </CompareField>
                      <CompareField label="Cert">{formatCertNumber(listing.certNumber)}</CompareField>
                      <CompareField label="Ask">{formatCurrency(listing.priceCents)}</CompareField>
                      <CompareField label="Estimate">
                        {formatEstimateRange(listing.estimatedRangeCents)}
                      </CompareField>
                      <CompareField label="Market context" dark>
                        <div className="flex items-center justify-between gap-2">
                          <span>
                            Last comp{" "}
                            {listing.lastCompCents
                              ? formatCurrency(listing.lastCompCents)
                              : "pending"}
                          </span>
                          <MarketDelta value={listing.marketDeltaPercent} compact />
                        </div>
                      </CompareField>
                      <CompareField label="Population">
                        {formatPopulation(listing.population)}
                      </CompareField>
                      <CompareField label="Custody">
                        {getVaultStatusLabel(listing.vaultStatus)}
                      </CompareField>
                      <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/42 p-3">
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
                      <Link
                        href={`/marketplace/${listing.slug}`}
                        className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-[7px] border border-vault-graphite bg-vault-ink px-4 text-sm font-semibold text-vault-paper transition hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                      >
                        Inspect slab
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
              ) : (
                <div className="grid min-h-[42svh] place-items-center rounded-[10px] border border-dashed border-[var(--border-medium)] bg-white/34 p-6 text-center">
                  <div className="max-w-sm">
                    <span className="mx-auto grid h-12 w-12 place-items-center rounded-[9px] border border-[var(--border-soft)] bg-white/54 text-vault-registry">
                      <Layers3 className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="mt-4 text-xl font-semibold text-vault-ink">
                      Compare queue is clear
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-vault-steel">
                      Add up to 3 slabs from marketplace listings to compare grade,
                      ask, custody, market signal, and seller trust.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <footer className="flex flex-col gap-2 border-t border-[var(--border-soft)] bg-white/50 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-vault-steel">
                Compare desk is a page-local inspection queue for this browse session.
              </p>
              <button
                type="button"
                onClick={onClear}
                className="inline-flex h-10 items-center justify-center rounded-[7px] border border-[var(--border-soft)] bg-white/56 px-4 text-sm font-semibold text-vault-graphite transition hover:bg-white/84 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              >
                Clear compare desk
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
