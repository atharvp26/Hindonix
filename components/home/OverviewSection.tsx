// v1.0.3
"use client";
import { useState, useEffect, useRef } from "react";
import { getOverviewBlockImages } from "@/lib/data";

interface OverviewSectionProps {
  initialBlockImages?: string[];
}

export function OverviewSection({ initialBlockImages }: OverviewSectionProps) {
  const [blockImages, setBlockImages] = useState<string[]>(initialBlockImages ?? []);
  const [imagesPerView, setImagesPerView] = useState(3);
  const [mobileHeight, setMobileHeight] = useState(240);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);
  const [offset, setOffset] = useState(0);
  const [applyTransition, setApplyTransition] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      
      const screenWidth = window.innerWidth;
      const imageAspectRatio = imageDimensions.width / imageDimensions.height;
      
      if (screenWidth < 768) {
        // Mobile: show 1 image - calculate height to maintain aspect ratio
        setImagesPerView(1);
        const mobileContainerWidth = screenWidth - 32; // container padding
        const calculatedHeight = Math.round(mobileContainerWidth / imageAspectRatio);
        setMobileHeight(calculatedHeight);
      } else if (screenWidth < 1024) {
        // Tablet: show 2 images - calculate height
        setImagesPerView(2);
        const tabletContainerWidth = screenWidth - 32; // container padding
        const calculatedHeight = Math.round((tabletContainerWidth / 2) / imageAspectRatio);
        setMobileHeight(calculatedHeight);
      } else {
        // Desktop: calculate based on container width and image width
        const containerWidth = screenWidth - (32 * 2); // container padding
        const imageHeight = 500; // increased height for 800x700 images
        const imageWidth = imageHeight * imageAspectRatio;
        const imagesCanFit = Math.floor(containerWidth / imageWidth);
        setImagesPerView(Math.max(3, imagesCanFit)); // at least 3
        setMobileHeight(240); // reset for desktop
      }
    };

    calculateImagesPerView();
    window.addEventListener("resize", calculateImagesPerView);
    return () => window.removeEventListener("resize", calculateImagesPerView);
  }, [imageDimensions]);

  // Continuous infinite scroll animation for desktop only - scrolls left only
  useEffect(() => {
    if (window.innerWidth < 1024 || blockImages.length === 0) return; // Only on desktop

    if (animationRef.current) clearInterval(animationRef.current);

    animationRef.current = setInterval(() => {
      setOffset((prev) => {
        const singleImageWidth = 100 / imagesPerView;
        const fullSetWidth = blockImages.length * singleImageWidth;
        const nextOffset = prev + singleImageWidth;
        
        // When we've scrolled through one complete set, reset to 0
        if (nextOffset >= fullSetWidth) {
          // Disable transition to hide the jump
          setApplyTransition(false);
          // Use a setTimeout to ensure the DOM updates happen in the right order
          setTimeout(() => {
            setApplyTransition(true);
          }, 50);
          return 0;
        }
        
        // Ensure transition is enabled during normal scrolling
        if (!applyTransition) {
          setApplyTransition(true);
        }
        
        return nextOffset;
      });
    }, 3000); // Move one image every 3 seconds

    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [blockImages.length, imagesPerView]);

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

      {/* Mobile Grid View - Show all images in grid without cropping */}
      <div className="lg:hidden grid w-full grid-cols-1 md:grid-cols-2 gap-px border-y border-[#1a1a1a]/10" style={{ backgroundColor: '#1a1a1a' }}>
        {blockImages.map((url, index) => (
          <div 
            key={index} 
            className="relative overflow-hidden bg-[#1a1a1a]"
            style={{
              height: `${mobileHeight}px`,
              minHeight: '200px',
            }}
          >
            {url ? (
              <img
                src={url}
                alt={`Block ${index + 1}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: '#1a1a1a' }} />
            )}
          </div>
        ))}
      </div>

      {/* Desktop Continuous Slider View */}
      <div className="hidden lg:block relative" style={{ backgroundColor: '#1a1a1a' }}>
        <div
          ref={sliderRef}
          className="overflow-hidden border-y border-[#1a1a1a]/10"
          style={{
            backgroundColor: '#1a1a1a',
          }}
        >
          <div
            className="flex"
            style={{
              transform: `translateX(-${offset}%)`,
              transition: applyTransition ? 'transform 0.8s ease-in-out' : 'none',
            }}
          >
            {/* Render images twice for seamless infinite loop */}
            {[...blockImages, ...blockImages].map((url, index) => (
              <div
                key={index}
                className="relative overflow-hidden flex-shrink-0 border-r border-[#1a1a1a]/10"
                style={{
                  width: `${100 / imagesPerView}%`,
                  height: imageDimensions ? `${imageDimensions.height * (500 / imageDimensions.width)}px` : '500px',
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
      </div>
    </section>
  );
}
