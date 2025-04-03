import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { FeedbackButton } from "@/components/FeedbackButton";
import { InfoButton } from "@/components/InfoButton";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Innerwave",
  description: "Enter deep states of focus, relaxation, and presence through curated sound frequencies and meditative tones.",
  keywords: "meditation, sound healing, binaural beats, solfeggio, frequency, resonance, innerwave, isochronic tones, focus, relaxation",
  authors: [{ name: "Jonai" }],
  manifest: '/manifest.json',
  applicationName: 'Innerwave',
  themeColor: '#000000',
  icons: {
    icon: [
      { url: "/favicon 16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon 32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon 192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon 512x512.png", sizes: "512x512", type: "image/png" }
    ]
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'application-name': 'Innerwave',
    'theme-color': '#000000'
  },
  openGraph: {
    title: 'Innerwave',
    description: 'Choose a sound to center, awaken, or expand.',
    url: 'https://innerwave.app',
    siteName: 'Innerwave',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Innerwave Logo'
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Innerwave',
    description: 'Choose a sound to center, awaken, or expand.',
    images: ['/logo.png'],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark touch-manipulation">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';" />
      </head>
      <body
        className={`${geist.className} bg-neutral-900 text-neutral-100 min-h-screen relative antialiased`}
      >
        {/* Info Button */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50">
          <InfoButton />
        </div>

        {/* Feedback Button */}
        <div className="fixed top-4 right-4 z-50">
          <FeedbackButton />
        </div>

        <main className="mx-auto max-w-screen-md px-4 pt-8 md:pt-12 pb-40">
          {children}
        </main>
        
        <div className="fixed bottom-0 left-0 w-full bg-neutral-800/90 backdrop-blur-sm border-t border-neutral-700/50 z-40">
          <div className="max-w-screen-md mx-auto">
            <div className="min-h-[3rem]" />
          </div>
        </div>
      </body>
    </html>
  );
}
