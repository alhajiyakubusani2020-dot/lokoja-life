import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
