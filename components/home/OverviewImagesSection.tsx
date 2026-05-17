"use client";

import { useEffect, useState, useRef } from "react";
import { getOverviewImages } from "@/lib/data";

interface OverviewImagesSectionProps {
  initialImages?: string[];
}

export function OverviewImagesSection({ initialImages }: OverviewImagesSectionProps) {
  const [images, setImages] = useState<string[]>(initialImages ?? []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!initialImages) {
      getOverviewImages().then(setImages).catch(console.error);
    }
    const reload = () => getOverviewImages().then(setImages).catch(console.error);
    window.addEventListener("overviewImagesUpdated", reload);
    return () => window.removeEventListener("overviewImagesUpdated", reload);
  }, [initialImages]);

  useEffect(() => {
    setLoaded(images.map(() => false));
    setActiveIndex(0);
  }, [images.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 2500);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length]);

  if (!images.length) return null;

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "800px", maxHeight: "800px" }}
      aria-label="Overview background slideshow"
    >
      {images.map((src, idx) => (
        <div
          key={src + idx}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: idx === activeIndex ? 1 : 0, zIndex: idx === activeIndex ? 1 : 0 }}
          aria-hidden={idx !== activeIndex}
        >
          <img
            src={src}
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover select-none pointer-events-none"
            style={{ display: "block" }}
            onLoad={() =>
              setLoaded((prev) => {
                const next = [...prev];
                next[idx] = true;
                return next;
              })
            }
          />
        </div>
      ))}

      {/* Dot indicators */}
      {images.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2"
          style={{ zIndex: 10 }}
        >
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (timerRef.current) clearInterval(timerRef.current);
                setActiveIndex(idx);
                timerRef.current = setInterval(() => {
                  setActiveIndex((prev) => (prev + 1) % images.length);
                }, 2500);
              }}
              className="w-2 h-2 rounded-full transition-all duration-300"
              style={{
                backgroundColor: idx === activeIndex ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.40)",
                transform: idx === activeIndex ? "scale(1.3)" : "scale(1)",
              }}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
