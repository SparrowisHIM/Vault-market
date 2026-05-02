import type { Metadata } from "next";
import { MarketDeskHome } from "@/components/home/market-desk-home";

export const metadata: Metadata = {
  title: "VaultMarket",
  description:
    "A trust-first marketplace and portfolio-style vault for authenticated graded trading cards.",
};

export default function Home() {
  return <MarketDeskHome />;
}
