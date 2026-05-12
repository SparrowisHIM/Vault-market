import { animate, stagger } from "animejs";

type ParsedMetric = {
  prefix: string;
  suffix: string;
  value: number;
  decimals: number;
  compact: boolean;
};

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
  }

  if (activeTicks.length > 0) {
    animations.push(
      animate(activeTicks, {
        scaleY: [0.28, 1],
        opacity: [0.36, 1],
        translateY: [4, 0],
        duration: 520,
        delay: stagger(36, { start: 300 }),
        ease: "outExpo",
      }),
    );
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
