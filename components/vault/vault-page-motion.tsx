"use client";

import { useEffect, useRef } from "react";
import { createScope, createTimeline, stagger } from "animejs";

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

    const scope = createScope({ root }).add(() => {
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
    });

    return () => scope.revert();
  }, []);

  return (
    <div ref={rootRef} className="mx-auto grid w-full max-w-7xl gap-5">
      {children}
    </div>
  );
}
