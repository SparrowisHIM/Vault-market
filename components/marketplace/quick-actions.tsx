"use client";

import { Eye, Plus, Sparkles, Star } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { animate } from "animejs";
import { cn } from "@/lib/utils";

type QuickActionsProps = {
  listingSlug: string;
  listingTitle: string;
  compact?: boolean;
};

export function QuickActions({
  listingSlug,
  listingTitle,
  compact = false,
}: QuickActionsProps) {
  const [isWatched, setIsWatched] = useState(false);
  const [isCompared, setIsCompared] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const watchRef = useRef<HTMLButtonElement | null>(null);
  const compareRef = useRef<HTMLButtonElement | null>(null);
  const inspectRef = useRef<HTMLAnchorElement | null>(null);
  const statusRef = useRef<HTMLSpanElement | null>(null);
  const burstRef = useRef<HTMLSpanElement | null>(null);

  function prefersReducedMotion() {
    return (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }

  function pulseAction(target: HTMLElement | null) {
    if (!target || prefersReducedMotion()) return;

    animate(target, {
      scale: [1, 0.96, 1.04, 1],
      duration: 420,
      ease: "outBack",
    });
  }

  function revealStatus(message: string) {
    setStatusMessage(message);

    if (prefersReducedMotion()) return;

    requestAnimationFrame(() => {
      if (statusRef.current) {
        animate(statusRef.current, {
          opacity: [0, 1],
          translateY: [6, 0],
          duration: 260,
          ease: "outExpo",
        });
      }
    });
  }

  function triggerBurst() {
    if (!burstRef.current || prefersReducedMotion()) return;

    animate(burstRef.current, {
      opacity: [0, 1, 0],
      scale: [0.5, 1.25, 1.8],
      rotate: [-18, 8],
      duration: 560,
      ease: "outExpo",
    });
  }

  function toggleWatch() {
    const nextWatched = !isWatched;
    setIsWatched(nextWatched);
    pulseAction(watchRef.current);
    if (nextWatched) triggerBurst();
    revealStatus(nextWatched ? "Added to watch desk" : "Removed from watch desk");
  }

  function toggleCompare() {
    const nextCompared = !isCompared;
    setIsCompared(nextCompared);
    pulseAction(compareRef.current);
    revealStatus(nextCompared ? "Queued for comparison" : "Removed from compare queue");
  }

  const buttonClass = cn(
    "relative inline-flex items-center justify-center overflow-hidden rounded-[6px] border border-[rgba(17,19,15,0.16)] bg-white/58 font-medium text-vault-graphite shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(47,94,124,0.36)] hover:bg-white/86 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
    compact ? "h-8 px-2 text-xs" : "h-9 min-w-0 px-3 text-sm",
  );

  return (
    <div>
      <div
        className={cn("grid gap-2", compact ? "grid-cols-3" : "grid-cols-2")}
        aria-label={`Actions for ${listingTitle}`}
      >
        <button
          ref={watchRef}
          type="button"
          className={cn(
            buttonClass,
            !compact && "w-full",
            isWatched &&
              "border-[rgba(166,111,31,0.42)] bg-[rgba(166,111,31,0.13)] text-[#744e18]",
          )}
          aria-pressed={isWatched}
          aria-label={
            isWatched ? `Remove ${listingTitle} from watchlist` : `Watch ${listingTitle}`
          }
          onClick={toggleWatch}
        >
          <span
            ref={burstRef}
            className="pointer-events-none absolute inset-0 grid scale-50 place-items-center text-vault-amber opacity-0"
            aria-hidden="true"
          >
            <Sparkles className="h-5 w-5" />
          </span>
          <Star
            className={cn("h-4 w-4", !compact && "mr-1.5", isWatched && "fill-current")}
            aria-hidden="true"
          />
          {!compact && <span>{isWatched ? "Watching" : "Watch"}</span>}
        </button>
        <button
          ref={compareRef}
          type="button"
          className={cn(
            buttonClass,
            !compact && "w-full",
            isCompared &&
              "border-[rgba(47,94,124,0.38)] bg-[rgba(47,94,124,0.1)] text-[#244f69]",
          )}
          aria-pressed={isCompared}
          aria-label={
            isCompared
              ? `Remove ${listingTitle} from compare queue`
              : `Queue ${listingTitle} for comparison`
          }
          title="Add this slab to your compare queue."
          onClick={toggleCompare}
        >
          <Plus
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              !compact && "mr-1.5",
              isCompared && "rotate-45",
            )}
            aria-hidden="true"
          />
          {!compact && <span>{isCompared ? "Queued" : "Compare"}</span>}
        </button>
        <Link
          ref={inspectRef}
          href={`/marketplace/${listingSlug}`}
          onPointerEnter={() => pulseAction(inspectRef.current)}
          className={cn(
            "group inline-flex items-center justify-center overflow-hidden rounded-[6px] border border-vault-graphite bg-vault-ink font-semibold text-vault-paper transition duration-200 hover:-translate-y-0.5 hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
            !compact && "col-span-2 w-full",
            compact ? "h-8 px-2 text-xs" : "h-9 px-3 text-sm",
          )}
          aria-label={`Inspect ${listingTitle}`}
        >
          <span
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.24),transparent)] transition duration-500 group-hover:translate-x-[320%]"
            aria-hidden="true"
          />
          <Eye className={cn("h-4 w-4", !compact && "mr-1.5")} aria-hidden="true" />
          {!compact && <span>Inspect</span>}
        </Link>
      </div>

      {statusMessage ? (
        <span
          ref={statusRef}
          role="status"
          className={cn(
            "mt-2 block rounded-[5px] border border-[var(--border-soft)] bg-white/38 px-2 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-vault-steel",
            compact && "sr-only",
          )}
        >
          {statusMessage}
        </span>
      ) : null}
    </div>
  );
}
