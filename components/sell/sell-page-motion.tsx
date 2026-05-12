"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, stagger } from "animejs";
import { installContainerBoundMotion } from "@/lib/motion/container-bounds";
import { installSummaryMeterMotion } from "@/lib/motion/summary-meters";

type SellPageMotionProps = {
  children: React.ReactNode;
};

export function SellPageMotion({ children }: SellPageMotionProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let lowerSellObserver: IntersectionObserver | null = null;
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
        .add(".sell-intake-shell", {
          opacity: [0, 1],
          y: [18, 0],
          filter: ["blur(8px)", "blur(0px)"],
          duration: 680,
        })
        .add(
          ".sell-intake-kicker",
          {
            opacity: [0, 1],
            y: [10, 0],
            delay: stagger(62),
            duration: 460,
          },
          "-=430",
        )
        .add(
          ".sell-title-word",
          {
            opacity: [0, 1],
            y: [24, 0],
            filter: ["blur(7px)", "blur(0px)"],
            delay: stagger(36),
            duration: 640,
          },
          "-=270",
        )
        .add(
          ".sell-intake-copy",
          {
            opacity: [0, 1],
            y: [12, 0],
            duration: 500,
          },
          "-=360",
        )
        .add(
          ".sell-intake-stat",
          {
            opacity: [0, 1],
            y: [12, 0],
            filter: ["blur(6px)", "blur(0px)"],
            delay: stagger(72),
            duration: 540,
          },
          "-=260",
        )
        .add(
          ".sell-pipeline-panel",
          {
            opacity: [0, 1],
            x: [18, 0],
            filter: ["blur(7px)", "blur(0px)"],
            duration: 600,
          },
          "-=650",
        )
        .add(
          ".sell-pipeline-row",
          {
            opacity: [0, 1],
            y: [10, 0],
            delay: stagger(64),
            duration: 460,
          },
          "-=360",
        )
        .add(
          ".sell-summary-card",
          {
            opacity: [0, 1],
            y: [14, 0],
            filter: ["blur(6px)", "blur(0px)"],
            delay: stagger(74),
            duration: 540,
          },
          "-=160",
        );

      const lowerSellSection = root.querySelector<HTMLElement>(".sell-lower-section");
      if (lowerSellSection) {
        let hasPlayedLowerSell = false;

        lowerSellObserver = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting || hasPlayedLowerSell) return;

            hasPlayedLowerSell = true;

            const lowerTimeline = createTimeline({
              defaults: {
                ease: "outExpo",
              },
            });

            lowerTimeline
              .add(lowerSellSection.querySelectorAll(".sell-side-panel"), {
                opacity: [0, 1],
                x: [-16, 0],
                filter: ["blur(7px)", "blur(0px)"],
                delay: stagger(90),
                duration: 560,
              })
              .add(
                lowerSellSection.querySelectorAll(".sell-panel-row"),
                {
                  opacity: [0, 1],
                  y: [10, 0],
                  filter: ["blur(6px)", "blur(0px)"],
                  delay: stagger(48),
                  duration: 440,
                },
                "-=360",
              )
              .add(
                lowerSellSection.querySelectorAll(".sell-dossier-panel"),
                {
                  opacity: [0, 1],
                  x: [16, 0],
                  filter: ["blur(7px)", "blur(0px)"],
                  duration: 600,
                },
                "-=620",
              )
              .add(
                lowerSellSection.querySelectorAll(".sell-dossier-section"),
                {
                  opacity: [0, 1],
                  y: [12, 0],
                  filter: ["blur(6px)", "blur(0px)"],
                  delay: stagger(58),
                  duration: 480,
                },
                "-=320",
              )
              .add(
                lowerSellSection.querySelectorAll(".sell-dossier-row"),
                {
                  opacity: [0, 1],
                  y: [8, 0],
                  delay: stagger(36),
                  duration: 360,
                },
                "-=260",
              );

            lowerSellObserver?.disconnect();
          },
          { threshold: 0.16, rootMargin: "0px 0px -10% 0px" },
        );

        lowerSellObserver.observe(lowerSellSection);
      }
    });

    return () => {
      lowerSellObserver?.disconnect();
      cleanupContainerBounds?.();
      cleanupSummaryMeters?.();
      scope.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      {children}
    </div>
  );
}
