import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

import { inter, geistMono } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "Crafterkite | Creative Operations OS",
    template: "%s | Crafterkite",
  },
  description:
    "Crafterkite is a premium multi-tenant Creative Operations OS designed to streamline your creative workflow.",
  keywords: [
    "creative operations",
    "design management",
    "brand assets",
    "creative workflow",
  ],
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

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
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