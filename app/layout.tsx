import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SkipLinks } from "@/components/ui/skip-link";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Bolvi Care - Trusted Care for Your Loved Ones",
  description: "Connect with verified, independent caregivers for flexible, compassionate support—without the agency markups. Find trusted care for seniors today.",
  keywords: ["elder care", "senior care", "caregiver", "home care", "companion care", "dementia care"],
  openGraph: {
    title: "Bolvi Care - Trusted Care for Your Loved Ones",
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <ToastProvider>
          {/* Skip links for keyboard navigation - essential for accessibility */}
          <SkipLinks
            links={[
              { href: "#main-content", label: "Skip to main content" },
              { href: "#navigation", label: "Skip to navigation" },
              { href: "#footer", label: "Skip to footer" },
            ]}
          />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
