import { animate, stagger } from "animejs";

const DEFAULT_BOUND_SELECTOR = [
  ".hero-inspection-frame",
  ".workflow-step-card",
  ".inspection-shell",
  ".inspection-info-panel",
  ".detail-dossier-panel",
  ".detail-context-panel",
  ".detail-context-card",
  ".detail-scroll-section",
  ".marketplace-preset-panel",
  ".marketplace-preset-card",
  ".marketplace-brief-panel",
  ".marketplace-filter-shell",
  ".vault-console-shell",
  ".vault-chain-panel",
  ".vault-summary-card",
  ".vault-ledger-panel",
  ".vault-control-panel",
  ".research-terminal-shell",
  ".research-confidence-panel",
  ".research-scan-panel",
  ".research-summary-card",
  ".research-comp-panel",
  ".research-sidebar-panel",
  ".auction-console-shell",
  ".auction-review-panel",
  ".auction-summary-card",
  ".auction-lot-spotlight",
].join(",");

const DARK_BOUND_PATTERN =
  /(console|terminal|inspection|preset-panel|control-panel|auction-review-panel)/;

type BoundTarget = {
  element: HTMLElement;
  overlay: HTMLElement;
  previousWidth: number;
  previousHeight: number;
  observer: ResizeObserver;
};

function createEdge(className: string) {
  const edge = document.createElement("span");
  edge.className = `container-bound-edge ${className}`;
  return edge;
}

function hasMotionDisabled() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function pulseBounds(target: BoundTarget) {
  animate(target.overlay, {
    opacity: [0, 0.92, 0],
    scale: [0.998, 1.002, 1],
    duration: 540,
    ease: "outExpo",
  });
}

export function installContainerBoundMotion(
  root: HTMLElement,
  selector = DEFAULT_BOUND_SELECTOR,
) {
  if (hasMotionDisabled()) return () => undefined;

  const elements = Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
    (element) => !element.dataset.boundMotionReady,
  );

  const targets = elements.map((element): BoundTarget => {
    const overlay = document.createElement("span");
    const className = element.className.toString();
    const isDark = DARK_BOUND_PATTERN.test(className);

    overlay.className = "container-bound-overlay";
    overlay.setAttribute("aria-hidden", "true");
    overlay.append(
      createEdge("container-bound-edge-top"),
      createEdge("container-bound-edge-right"),
      createEdge("container-bound-edge-bottom"),
      createEdge("container-bound-edge-left"),
    );

    element.dataset.boundMotionReady = "true";
    element.classList.add("animated-container-bound");
    element.style.setProperty(
      "--bound-color",
      isDark ? "rgba(224, 181, 108, 0.62)" : "rgba(47, 94, 124, 0.46)",
    );
    element.style.setProperty(
      "--bound-glow",
      isDark ? "rgba(224, 181, 108, 0.18)" : "rgba(47, 94, 124, 0.14)",
    );

    if (window.getComputedStyle(element).position === "static") {
      element.style.position = "relative";
    }

    element.append(overlay);

    const bounds = element.getBoundingClientRect();
    const target: BoundTarget = {
      element,
      overlay,
      previousWidth: bounds.width,
      previousHeight: bounds.height,
      observer: new ResizeObserver(([entry]) => {
        if (!entry) return;

        const { width, height } = entry.contentRect;
        const widthDelta = Math.abs(width - target.previousWidth);
        const heightDelta = Math.abs(height - target.previousHeight);

        target.previousWidth = width;
        target.previousHeight = height;

        if (widthDelta < 2 && heightDelta < 2) return;
        pulseBounds(target);
      }),
    };

    target.observer.observe(element);
    return target;
  });

  animate(
    targets.map((target) => target.overlay),
    {
      opacity: [0, 0.9, 0.52],
      duration: 620,
      delay: stagger(46),
      ease: "outExpo",
    },
  );

  animate(root.querySelectorAll(".container-bound-edge-top, .container-bound-edge-bottom"), {
    scaleX: [0, 1],
    duration: 720,
    delay: stagger(36),
    ease: "outExpo",
  });

  animate(root.querySelectorAll(".container-bound-edge-left, .container-bound-edge-right"), {
    scaleY: [0, 1],
    duration: 720,
    delay: stagger(36, { start: 90 }),
    ease: "outExpo",
  });

  return () => {
    targets.forEach(({ element, overlay, observer }) => {
      observer.disconnect();
      overlay.remove();
      element.classList.remove("animated-container-bound");
      element.removeAttribute("data-bound-motion-ready");
      element.style.removeProperty("--bound-color");
      element.style.removeProperty("--bound-glow");
    });
  };
}
