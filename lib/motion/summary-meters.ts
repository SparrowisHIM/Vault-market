import { animate, stagger } from "animejs";

type ParsedMetric = {
  prefix: string;
  suffix: string;
  value: number;
  decimals: number;
  compact: boolean;
};

const SUMMARY_CARD_SELECTOR = [
  ".vault-summary-card",
  ".research-summary-card",
  ".sell-summary-card",
  ".private-desk-summary-card",
  ".auction-summary-card",
].join(",");

function parseMetricValue(value: string): ParsedMetric | null {
  const trimmed = value.trim();
  const match = trimmed.match(/^([^0-9+-]*)([+-]?\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return null;

  const [, prefix, numericValue, suffix] = match;
  const normalizedValue = Number.parseFloat(numericValue.replace(/,/g, ""));
  if (Number.isNaN(normalizedValue)) return null;

  return {
    prefix,
    suffix,
    value: normalizedValue,
    decimals: numericValue.includes(".") ? numericValue.split(".")[1]?.length ?? 0 : 0,
    compact: numericValue.includes(","),
  };
}

function formatMetricValue(metric: ParsedMetric, value: number) {
  const fixedValue = value.toFixed(metric.decimals);
  const displayValue = metric.compact
    ? Number(fixedValue).toLocaleString("en-US", {
        minimumFractionDigits: metric.decimals,
        maximumFractionDigits: metric.decimals,
      })
    : fixedValue;

  return `${metric.prefix}${displayValue}${metric.suffix}`;
}

function groupBySummaryCard(elements: HTMLElement[]) {
  const grouped = new Map<HTMLElement, HTMLElement[]>();

  elements.forEach((element) => {
    const card = element.closest<HTMLElement>(SUMMARY_CARD_SELECTOR) ?? element.parentElement;
    if (!card) return;

    const currentGroup = grouped.get(card) ?? [];
    currentGroup.push(element);
    grouped.set(card, currentGroup);
  });

  return Array.from(grouped.values());
}

export function installSummaryMeterMotion(root: HTMLElement) {
  const animations: Array<ReturnType<typeof animate>> = [];
  const values = Array.from(root.querySelectorAll<HTMLElement>(".summary-meter-value"));
  const fills = Array.from(root.querySelectorAll<HTMLElement>(".summary-meter-fill"));
  const activeTicks = Array.from(root.querySelectorAll<HTMLElement>(".summary-meter-tick-active"));
  const inactiveTicks = Array.from(root.querySelectorAll<HTMLElement>(".summary-meter-tick-idle"));

  values.forEach((element, index) => {
    const finalValue = element.dataset.summaryValue ?? element.textContent ?? "";
    const metric = parseMetricValue(finalValue);
    if (!metric) return;

    const counter = { value: 0 };
    const animation = animate(counter, {
      value: [0, metric.value],
      duration: 820,
      delay: 220 + index * 70,
      ease: "outExpo",
      onUpdate: () => {
        element.textContent = formatMetricValue(metric, counter.value);
      },
      onComplete: () => {
        element.textContent = finalValue;
      },
    });

    animations.push(animation);
  });

  if (fills.length > 0) {
    fills.forEach((fill) => {
      fill.style.transformOrigin = "left center";
      fill.style.willChange = "filter, box-shadow, opacity, transform";
    });

    animations.push(
      animate(fills, {
        scaleX: [0, 1],
        opacity: [0.45, 1],
        duration: 760,
        delay: stagger(82, { start: 260 }),
        ease: "outExpo",
      }),
    );

    animations.push(
      animate(fills, {
        filter: ["brightness(0.96)", "brightness(1.22)", "brightness(1)"],
        boxShadow: [
          "0 0 0 rgba(47,113,88,0)",
          "0 0 16px rgba(47,113,88,0.34)",
          "0 0 0 rgba(47,113,88,0)",
        ],
        duration: 1800,
        delay: stagger(140, { start: 1050 }),
        loop: true,
        ease: "inOutSine",
      }),
    );
  }

  if (activeTicks.length > 0) {
    const activeTickGroups = groupBySummaryCard(activeTicks);

    activeTickGroups.forEach((ticks, groupIndex) => {
      ticks.forEach((tick) => {
        tick.style.transformOrigin = "bottom center";
        tick.style.willChange = "filter, box-shadow, opacity, transform";
      });

      animations.push(
        animate(ticks, {
          scaleY: [0.28, 1],
          opacity: [0.36, 1],
          translateY: [4, 0],
          filter: ["brightness(0.78)", "brightness(1.18)", "brightness(1)"],
          boxShadow: [
            "0 0 0 rgba(47,113,88,0)",
            "0 0 14px rgba(47,113,88,0.32)",
            "0 0 0 rgba(47,113,88,0)",
          ],
          duration: 620,
          delay: stagger(48, { start: 320 + groupIndex * 95 }),
          ease: "outExpo",
        }),
      );

      animations.push(
        animate(ticks, {
          opacity: [0.68, 1, 0.76],
          scaleY: [0.9, 1.12, 0.96],
          translateY: [0, -1.5, 0],
          filter: ["brightness(0.92)", "brightness(1.32)", "brightness(1)"],
          boxShadow: [
            "0 0 0 rgba(47,113,88,0)",
            "0 0 18px rgba(47,113,88,0.38)",
            "0 0 0 rgba(47,113,88,0)",
          ],
          duration: 1500,
          delay: stagger(72, { start: 1080 + groupIndex * 150 }),
          loop: true,
          ease: "inOutSine",
        }),
      );
    });
  }

  if (inactiveTicks.length > 0) {
    animations.push(
      animate(inactiveTicks, {
        opacity: [0.22, 1],
        duration: 420,
        delay: stagger(24, { start: 360 }),
        ease: "outExpo",
      }),
    );
  }

  return () => {
    animations.forEach((animation) => animation.cancel());
  };
}
