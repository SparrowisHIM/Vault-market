"use client";

import {
  ArrowUpRight,
  BadgeCheck,
  Check,
  ChevronDown,
  Grid3X3,
  RotateCcw,
  Rows3,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { animate, createScope, createTimeline, stagger } from "animejs";
import { formatCurrency, formatPopulation } from "@/lib/marketplace/format";
import type {
  Franchise,
  GradingCompany,
  ListingType,
  ListingStatus,
  SellerTrustTier,
  VaultListing,
} from "@/lib/marketplace/types";
import { installContainerBoundMotion } from "@/lib/motion/container-bounds";
import { cn } from "@/lib/utils";
import { CompareDrawer } from "./compare-drawer";
import { SlabCard } from "./slab-card";

type MarketplaceBrowserProps = {
  listings: VaultListing[];
  initialQueryParams?: MarketplaceQueryParams;
};

export type MarketplaceQueryParams = {
  q?: string;
  type?: string;
  franchise?: string;
  grader?: string;
  trust?: string;
  status?: string;
  sort?: string;
};

type FilterValue<T extends string> = "all" | T;

type SortValue = "market-signal" | "price-high" | "price-low" | "grade-high";
type ViewDensity = "default" | "compact";
type DeskPreset = "all" | "high-signal" | "vault-held" | "premier" | "active";

const listingTypes: ListingType[] = ["buy_now", "auction", "premier"];
const franchises: Franchise[] = ["Pokemon", "One Piece", "Sports", "MTG", "Yu-Gi-Oh"];
const gradingCompanies: GradingCompany[] = ["PSA", "BGS", "CGC", "SGC"];
const sellerTrustTiers: SellerTrustTier[] = ["vault", "verified", "new"];
const listingStatuses: ListingStatus[] = ["active", "reserved", "sold"];
const sortValues: SortValue[] = ["market-signal", "price-high", "price-low", "grade-high"];

const filterControlClass =
  "h-11 w-full rounded-[7px] border border-[rgba(17,19,15,0.105)] bg-[rgba(255,254,249,0.58)] px-3 text-sm font-medium text-vault-graphite shadow-[inset_0_1px_0_rgba(255,255,255,0.68)] outline-none transition hover:border-[rgba(47,94,124,0.2)] hover:bg-[rgba(255,254,249,0.82)] focus:border-vault-registry focus:bg-white/86 focus:ring-2 focus:ring-[var(--focus-ring)]";

const labelClass =
  "font-mono text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-vault-steel";

const deskPresets: Array<{
  id: DeskPreset;
  label: string;
  detail: string;
  icon: typeof TrendingUp;
}> = [
  {
    id: "all",
    label: "Full book",
    detail: "All visible graded slabs",
    icon: Grid3X3,
  },
  {
    id: "high-signal",
    label: "High signal",
    detail: "Sort by current market move",
    icon: TrendingUp,
  },
  {
    id: "vault-held",
    label: "Vault held",
    detail: "Custody-forward inventory",
    icon: ShieldCheck,
  },
  {
    id: "premier",
    label: "Premier lots",
    detail: "Top-tier staged listings",
    icon: BadgeCheck,
  },
  {
    id: "active",
    label: "Active now",
    detail: "Available listings only",
    icon: ArrowUpRight,
  },
];

function trustLabel(tier: SellerTrustTier) {
  switch (tier) {
    case "vault":
      return "Vault held";
    case "verified":
      return "Verified";
    case "new":
      return "New seller";
  }
}

function statusLabel(status: ListingStatus) {
  return status[0].toUpperCase() + status.slice(1);
}

function listingTypeLabel(type: ListingType) {
  switch (type) {
    case "buy_now":
      return "Buy Now";
    case "auction":
      return "Auction";
    case "premier":
      return "Premier";
  }
}

type MarketSelectOption<T extends string> = {
  value: T;
  label: string;
};

function MarketSelect<T extends string>({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: T;
  options: MarketSelectOption<T>[];
  onChange: (value: T) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = options.find((option) => option.value === value) ?? options[0];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative grid gap-1.5">
      <label className={labelClass} id={`${id}-label`}>
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label ${id}`}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          filterControlClass,
          "flex items-center justify-between gap-2 text-left",
          open && "border-vault-registry bg-white/90 ring-2 ring-[var(--focus-ring)]",
        )}
      >
        <span className="min-w-0 truncate">{selectedOption.label}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-vault-steel transition", open && "rotate-180 text-vault-registry")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-[90] overflow-hidden rounded-[8px] border border-[rgba(17,19,15,0.14)] bg-[#fffdf7] p-1.5 shadow-[0_24px_58px_rgba(17,19,15,0.22),inset_0_1px_0_rgba(255,255,255,0.86)]">
          <div role="listbox" aria-labelledby={`${id}-label`} className="grid gap-0.5">
            {options.map((option) => {
              const selected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex min-h-9 items-center justify-between gap-2 rounded-[6px] px-2.5 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
                    selected
                      ? "bg-[rgba(47,94,124,0.1)] text-vault-ink"
                      : "text-vault-graphite hover:bg-[rgba(17,19,15,0.055)]",
                  )}
                >
                  <span className="min-w-0 truncate">{option.label}</span>
                  {selected ? <Check className="h-3.5 w-3.5 shrink-0 text-vault-registry" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getGradeValue(grade: string) {
  const numericGrade = Number.parseFloat(grade);
  return Number.isNaN(numericGrade) ? 0 : numericGrade;
}

function getFilterParam<T extends string>(value: string | null, options: readonly T[]) {
  if (value && options.includes(value as T)) {
    return value as T;
  }

  return "all";
}

function getSortParam(value: string | null) {
  if (value && sortValues.includes(value as SortValue)) {
    return value as SortValue;
  }

  return "market-signal";
}

export function MarketplaceBrowser({
  listings,
  initialQueryParams = {},
}: MarketplaceBrowserProps) {
  const router = useRouter();
  const [query, setQuery] = useState(() => initialQueryParams.q ?? "");
  const [listingType, setListingType] = useState<FilterValue<ListingType>>(() =>
    getFilterParam(initialQueryParams.type ?? null, listingTypes),
  );
  const [franchise, setFranchise] = useState<FilterValue<Franchise>>(() =>
    getFilterParam(initialQueryParams.franchise ?? null, franchises),
  );
  const [gradingCompany, setGradingCompany] = useState<FilterValue<GradingCompany>>(() =>
    getFilterParam(initialQueryParams.grader ?? null, gradingCompanies),
  );
  const [sellerTrust, setSellerTrust] = useState<FilterValue<SellerTrustTier>>(() =>
    getFilterParam(initialQueryParams.trust ?? null, sellerTrustTiers),
  );
  const [status, setStatus] = useState<FilterValue<ListingStatus>>(() =>
    getFilterParam(initialQueryParams.status ?? null, listingStatuses),
  );
  const [sort, setSort] = useState<SortValue>(() =>
    getSortParam(initialQueryParams.sort ?? null),
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [viewDensity, setViewDensity] = useState<ViewDensity>("default");
  const [spotlightListingId, setSpotlightListingId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareNotice, setCompareNotice] = useState<string | null>(null);
  const [compareNoticeTone, setCompareNoticeTone] = useState<"limit" | "neutral" | null>(null);
  const compareIdsRef = useRef<string[]>([]);
  const rootRef = useRef<HTMLElement | null>(null);
  const resultsGridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();

    if (trimmedQuery) params.set("q", trimmedQuery);
    if (listingType !== "all") params.set("type", listingType);
    if (franchise !== "all") params.set("franchise", franchise);
    if (gradingCompany !== "all") params.set("grader", gradingCompany);
    if (sellerTrust !== "all") params.set("trust", sellerTrust);
    if (status !== "all") params.set("status", status);
    if (sort !== "market-signal") params.set("sort", sort);

    const nextPath = params.toString() ? `/marketplace?${params.toString()}` : "/marketplace";
    router.replace(nextPath, { scroll: false });
  }, [franchise, gradingCompany, listingType, query, router, sellerTrust, sort, status]);

  const filteredListings = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return listings
      .filter((listing) => {
        const searchableText = [
          listing.title,
          listing.franchise,
          listing.setName,
          listing.cardNumber,
          listing.gradingCompany,
          listing.certNumber,
          listing.seller.name,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return (
          (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
          (listingType === "all" || listing.listingType === listingType) &&
          (franchise === "all" || listing.franchise === franchise) &&
          (gradingCompany === "all" || listing.gradingCompany === gradingCompany) &&
          (sellerTrust === "all" || listing.seller.trustTier === sellerTrust) &&
          (status === "all" || listing.status === status)
        );
      })
      .sort((a, b) => {
        switch (sort) {
          case "price-high":
            return b.priceCents - a.priceCents;
          case "price-low":
            return a.priceCents - b.priceCents;
          case "grade-high":
            return getGradeValue(b.grade) - getGradeValue(a.grade);
          case "market-signal":
            return (b.marketDeltaPercent ?? 0) - (a.marketDeltaPercent ?? 0);
        }
      });
  }, [franchise, gradingCompany, listingType, listings, query, sellerTrust, sort, status]);

  const hasActiveFilters =
    query.trim() !== "" ||
    listingType !== "all" ||
    franchise !== "all" ||
    gradingCompany !== "all" ||
    sellerTrust !== "all" ||
    status !== "all";

  const spotlightListing =
    filteredListings.find((listing) => listing.id === spotlightListingId) ??
    filteredListings[0] ??
    null;
  const comparedListings = useMemo(
    () =>
      compareIds
        .map((id) => listings.find((listing) => listing.id === id))
        .filter(Boolean) as VaultListing[],
    [compareIds, listings],
  );

  useEffect(() => {
    if (!compareNotice) return;

    const timeout = window.setTimeout(() => {
      setCompareNotice(null);
      setCompareNoticeTone(null);
    }, 2600);
    return () => window.clearTimeout(timeout);
  }, [compareNotice]);

  useEffect(() => {
    compareIdsRef.current = compareIds;
  }, [compareIds]);

  const marketStats = useMemo(() => {
    const askBook = filteredListings.reduce((total, listing) => total + listing.priceCents, 0);
    const vaultHeld = filteredListings.filter(
      (listing) => listing.seller.trustTier === "vault",
    ).length;
    const available = filteredListings.filter((listing) => listing.status === "active").length;
    const averageDelta =
      filteredListings.length > 0
        ? filteredListings.reduce(
            (total, listing) => total + (listing.marketDeltaPercent ?? 0),
            0,
          ) / filteredListings.length
        : 0;

    return {
      askBook,
      vaultHeld,
      available,
      averageDelta,
    };
  }, [filteredListings]);

  const activeFilters = [
    query.trim()
      ? {
          key: "query",
          label: `Search: ${query.trim()}`,
          clear: () => setQuery(""),
        }
      : null,
    listingType !== "all"
      ? {
          key: "listingType",
          label: `Mode: ${listingTypeLabel(listingType)}`,
          clear: () => setListingType("all"),
        }
      : null,
    franchise !== "all"
      ? {
          key: "franchise",
          label: `Franchise: ${franchise}`,
          clear: () => setFranchise("all"),
        }
      : null,
    gradingCompany !== "all"
      ? {
          key: "gradingCompany",
          label: `Grader: ${gradingCompany}`,
          clear: () => setGradingCompany("all"),
        }
      : null,
    sellerTrust !== "all"
      ? {
          key: "sellerTrust",
          label: `Trust: ${trustLabel(sellerTrust)}`,
          clear: () => setSellerTrust("all"),
        }
      : null,
    status !== "all"
      ? {
          key: "status",
          label: `Status: ${statusLabel(status)}`,
          clear: () => setStatus("all"),
        }
      : null,
    sort !== "market-signal"
      ? {
          key: "sort",
          label: `Sort: ${sort.replace("-", " ")}`,
          clear: () => setSort("market-signal"),
        }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; clear: () => void }>;

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
        .add(".marketplace-preset-panel", {
          opacity: [0, 1],
          y: [16, 0],
          filter: ["blur(8px)", "blur(0px)"],
          duration: 620,
        })
        .add(
          ".marketplace-preset-card",
          {
            opacity: [0, 1],
            y: [12, 0],
            delay: stagger(54),
            duration: 480,
          },
          "-=380",
        )
        .add(
          ".marketplace-brief-panel",
          {
            opacity: [0, 1],
            y: [14, 0],
            filter: ["blur(7px)", "blur(0px)"],
            duration: 560,
          },
          "-=420",
        )
        .add(
          ".marketplace-filter-shell",
          {
            opacity: [0, 1],
            y: [12, 0],
            duration: 520,
          },
          "-=260",
        )
        .add(
          ".marketplace-results-heading-row",
          {
            opacity: [0, 1],
            y: [10, 0],
            duration: 460,
          },
          "-=220",
        );
    });

    return () => {
      cleanupContainerBounds?.();
      scope.revert();
    };
  }, []);

  useEffect(() => {
    const grid = resultsGridRef.current;
    if (!grid) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const cards = grid.querySelectorAll(".marketplace-result-card");
    animate(cards, {
      opacity: [0, 1],
      translateY: [14, 0],
      filter: ["blur(7px)", "blur(0px)"],
      delay: stagger(42),
      duration: 500,
      ease: "outExpo",
    });
  }, [filteredListings]);

  function resetFilters() {
    setQuery("");
    setListingType("all");
    setFranchise("all");
    setGradingCompany("all");
    setSellerTrust("all");
    setStatus("all");
    setSort("market-signal");
  }

  function applyDeskPreset(preset: DeskPreset) {
    if (preset === "all") {
      resetFilters();
      return;
    }

    setQuery("");
    setFranchise("all");
    setGradingCompany("all");

    if (preset === "high-signal") {
      setListingType("all");
      setSellerTrust("all");
      setStatus("all");
      setSort("market-signal");
    }

    if (preset === "vault-held") {
      setListingType("all");
      setSellerTrust("vault");
      setStatus("all");
      setSort("market-signal");
    }

    if (preset === "premier") {
      setListingType("premier");
      setSellerTrust("all");
      setStatus("all");
      setSort("price-high");
    }

    if (preset === "active") {
      setListingType("all");
      setSellerTrust("all");
      setStatus("active");
      setSort("market-signal");
    }
  }

  function toggleCompareListing(listing: VaultListing, nextCompared: boolean) {
    if (!nextCompared) {
      const nextCompareIds = compareIdsRef.current.filter((id) => id !== listing.id);
      compareIdsRef.current = nextCompareIds;
      setCompareIds(nextCompareIds);
      setCompareNotice(null);
      setCompareNoticeTone(null);
      return true;
    }

    const currentCompareIds = compareIdsRef.current;

    if (currentCompareIds.includes(listing.id)) return true;

    if (currentCompareIds.length >= 3) {
      setCompareOpen(true);
      setCompareNotice("Compare queue holds up to 3 slabs");
      setCompareNoticeTone("limit");
      return false;
    }

    const nextCompareIds = [...currentCompareIds, listing.id];
    compareIdsRef.current = nextCompareIds;
    setCompareIds(nextCompareIds);
    if (nextCompareIds.length >= 2) {
      setCompareOpen(true);
    }
    setCompareNotice(`${listing.title} added to compare desk`);
    setCompareNoticeTone("neutral");
    return true;
  }

  function removeComparedListing(listingId: string) {
    const nextCompareIds = compareIdsRef.current.filter((id) => id !== listingId);
    compareIdsRef.current = nextCompareIds;
    setCompareIds(nextCompareIds);
  }

  function clearComparedListings() {
    compareIdsRef.current = [];
    setCompareIds([]);
    setCompareOpen(false);
    setCompareNotice(null);
    setCompareNoticeTone(null);
  }

  function getActivePreset() {
    if (!hasActiveFilters && sort === "market-signal") return "all";
    if (
      sellerTrust === "vault" &&
      listingType === "all" &&
      franchise === "all" &&
      gradingCompany === "all" &&
      status === "all" &&
      query.trim() === ""
    ) {
      return "vault-held";
    }
    if (
      listingType === "premier" &&
      sort === "price-high" &&
      sellerTrust === "all" &&
      franchise === "all" &&
      gradingCompany === "all" &&
      status === "all" &&
      query.trim() === ""
    ) {
      return "premier";
    }
    if (
      status === "active" &&
      listingType === "all" &&
      sellerTrust === "all" &&
      franchise === "all" &&
      gradingCompany === "all" &&
      query.trim() === ""
    ) {
      return "active";
    }
    return null;
  }

  const activePreset = getActivePreset();
  const currentMarketplacePath = useMemo(() => {
    const params = new URLSearchParams();
    const trimmedQuery = query.trim();

    if (trimmedQuery) params.set("q", trimmedQuery);
    if (listingType !== "all") params.set("type", listingType);
    if (franchise !== "all") params.set("franchise", franchise);
    if (gradingCompany !== "all") params.set("grader", gradingCompany);
    if (sellerTrust !== "all") params.set("trust", sellerTrust);
    if (status !== "all") params.set("status", status);
    if (sort !== "market-signal") params.set("sort", sort);

    return params.toString() ? `/marketplace?${params.toString()}` : "/marketplace";
  }, [franchise, gradingCompany, listingType, query, sellerTrust, sort, status]);

  return (
    <section ref={rootRef} aria-labelledby="marketplace-results-heading" className="grid gap-4">
      <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="marketplace-preset-panel relative overflow-hidden rounded-[10px] border border-[var(--border-soft)] bg-[rgba(17,19,15,0.9)] p-3 text-vault-paper shadow-[0_24px_70px_rgba(17,19,15,0.2)] motion-safe:opacity-0">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,transparent,rgba(255,255,255,0.08)_48%,transparent_58%)]" />
          <div className="relative grid gap-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-vault-paper/58">
                  Desk presets
                </p>
                <h2 className="mt-1 text-lg font-semibold text-vault-paper">
                  Open a market view
                </h2>
              </div>
              <div className="inline-grid grid-cols-2 rounded-[8px] border border-white/10 bg-white/[0.06] p-1">
                <button
                  type="button"
                  onClick={() => setViewDensity("default")}
                  aria-pressed={viewDensity === "default"}
                  className={cn(
                    "inline-flex h-9 items-center justify-center gap-2 rounded-[6px] px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45",
                    viewDensity === "default"
                      ? "bg-vault-paper text-vault-ink"
                      : "text-vault-paper/68 hover:bg-white/[0.08] hover:text-vault-paper",
                  )}
                >
                  <Grid3X3 className="h-4 w-4" aria-hidden="true" />
                  Default
                </button>
                <button
                  type="button"
                  onClick={() => setViewDensity("compact")}
                  aria-pressed={viewDensity === "compact"}
                  className={cn(
                    "inline-flex h-9 items-center justify-center gap-2 rounded-[6px] px-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45",
                    viewDensity === "compact"
                      ? "bg-vault-paper text-vault-ink"
                      : "text-vault-paper/68 hover:bg-white/[0.08] hover:text-vault-paper",
                  )}
                >
                  <Rows3 className="h-4 w-4" aria-hidden="true" />
                  Compact
                </button>
              </div>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {deskPresets.map((preset) => {
                const Icon = preset.icon;
                const isActive = activePreset === preset.id;

                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyDeskPreset(preset.id)}
                    aria-pressed={isActive}
                    className={cn(
                      "marketplace-preset-card group min-h-24 rounded-[8px] border p-3 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45 motion-safe:opacity-0",
                      isActive
                        ? "border-white/30 bg-white/[0.14] text-vault-paper shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                        : "border-white/10 bg-white/[0.055] text-vault-paper/72 hover:-translate-y-0.5 hover:bg-white/[0.09] hover:text-vault-paper",
                    )}
                  >
                    <span className="flex items-center justify-between gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-[7px] border border-white/10 bg-white/[0.08]">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <ArrowUpRight
                        className="h-4 w-4 opacity-38 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </span>
                    <span className="mt-3 block text-sm font-semibold">{preset.label}</span>
                    <span className="mt-1 block text-xs leading-5 text-vault-paper/52">
                      {preset.detail}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="marketplace-brief-panel rounded-[10px] border border-[var(--border-soft)] bg-[var(--surface-panel)] p-3 shadow-[var(--shadow-card)] motion-safe:opacity-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={labelClass}>Live desk brief</p>
              <h2 className="mt-1 text-lg font-semibold text-vault-ink">
                {spotlightListing ? spotlightListing.title : "No slab selected"}
              </h2>
            </div>
            <span
              className={cn(
                "rounded-full border px-2 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em]",
                marketStats.averageDelta >= 0
                  ? "border-[rgba(47,113,88,0.25)] bg-[rgba(47,113,88,0.08)] text-[#235844]"
                  : "border-[rgba(154,62,53,0.25)] bg-[rgba(154,62,53,0.08)] text-vault-loss",
              )}
            >
              {marketStats.averageDelta >= 0 ? "+" : ""}
              {marketStats.averageDelta.toFixed(1)}% avg
            </span>
          </div>

          {spotlightListing ? (
            <div className="mt-3 grid gap-2">
              <div className="rounded-[8px] border border-[var(--border-soft)] bg-white/42 p-3">
                <p className={labelClass}>Spotlight ask</p>
                <p className="mt-1 text-2xl font-semibold text-vault-ink">
                  {formatCurrency(spotlightListing.priceCents)}
                </p>
                <p className="mt-1 text-xs text-vault-steel">
                  {spotlightListing.gradingCompany} {spotlightListing.grade} /{" "}
                  {spotlightListing.franchise} / {formatPopulation(spotlightListing.population)}
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-2">
                  <p className={labelClass}>Shown</p>
                  <p className="mt-1 text-lg font-semibold text-vault-ink">
                    {filteredListings.length}
                  </p>
                </div>
                <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-2">
                  <p className={labelClass}>Active</p>
                  <p className="mt-1 text-lg font-semibold text-vault-ink">
                    {marketStats.available}
                  </p>
                </div>
                <div className="rounded-[7px] border border-[var(--border-soft)] bg-white/36 p-2">
                  <p className={labelClass}>Vault</p>
                  <p className="mt-1 text-lg font-semibold text-vault-ink">
                    {marketStats.vaultHeld}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="mt-3 rounded-[8px] border border-dashed border-[var(--border-medium)] p-3 text-sm leading-6 text-vault-steel">
              Broaden filters to populate the desk brief.
            </p>
          )}
        </aside>
      </div>

      <div className="marketplace-filter-shell relative z-30 rounded-[10px] border border-[rgba(17,19,15,0.1)] bg-[linear-gradient(180deg,rgba(255,254,249,0.76),rgba(249,248,243,0.58))] p-4 shadow-[0_16px_46px_rgba(17,19,15,0.045),inset_0_1px_0_rgba(255,255,255,0.72)] motion-safe:opacity-0">
        <div className="flex flex-wrap items-center justify-between gap-3 lg:hidden">
          <div>
            <p className={labelClass}>Market refinement</p>
            <p className="mt-1 text-sm text-vault-steel">
              {activeFilters.length > 0
                ? `${activeFilters.length} active filter${activeFilters.length === 1 ? "" : "s"}`
                : "Full market book"}
            </p>
          </div>
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="marketplace-filter-panel"
            onClick={() => setFiltersOpen((current) => !current)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-vault-graphite bg-vault-ink px-4 text-sm font-semibold text-vault-paper transition hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            {filtersOpen ? "Hide filters" : "Show filters"}
          </button>
        </div>

        <div className="hidden items-end justify-between gap-3 lg:flex">
          <div>
            <p className={labelClass}>Market refinement</p>
            <p className="mt-1 text-xs text-vault-steel">
              Tune the visible book after choosing a desk preset.
            </p>
          </div>
          <span className="rounded-full border border-[rgba(17,19,15,0.08)] bg-white/36 px-2.5 py-1 font-mono text-[0.62rem] font-semibold uppercase tracking-[0.12em] text-vault-steel">
            {activeFilters.length > 0
              ? `${activeFilters.length} tuned`
              : "Full book"}
          </span>
        </div>

        <div
          id="marketplace-filter-panel"
          className={cn(
            "mt-4 grid gap-3 lg:grid lg:grid-cols-[minmax(210px,1.35fr)_repeat(6,minmax(126px,0.82fr))_minmax(96px,auto)] lg:items-end",
            filtersOpen ? "grid" : "hidden",
          )}
        >
        <div className="grid gap-1.5">
          <label className={labelClass} htmlFor="marketplace-search">
            Search book
          </label>
          <input
            id="marketplace-search"
            name="q"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Card, set, cert, seller..."
            autoComplete="off"
            className={cn(filterControlClass, "font-normal placeholder:text-vault-steel/58")}
          />
        </div>

        <MarketSelect
          id="type-filter"
          label="Sale mode"
          value={listingType}
          onChange={setListingType}
          options={[
            { value: "all", label: "All" },
            ...listingTypes.map((item) => ({ value: item, label: listingTypeLabel(item) })),
          ]}
        />

        <MarketSelect
          id="franchise-filter"
          label="Franchise"
          value={franchise}
          onChange={setFranchise}
          options={[
            { value: "all", label: "All" },
            ...franchises.map((item) => ({ value: item, label: item })),
          ]}
        />

        <MarketSelect
          id="grading-filter"
          label="Grader"
          value={gradingCompany}
          onChange={setGradingCompany}
          options={[
            { value: "all", label: "All" },
            ...gradingCompanies.map((item) => ({ value: item, label: item })),
          ]}
        />

        <MarketSelect
          id="trust-filter"
          label="Trust"
          value={sellerTrust}
          onChange={setSellerTrust}
          options={[
            { value: "all", label: "All" },
            ...sellerTrustTiers.map((item) => ({ value: item, label: trustLabel(item) })),
          ]}
        />

        <MarketSelect
          id="status-filter"
          label="Status"
          value={status}
          onChange={setStatus}
          options={[
            { value: "all", label: "All" },
            ...listingStatuses.map((item) => ({ value: item, label: statusLabel(item) })),
          ]}
        />

        <MarketSelect
          id="sort-listings"
          label="Sort"
          value={sort}
          onChange={setSort}
          options={[
            { value: "market-signal", label: "Market signal" },
            { value: "price-high", label: "Price high" },
            { value: "price-low", label: "Price low" },
            { value: "grade-high", label: "Grade high" },
          ]}
        />

        <button
          type="button"
          onClick={resetFilters}
          disabled={!hasActiveFilters && sort === "market-signal"}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[7px] border border-[rgba(17,19,15,0.1)] bg-white/30 px-3 text-sm font-semibold text-vault-steel transition hover:border-[rgba(47,94,124,0.18)] hover:bg-white/70 hover:text-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </button>
      </div>
      </div>

      {activeFilters.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-vault-steel">
            Active desk view
          </span>
          {activeFilters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={filter.clear}
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[rgba(47,94,124,0.22)] bg-[rgba(47,94,124,0.08)] px-3 font-mono text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-[#244f69] transition hover:-translate-y-0.5 hover:bg-[rgba(47,94,124,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
              aria-label={`Remove ${filter.label} filter`}
            >
              {filter.label}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ))}
        </div>
      ) : null}

      <div className="marketplace-results-heading-row flex flex-wrap items-end justify-between gap-3 border-b border-[var(--border-soft)] pb-3 motion-safe:opacity-0">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-vault-registry" aria-hidden="true" />
            <h2 id="marketplace-results-heading" className="text-lg font-semibold text-vault-ink">
              Marketplace listings
            </h2>
          </div>
          <p className="mt-1 text-sm text-vault-steel">
            Showing {filteredListings.length} of {listings.length} graded cards
          </p>
          <p className="sr-only" role="status" aria-live="polite">
            Showing {filteredListings.length} of {listings.length} graded cards.
          </p>
        </div>

        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-vault-steel">
          {hasActiveFilters ? "Filtered book" : "Full ask book"} /{" "}
          {formatCurrency(marketStats.askBook)}
        </p>
      </div>

      {filteredListings.length > 0 ? (
        <div
          ref={resultsGridRef}
          className={cn(
            "grid grid-cols-1 gap-3",
            viewDensity === "compact"
              ? "md:grid-cols-2 2xl:grid-cols-3"
              : "md:grid-cols-2 xl:grid-cols-3",
          )}
        >
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="marketplace-result-card motion-safe:opacity-0"
              onPointerEnter={() => setSpotlightListingId(listing.id)}
              onFocusCapture={() => setSpotlightListingId(listing.id)}
            >
              <SlabCard
                listing={listing}
                variant={viewDensity}
                sourceHref={currentMarketplacePath}
                compareQueued={compareIds.includes(listing.id)}
                onCompareToggle={toggleCompareListing}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-[8px] border border-dashed border-[var(--border-medium)] bg-white/35 px-5 py-10 text-center">
          <h3 className="text-base font-semibold text-vault-ink">No matching slabs</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-vault-steel">
            Broaden the registry filters or reset the browse desk to see the full market set.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-[6px] border border-vault-graphite bg-vault-ink px-4 text-sm font-semibold text-vault-paper transition hover:bg-vault-graphite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-canvas)]"
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset filters
          </button>
        </div>
      )}
      <CompareDrawer
        listings={comparedListings}
        isOpen={compareOpen}
        notice={compareNotice}
        sourceHref={currentMarketplacePath}
        noticeTone={compareNoticeTone}
        onOpen={() => setCompareOpen(true)}
        onClose={() => setCompareOpen(false)}
        onRemove={removeComparedListing}
        onClear={clearComparedListings}
      />
    </section>
  );
}
