"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, stagger } from "animejs";
import { installContainerBoundMotion } from "@/lib/motion/container-bounds";

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

    const scrollObservers: IntersectionObserver[] = [];
    let cleanupContainerBounds: (() => void) | null = null;

    const scope = createScope({ root }).add(() => {
      cleanupContainerBounds = installContainerBoundMotion(root);

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

      root.querySelectorAll<HTMLElement>(".detail-scroll-section").forEach((section) => {
        let hasPlayed = false;
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry?.isIntersecting || hasPlayed) return;
            hasPlayed = true;

            const sectionTimeline = createTimeline({
              defaults: {
                ease: "outExpo",
              },
            });

            sectionTimeline
              .add(section, {
                opacity: [0, 1],
                y: [18, 0],
                filter: ["blur(8px)", "blur(0px)"],
                duration: 620,
              })
              .add(
                section.querySelectorAll(".detail-scroll-copy"),
                {
                  opacity: [0, 1],
                  y: [8, 0],
                  delay: stagger(45),
                  duration: 420,
                },
                "-=360",
              )
              .add(
                section.querySelectorAll(".detail-scroll-card"),
                {
                  opacity: [0, 1],
                  y: [12, 0],
                  filter: ["blur(6px)", "blur(0px)"],
                  delay: stagger(62),
                  duration: 500,
                },
                "-=260",
              );

            observer.disconnect();
          },
          { threshold: 0.24, rootMargin: "0px 0px -10% 0px" },
        );

        observer.observe(section);
        scrollObservers.push(observer);
      });
    });

    return () => {
      scrollObservers.forEach((observer) => observer.disconnect());
      cleanupContainerBounds?.();
      scope.revert();
    };
  }, []);

  return (
    <div ref={rootRef} className="mx-auto grid w-full max-w-7xl gap-5">
      {children}
    </div>
  );
}
