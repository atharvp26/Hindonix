"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { getHeroImages } from "@/lib/data";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ImageDisplay } from "@/components/ImageDisplay";

interface HeroSectionProps {
  initialImages?: string[];
}

export function HeroSection({ initialImages }: HeroSectionProps) {
  const [heroImages, setHeroImages] = useState<string[]>(
    initialImages && initialImages.length > 0
      ? initialImages
      : ["/images/home/hero-knobs.jpg"]
  );
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);

  useEffect(() => {
    if (!initialImages) {
      getHeroImages()
        .then((images) => {
          if (images && images.length > 0) setHeroImages(images);
        })
        .catch(console.error);
    }

    const handleHeroImageUpdate = () => {
      getHeroImages()
        .then((images) => {
          if (images && images.length > 0) setHeroImages(images);
        })
        .catch(console.error);
    };

    window.addEventListener("heroImageUpdated", handleHeroImageUpdate);
    return () =>
      window.removeEventListener("heroImageUpdated", handleHeroImageUpdate);
  }, [initialImages]);

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

  return (
    /*
     * Mobile  (< md): flex-col — image on top (52vw tall), text stacked below, all centered
     * Desktop (≥ md): relative block — image absolute full-bleed, text absolute right overlay
     */
    <section
      className="w-full bg-[#eaeaea] overflow-hidden relative h-[75vw] md:h-[calc(100vh-65px)] md:min-h-[500px]"
    >
      {/* IMAGE — always absolute background fill */}
      <div className="absolute inset-0">
        {heroImages.length <= 1 ? (
          <ImageDisplay
            src={heroImages[0]}
            alt="Architectural Hardware Collection"
            className="w-full h-full object-cover md:object-contain"
            style={{ objectPosition: 'left center' }}
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
                    className="w-full h-full object-cover md:object-contain"
                    style={{ objectPosition: 'left center' }}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* Mobile gradient — fades image toward bottom for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[#eaeaea] via-[#eaeaea]/60 to-transparent md:hidden" aria-hidden="true" />

      {/* TEXT — overlay: bottom-center on mobile, right side on desktop */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center text-center px-6 pb-8 md:top-0 md:bottom-0 md:h-full md:left-[42%] md:right-16 md:px-0 md:pb-0 md:justify-center">

        {/* Heading — wraps on mobile, single line on desktop */}
        <h1
          className="text-[#1a1a1a] leading-none mb-4 tracking-[0.1em] md:whitespace-nowrap md:tracking-[0.2em]"
          style={{
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: 'clamp(1.2rem, 2.5vw, 3.2rem)',
            fontWeight: 400,
          }}
        >
          ARCHITECTURAL DOORWARE
        </h1>

        {/* Subtitle */}
        <p
          className="text-[#1a1a1a]/70 mb-6 md:mb-8"
          style={{
            fontFamily: 'Montserrat, system-ui, sans-serif',
            fontSize: 'clamp(0.85rem, 1.1vw, 1.1rem)',
            fontWeight: 400,
            letterSpacing: '0.06em',
          }}
        >
          Export Grade Craftsmanship
        </p>

        {/* CTA pill */}
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
