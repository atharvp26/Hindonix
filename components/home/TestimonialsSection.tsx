"use client";

import { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { getTestimonials, getOverviewImages, type Testimonial } from "@/lib/data";
import { ImageDisplay } from "@/components/ImageDisplay";

interface TestimonialsSectionProps {
  initialTestimonials?: Testimonial[];
  initialBackgroundImages?: string[];
}

export function TestimonialsSection({ initialTestimonials, initialBackgroundImages }: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials ?? []);
  const [activeIndex, setActiveIndex] = useState(0);

  const [bgImages, setBgImages] = useState<string[]>(initialBackgroundImages ?? []);
  const [bgIndex, setBgIndex] = useState(0);
  const bgTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!initialTestimonials) {
      getTestimonials().then(setTestimonials).catch(console.error);
    }
    const reload = () => getTestimonials().then(setTestimonials).catch(console.error);
    window.addEventListener("dataUpdated", reload);
    return () => window.removeEventListener("dataUpdated", reload);
  }, [initialTestimonials]);

  useEffect(() => {
    if (!initialBackgroundImages) {
      getOverviewImages().then(setBgImages).catch(console.error);
    }
    const reload = () => getOverviewImages().then(setBgImages).catch(console.error);
    window.addEventListener("overviewImagesUpdated", reload);
    return () => window.removeEventListener("overviewImagesUpdated", reload);
  }, [initialBackgroundImages]);

  useEffect(() => {
    if (bgImages.length <= 1) return;
    bgTimerRef.current = setInterval(() => {
      setBgIndex((prev) => (prev + 1) % bgImages.length);
    }, 2500);
    return () => { if (bgTimerRef.current) clearInterval(bgTimerRef.current); };
  }, [bgImages.length]);

  useEffect(() => {
    if (activeIndex >= testimonials.length) setActiveIndex(0);
  }, [testimonials.length, activeIndex]);

  if (!testimonials.length) return null;

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-20 lg:py-28 relative overflow-hidden" style={{ backgroundColor: '#eaeaea' }}>
      {/* Background slideshow */}
      {bgImages.map((src, idx) => (
        <div
          key={src + idx}
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{ opacity: idx === bgIndex ? 1 : 0, zIndex: 0 }}
          aria-hidden="true"
        >
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover select-none"
            style={{ display: "block" }}
          />
        </div>
      ))}
      {/* Overlay for readability — only shown when background images are present */}
      {bgImages.length > 0 && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: 'rgba(234,234,234,0.72)', zIndex: 1 }}
          aria-hidden="true"
        />
      )}

      {/* Section content */}
      <div className="container mx-auto px-4 lg:px-8 relative" style={{ zIndex: 2 }}>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[#1a1a1a]/45 font-medium text-xs uppercase tracking-[0.25em] mb-4">Client Testimonials</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-[#1a1a1a] mb-6 tracking-tight">Trusted by Businesses Worldwide</h2>
          <p className="text-[#1a1a1a]/55 font-light">Hear from our partners who have experienced the Hindonix difference.</p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white p-8 lg:p-12 border border-[#1a1a1a]/8 relative overflow-hidden">
            <div className="absolute top-8 right-8 opacity-5">
              <Quote className="w-24 h-24 text-[#1a1a1a]" />
            </div>
            <div className="relative z-10">
              <blockquote className="text-lg lg:text-xl text-[#1a1a1a] font-light leading-relaxed mb-8">
                &ldquo;{testimonials[activeIndex].content}&rdquo;
              </blockquote>
              <div className="flex items-center gap-4">
                {testimonials[activeIndex].image ? (
                  <div className="w-12 h-12 overflow-hidden bg-[#eaeaea] flex-shrink-0">
                    <ImageDisplay src={testimonials[activeIndex].image as string} alt={testimonials[activeIndex].name} className="w-full h-full object-cover" />
                  </div>
                ) : null}
                <div>
                  <div className="font-semibold text-[#1a1a1a] tracking-wide">{testimonials[activeIndex].name}</div>
                  <div className="text-[#1a1a1a]/50 text-sm font-light">{testimonials[activeIndex].role}, {testimonials[activeIndex].company}</div>
                  <div className="text-[#1a1a1a]/40 text-xs uppercase tracking-widest mt-0.5">{testimonials[activeIndex].location}</div>
                  {testimonials[activeIndex].rating ? (
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: testimonials[activeIndex].rating }).map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-[#1a1a1a]/60 text-[#1a1a1a]/60" />
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prevSlide} className="w-10 h-10 border border-[#1a1a1a]/20 flex items-center justify-center hover:bg-[#1a1a1a] hover:text-[#eaeaea] hover:border-[#1a1a1a] transition-all duration-300 text-[#1a1a1a]" aria-label="Previous testimonial">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button key={index} onClick={() => setActiveIndex(index)} className={cn("h-[2px] transition-all duration-300", index === activeIndex ? "bg-[#1a1a1a] w-8" : "bg-[#1a1a1a]/20 hover:bg-[#1a1a1a]/40 w-4")} aria-label={`Go to testimonial ${index + 1}`} />
              ))}
            </div>
            <button onClick={nextSlide} className="w-10 h-10 border border-[#1a1a1a]/20 flex items-center justify-center hover:bg-[#1a1a1a] hover:text-[#eaeaea] hover:border-[#1a1a1a] transition-all duration-300 text-[#1a1a1a]" aria-label="Next testimonial">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
