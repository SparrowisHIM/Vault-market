"use client";

import { Check, FileCheck2, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { animate } from "animejs";
import { cn } from "@/lib/utils";

type HandoffState = "idle" | "preparing" | "queued";

type SpecialistReviewHandoffProps = {
  ticketId: string;
};

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function SpecialistReviewHandoff({ ticketId }: SpecialistReviewHandoffProps) {
  const [handoffState, setHandoffState] = useState<HandoffState>("idle");
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const sweepRef = useRef<HTMLSpanElement | null>(null);
  const ticketRef = useRef<HTMLDivElement | null>(null);
  const checkRef = useRef<HTMLSpanElement | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  function revealTicket() {
    setHandoffState("queued");

    if (prefersReducedMotion()) return;

    requestAnimationFrame(() => {
      if (ticketRef.current) {
        animate(ticketRef.current, {
          opacity: [0, 1],
          translateY: [10, 0],
          duration: 380,
          ease: "outExpo",
        });
      }

      if (checkRef.current) {
        animate(checkRef.current, {
          scale: [0.82, 1.06, 1],
          opacity: [0, 1],
          duration: 420,
          ease: "outExpo",
        });
      }
    });
  }

  function prepareReviewPacket() {
    if (handoffState !== "idle") return;

    if (prefersReducedMotion()) {
      setHandoffState("queued");
      return;
    }

    setHandoffState("preparing");

    requestAnimationFrame(() => {
      if (buttonRef.current) {
        animate(buttonRef.current, {
          scale: [1, 0.985, 1],
          duration: 280,
          ease: "outExpo",
        });
      }

      if (sweepRef.current) {
        animate(sweepRef.current, {
          translateX: ["-130%", "135%"],
          opacity: [0, 0.72, 0],
          duration: 720,
          ease: "outExpo",
        });
      }
    });

    timerRef.current = window.setTimeout(revealTicket, 780);
  }

  const isPreparing = handoffState === "preparing";
  const isQueued = handoffState === "queued";

  return (
    <div className="grid gap-3 sm:min-w-[17rem] sm:max-w-xs">
      <button
        ref={buttonRef}
        type="button"
        onClick={prepareReviewPacket}
        disabled={isPreparing || isQueued}
        className={cn(
          "group relative inline-flex min-h-12 w-full items-center justify-center overflow-hidden rounded-[7px] border border-vault-graphite bg-vault-ink px-5 py-3 text-sm font-semibold text-vault-paper shadow-[0_16px_34px_rgba(17,19,15,0.18),inset_0_1px_0_rgba(255,255,255,0.18)] transition duration-200 hover:-translate-y-0.5 hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)] disabled:cursor-default disabled:hover:translate-y-0",
          isQueued && "border-[rgba(47,113,88,0.34)] bg-[rgba(17,24,20,0.96)]",
        )}
        aria-live="polite"
      >
        <span
          ref={sweepRef}
          className="pointer-events-none absolute inset-y-[-20%] left-0 w-1/2 -translate-x-[130%] rotate-12 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.32),transparent)] opacity-0"
          aria-hidden="true"
        />
        {isQueued ? (
          <Check className="mr-2 h-4 w-4 text-[#a7ddc4]" aria-hidden="true" />
        ) : (
          <Sparkles className="mr-2 h-4 w-4 text-[#9bc2dc]" aria-hidden="true" />
        )}
        {isPreparing
          ? "Preparing review packet..."
          : isQueued
            ? "Specialist review queued"
            : "Request specialist review"}
      </button>

      {isQueued ? (
        <div
          ref={ticketRef}
          className="relative overflow-hidden rounded-[9px] border border-[rgba(47,94,124,0.22)] bg-[linear-gradient(135deg,rgba(255,255,255,0.66),rgba(249,248,243,0.42))] p-3 opacity-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_14px_36px_rgba(17,19,15,0.08)]"
          role="status"
          aria-live="polite"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(47,94,124,0.48),transparent)]"
            aria-hidden="true"
          />
          <div className="flex items-start gap-3">
            <span
              ref={checkRef}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-[7px] border border-[rgba(47,113,88,0.22)] bg-[rgba(47,113,88,0.08)] text-[#235844]"
            >
              <FileCheck2 className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-vault-registry">
                Private desk receipt
              </p>
              <h3 className="mt-1 text-base font-semibold text-vault-ink">
                Specialist review queued
              </h3>
              <p className="mt-1 font-mono text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-vault-graphite">
                Desk ticket {ticketId} prepared
              </p>
              <p className="mt-2 text-xs leading-5 text-vault-steel">
                Review packet includes valuation range, comps, custody posture, and seller trust.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
