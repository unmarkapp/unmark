import type { Metadata } from "next";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
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

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600"],
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
  referrer: "no-referrer-when-downgrade",
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
      description: SITE_TAGLINE,
      sameAs: [PRODUCT_HUNT_PROFILE_URL, CHROME_WEB_STORE_URL],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "pythondemo4@gmail.com",
        url: `${SITE_URL}/support`,
        availableLanguage: ["English"],
      },
    },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <head>
        <link rel="preconnect" href="https://auth.unmark.ink" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <meta name="referrer" content="no-referrer-when-downgrade" />
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
