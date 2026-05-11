"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, stagger } from "animejs";

type ResearchPageMotionProps = {
  children: React.ReactNode;
};

export function ResearchPageMotion({ children }: ResearchPageMotionProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let lowerResearchObserver: IntersectionObserver | null = null;

    const scope = createScope({ root }).add(() => {
      const timeline = createTimeline({
        defaults: {
          ease: "outExpo",
        },
      });

      timeline
        .add(".research-terminal-shell", {
          opacity: [0, 1],
          y: [18, 0],
          filter: ["blur(8px)", "blur(0px)"],
          duration: 680,
        })
        .add(
          ".research-terminal-kicker",
          {
            opacity: [0, 1],
            y: [10, 0],
            delay: stagger(62),
            duration: 460,
          },
          "-=430",
        )
        .add(
          ".research-title-word",
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
          ".research-terminal-copy",
          {
            opacity: [0, 1],
            y: [12, 0],
            duration: 500,
          },
          "-=360",
        )
        .add(
          ".research-confidence-panel",
          {
            opacity: [0, 1],
            x: [14, 0],
            filter: ["blur(7px)", "blur(0px)"],
            duration: 560,
          },
          "-=500",
        )
        .add(
          ".research-hero-stat",
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
          ".research-scan-panel",
          {
            opacity: [0, 1],
            x: [18, 0],
            filter: ["blur(7px)", "blur(0px)"],
            duration: 600,
          },
          "-=650",
        )
        .add(
          ".research-scan-row",
          {
            opacity: [0, 1],
            y: [10, 0],
            delay: stagger(68),
            duration: 460,
          },
          "-=360",
        )
        .add(
          ".research-summary-card",
          {
            opacity: [0, 1],
            y: [14, 0],
            filter: ["blur(6px)", "blur(0px)"],
            delay: stagger(74),
            duration: 540,
          },
          "-=160",
        );

      const lowerResearchSection = root.querySelector<HTMLElement>(".research-lower-section");
      if (lowerResearchSection) {
        let hasPlayedLowerResearch = false;

        lowerResearchObserver = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting || hasPlayedLowerResearch) return;

            hasPlayedLowerResearch = true;

            const lowerTimeline = createTimeline({
              defaults: {
                ease: "outExpo",
              },
            });

            lowerTimeline
              .add(lowerResearchSection.querySelectorAll(".research-comp-panel"), {
                opacity: [0, 1],
                y: [16, 0],
                filter: ["blur(8px)", "blur(0px)"],
                duration: 600,
              })
              .add(
                lowerResearchSection.querySelectorAll(".research-comp-row"),
                {
                  opacity: [0, 1],
                  y: [14, 0],
                  filter: ["blur(7px)", "blur(0px)"],
                  delay: stagger(58),
                  duration: 520,
                },
                "-=340",
              )
              .add(
                lowerResearchSection.querySelectorAll(".research-sidebar-panel"),
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
                lowerResearchSection.querySelectorAll(".research-sidebar-row"),
                {
                  opacity: [0, 1],
                  y: [10, 0],
                  delay: stagger(52),
                  duration: 440,
                },
                "-=360",
              );

            lowerResearchObserver?.disconnect();
          },
          { threshold: 0.18, rootMargin: "0px 0px -10% 0px" },
        );

        lowerResearchObserver.observe(lowerResearchSection);
      }
    });

    return () => {
      lowerResearchObserver?.disconnect();
      scope.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {children}
    </div>
  );
}
