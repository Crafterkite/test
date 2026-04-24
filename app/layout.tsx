import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/toaster";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background antialiased">

        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {/* ✅ THIS MUST WRAP EVERYTHING */}
          <Providers>
            {children}
            <Toaster />
          </Providers>
        </ThemeProvider>

      </body>
    </html>
  );
}