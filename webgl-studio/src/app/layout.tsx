import type { Metadata } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import './globals.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-sans',
  display: 'swap',
});

const siteUrl = 'https://celeste-patisserie.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Céleste — Pâtisserie d\'Exception',
    template: '%s — Céleste',
  },
  description:
    'Céleste crée des pièces de pâtisserie sur mesure à Perth. Découvrez notre création signature en 3D, tournez-la à 360°, zoomez sur chaque détail.',
  keywords: [
    'pâtisserie Perth',
    'gâteau sur mesure',
    'pâtissière artisanale',
    'wedding cake Perth',
    'Céleste pâtisserie',
  ],
  openGraph: {
    title: 'Céleste — Pâtisserie d\'Exception',
    description:
      'Une création signature, en 3D, tournée et détaillée sous toutes ses coutures. Pâtisserie artisanale à Perth.',
    url: siteUrl,
    siteName: 'Céleste',
    type: 'website',
    locale: 'fr_FR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Céleste — Pâtisserie d\'Exception',
    description: 'Une création signature, en 3D, tournée et détaillée sous toutes ses coutures.',
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Bakery',
  name: 'Céleste Pâtisserie',
  description:
    "Pâtisserie artisanale sur mesure à Perth, Australie. Gâteaux de mariage, pièces signature et créations personnalisées.",
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Perth',
    addressRegion: 'WA',
    addressCountry: 'AU',
  },
  servesCuisine: 'Pâtisserie française',
  priceRange: '$$$',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${fraunces.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans antialiased bg-cream text-cocoa">{children}</body>
    </html>
  );
}
