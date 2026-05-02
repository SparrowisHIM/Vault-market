export type Franchise = "Pokemon" | "One Piece" | "Sports" | "MTG" | "Yu-Gi-Oh";

export type GradingCompany = "PSA" | "BGS" | "CGC" | "SGC";

export type ListingStatus = "active" | "reserved" | "sold";

export type SellerTrustTier = "vault" | "verified" | "new";

export type SlabCardVariant = "default" | "compact";

export type ListingType = "buy_now" | "auction" | "premier";

export type VaultStatus = "vault_held" | "seller_held" | "intake_pending";

export type VerificationStatus = "vault_verified" | "verified" | "pending_review";

export type EyeAppeal = "collect_a" | "collect_e" | "collect_s";

export type VaultListing = {
  id: string;
  slug: string;
  title: string;
  franchise: Franchise;
  setName: string;
  year: number;
  cardNumber?: string;
  gradingCompany: GradingCompany;
  grade: string;
  certNumber: string;
  imageUrl: string;
  imageAlt: string;
  priceCents: number;
  marketDeltaPercent?: number;
  lastCompCents?: number;
  estimatedRangeCents?: [number, number];
  population?: number;
  listingType: ListingType;
  vaultStatus: VaultStatus;
  verificationStatus: VerificationStatus;
  eyeAppeal?: EyeAppeal;
  provenanceNotes?: string;
  inspectionHighlights: string[];
  seller: {
    name: string;
    trustTier: SellerTrustTier;
    completedSales: number;
    location: string;
  };
  status: ListingStatus;
};
