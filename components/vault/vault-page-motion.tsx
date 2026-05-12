"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, stagger } from "animejs";
import { installContainerBoundMotion } from "@/lib/motion/container-bounds";
import { installSummaryMeterMotion } from "@/lib/motion/summary-meters";

type VaultPageMotionProps = {
  children: React.ReactNode;
};

export function VaultPageMotion({ children }: VaultPageMotionProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let lowerVaultObserver: IntersectionObserver | null = null;
    let cleanupContainerBounds: (() => void) | null = null;
    let cleanupSummaryMeters: (() => void) | null = null;

    const scope = createScope({ root }).add(() => {
      cleanupContainerBounds = installContainerBoundMotion(root);
      cleanupSummaryMeters = installSummaryMeterMotion(root);

      const timeline = createTimeline({
        defaults: {
          ease: "outExpo",
        },
      });

      timeline
        .add(".vault-console-shell", {
          opacity: [0, 1],
          y: [18, 0],
          filter: ["blur(8px)", "blur(0px)"],
          duration: 680,
        })
        .add(
          ".vault-console-kicker",
          {
            opacity: [0, 1],
            y: [10, 0],
            delay: stagger(62),
            duration: 460,
          },
          "-=430",
        )
        .add(
          ".vault-title-word",
          {
            opacity: [0, 1],
            y: [24, 0],
            filter: ["blur(7px)", "blur(0px)"],
            delay: stagger(42),
            duration: 640,
          },
          "-=270",
        )
        .add(
          ".vault-console-copy",
          {
            opacity: [0, 1],
            y: [12, 0],
            duration: 500,
          },
          "-=360",
        )
        .add(
          ".vault-console-stat",
          {
            opacity: [0, 1],
            y: [12, 0],
            filter: ["blur(6px)", "blur(0px)"],
            delay: stagger(72),
            duration: 540,
          },
          "-=300",
        )
        .add(
          ".vault-chain-panel",
          {
            opacity: [0, 1],
            x: [18, 0],
            filter: ["blur(7px)", "blur(0px)"],
            duration: 600,
          },
          "-=650",
        )
        .add(
          ".vault-chain-row",
          {
            opacity: [0, 1],
            y: [10, 0],
            delay: stagger(70),
            duration: 460,
          },
          "-=360",
        )
        .add(
          ".vault-summary-card",
          {
            opacity: [0, 1],
            y: [14, 0],
            filter: ["blur(6px)", "blur(0px)"],
            delay: stagger(74),
            duration: 540,
          },
          "-=180",
        );

      const lowerVaultSection = root.querySelector<HTMLElement>(".vault-lower-section");
      if (lowerVaultSection) {
        let hasPlayedLowerVault = false;

        lowerVaultObserver = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting || hasPlayedLowerVault) return;

            hasPlayedLowerVault = true;

            const lowerTimeline = createTimeline({
              defaults: {
                ease: "outExpo",
              },
            });

            lowerTimeline
              .add(lowerVaultSection.querySelectorAll(".vault-asset-header"), {
                opacity: [0, 1],
                y: [14, 0],
                filter: ["blur(7px)", "blur(0px)"],
                duration: 560,
              })
              .add(
                lowerVaultSection.querySelectorAll(".vault-asset-card-reveal"),
                {
                  opacity: [0, 1],
                  y: [14, 0],
                  filter: ["blur(7px)", "blur(0px)"],
                  delay: stagger(64),
                  duration: 540,
                },
                "-=280",
              )
              .add(
                lowerVaultSection.querySelectorAll(".vault-ledger-panel"),
                {
                  opacity: [0, 1],
                  x: [16, 0],
                  filter: ["blur(7px)", "blur(0px)"],
                  duration: 560,
                },
                "-=560",
              )
              .add(
                lowerVaultSection.querySelectorAll(".vault-ledger-row"),
                {
                  opacity: [0, 1],
                  y: [10, 0],
                  delay: stagger(58),
                  duration: 460,
                },
                "-=320",
              )
              .add(
                lowerVaultSection.querySelectorAll(".vault-control-panel"),
                {
                  opacity: [0, 1],
                  y: [12, 0],
                  filter: ["blur(6px)", "blur(0px)"],
                  duration: 520,
                },
                "-=260",
              )
              .add(
                lowerVaultSection.querySelectorAll(".vault-control-action"),
                {
                  opacity: [0, 1],
                  y: [8, 0],
                  delay: stagger(58),
                  duration: 420,
                },
                "-=300",
              );

            lowerVaultObserver?.disconnect();
          },
          { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
        );

        lowerVaultObserver.observe(lowerVaultSection);
      }
    });

    return () => {
      lowerVaultObserver?.disconnect();
      cleanupContainerBounds?.();
      cleanupSummaryMeters?.();
      scope.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="mx-auto grid w-full max-w-7xl gap-5">
      {children}
    </div>
  );
}
