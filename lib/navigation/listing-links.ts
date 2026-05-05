const DEFAULT_LISTING_SOURCE = "/marketplace";

const sourceLabels: Array<[string, string]> = [
  ["/auctions", "Back to auctions"],
  ["/vault", "Back to vault"],
  ["/private-desk", "Back to private desk"],
  ["/research", "Back to research"],
  ["/sell", "Back to sell"],
  ["/marketplace", "Back to marketplace"],
];

export function getSafeInternalPath(value?: string | string[] | null) {
  const candidate = Array.isArray(value) ? value[0] : value;

  if (!candidate || !candidate.startsWith("/") || candidate.startsWith("//")) {
    return null;
  }

  try {
    const url = new URL(candidate, "https://vaultmarket.local");
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return null;
  }
}

export function buildListingHref(slug: string, from?: string | string[] | null) {
  const safeSource = getSafeInternalPath(from);
  const baseHref = `/marketplace/${slug}`;

  if (!safeSource) return baseHref;

  return `${baseHref}?from=${encodeURIComponent(safeSource)}`;
}

export function getListingBackTarget(from?: string | string[] | null) {
  return getSafeInternalPath(from) ?? DEFAULT_LISTING_SOURCE;
}

export function getListingBackLabel(target: string) {
  const match = sourceLabels.find(([source]) => target === source || target.startsWith(`${source}?`));
  return match?.[1] ?? "Back";
}
