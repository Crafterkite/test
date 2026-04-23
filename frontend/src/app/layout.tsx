import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Crafterkite | Creative Operations OS',
    template: '%s | Crafterkite',
  },
  description:
    'Crafterkite is a premium multi-tenant Creative Operations OS designed to streamline your creative workflow.',
  keywords: ['creative operations', 'design management', 'brand assets', 'creative workflow'],
  authors: [{ name: 'Crafterkite' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Crafterkite | Creative Operations OS',
    description: 'A premium multi-tenant Creative Operations OS.',
    siteName: 'Crafterkite',
  },
  robots: {
    index: false,
    follow: false,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={true}
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
