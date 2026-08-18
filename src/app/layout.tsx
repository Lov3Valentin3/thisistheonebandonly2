import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Cinzel_Decorative, Cormorant_Garamond, Great_Vibes, Nunito } from "next/font/google";
import { ensureSeeded } from "@/lib/seed";
import "./globals.css";
const display = Cinzel_Decorative({ subsets: ["latin"], weight: ["700", "900"], variable: "--font-display" });
const script = Great_Vibes({ subsets: ["latin"], weight: "400", variable: "--font-script" });
const letter = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-letter" });
const nunito = Nunito({ subsets: ["latin"], weight: ["400", "600", "700", "800"], variable: "--font-nunito" });
const title = "Elf Pen Pal | Magical Letters from the North Pole";
const description =
  "A magical Christmas pen pal world where children write letters to a unique elf friend at the North Pole. North Pole letters, elf mail, certificates, games, and workshop videos for kids ages 3–12.";
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: title,
    template: "%s | North Pole Post",
  },
  description,
  keywords: [
    "Elf Pen Pal",
    "Letters from the North Pole",
    "Santa Letters",
    "Christmas App for Kids",
    "Elf Friend",
    "Santa Pen Pal",
    "Christmas Magic",
    "North Pole Letters",
    "Elf Mail",
    "Santa's Workshop",
  ],
  applicationName: "North Pole Post",
  authors: [{ name: "North Pole Post" }],
  openGraph: {
    title,
    description,
    type: "website",
    siteName: "North Pole Post",
    images: [{ url: "/images/share-card.jpg", width: 1200, height: 630, alt: "North Pole Post elf mail" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/images/share-card.jpg"],
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  icons: { icon: "/icons/icon.svg", apple: "/icons/icon.svg" },
  alternates: { canonical: "/" },
};
export const viewport: Viewport = {
  themeColor: "#6d0b18",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};
export default async function RootLayout({ children }: { children: ReactNode }) {
  await ensureSeeded();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: "North Pole Post",
    applicationCategory: "KidsApplication",
    operatingSystem: "iOS, Android, Web",
    description,
    offers: {
      "@type": "Offer",
      price: "9.99",
      priceCurrency: "USD",
    },
  };
  return (
    <html lang="en">
      <body className={`${display.variable} ${script.variable} ${letter.variable} ${nunito.variable} antialiased`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}