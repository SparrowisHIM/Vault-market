"use client";

import {
  BookOpen,
  BriefcaseBusiness,
  Gavel,
  Landmark,
  Search,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { animate, createTimeline } from "animejs";
import { cn } from "@/lib/utils";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const contentRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);
  const marketplaceActive = pathname.startsWith("/marketplace");
  const vaultActive = pathname.startsWith("/vault");
  const researchActive = pathname.startsWith("/research");
  const auctionsActive = pathname.startsWith("/auctions");
  const sellActive = pathname.startsWith("/sell");
  const privateDeskActive = pathname.startsWith("/private-desk");

  useEffect(() => {
    const content = contentRef.current;
    const progress = progressRef.current;
    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!content || reduceMotion) return;

    if (progress) {
      const timeline = createTimeline({
        defaults: {
          ease: "outExpo",
        },
      });

      timeline
        .add(progress, { scaleX: [0, 0.72], opacity: [0, 1], duration: 280 })
        .add(progress, { scaleX: [0.72, 1], duration: 260 }, "-=80")
        .add(progress, { opacity: [1, 0], duration: 260 }, "-=80");
    }

    animate(content, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 520,
      ease: "outExpo",
    });
  }, [pathname]);

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-[6px] focus:bg-vault-ink focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-vault-paper"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-40 border-b border-[var(--border-soft)] bg-[rgba(235,230,220,0.82)] backdrop-blur-xl">
        <div
          ref={progressRef}
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-[linear-gradient(90deg,var(--vault-registry),var(--vault-amber),var(--vault-verified))] opacity-0"
          aria-hidden="true"
        />
        <div className="mx-auto flex w-full max-w-[92rem] flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-5 lg:px-8 lg:py-2.5">
          <div className="flex items-center justify-between gap-3">
            <Link
              href="/"
              className="group flex min-w-0 items-center gap-3 rounded-[7px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
              aria-label="VaultMarket home"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[7px] border border-[var(--border-medium)] bg-vault-ink text-vault-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]">
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="block text-base font-semibold leading-none text-vault-ink">
                  VaultMarket
                </span>
                <span className="mt-1 block truncate font-mono text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-vault-steel">
                  Collectibles trust desk
                </span>
              </span>
            </Link>

            <div className="hidden items-center gap-2 xl:flex">
              <span className="rounded-full border border-[var(--border-soft)] bg-white/44 px-3 py-1.5 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
                Graded cards live
              </span>
            </div>
          </div>

          <nav aria-label="Primary navigation" className="-mx-1 overflow-x-auto pb-1 lg:mx-0 lg:pb-0">
            <ul className="flex min-w-max items-center gap-2 px-1">
              <li>
                <Link
                  href="/marketplace"
                  aria-current={marketplaceActive ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-[6px] border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
                    marketplaceActive
                      ? "border-vault-graphite bg-vault-ink text-vault-paper"
                      : "border-[var(--border-soft)] bg-white/44 text-vault-graphite hover:bg-white/78",
                  )}
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/vault"
                  aria-current={vaultActive ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-[6px] border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
                    vaultActive
                      ? "border-vault-graphite bg-vault-ink text-vault-paper"
                      : "border-[var(--border-soft)] bg-white/44 text-vault-graphite hover:bg-white/78",
                  )}
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Vault
                </Link>
              </li>
              <li>
                <Link
                  href="/research"
                  aria-current={researchActive ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-[6px] border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
                    researchActive
                      ? "border-vault-graphite bg-vault-ink text-vault-paper"
                      : "border-[var(--border-soft)] bg-white/44 text-vault-graphite hover:bg-white/78",
                  )}
                >
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  Research
                </Link>
              </li>
              <li>
                <Link
                  href="/auctions"
                  aria-current={auctionsActive ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-[6px] border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
                    auctionsActive
                      ? "border-vault-graphite bg-vault-ink text-vault-paper"
                      : "border-[var(--border-soft)] bg-white/44 text-vault-graphite hover:bg-white/78",
                  )}
                >
                  <Gavel className="h-4 w-4" aria-hidden="true" />
                  Auctions
                </Link>
              </li>
              <li>
                <Link
                  href="/sell"
                  aria-current={sellActive ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-[6px] border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
                    sellActive
                      ? "border-vault-graphite bg-vault-ink text-vault-paper"
                      : "border-[var(--border-soft)] bg-white/44 text-vault-graphite hover:bg-white/78",
                  )}
                >
                  <BriefcaseBusiness className="h-4 w-4" aria-hidden="true" />
                  Sell
                </Link>
              </li>
              <li>
                <Link
                  href="/private-desk"
                  aria-current={privateDeskActive ? "page" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center gap-2 rounded-[6px] border px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]",
                    privateDeskActive
                      ? "border-vault-graphite bg-vault-ink text-vault-paper"
                      : "border-[var(--border-soft)] bg-white/44 text-vault-graphite hover:bg-white/78",
                  )}
                >
                  <Landmark className="h-4 w-4" aria-hidden="true" />
                  Private Desk
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <div ref={contentRef} id="main-content" className="route-transition-surface">
        {children}
      </div>
    </>
  );
}
