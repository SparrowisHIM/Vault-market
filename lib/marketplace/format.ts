import type {
  EyeAppeal,
  ListingType,
  SellerTrustTier,
  VaultStatus,
  VerificationStatus,
} from "./types";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-US");

export function formatCurrency(cents: number) {
  return currencyFormatter.format(cents / 100);
}

export function formatCertNumber(certNumber: string) {
  return certNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatPopulation(population?: number) {
  if (population === undefined) {
    return "Pop pending";
  }

  return `Pop ${numberFormatter.format(population)}`;
}

export function formatMarketDelta(delta?: number) {
  if (delta === undefined || delta === 0) {
    return "Market flat";
  }

  const sign = delta > 0 ? "+" : "";
  return `${sign}${delta.toFixed(1)}% vs comp`;
}

export function formatEstimateRange(range?: [number, number]) {
  if (!range) {
    return "Estimate pending";
  }

  const [low, high] = range;
  return `${formatCurrency(low)} - ${formatCurrency(high)}`;
}

export function getListingTypeLabel(type: ListingType) {
  switch (type) {
    case "buy_now":
      return "Buy Now";
    case "auction":
      return "Auction";
    case "premier":
      return "Premier";
  }
}

export function getVaultStatusLabel(status: VaultStatus) {
  switch (status) {
    case "vault_held":
      return "Vault held";
    case "seller_held":
      return "Seller held";
    case "intake_pending":
      return "Intake pending";
  }
}

export function getVerificationStatusLabel(status: VerificationStatus) {
  switch (status) {
    case "vault_verified":
      return "Vault verified";
    case "verified":
      return "Verified";
    case "pending_review":
      return "Pending review";
  }
}

export function getEyeAppealLabel(eyeAppeal?: EyeAppeal) {
  switch (eyeAppeal) {
    case "collect_a":
      return "Collect-A eye appeal";
    case "collect_e":
      return "Collect-E eye appeal";
    case "collect_s":
      return "Collect-S eye appeal";
    default:
      return "Eye appeal not reviewed";
  }
}

export function getTrustLabel(tier: SellerTrustTier) {
  switch (tier) {
    case "vault":
      return "Vault held";
    case "verified":
      return "Verified seller";
    case "new":
      return "New seller";
  }
}

export function getTrustDescription(tier: SellerTrustTier, completedSales: number) {
  switch (tier) {
    case "vault":
      return `Custody verified, ${numberFormatter.format(completedSales)} completed sales`;
    case "verified":
      return `Identity verified, ${numberFormatter.format(completedSales)} completed sales`;
    case "new":
      return `Identity review started, ${numberFormatter.format(completedSales)} completed sales`;
  }
}
