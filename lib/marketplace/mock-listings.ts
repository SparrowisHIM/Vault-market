import type { VaultListing } from "./types";

function cardArtwork(title: string, accent: string, secondary: string, code: string) {
  const escapedTitle = title
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 900" role="img" aria-label="${escapedTitle}">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop stop-color="${accent}" offset="0"/>
      <stop stop-color="${secondary}" offset="0.58"/>
      <stop stop-color="#121410" offset="1"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.13"/>
      </feComponentTransfer>
    </filter>
  </defs>
  <rect width="640" height="900" rx="38" fill="#f6f0df"/>
  <rect x="36" y="36" width="568" height="828" rx="28" fill="url(#g)"/>
  <rect x="72" y="86" width="496" height="560" rx="18" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.34)" stroke-width="2"/>
  <path d="M104 612 C180 474 238 534 300 386 C363 236 434 298 536 138" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="20" stroke-linecap="round"/>
  <path d="M126 554 C210 492 268 492 346 356 C422 225 472 224 540 172" fill="none" stroke="rgba(246,240,223,0.42)" stroke-width="5" stroke-linecap="round"/>
  <rect x="72" y="682" width="496" height="118" rx="18" fill="rgba(246,240,223,0.88)"/>
  <text x="96" y="730" fill="#121410" font-family="Arial, sans-serif" font-size="34" font-weight="700">${escapedTitle}</text>
  <text x="96" y="770" fill="#384037" font-family="Arial, sans-serif" font-size="22" letter-spacing="4">${code}</text>
  <rect width="640" height="900" rx="38" filter="url(#grain)"/>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const mockListings: VaultListing[] = [
  {
    id: "lst_001",
    slug: "1999-pokemon-base-charizard-psa-9",
    title: "Charizard Holo",
    franchise: "Pokemon",
    setName: "Base Set Unlimited",
    year: 1999,
    cardNumber: "4/102",
    gradingCompany: "PSA",
    grade: "9",
    certNumber: "812849337",
    imageUrl: cardArtwork("Charizard Holo", "#b84d35", "#e5a842", "BASE 4/102"),
    imageAlt: "Stylized registry artwork for 1999 Pokemon Base Set Charizard Holo",
    priceCents: 425000,
    marketDeltaPercent: 4.8,
    lastCompCents: 405000,
    estimatedRangeCents: [390000, 455000],
    population: 7257,
    listingType: "buy_now",
    vaultStatus: "vault_held",
    verificationStatus: "vault_verified",
    eyeAppeal: "collect_e",
    provenanceNotes: "Vaulted after seller intake with cert, slab face, and label reviewed.",
    inspectionHighlights: [
      "Cert number visible",
      "No slab cracks noted",
      "Strong color registration",
    ],
    seller: {
      name: "Northstar Vault",
      trustTier: "vault",
      completedSales: 418,
      location: "Chicago, IL",
    },
    status: "active",
  },
  {
    id: "lst_002",
    slug: "2023-one-piece-manga-shanks-psa-10",
    title: "Shanks Manga Alternate Art",
    franchise: "One Piece",
    setName: "Romance Dawn",
    year: 2023,
    cardNumber: "OP01-120",
    gradingCompany: "PSA",
    grade: "10",
    certNumber: "902184774",
    imageUrl: cardArtwork("Shanks Manga", "#7b2726", "#1b3440", "OP01-120"),
    imageAlt: "VaultMarket slab artwork for One Piece Shanks Manga Alternate Art",
    priceCents: 318000,
    marketDeltaPercent: -2.2,
    lastCompCents: 325000,
    estimatedRangeCents: [295000, 345000],
    population: 381,
    listingType: "auction",
    vaultStatus: "seller_held",
    verificationStatus: "verified",
    provenanceNotes: "Seller-held listing prepared for auction review and final intake.",
    inspectionHighlights: [
      "Cert number visible",
      "Auction intake requested",
      "Low population example",
    ],
    seller: {
      name: "Red Line Cards",
      trustTier: "verified",
      completedSales: 96,
      location: "Austin, TX",
    },
    status: "active",
  },
  {
    id: "lst_003",
    slug: "1986-fleer-michael-jordan-rookie-sgc-8",
    title: "Michael Jordan Rookie",
    franchise: "Sports",
    setName: "Fleer Basketball",
    year: 1986,
    cardNumber: "57",
    gradingCompany: "SGC",
    grade: "8",
    certNumber: "118204593",
    imageUrl: cardArtwork("Jordan Rookie", "#b4212d", "#1e1f24", "FLEER 57"),
    imageAlt: "Graded slab artwork for 1986 Fleer Michael Jordan Rookie",
    priceCents: 795000,
    marketDeltaPercent: 1.4,
    lastCompCents: 784000,
    estimatedRangeCents: [760000, 835000],
    population: 1194,
    listingType: "premier",
    vaultStatus: "vault_held",
    verificationStatus: "vault_verified",
    eyeAppeal: "collect_a",
    provenanceNotes: "Reserved premier lot from a long-standing sports-card seller.",
    inspectionHighlights: [
      "Vault custody confirmed",
      "Vintage rookie lot",
      "Seller history reviewed",
    ],
    seller: {
      name: "Baseline Registry",
      trustTier: "vault",
      completedSales: 312,
      location: "New York, NY",
    },
    status: "reserved",
  },
  {
    id: "lst_004",
    slug: "1993-mtg-beta-black-lotus-bgs-85",
    title: "Black Lotus",
    franchise: "MTG",
    setName: "Limited Edition Beta",
    year: 1993,
    cardNumber: "233",
    gradingCompany: "BGS",
    grade: "8.5",
    certNumber: "0012098841",
    imageUrl: cardArtwork("Black Lotus", "#161613", "#746348", "BETA 233"),
    imageAlt: "Stylized registry artwork for Magic The Gathering Beta Black Lotus",
    priceCents: 12450000,
    marketDeltaPercent: 6.1,
    lastCompCents: 11730000,
    estimatedRangeCents: [11200000, 13200000],
    population: 86,
    listingType: "premier",
    vaultStatus: "intake_pending",
    verificationStatus: "pending_review",
    eyeAppeal: "collect_s",
    provenanceNotes: "Premier candidate pending final vault intake and surface review.",
    inspectionHighlights: [
      "Elite rarity profile",
      "Estimate range assigned",
      "Final intake pending",
    ],
    seller: {
      name: "Lotus Desk",
      trustTier: "verified",
      completedSales: 51,
      location: "Seattle, WA",
    },
    status: "active",
  },
  {
    id: "lst_005",
    slug: "2002-yugioh-blue-eyes-white-dragon-cgc-95",
    title: "Blue-Eyes White Dragon",
    franchise: "Yu-Gi-Oh",
    setName: "Legend of Blue Eyes",
    year: 2002,
    cardNumber: "LOB-001",
    gradingCompany: "CGC",
    grade: "9.5",
    certNumber: "443019281",
    imageUrl: cardArtwork("Blue-Eyes", "#e7edf0", "#315c7a", "LOB-001"),
    imageAlt: "VaultMarket slab artwork for Yu-Gi-Oh Blue-Eyes White Dragon",
    priceCents: 268000,
    marketDeltaPercent: 0,
    lastCompCents: 268000,
    estimatedRangeCents: [250000, 285000],
    population: 218,
    listingType: "buy_now",
    vaultStatus: "seller_held",
    verificationStatus: "verified",
    provenanceNotes: "Fixed-price listing from a verified seller with stable recent comps.",
    inspectionHighlights: [
      "Cert number visible",
      "Stable comp profile",
      "Seller location verified",
    ],
    seller: {
      name: "Kaiba Casework",
      trustTier: "verified",
      completedSales: 174,
      location: "Irvine, CA",
    },
    status: "active",
  },
  {
    id: "lst_006",
    slug: "2003-pokemon-skyridge-crystal-ho-oh-psa-10",
    title: "Crystal Ho-Oh Holo",
    franchise: "Pokemon",
    setName: "Skyridge",
    year: 2003,
    cardNumber: "149/144",
    gradingCompany: "PSA",
    grade: "10",
    certNumber: "729118002",
    imageUrl: cardArtwork("Crystal Ho-Oh", "#cc7d32", "#2f6d78", "SKY 149/144"),
    imageAlt: "Graded slab artwork for Pokemon Skyridge Crystal Ho-Oh Holo",
    priceCents: 985000,
    marketDeltaPercent: 8.7,
    lastCompCents: 906000,
    estimatedRangeCents: [925000, 1060000],
    population: 96,
    listingType: "auction",
    vaultStatus: "vault_held",
    verificationStatus: "vault_verified",
    eyeAppeal: "collect_s",
    provenanceNotes: "Vault-held auction candidate with scarce high-grade population.",
    inspectionHighlights: [
      "Vault custody confirmed",
      "Scarce population",
      "Superior visual presentation",
    ],
    seller: {
      name: "Summit Slabs",
      trustTier: "vault",
      completedSales: 227,
      location: "Denver, CO",
    },
    status: "active",
  },
];
