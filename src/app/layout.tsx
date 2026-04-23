import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { site } from "@/data/config";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { websiteJsonLd } from "@/lib/schema";
import { SearchProvider } from "@/components/search/SearchProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#faf7f2",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(site.baseUrl),
  title: {
    default: `${site.name}, Jewellers of Banda, Uttar Pradesh since the 1820s`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "Goel family Banda",
    "Ganesh Prasad Gondilal Saraf",
    "Gondilal Saraf",
    "Gondilal Kiva",
    "Banda jewellers",
    "Goel jewellers Uttar Pradesh",
    "Agarwal family Jhansi",
    "Rohit Goel",
    "Radha Krishna Goel",
    "Goel Banda history",
    "Indian family tree",
    "Clay Craft India family",
    "MP Wire India",
  ],
  authors: [{ name: site.name, url: site.baseUrl }],
  creator: site.name,
  publisher: site.name,
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: site.baseUrl },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: site.baseUrl,
    siteName: site.shortName,
    title: `${site.name}, Jewellers of Banda since the 1820s`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.tagline,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "Family history",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <JsonLd data={websiteJsonLd()} />
        <SearchProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </SearchProvider>
      </body>
    </html>
  );
}
