import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "CareConnect - Trusted Care for Your Loved Ones",
  description: "Connect with verified, independent caregivers for flexible, compassionate support—without the agency markups. Find trusted care for seniors today.",
  keywords: ["elder care", "senior care", "caregiver", "home care", "companion care", "dementia care"],
  openGraph: {
    title: "CareConnect - Trusted Care for Your Loved Ones",
    description: "Connect with verified, independent caregivers for flexible, compassionate support.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#3B82F6",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
