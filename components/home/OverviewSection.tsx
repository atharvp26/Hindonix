// v1.0.4
"use client";
import { useState, useEffect } from "react";
import { getOverviewBlockImages } from "@/lib/data";

interface OverviewSectionProps {
  initialBlockImages?: string[];
}

export function OverviewSection({ initialBlockImages }: OverviewSectionProps) {
  const [blockImages, setBlockImages] = useState<string[]>(initialBlockImages ?? []);
  const [imagesPerView, setImagesPerView] = useState(3);
  const [mobileHeight, setMobileHeight] = useState(240);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    if (blockImages.length > 0) {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = blockImages[0];
    }
  }, [blockImages]);

  useEffect(() => {
    const calculateImagesPerView = () => {
      if (!imageDimensions) return;

      const screenWidth = window.innerWidth;
      const imageAspectRatio = imageDimensions.width / imageDimensions.height;

      if (screenWidth < 768) {
        setImagesPerView(1);
        const mobileContainerWidth = screenWidth - 32;
        setMobileHeight(Math.round(mobileContainerWidth / imageAspectRatio));
      } else if (screenWidth < 1024) {
        setImagesPerView(2);
        const tabletContainerWidth = screenWidth - 32;
        setMobileHeight(Math.round((tabletContainerWidth / 2) / imageAspectRatio));
      } else {
        const containerWidth = screenWidth - 32 * 2;
        const imageHeight = 500;
        const imageWidth = imageHeight * imageAspectRatio;
        setImagesPerView(Math.max(3, Math.floor(containerWidth / imageWidth)));
        setMobileHeight(240);
      }
    };

    calculateImagesPerView();
    window.addEventListener("resize", calculateImagesPerView);
    return () => window.removeEventListener("resize", calculateImagesPerView);
  }, [imageDimensions]);

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

  // 3 seconds per image for one full cycle
  const animationDuration = blockImages.length * 3;

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: '#eaeaea' }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block text-[#1a1a1a]/50 font-normal text-xs tracking-[0.05em] mb-4" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>Why Design Professionals Choose Us</span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-[#1a1a1a] mb-6 tracking-tight">Exceptional Architectural Hardware</h2>
          <p className="text-[#1a1a1a]/60 text-base lg:text-lg font-light">From concept to installation, we provide premium hardware solutions with uncompromising quality, elegant design, and lasting durability.</p>
        </div>
      </div>

      {/* Mobile Grid View */}
      <div className="lg:hidden grid w-full grid-cols-1 md:grid-cols-2 gap-px border-y border-[#1a1a1a]/10" style={{ backgroundColor: '#1a1a1a' }}>
        {blockImages.map((url, index) => (
          <div
            key={index}
            className="relative overflow-hidden bg-[#1a1a1a]"
            style={{ height: `${mobileHeight}px`, minHeight: '200px' }}
          >
            {url ? (
              <img src={url} alt={`Block ${index + 1}`} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full" style={{ backgroundColor: '#1a1a1a' }} />
            )}
          </div>
        ))}
      </div>

      {/* Desktop Infinite Left Scroll */}
      <div className="hidden lg:block" style={{ backgroundColor: '#1a1a1a' }}>
        <style>{`
          @keyframes hindonix-scroll-left {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
        `}</style>
        <div className="overflow-hidden border-y border-[#1a1a1a]/10">
          <div
            className="flex"
            style={{
              animation: blockImages.length > 0
                ? `hindonix-scroll-left ${animationDuration}s linear infinite`
                : 'none',
            }}
          >
            {[...blockImages, ...blockImages].map((url, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 overflow-hidden border-r border-[#1a1a1a]/10"
                style={{
                  width: `${100 / imagesPerView}%`,
                  height: imageDimensions
                    ? `${imageDimensions.height * (500 / imageDimensions.width)}px`
                    : '500px',
                }}
              >
                {url ? (
                  <img src={url} alt={`Block ${index + 1}`} className="w-full h-full object-cover" />
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
