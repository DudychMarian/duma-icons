import type { Metadata } from "next";
import Script from "next/script";
import { SITE_URL, SITE_NAME, TITLE, DESCRIPTION, KEYWORDS } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: KEYWORDS,
  authors: [{ name: "Marian Dudych" }],
  creator: "Marian Dudych",
  category: "technology",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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
  icons: {
    icon: [{ url: "/logo.svg", type: "image/svg+xml" }],
    apple: "/logo.svg",
  },
};

// Structured data: helps Google understand the site is a free software/icon library.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: DESCRIPTION,
    },
    {
      "@type": "SoftwareApplication",
      name: SITE_NAME,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Any",
      description: DESCRIPTION,
      url: SITE_URL,
      softwareVersion: "0.1.0",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Person", name: "Marian Dudych" },
      keywords: KEYWORDS.join(", "),
    },
  ],
};

// Resolve the saved theme (or the OS preference) and set it before first paint,
// so there's no flash of the wrong theme on load.
const themeScript = `(function(){try{var t=localStorage.getItem('duma-theme');if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='light';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <Script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="371b4ce6-b71e-47b9-8b31-fdc84d035b60"
        />
      </body>
    </html>
  );
}
