// v1.0.2
"use client";
import { useState, useEffect } from "react";
import { getOverviewBlockImages } from "@/lib/data";

interface OverviewSectionProps {
  initialBlockImages?: string[];
}

export function OverviewSection({ initialBlockImages }: OverviewSectionProps) {
  const [blockImages, setBlockImages] = useState<string[]>(initialBlockImages ?? []);

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
      <div className="grid w-full grid-cols-1 lg:grid-cols-5 gap-px border-y border-[#1a1a1a]/10" style={{ backgroundColor: '#1a1a1a' }}>
        {Array.from({ length: 5 }).map((_, index) => {
          const url = blockImages[index];
          return (
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
          );
        })}
      </div>
    </section>
  );
}
