import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hindonix.com"),
  title: {
    default: "Hindonix - Premium Architectural Hardware",
    template: "%s | Hindonix",
  },
  description:
    "Hindonix manufactures and exports premium stainless steel and brass architectural hardware including door handles, door knobs, and more.",
  keywords: [
    "architectural hardware",
    "door handles",
    "door knobs",
    "stainless steel hardware",
    "brass hardware manufacturer",
    "door hardware exporter",
  ],
  openGraph: {
    type: "website",
    siteName: "Hindonix",
    title: "Hindonix - Premium Architectural Hardware",
    description:
      "Hindonix manufactures and exports premium stainless steel and brass architectural hardware including door handles, door knobs, and more.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Hindonix",
  alternateName: "Hindonix Architectural Hardware",
  url: "https://hindonix.com",
  logo: "https://res.cloudinary.com/dlt9vf8qk/image/upload/v1780943181/Logo-Black_ytnast.png",
  description:
    "Hindonix manufactures and exports premium stainless steel and brass architectural hardware including door handles, door knobs, and more.",
  telephone: "+91-8850765050",
  email: "info@hindonix.com",
  sameAs: [
    "https://www.linkedin.com/company/hindonix/",
    "https://www.instagram.com/hindonix/",
    "https://www.facebook.com/share/1BjnmmbXY1/",
    "https://youtube.com/@hindonix",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en">
        <body>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
          />
          <Providers>
            <TooltipProvider>
              <ScrollToTop />
              <Navbar />
              <main className="pt-[65px]">{children}</main>
              <Footer />
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
