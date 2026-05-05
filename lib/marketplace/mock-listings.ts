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

function listingImage({
  title,
  src,
  fallbackSrc,
  official = true,
}: {
  title: string;
  src?: string;
  fallbackSrc: string;
  official?: boolean;
}) {
  return {
    src: src ?? fallbackSrc,
    fallbackSrc,
    alt: official ? `Official card artwork for ${title}` : `Registry artwork for ${title}`,
    fallbackAlt: `VaultMarket slab artwork for ${title}`,
  };
}

const charizardFallback = cardArtwork("Charizard Holo", "#b84d35", "#e5a842", "BASE 4/102");
const shanksFallback = cardArtwork("Shanks Manga", "#7b2726", "#1b3440", "OP01-120");
const aceFallback = cardArtwork("Portgas D. Ace", "#9f2d25", "#d6a14b", "OP02-013");
const jordanFallback = cardArtwork("Jordan Rookie", "#b4212d", "#1e1f24", "FLEER 57");
const lotusFallback = cardArtwork("Black Lotus", "#161613", "#746348", "BETA 233");
const moxSapphireFallback = cardArtwork("Mox Sapphire", "#183d66", "#75a8c7", "BETA 266");
const blueEyesFallback = cardArtwork("Blue-Eyes", "#e7edf0", "#315c7a", "LOB-001");
const hoOhFallback = cardArtwork("Crystal Ho-Oh", "#cc7d32", "#2f6d78", "SKY 149/144");
const blastoiseFallback = cardArtwork("Blastoise Holo", "#2f5f91", "#c2d8e6", "BASE 2/102");

export const mockListings: VaultListing[] = [
  {
    id: "lst_001",
    slug: "1999-pokemon-base-charizard-psa-9",
    title: "1999 Pokemon Base Set Charizard Holo",
    franchise: "Pokemon",
    setName: "Base Set Unlimited",
    year: 1999,
    cardNumber: "4/102",
    gradingCompany: "PSA",
    grade: "9",
    certNumber: "812849337",
    image: listingImage({
      title: "1999 Pokemon Base Set Charizard Holo",
      src: "https://images.pokemontcg.io/base1/4_hires.png",
      fallbackSrc: charizardFallback,
    }),
    priceCents: 525000,
    marketDeltaPercent: 3.8,
    lastCompCents: 506000,
    estimatedRangeCents: [480000, 580000],
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
    title: "2023 One Piece Shanks Manga",
    franchise: "One Piece",
    setName: "Romance Dawn",
    year: 2023,
    cardNumber: "OP01-120",
    gradingCompany: "PSA",
    grade: "10",
    certNumber: "902184774",
    image: listingImage({
      title: "2023 One Piece Shanks Manga",
      src: "https://en.onepiece-cardgame.com/images/cardlist/card/OP01-120_p1.png",
      fallbackSrc: shanksFallback,
    }),
    priceCents: 320000,
    marketDeltaPercent: -1.7,
    lastCompCents: 326000,
    estimatedRangeCents: [295000, 355000],
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
    title: "1986 Fleer Michael Jordan Rookie",
    franchise: "Sports",
    setName: "Fleer Basketball",
    year: 1986,
    cardNumber: "57",
    gradingCompany: "SGC",
    grade: "8",
    certNumber: "118204593",
    image: listingImage({
      title: "1986 Fleer Michael Jordan Rookie",
      fallbackSrc: jordanFallback,
      official: false,
    }),
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
    title: "1993 MTG Beta Black Lotus",
    franchise: "MTG",
    setName: "Limited Edition Beta",
    year: 1993,
    cardNumber: "233",
    gradingCompany: "BGS",
    grade: "8.5",
    certNumber: "0012098841",
    image: listingImage({
      title: "1993 Magic: The Gathering Beta Black Lotus",
      src: "https://cards.scryfall.io/large/front/b/3/b3a69a1c-c80f-4413-a6fd-ae54cabbce28.jpg?1559591595",
      fallbackSrc: lotusFallback,
    }),
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
    slug: "1993-mtg-beta-mox-sapphire-psa-8",
    title: "1993 MTG Beta Mox Sapphire",
    franchise: "MTG",
    setName: "Limited Edition Beta",
    year: 1993,
    cardNumber: "266",
    gradingCompany: "PSA",
    grade: "8",
    certNumber: "413609251",
    image: listingImage({
      title: "1993 Magic: The Gathering Beta Mox Sapphire",
      src: "https://cards.scryfall.io/large/front/1/e/1eb3178b-dac5-4b34-9d3e-4f5a170d1c87.jpg?1559591907",
      fallbackSrc: moxSapphireFallback,
    }),
    priceCents: 3850000,
    marketDeltaPercent: 4.2,
    lastCompCents: 3695000,
    estimatedRangeCents: [3400000, 4200000],
    population: 132,
    listingType: "premier",
    vaultStatus: "vault_held",
    verificationStatus: "vault_verified",
    eyeAppeal: "collect_s",
    provenanceNotes: "Power Nine trophy card held in vault custody with specialist desk review complete.",
    inspectionHighlights: [
      "Vault custody confirmed",
      "Power Nine market signal",
      "Estimate range assigned",
    ],
    seller: {
      name: "Lotus Desk",
      trustTier: "vault",
      completedSales: 52,
      location: "Seattle, WA",
    },
    status: "active",
  },
  {
    id: "lst_006",
    slug: "2002-yugioh-blue-eyes-white-dragon-psa-9",
    title: "2002 Yu-Gi-Oh! Blue-Eyes White Dragon",
    franchise: "Yu-Gi-Oh",
    setName: "Legend of Blue Eyes",
    year: 2002,
    cardNumber: "LOB-001",
    gradingCompany: "PSA",
    grade: "9",
    certNumber: "443019281",
    image: listingImage({
      title: "2002 Yu-Gi-Oh! Legend of Blue Eyes White Dragon",
      src: "https://images.ygoprodeck.com/images/cards/89631139.jpg",
      fallbackSrc: blueEyesFallback,
    }),
    priceCents: 980000,
    marketDeltaPercent: 2.1,
    lastCompCents: 960000,
    estimatedRangeCents: [895000, 1080000],
    population: 412,
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
    id: "lst_007",
    slug: "2003-pokemon-skyridge-crystal-ho-oh-psa-10",
    title: "2003 Pokemon Skyridge Crystal Ho-Oh Holo",
    franchise: "Pokemon",
    setName: "Skyridge",
    year: 2003,
    cardNumber: "149/144",
    gradingCompany: "PSA",
    grade: "10",
    certNumber: "729118002",
    image: listingImage({
      title: "Pokemon Skyridge Crystal Ho-Oh Holo",
      src: "https://images.pokemontcg.io/ecard3/149_hires.png",
      fallbackSrc: hoOhFallback,
    }),
    priceCents: 1085000,
    marketDeltaPercent: 7.6,
    lastCompCents: 1008000,
    estimatedRangeCents: [980000, 1180000],
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
  {
    id: "lst_008",
    slug: "2023-one-piece-portgas-d-ace-manga-psa-10",
    title: "2023 One Piece Portgas D. Ace Manga",
    franchise: "One Piece",
    setName: "Paramount War",
    year: 2023,
    cardNumber: "OP02-013",
    gradingCompany: "PSA",
    grade: "10",
    certNumber: "919640118",
    image: listingImage({
      title: "2023 One Piece Portgas D. Ace Manga",
      src: "https://en.onepiece-cardgame.com/images/cardlist/card/OP02-013_p2.png",
      fallbackSrc: aceFallback,
    }),
    priceCents: 295000,
    marketDeltaPercent: 5.4,
    lastCompCents: 280000,
    estimatedRangeCents: [265000, 330000],
    population: 514,
    listingType: "auction",
    vaultStatus: "intake_pending",
    verificationStatus: "pending_review",
    eyeAppeal: "collect_e",
    provenanceNotes: "Modern manga rare candidate routed for intake review before auction placement.",
    inspectionHighlights: [
      "Auction intake requested",
      "Manga rare profile",
      "Estimate range assigned",
    ],
    seller: {
      name: "Red Line Cards",
      trustTier: "verified",
      completedSales: 97,
      location: "Austin, TX",
    },
    status: "active",
  },
  {
    id: "lst_009",
    slug: "1999-pokemon-first-edition-blastoise-psa-9",
    title: "1999 Pokemon First Edition Blastoise Holo",
    franchise: "Pokemon",
    setName: "Base Set",
    year: 1999,
    cardNumber: "2/102",
    gradingCompany: "PSA",
    grade: "9",
    certNumber: "738622104",
    image: listingImage({
      title: "1999 Pokemon Base Set Blastoise Holo",
      src: "https://images.pokemontcg.io/base1/2_hires.png",
      fallbackSrc: blastoiseFallback,
    }),
    priceCents: 2450000,
    marketDeltaPercent: 6.9,
    lastCompCents: 2292000,
    estimatedRangeCents: [2150000, 2700000],
    population: 812,
    listingType: "premier",
    vaultStatus: "vault_held",
    verificationStatus: "vault_verified",
    eyeAppeal: "collect_s",
    provenanceNotes: "High-grade Base Set trophy card held under vault custody for private desk review.",
    inspectionHighlights: [
      "Vault custody confirmed",
      "First Edition registry demand",
      "Specialist review complete",
    ],
    seller: {
      name: "Northstar Vault",
      trustTier: "vault",
      completedSales: 419,
      location: "Chicago, IL",
    },
    status: "active",
  },
];
