"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, stagger } from "animejs";
import { installContainerBoundMotion } from "@/lib/motion/container-bounds";

type AuctionsPageMotionProps = {
  children: React.ReactNode;
};

export function AuctionsPageMotion({ children }: AuctionsPageMotionProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let cleanupContainerBounds: (() => void) | null = null;

    const scope = createScope({ root }).add(() => {
      cleanupContainerBounds = installContainerBoundMotion(root);

      const timeline = createTimeline({
        defaults: {
          ease: "outExpo",
        },
      });

      timeline
        .add(".auction-console-shell", {
          opacity: [0, 1],
          y: [18, 0],
          filter: ["blur(8px)", "blur(0px)"],
          duration: 680,
        })
        .add(
          ".auction-console-kicker",
          {
            opacity: [0, 1],
            y: [10, 0],
            delay: stagger(62),
            duration: 460,
          },
          "-=430",
        )
        .add(
          ".auction-title-word",
          {
            opacity: [0, 1],
            y: [24, 0],
            filter: ["blur(7px)", "blur(0px)"],
            delay: stagger(40),
            duration: 640,
          },
          "-=270",
        )
        .add(
          ".auction-console-copy",
          {
            opacity: [0, 1],
            y: [12, 0],
            duration: 500,
          },
          "-=360",
        )
        .add(
          ".auction-hero-stat",
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
          ".auction-review-panel",
          {
            opacity: [0, 1],
            x: [18, 0],
            filter: ["blur(7px)", "blur(0px)"],
            duration: 600,
          },
          "-=650",
        )
        .add(
          ".auction-review-row",
          {
            opacity: [0, 1],
            y: [10, 0],
            delay: stagger(68),
            duration: 460,
          },
          "-=360",
        )
        .add(
          ".auction-summary-card",
          {
            opacity: [0, 1],
            y: [14, 0],
            filter: ["blur(6px)", "blur(0px)"],
            delay: stagger(74),
            duration: 540,
          },
          "-=160",
        );
    });

    return () => {
      cleanupContainerBounds?.();
      scope.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="mx-auto flex w-full max-w-7xl flex-col gap-5">
      {children}
    </div>
  );
}
