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
const venusaurFallback = cardArtwork("Venusaur Holo", "#4d7d52", "#c6d55d", "BASE 3/102");
const umbreonFallback = cardArtwork("Umbreon VMAX", "#2f3358", "#b7a2d6", "SWSH 215");
const lugiaFallback = cardArtwork("Lugia Holo", "#4b6f92", "#d9e7ef", "NEO 9/111");
const blueEyesFallback = cardArtwork("Blue-Eyes", "#e7edf0", "#315c7a", "LOB-001");
const darkMagicianFallback = cardArtwork("Dark Magician", "#45246b", "#be7fc7", "LOB-005");
const redEyesFallback = cardArtwork("Red-Eyes", "#2f2f36", "#9b2e2d", "LOB-070");
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
    slug: "1999-pokemon-base-venusaur-holo-psa-9",
    title: "1999 Pokemon Base Set Venusaur Holo",
    franchise: "Pokemon",
    setName: "Base Set Unlimited",
    year: 1999,
    cardNumber: "3/102",
    gradingCompany: "PSA",
    grade: "9",
    certNumber: "580294613",
    image: listingImage({
      title: "1999 Pokemon Base Set Venusaur Holo",
      src: "https://images.pokemontcg.io/base1/3_hires.png",
      fallbackSrc: venusaurFallback,
    }),
    priceCents: 185000,
    marketDeltaPercent: 2.8,
    lastCompCents: 180000,
    estimatedRangeCents: [165000, 210000],
    population: 3184,
    listingType: "buy_now",
    vaultStatus: "vault_held",
    verificationStatus: "vault_verified",
    eyeAppeal: "collect_e",
    provenanceNotes: "Vault-held Base Set holo with cert, slab face, and label reviewed.",
    inspectionHighlights: [
      "Cert number visible",
      "No slab cracks noted",
      "Classic Base Set holo",
    ],
    seller: {
      name: "Northstar Vault",
      trustTier: "vault",
      completedSales: 422,
      location: "Chicago, IL",
    },
    status: "active",
  },
  {
    id: "lst_003",
    slug: "2000-pokemon-neo-genesis-lugia-holo-psa-9",
    title: "2000 Pokemon Neo Genesis Lugia Holo",
    franchise: "Pokemon",
    setName: "Neo Genesis",
    year: 2000,
    cardNumber: "9/111",
    gradingCompany: "PSA",
    grade: "9",
    certNumber: "638294105",
    image: listingImage({
      title: "2000 Pokemon Neo Genesis Lugia Holo",
      src: "https://images.pokemontcg.io/neo1/9_hires.png",
      fallbackSrc: lugiaFallback,
    }),
    priceCents: 1850000,
    marketDeltaPercent: 5.2,
    lastCompCents: 1759000,
    estimatedRangeCents: [1650000, 2050000],
    population: 642,
    listingType: "premier",
    vaultStatus: "vault_held",
    verificationStatus: "vault_verified",
    eyeAppeal: "collect_s",
    provenanceNotes: "Vault-held Neo Genesis chase card selected for specialist review and private desk routing.",
    inspectionHighlights: [
      "Vault custody confirmed",
      "Iconic Neo-era chase card",
      "Estimate range assigned",
    ],
    seller: {
      name: "Northstar Vault",
      trustTier: "vault",
      completedSales: 421,
      location: "Chicago, IL",
    },
    status: "active",
  },
  {
    id: "lst_004",
    slug: "2002-yugioh-dark-magician-psa-9",
    title: "2002 Yu-Gi-Oh! Dark Magician",
    franchise: "Yu-Gi-Oh",
    setName: "Legend of Blue Eyes",
    year: 2002,
    cardNumber: "LOB-005",
    gradingCompany: "PSA",
    grade: "9",
    certNumber: "557390126",
    image: listingImage({
      title: "2002 Yu-Gi-Oh! Dark Magician",
      src: "https://images.ygoprodeck.com/images/cards/46986414.jpg",
      fallbackSrc: darkMagicianFallback,
    }),
    priceCents: 625000,
    marketDeltaPercent: 3.5,
    lastCompCents: 604000,
    estimatedRangeCents: [560000, 700000],
    population: 538,
    listingType: "premier",
    vaultStatus: "vault_held",
    verificationStatus: "vault_verified",
    eyeAppeal: "collect_e",
    provenanceNotes: "Iconic spellcaster lot held in vault custody with cert and label review complete.",
    inspectionHighlights: [
      "Vault custody confirmed",
      "Iconic LOB chase card",
      "Estimate range assigned",
    ],
    seller: {
      name: "Kaiba Casework",
      trustTier: "vault",
      completedSales: 176,
      location: "Irvine, CA",
    },
    status: "active",
  },
  {
    id: "lst_005",
    slug: "2002-yugioh-red-eyes-black-dragon-psa-9",
    title: "2002 Yu-Gi-Oh! Red-Eyes Black Dragon",
    franchise: "Yu-Gi-Oh",
    setName: "Legend of Blue Eyes",
    year: 2002,
    cardNumber: "LOB-070",
    gradingCompany: "PSA",
    grade: "9",
    certNumber: "731846290",
    image: listingImage({
      title: "2002 Yu-Gi-Oh! Red-Eyes Black Dragon",
      src: "https://images.ygoprodeck.com/images/cards/74677422.jpg",
      fallbackSrc: redEyesFallback,
    }),
    priceCents: 485000,
    marketDeltaPercent: -0.9,
    lastCompCents: 489000,
    estimatedRangeCents: [430000, 540000],
    population: 611,
    listingType: "premier",
    vaultStatus: "seller_held",
    verificationStatus: "verified",
    eyeAppeal: "collect_e",
    provenanceNotes: "Seller-held LOB icon queued for intake review and custody path evaluation.",
    inspectionHighlights: [
      "Cert number visible",
      "Classic LOB chase card",
      "Estimate range assigned",
    ],
    seller: {
      name: "Kaiba Casework",
      trustTier: "verified",
      completedSales: 177,
      location: "Irvine, CA",
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
    slug: "2021-pokemon-umbreon-vmax-alt-art-psa-10",
    title: "2021 Pokemon Umbreon VMAX Alternate Art",
    franchise: "Pokemon",
    setName: "Evolving Skies",
    year: 2021,
    cardNumber: "215/203",
    gradingCompany: "PSA",
    grade: "10",
    certNumber: "776318904",
    image: listingImage({
      title: "2021 Pokemon Umbreon VMAX Alternate Art",
      src: "https://images.pokemontcg.io/swsh7/215_hires.png",
      fallbackSrc: umbreonFallback,
    }),
    priceCents: 245000,
    marketDeltaPercent: 4.6,
    lastCompCents: 234000,
    estimatedRangeCents: [220000, 275000],
    population: 6412,
    listingType: "auction",
    vaultStatus: "seller_held",
    verificationStatus: "verified",
    eyeAppeal: "collect_e",
    provenanceNotes: "Modern chase card queued for auction review with verified slab data.",
    inspectionHighlights: [
      "Auction intake requested",
      "Modern alternate-art demand",
      "Estimate range assigned",
    ],
    seller: {
      name: "Summit Slabs",
      trustTier: "verified",
      completedSales: 229,
      location: "Denver, CO",
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
