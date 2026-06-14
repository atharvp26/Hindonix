"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getHeroImages, getHeroDesktopImage } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ImageDisplay } from "@/components/ImageDisplay";

interface HeroSectionProps {
  initialImages?: string[];
  initialDesktopImage?: string;
}

export function HeroSection({ initialImages, initialDesktopImage }: HeroSectionProps) {
  const [heroImages, setHeroImages] = useState<string[]>(
    initialImages && initialImages.length > 0
      ? initialImages
      : ["https://res.cloudinary.com/dlt9vf8qk/image/upload/v1781429420/Hero-Page-02_vmrd24.png"]
  );
  const [desktopImage, setDesktopImage] = useState<string>(initialDesktopImage || "");
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!initialImages) {
      getHeroImages()
        .then((images) => { if (images && images.length > 0) setHeroImages(images); })
        .catch(console.error);
    }
    if (!initialDesktopImage) {
      getHeroDesktopImage()
        .then((url) => { if (url) setDesktopImage(url); })
        .catch(console.error);
    }

    const handleHeroImageUpdate = () => {
      getHeroImages()
        .then((images) => { if (images && images.length > 0) setHeroImages(images); })
        .catch(console.error);
      getHeroDesktopImage()
        .then((url) => setDesktopImage(url || ""))
        .catch(console.error);
    };

    window.addEventListener("heroImageUpdated", handleHeroImageUpdate);
    return () => window.removeEventListener("heroImageUpdated", handleHeroImageUpdate);
  }, [initialImages, initialDesktopImage]);

  useEffect(() => {
    if (!carouselApi || heroImages.length <= 1) return;
    const interval = setInterval(() => {
      try {
        const index = carouselApi.selectedScrollSnap();
        if (index >= heroImages.length - 1) {
          carouselApi.scrollTo(0);
        } else {
          carouselApi.scrollNext();
        }
      } catch (e) {}
    }, 4000);
    return () => clearInterval(interval);
  }, [carouselApi, heroImages]);

  // The active image for desktop (falls back to first mobile image if none set)
  const activeDesktopImage = desktopImage || heroImages[0] || "";

  return (
    /*
     * Mobile  (< md): portrait image fills full screen height, text overlaid at bottom with gradient
     * Desktop (≥ md): landscape desktop image fills full viewport, text overlaid on right side
     */
    <section className="relative w-full bg-[#eaeaea] overflow-hidden h-[100svh] min-h-[600px] md:h-[calc(100vh-65px)] md:min-h-[500px]">

      {/* MOBILE IMAGE — portrait, full bleed, hidden on desktop */}
      <div className="absolute inset-0 md:hidden">
        {heroImages.length <= 1 ? (
          <ImageDisplay
            src={heroImages[0]}
            alt="Architectural Hardware Collection"
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <Carousel
            setApi={setCarouselApi}
            className="w-full h-full"
            opts={{ loop: true, align: "center" }}
          >
            <CarouselContent className="h-full">
              {heroImages.map((img, idx) => (
                <CarouselItem key={idx} className="h-full">
                  <ImageDisplay
                    src={img}
                    alt={`Hero ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* DESKTOP IMAGE — landscape, full bleed, hidden on mobile */}
      <div className="absolute inset-0 hidden md:block">
        <ImageDisplay
          src={activeDesktopImage}
          alt="Architectural Hardware Collection"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Gradient overlay for text readability on mobile only */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent md:hidden" />

      {/* TEXT — bottom overlay on mobile, right-side panel on desktop */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center text-center px-6 pb-16 md:inset-x-auto md:top-0 md:bottom-0 md:left-[42%] md:right-16 md:justify-center md:pb-0 md:px-0">

        <h1
          className="text-[#eaeaea] md:text-[#1a1a1a] leading-none mb-4 tracking-[0.1em] md:whitespace-nowrap md:tracking-[0.2em]"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: 'clamp(1.4rem, 2.5vw, 3.2rem)',
            fontWeight: 400,
          }}
        >
          ARCHITECTURAL DOORWARE
        </h1>

        <p
          className="text-[#eaeaea]/80 md:text-[#1a1a1a]/70 mb-7 md:mb-8"
          style={{
            fontFamily: 'Montserrat, system-ui, sans-serif',
            fontSize: 'clamp(0.85rem, 1.1vw, 1.1rem)',
            fontWeight: 400,
            letterSpacing: '0.06em',
          }}
        >
          Export Grade Craftsmanship
        </p>

        <div className="inline-flex items-center rounded-full border border-[#c8c8c8] bg-[#f4f4f4]/90 overflow-hidden">
          <Link
            href="/products"
            className="px-5 py-2.5 md:px-7 md:py-3 text-sm md:text-[0.85rem] text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:bg-[#eaeaea]/70 transition-colors whitespace-nowrap"
            style={{ fontFamily: 'Montserrat, system-ui, sans-serif', letterSpacing: '0.01em' }}
          >
            View Collections
          </Link>
          <span className="text-[#c0c0c0] text-xs select-none px-0.5">|</span>
          <Link
            href="/contact"
            className="px-5 py-2.5 md:px-7 md:py-3 text-sm md:text-[0.85rem] text-[#1a1a1a]/70 hover:text-[#1a1a1a] hover:bg-[#eaeaea]/70 transition-colors whitespace-nowrap"
            style={{ fontFamily: 'Montserrat, system-ui, sans-serif', letterSpacing: '0.01em' }}
          >
            Get Quote
          </Link>
        </div>
      </div>
    </section>
  );
}
