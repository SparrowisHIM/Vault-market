"use client";

import { Eye, Landmark, Plus, Star } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";
import { animate } from "animejs";
import { buildListingHref } from "@/lib/navigation/listing-links";
import { cn } from "@/lib/utils";

type QuickActionsProps = {
  listingSlug: string;
  listingTitle: string;
  compact?: boolean;
  context?: "card" | "inspection";
  sourceHref?: string;
  onRequestSpecialistReview?: () => void;
  compareQueued?: boolean;
  onCompareToggle?: (nextCompared: boolean) => boolean | void;
};

export function QuickActions({
  listingSlug,
  listingTitle,
  compact = false,
  context = "card",
  sourceHref,
  onRequestSpecialistReview,
  compareQueued,
  onCompareToggle,
}: QuickActionsProps) {
  const [isWatched, setIsWatched] = useState(false);
  const [localCompared, setLocalCompared] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const watchRef = useRef<HTMLButtonElement | null>(null);
  const compareRef = useRef<HTMLButtonElement | null>(null);
  const primaryButtonRef = useRef<HTMLButtonElement | null>(null);
  const primaryLinkRef = useRef<HTMLAnchorElement | null>(null);
  const statusRef = useRef<HTMLSpanElement | null>(null);
  const watchRingRef = useRef<HTMLSpanElement | null>(null);
  const compareRailRef = useRef<HTMLSpanElement | null>(null);

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

  function pulseWatchCalm(target: HTMLElement | null) {
    if (!target || prefersReducedMotion()) return;

    animate(target, {
      scale: [1, 0.99, 1.018, 1],
      duration: 520,
      ease: "outExpo",
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

  function triggerWatchRing() {
    if (!watchRingRef.current || prefersReducedMotion()) return;

    animate(watchRingRef.current, {
      opacity: [0, 0.38, 0],
      scale: [0.97, 1.02, 1.05],
      duration: 720,
      ease: "inOutSine",
    });
  }

  function triggerCompareRail() {
    if (!compareRailRef.current || prefersReducedMotion()) return;

    animate(compareRailRef.current, {
      scaleX: [0, 1],
      opacity: [0, 1, 0.72],
      duration: 420,
      ease: "outExpo",
    });
  }

  function toggleWatch() {
    const nextWatched = !isWatched;
    setIsWatched(nextWatched);
    pulseWatchCalm(watchRef.current);
    if (nextWatched) triggerWatchRing();
    if (nextWatched) {
      revealStatus("Added to watch desk");
    } else {
      setStatusMessage("");
    }
  }

  function toggleCompare() {
    if (!onCompareToggle) return;

    const currentCompared = compareQueued ?? localCompared;
    const nextCompared = !currentCompared;
    const handled = onCompareToggle?.(nextCompared);

    if (handled === false) {
      pulseAction(compareRef.current);
      return;
    }

    if (compareQueued === undefined) {
      setLocalCompared(nextCompared);
    }

    pulseAction(compareRef.current);
    if (nextCompared) triggerCompareRail();
    if (nextCompared) {
      revealStatus("Queued for comparison");
    } else {
      setStatusMessage("");
    }
  }

  const buttonClass = cn(
    "relative inline-flex items-center justify-center overflow-hidden rounded-[6px] border border-[rgba(17,19,15,0.11)] bg-white/36 font-medium text-vault-graphite/88 shadow-[inset_0_1px_0_rgba(255,255,255,0.56)] transition duration-200 hover:-translate-y-0.5 hover:border-[rgba(47,94,124,0.28)] hover:bg-white/64 hover:text-vault-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
    context === "inspection"
      ? "h-10 w-full px-3 text-sm"
      : compact
        ? "h-8 px-2 text-xs"
        : "h-9 min-w-0 px-3 text-sm",
  );
  const primaryAction =
    context === "inspection"
      ? {
          href: "/private-desk",
          label: "Request specialist review",
          ariaLabel: `Request specialist review for ${listingTitle}`,
          Icon: Landmark,
        }
      : {
          href: buildListingHref(listingSlug, sourceHref),
          label: "Inspect slab",
          ariaLabel: `Inspect slab for ${listingTitle}`,
          Icon: Eye,
        };
  const PrimaryIcon = primaryAction.Icon;
  const isCompared = compareQueued ?? localCompared;
  const showCompare = Boolean(onCompareToggle);
  const primaryActionControl =
    context === "inspection" ? (
      <button
        ref={primaryButtonRef}
        type="button"
        onClick={() => {
          pulseAction(primaryButtonRef.current);
          onRequestSpecialistReview?.();
        }}
        onPointerEnter={() => pulseAction(primaryButtonRef.current)}
        className={cn(
          "group inline-flex items-center justify-center overflow-hidden rounded-[6px] border border-vault-graphite bg-vault-ink font-semibold text-vault-paper transition duration-200 hover:-translate-y-0.5 hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
          context === "inspection" && "w-full",
          !compact && context !== "inspection" && "col-span-2 w-full",
          context === "inspection"
            ? "h-10 px-3 text-sm"
            : compact
              ? "h-8 px-2 text-xs"
              : "h-9 px-3 text-sm",
        )}
        aria-label={primaryAction.ariaLabel}
      >
        <span
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.24),transparent)] transition duration-500 group-hover:translate-x-[320%]"
          aria-hidden="true"
        />
        <PrimaryIcon className={cn("h-4 w-4", !compact && "mr-1.5")} aria-hidden="true" />
        {!compact && <span>{primaryAction.label}</span>}
      </button>
    ) : (
    <Link
      ref={primaryLinkRef}
      href={primaryAction.href}
      onPointerEnter={() => pulseAction(primaryLinkRef.current)}
      className={cn(
          "group inline-flex items-center justify-center overflow-hidden rounded-[6px] border border-vault-graphite bg-vault-ink font-semibold text-vault-paper transition duration-200 hover:-translate-y-0.5 hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
        !compact && "col-span-2 w-full",
        compact ? "h-8 px-2 text-xs" : "h-9 px-3 text-sm",
      )}
      aria-label={primaryAction.ariaLabel}
    >
      <span
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.24),transparent)] transition duration-500 group-hover:translate-x-[320%]"
        aria-hidden="true"
      />
      <PrimaryIcon className={cn("h-4 w-4", !compact && "mr-1.5")} aria-hidden="true" />
      {!compact && <span>{primaryAction.label}</span>}
    </Link>
    );

  return (
    <div>
      <div
        className={cn(
          "grid gap-2",
          context === "inspection"
            ? "grid-cols-1"
            : compact && showCompare
              ? "grid-cols-3"
              : "grid-cols-2",
        )}
        aria-label={`Actions for ${listingTitle}`}
      >
        {context === "inspection" && primaryActionControl}
        <button
          ref={watchRef}
          type="button"
          className={cn(
            buttonClass,
            (!compact || context === "inspection") && "w-full",
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
            ref={watchRingRef}
            className="pointer-events-none absolute inset-1 rounded-[5px] border border-[rgba(166,111,31,0.36)] opacity-0"
            aria-hidden="true"
          />
          <Star
            className={cn("h-4 w-4", !compact && "mr-1.5", isWatched && "fill-current")}
            aria-hidden="true"
          />
          {!compact && <span>{isWatched ? "Watching" : "Watch"}</span>}
        </button>
        {showCompare ? (
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
            <span
              ref={compareRailRef}
              className="pointer-events-none absolute inset-x-2 bottom-1 h-px origin-left scale-x-0 rounded-full bg-[linear-gradient(90deg,transparent,rgba(47,94,124,0.72),transparent)] opacity-0"
              aria-hidden="true"
            />
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
        ) : null}
        {context === "card" && primaryActionControl}
      </div>

      {statusMessage ? (
        <span
          ref={statusRef}
          role="status"
          aria-live="polite"
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
