import type { Metadata } from "next";
import { AppShell } from "@/components/site/app-shell";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "VaultMarket",
    template: "%s | VaultMarket",
  },
  description:
    "A trust-first marketplace for authenticated high-value graded trading cards.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
