import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PwaRegister } from "@/components/game/PwaRegister";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/* Outfit — the game's display voice: geometric, warm, confident.
   Used by .lko-display for the logo, headings and big numbers. */
const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#146b3a",
};

export const metadata: Metadata = {
  title: "Lokoja Life — Build your life at the Confluence",
  description:
    "An original Nigerian browser life-simulation game set in Lokoja, Kogi State. Start with ₦5,000, hustle smart, and build your life at the meeting point of the Niger and Benue.",
  keywords: [
    "Lokoja Life",
    "Nigerian game",
    "browser game",
    "life simulation",
    "Lokoja",
    "Kogi State",
    "Naija game",
  ],
  authors: [{ name: "Lokoja Life Studio" }],
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lokoja Life",
  },
  openGraph: {
    title: "Lokoja Life — Build your life at the Confluence",
    description:
      "Start small in Lokoja. Hustle, build, explore the Confluence — an original Nigerian life sim you can play in your browser.",
    siteName: "Lokoja Life",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} antialiased`}
      >
        {children}
        <Toaster />
        <PwaRegister />
      </body>
    </html>
  );
}
