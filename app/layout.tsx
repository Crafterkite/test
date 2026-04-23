import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import localFont from "next/font/local";
import "./globals.css";

// Geist Mono for code only (kept exactly as you had it)
const geistMono = localFont({
  src: [
    { path: "/fonts/geist-mono/GeistMono-Regular.woff2", weight: "400", style: "normal" },
    { path: "/fonts/geist-mono/GeistMono-Medium.woff2", weight: "500", style: "normal" },
    { path: "/fonts/geist-mono/GeistMono-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "/fonts/geist-mono/GeistMono-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "Crafterkite | Creative Operations OS",
    template: "%s | Crafterkite",
  },
  description:
    "Crafterkite is a premium multi-tenant Creative Operations OS designed to streamline your creative workflow.",
  keywords: ["creative operations", "design management", "brand assets", "creative workflow"],
  authors: [{ name: "Crafterkite" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Crafterkite | Creative Operations OS",
    description: "A premium multi-tenant Creative Operations OS.",
    siteName: "Crafterkite",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={geistMono.variable}
    >
      <body className="min-h-screen bg-background antialiased font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}