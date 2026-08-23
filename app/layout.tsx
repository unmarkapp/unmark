import type { Metadata } from "next";
import { Figtree, Geist_Mono, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { AuthProvider } from "@/lib/auth";
import { CreditsProvider } from "@/lib/credits";
import {
  PRODUCT_HUNT_PROFILE_URL,
  CHROME_WEB_STORE_URL,
  SITE_KEYWORDS,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_TITLE_DEFAULT,
  SITE_URL,
} from "@/lib/seo";
import { ThemeProvider, themeInitScript } from "@/lib/theme";
import { ToastProvider } from "@/components/Toast";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import ReferralCapture from "@/components/ReferralCapture";
import { DropToCleanProvider } from "@/lib/dropToClean";
import PwaRegister from "@/components/PwaRegister";
import { GA_MEASUREMENT_ID } from "@/lib/analytics";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE_DEFAULT,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "Sumit Kumar", url: `${SITE_URL}/about` }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE_DEFAULT,
    description: SITE_TAGLINE,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_DEFAULT,
    description: SITE_TAGLINE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      alternateName: [
        "Gemini watermark remover",
        "Unmark Gemini watermark remover",
        "AI background remover",
      ],
      description: SITE_TAGLINE,
      publisher: { "@id": `${SITE_URL}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.png`,
      },
      sameAs: [PRODUCT_HUNT_PROFILE_URL, CHROME_WEB_STORE_URL],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "pythondemo4@gmail.com",
        url: `${SITE_URL}/support`,
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#app`,
      name: "Unmark",
      alternateName: "Gemini Watermark Remover",
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      url: SITE_URL,
      description: SITE_TAGLINE,
      featureList: [
        "Remove Gemini sparkle watermark from images",
        "Gemini and Veo video watermark removal",
        "Automatic background removal and transparent PNG cutouts",
        "Google Flow and Nano Banana exports",
        "Auto and manual detection",
        "16:9 and 9:16 Gemini exports",
        "Original quality download",
        "Chrome extension for Gemini and Flow",
        "Cloud Library and bulk processing",
      ],
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        description: "Free signup credits; paid credit packs available",
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${figtree.variable} ${geistMono.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://auth.unmark.ink" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="preconnect" href="https://script.supademo.com" />
        <link rel="dns-prefetch" href="https://app.supademo.com" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {GA_MEASUREMENT_ID ? (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              strategy="lazyOnload"
            />
            <Script id="ga-init" strategy="lazyOnload">{`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_MEASUREMENT_ID}');
`}</Script>
          </>
        ) : null}
        <JsonLd data={jsonLd} />
        <GoogleAnalytics />
        <ThemeProvider>
          <AuthProvider>
            <CreditsProvider>
              <ReferralCapture />
              <ToastProvider>
                <PwaRegister />
                <DropToCleanProvider>{children}</DropToCleanProvider>
              </ToastProvider>
            </CreditsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
