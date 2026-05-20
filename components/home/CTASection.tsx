"use client";

import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { getCTAImage, getCTAMobileImage } from "@/lib/data";

interface CTASectionProps {
  initialBgImage?: string;
  initialMobileImage?: string;
}

export function CTASection({ initialBgImage, initialMobileImage }: CTASectionProps) {
  const [bgImage, setBgImage] = useState<string>(initialBgImage || "");
  const [mobileImage, setMobileImage] = useState<string>(initialMobileImage || "");

  useEffect(() => {
    if (!initialBgImage) {
      getCTAImage()
        .then((url) => { if (url) setBgImage(url); })
        .catch(console.error);
    }
    if (!initialMobileImage) {
      getCTAMobileImage()
        .then((url) => { if (url) setMobileImage(url); })
        .catch(console.error);
    }

    const handleUpdate = () => {
      getCTAImage().then((url) => setBgImage(url || "")).catch(console.error);
      getCTAMobileImage().then((url) => setMobileImage(url || "")).catch(console.error);
    };
    window.addEventListener("ctaImageUpdated", handleUpdate);
    return () => window.removeEventListener("ctaImageUpdated", handleUpdate);
  }, [initialBgImage, initialMobileImage]);

  const bgStyle = bgImage
    ? {}
    : { backgroundColor: "#1a1a1a" };

  const textContent = (
    <div className="text-center">
      <h2 className="text-3xl lg:text-5xl font-semibold text-[#eaeaea] mb-6 tracking-tight">Ready to Elevate Your Next Project?</h2>
      <p className="text-base lg:text-lg text-[#f3f3f3]/70 mb-10 max-w-2xl mx-auto font-light">Discover how our premium architectural hardware can bring sophistication and functionality to your residential or commercial space.</p>
      <div className="flex flex-col sm:flex-row gap-0 justify-center mb-12 border border-[#eaeaea]/20 w-fit mx-auto">
        <Link
          href="/contact"
          className="px-10 py-4 bg-[#eaeaea] text-[#1a1a1a] text-xs font-medium tracking-[0.2em] uppercase hover:bg-white transition-colors"
        >
          Request a Quote
        </Link>
        <Link
          href="/products"
          className="px-10 py-4 border-t border-[#eaeaea]/20 sm:border-t-0 sm:border-l text-[#eaeaea] text-xs font-medium tracking-[0.2em] uppercase hover:bg-[#eaeaea]/10 transition-colors"
        >
          View Collection
        </Link>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[#f3f3f3]/60 text-sm">
        <a href="tel:+918850765050" className="flex items-center gap-2 hover:text-[#f3f3f3] transition-colors font-light">
          <Phone className="w-4 h-4 text-[#f3f3f3]" />
          <span>+91 8850765050</span>
        </a>
        <span className="hidden sm:block w-1 h-1 rounded-full bg-[#f3f3f3]/20" />
        <a href="mailto:info@hindonix.com" className="flex items-center gap-2 hover:text-[#f3f3f3] transition-colors font-light">
          <Mail className="w-4 h-4 text-[#f3f3f3]" />
          <span>info@hindonix.com</span>
        </a>
      </div>
    </div>
  );

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#eaeaea' }}>
      <div className="container mx-auto px-4 lg:px-8">

        {/* ── Desktop: background image with dark overlay ── */}
        <div className="hidden lg:block relative overflow-hidden" style={bgStyle}>
          {bgImage && (
            <img
              src={bgImage}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              style={{ zIndex: 0 }}
            />
          )}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: bgImage ? "rgba(0,0,0,0.20)" : "#1a1a1a", zIndex: 1 }}
          />
          <div className="relative px-8 py-16 lg:px-16 lg:py-24" style={{ zIndex: 2 }}>
            {textContent}
          </div>
        </div>

        {/* ── Mobile: dark content block on top, image below ── */}
        <div className="lg:hidden flex flex-col">
          <div className="bg-[#1a1a1a] px-8 py-16">
            {textContent}
          </div>
          {(mobileImage || bgImage) && (
            <img
              src={mobileImage || bgImage}
              alt=""
              className="w-full block"
              style={{ height: '420px', objectFit: 'cover', objectPosition: 'center' }}
            />
          )}
        </div>

      </div>
    </section>
  );
}
