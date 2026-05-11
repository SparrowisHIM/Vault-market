"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, stagger } from "animejs";

type ListingDetailMotionProps = {
  children: React.ReactNode;
};

export function ListingDetailMotion({ children }: ListingDetailMotionProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

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
        .add(".detail-back-link", {
          opacity: [0, 1],
          y: [8, 0],
          duration: 420,
        })
        .add(
          ".detail-dossier-panel",
          {
            opacity: [0, 1],
            y: [16, 0],
            filter: ["blur(8px)", "blur(0px)"],
            duration: 640,
          },
          "-=180",
        )
        .add(
          ".detail-kicker",
          {
            opacity: [0, 1],
            y: [10, 0],
            duration: 420,
          },
          "-=420",
        )
        .add(
          ".detail-title-word",
          {
            opacity: [0, 1],
            y: [22, 0],
            filter: ["blur(7px)", "blur(0px)"],
            delay: stagger(38),
            duration: 600,
          },
          "-=260",
        )
        .add(
          ".detail-meta-line",
          {
            opacity: [0, 1],
            y: [8, 0],
            duration: 420,
          },
          "-=360",
        )
        .add(
          ".detail-decision-card",
          {
            opacity: [0, 1],
            y: [10, 0],
            delay: stagger(54),
            duration: 480,
          },
          "-=240",
        )
        .add(
          ".detail-context-panel",
          {
            opacity: [0, 1],
            y: [14, 0],
            filter: ["blur(7px)", "blur(0px)"],
            duration: 580,
          },
          "-=300",
        )
        .add(
          ".detail-context-card",
          {
            opacity: [0, 1],
            y: [10, 0],
            delay: stagger(62),
            duration: 480,
          },
          "-=320",
        );
    });

    return () => scope.revert();
  }, []);

  return (
    <div ref={rootRef} className="mx-auto grid w-full max-w-7xl gap-5">
      {children}
    </div>
  );
}
