"use client";

import { useEffect, useRef } from "react";
import { animate, createScope, createTimeline, stagger } from "animejs";
import { installContainerBoundMotion } from "@/lib/motion/container-bounds";
import { installSummaryMeterMotion } from "@/lib/motion/summary-meters";

type PrivateDeskPageMotionProps = {
  children: React.ReactNode;
};

export function PrivateDeskPageMotion({ children }: PrivateDeskPageMotionProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let lowerDeskObserver: IntersectionObserver | null = null;
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
        .add(".private-desk-shell", {
          opacity: [0, 1],
          y: [18, 0],
          filter: ["blur(8px)", "blur(0px)"],
          duration: 680,
        })
        .add(
          ".private-desk-kicker",
          {
            opacity: [0, 1],
            y: [10, 0],
            delay: stagger(62),
            duration: 460,
          },
          "-=430",
        )
        .add(
          ".private-desk-title-word",
          {
            opacity: [0, 1],
            y: [24, 0],
            filter: ["blur(7px)", "blur(0px)"],
            delay: stagger(34),
            duration: 640,
          },
          "-=270",
        )
        .add(
          ".private-desk-copy",
          {
            opacity: [0, 1],
            y: [12, 0],
            duration: 500,
          },
          "-=360",
        )
        .add(
          ".private-desk-stat",
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
          ".private-desk-review-panel",
          {
            opacity: [0, 1],
            x: [18, 0],
            filter: ["blur(7px)", "blur(0px)"],
            duration: 600,
          },
          "-=650",
        )
        .add(
          ".private-desk-review-row",
          {
            opacity: [0, 1],
            y: [10, 0],
            delay: stagger(68),
            duration: 460,
          },
          "-=360",
        )
        .add(
          ".private-desk-summary-card",
          {
            opacity: [0, 1],
            y: [14, 0],
            filter: ["blur(6px)", "blur(0px)"],
            delay: stagger(74),
            duration: 540,
          },
          "-=160",
        );

      animate(".private-desk-pulse", {
        opacity: [0.4, 1, 0.4],
        scale: [0.94, 1.14, 0.94],
        duration: 2200,
        loop: true,
        ease: "inOutSine",
      });

      const lowerDeskSection = root.querySelector<HTMLElement>(".private-desk-lower-section");
      if (lowerDeskSection) {
        let hasPlayedLowerDesk = false;

        lowerDeskObserver = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting || hasPlayedLowerDesk) return;

            hasPlayedLowerDesk = true;

            const lowerTimeline = createTimeline({
              defaults: {
                ease: "outExpo",
              },
            });

            lowerTimeline
              .add(lowerDeskSection.querySelectorAll(".private-desk-spotlight"), {
                opacity: [0, 1],
                y: [16, 0],
                filter: ["blur(8px)", "blur(0px)"],
                duration: 600,
              })
              .add(
                lowerDeskSection.querySelectorAll(".private-desk-spotlight-detail"),
                {
                  opacity: [0, 1],
                  y: [10, 0],
                  delay: stagger(58),
                  duration: 460,
                },
                "-=340",
              )
              .add(
                lowerDeskSection.querySelectorAll(".private-desk-panel"),
                {
                  opacity: [0, 1],
                  x: [16, 0],
                  filter: ["blur(7px)", "blur(0px)"],
                  delay: stagger(90),
                  duration: 560,
                },
                "-=520",
              )
              .add(
                lowerDeskSection.querySelectorAll(".private-desk-row"),
                {
                  opacity: [0, 1],
                  y: [10, 0],
                  filter: ["blur(6px)", "blur(0px)"],
                  delay: stagger(48),
                  duration: 440,
                },
                "-=360",
              );

            lowerDeskObserver?.disconnect();
          },
          { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
        );

        lowerDeskObserver.observe(lowerDeskSection);
      }
    });

    return () => {
      lowerDeskObserver?.disconnect();
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
