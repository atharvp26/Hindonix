// v1.0.2
"use client";
import { useState, useEffect, useRef } from "react";
import { getOverviewBlockImages } from "@/lib/data";

interface OverviewSectionProps {
  initialBlockImages?: string[];
}

export function OverviewSection({ initialBlockImages }: OverviewSectionProps) {
  const [blockImages, setBlockImages] = useState<string[]>(initialBlockImages ?? []);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesPerView, setImagesPerView] = useState(3);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const autoSlideRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get image dimensions on mount (assuming all images have same aspect ratio)
  useEffect(() => {
    if (blockImages.length > 0) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = blockImages[0];
    }
  }, [blockImages]);

  // Calculate images per view based on screen size and image aspect ratio
  useEffect(() => {
    const calculateImagesPerView = () => {
      if (!imageDimensions) return;
      
      if (window.innerWidth < 768) {
        // Mobile: show 1 image
        setImagesPerView(1);
      } else if (window.innerWidth < 1024) {
        // Tablet: show 2 images
        setImagesPerView(2);
      } else {
        // Desktop: calculate based on container width and image width
        const containerWidth = window.innerWidth - (32 * 2); // container padding
        const imageAspectRatio = imageDimensions.width / imageDimensions.height;
        const imageHeight = 300; // desired height for desktop
        const imageWidth = imageHeight * imageAspectRatio;
        const imagesCanFit = Math.floor(containerWidth / imageWidth);
        setImagesPerView(Math.max(3, imagesCanFit)); // at least 3
      }
    };

    calculateImagesPerView();
    window.addEventListener("resize", calculateImagesPerView);
    return () => window.removeEventListener("resize", calculateImagesPerView);
  }, [imageDimensions]);

  // Auto-slide functionality for desktop only
  useEffect(() => {
    if (window.innerWidth < 1024) return; // Only on desktop

    const startAutoSlide = () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
      
      autoSlideRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          const maxSlide = Math.max(0, blockImages.length - imagesPerView);
          return prev >= maxSlide ? 0 : prev + 1;
        });
      }, 4000); // Auto-slide every 4 seconds
    };

    startAutoSlide();
    return () => {
      if (autoSlideRef.current) clearInterval(autoSlideRef.current);
    };
  }, [blockImages.length, imagesPerView]);

  // Stop auto-slide on user interaction
  const handleManualSlide = (direction: 'prev' | 'next') => {
    if (autoSlideRef.current) clearInterval(autoSlideRef.current);

    setCurrentSlide((prev) => {
      const maxSlide = Math.max(0, blockImages.length - imagesPerView);
      if (direction === 'next') {
        return prev >= maxSlide ? 0 : prev + 1;
      } else {
        return prev <= 0 ? maxSlide : prev - 1;
      }
    });

    // Restart auto-slide after user interaction
    const timer = setTimeout(() => {
      autoSlideRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          const maxSlide = Math.max(0, blockImages.length - imagesPerView);
          return prev >= maxSlide ? 0 : prev + 1;
        });
      }, 4000);
    }, 500);

    return () => clearTimeout(timer);
  };

  useEffect(() => {
    if (!initialBlockImages || initialBlockImages.length === 0) {
      getOverviewBlockImages()
        .then((urls) => { if (urls.length > 0) setBlockImages(urls); })
        .catch(console.error);
    }

    const handleUpdate = () => {
      getOverviewBlockImages()
        .then((urls) => setBlockImages(urls))
        .catch(console.error);
    };
    window.addEventListener("overviewBlockImagesUpdated", handleUpdate);
    return () => window.removeEventListener("overviewBlockImagesUpdated", handleUpdate);
  }, [initialBlockImages]);

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#eaeaea' }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[#1a1a1a]/50 font-normal text-xs tracking-[0.05em] mb-4" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>Why Design Professionals Choose Us</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-[#1a1a1a] mb-6 tracking-tight">Exceptional Architectural Hardware</h2>
          <p className="text-[#1a1a1a]/60 text-base lg:text-lg font-light">From concept to installation, we provide premium hardware solutions with uncompromising quality, elegant design, and lasting durability.</p>
        </div>
      </div>

      {/* Mobile Grid View - Show all images in grid */}
      <div className="lg:hidden grid w-full grid-cols-1 md:grid-cols-2 gap-px border-y border-[#1a1a1a]/10" style={{ backgroundColor: '#1a1a1a' }}>
        {blockImages.map((url, index) => (
          <div key={index} className="relative overflow-hidden" style={{ height: '240px' }}>
            {url ? (
              <img
                src={url}
                alt={`Block ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: '#1a1a1a' }} />
            )}
          </div>
        ))}
      </div>

      {/* Desktop Slider View */}
      <div className="hidden lg:block relative" style={{ backgroundColor: '#1a1a1a' }}>
        <div
          ref={sliderRef}
          className="overflow-hidden border-y border-[#1a1a1a]/10"
          style={{
            backgroundColor: '#1a1a1a',
          }}
        >
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{
              transform: `translateX(-${currentSlide * (100 / imagesPerView)}%)`,
            }}
          >
            {blockImages.map((url, index) => (
              <div
                key={index}
                className="relative overflow-hidden flex-shrink-0 border-r border-[#1a1a1a]/10"
                style={{
                  width: `${100 / imagesPerView}%`,
                  height: imageDimensions ? `${imageDimensions.height * (300 / imageDimensions.width)}px` : '300px',
                }}
              >
                {url ? (
                  <img
                    src={url}
                    alt={`Block ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full" style={{ backgroundColor: '#1a1a1a' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        {blockImages.length > imagesPerView && (
          <>
            <button
              onClick={() => handleManualSlide('prev')}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Previous images"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => handleManualSlide('next')}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label="Next images"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
              {Array.from({ length: Math.max(0, blockImages.length - imagesPerView + 1) }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: idx === currentSlide ? '24px' : '8px',
                    backgroundColor: idx === currentSlide ? '#ffffff' : 'rgba(255, 255, 255, 0.4)',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
