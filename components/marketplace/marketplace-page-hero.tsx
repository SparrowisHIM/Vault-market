"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, stagger } from "animejs";

type MarketplacePageHeroProps = {
  activeCount: number;
  vaultHeldCount: number;
  totalMarketValue: string;
};

const marketplaceHeadingWords = "Inspection-grade marketplace browse".split(" ");

export function MarketplacePageHero({
  activeCount,
  vaultHeldCount,
  totalMarketValue,
}: MarketplacePageHeroProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const scope = createScope({ root }).add(() => {
      const timeline = createTimeline({
        defaults: {
          ease: "outExpo",
        },
      });

      timeline
        .add(".marketplace-hero-kicker", {
          opacity: [0, 1],
          y: [10, 0],
          filter: ["blur(5px)", "blur(0px)"],
          duration: 460,
        })
        .add(
          ".marketplace-hero-word",
          {
            opacity: [0, 1],
            y: [24, 0],
            filter: ["blur(7px)", "blur(0px)"],
            delay: stagger(44),
            duration: 660,
          },
          "-=220",
        )
        .add(
          ".marketplace-hero-copy",
          {
            opacity: [0, 1],
            y: [12, 0],
            duration: 520,
          },
          "-=360",
        )
        .add(
          ".marketplace-hero-stat",
          {
            opacity: [0, 1],
            y: [12, 0],
            filter: ["blur(6px)", "blur(0px)"],
            delay: stagger(70),
            duration: 560,
          },
          "-=320",
        );
    });

    return () => scope.revert();
  }, []);

  return (
    <header
      ref={rootRef}
      className="grid gap-4 border-b border-[var(--border-soft)] pb-5 lg:grid-cols-[1fr_auto] lg:items-end"
    >
      <div>
        <p className="marketplace-hero-kicker font-mono text-xs font-semibold uppercase tracking-[0.18em] text-vault-registry motion-safe:opacity-0">
          VaultMarket / Graded cards only
        </p>
        <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-normal text-vault-ink sm:text-4xl">
          {marketplaceHeadingWords.map((word, index) => (
            <span
              key={`${word}-${index}`}
              className="marketplace-hero-word inline-block motion-safe:opacity-0"
            >
              {word}
              {index < marketplaceHeadingWords.length - 1 ? "\u00a0" : ""}
            </span>
          ))}
        </h1>
        <p className="marketplace-hero-copy mt-3 max-w-2xl text-sm leading-6 text-vault-steel motion-safe:opacity-0 sm:text-base">
          Serious listings with grade, cert, seller trust, market context, and
          watch actions visible before opening the full inspection view.
        </p>
      </div>

      <dl className="grid grid-cols-3 gap-2 rounded-[8px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.58)]">
        <div className="marketplace-hero-stat rounded-[6px] bg-white/40 p-3 motion-safe:opacity-0">
          <dt className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
            Active
          </dt>
          <dd className="mt-1 text-xl font-semibold text-vault-ink">{activeCount}</dd>
        </div>
        <div className="marketplace-hero-stat rounded-[6px] bg-white/40 p-3 motion-safe:opacity-0">
          <dt className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
            Vault
          </dt>
          <dd className="mt-1 text-xl font-semibold text-vault-ink">{vaultHeldCount}</dd>
        </div>
        <div className="marketplace-hero-stat rounded-[6px] bg-white/40 p-3 motion-safe:opacity-0">
          <dt className="font-mono text-[0.64rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
            Ask book
          </dt>
          <dd className="mt-1 text-xl font-semibold text-vault-ink">
            {totalMarketValue}
          </dd>
        </div>
      </dl>
    </header>
  );
}
