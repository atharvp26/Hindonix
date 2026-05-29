// v1.0.5
"use client";
import { useState, useEffect, useRef } from "react";
import { getOverviewBlockImages } from "@/lib/data";

const DESKTOP_VISIBLE = 3;    // images visible side-by-side on desktop
const SECS_PER_IMAGE  = 3;    // seconds for one image-width to scroll past
const DESKTOP_HEIGHT  = 500;  // px

interface OverviewSectionProps {
  initialBlockImages?: string[];
}

export function OverviewSection({ initialBlockImages }: OverviewSectionProps) {
  const [blockImages, setBlockImages] = useState<string[]>(initialBlockImages ?? []);
  const [mobileHeight, setMobileHeight] = useState(240);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const posRef       = useRef(0);
  const lastTRef     = useRef<number | null>(null);
  const rafRef       = useRef<number | null>(null);

  /* ── fetch / listen for image updates ── */
  useEffect(() => {
    if (!initialBlockImages || initialBlockImages.length === 0) {
      getOverviewBlockImages()
        .then(urls => { if (urls.length > 0) setBlockImages(urls); })
        .catch(console.error);
    }
    const onUpdate = () =>
      getOverviewBlockImages().then(setBlockImages).catch(console.error);
    window.addEventListener("overviewBlockImagesUpdated", onUpdate);
    return () => window.removeEventListener("overviewBlockImagesUpdated", onUpdate);
  }, [initialBlockImages]);

  /* ── mobile height from first image's aspect ratio ── */
  useEffect(() => {
    if (blockImages.length === 0) return;
    const img = new Image();
    img.onload = () => {
      if (!img.naturalWidth) return;
      const ratio = img.naturalWidth / img.naturalHeight;
      const calc = () =>
        setMobileHeight(Math.max(180, Math.round((window.innerWidth - 32) / ratio)));
      calc();
      window.addEventListener("resize", calc);
    };
    img.src = blockImages[0];
  }, [blockImages]);

  /* ── desktop infinite left-scroll via requestAnimationFrame ──
     Logic: render [...images, ...images] (2× the images).
     The track is twice as wide as one full cycle.
     We continuously increase posRef. When pos reaches
     (N × imageWidth) — exactly halfway — we subtract that value:
     the visual position is identical (second copy = first copy),
     so there is never a visible jump or rightward movement. ── */
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;

    const container = containerRef.current;
    const track     = trackRef.current;
    if (!container || !track || blockImages.length === 0) return;

    const applyWidths = () => {
      const w = container.offsetWidth / DESKTOP_VISIBLE;
      Array.from(track.children as HTMLCollectionOf<HTMLElement>).forEach(
        el => { el.style.width = `${w}px`; }
      );
    };
    applyWidths();

    let active = true;

    const tick = (t: number) => {
      if (!active) return;
      if (lastTRef.current === null) lastTRef.current = t;
      const dt = Math.min(t - lastTRef.current, 100); // cap lag on tab-switch
      lastTRef.current = t;

      const imgW  = container.offsetWidth / DESKTOP_VISIBLE;
      const cycle = blockImages.length * imgW; // width of one complete set

      posRef.current += (imgW / (SECS_PER_IMAGE * 1000)) * dt;
      if (posRef.current >= cycle) posRef.current -= cycle; // seamless wrap

      track.style.transform = `translateX(-${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener("resize", applyWidths);

    return () => {
      active = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTRef.current = null;
      window.removeEventListener("resize", applyWidths);
    };
  }, [blockImages]);

  return (
    <section className="py-20 lg:py-28" style={{ backgroundColor: "#eaeaea" }}>
      {/* heading */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span
            className="inline-block text-[#1a1a1a]/50 font-normal text-xs tracking-[0.05em] mb-4"
            style={{ fontFamily: "Montserrat, system-ui, sans-serif" }}
          >
            Why Design Professionals Choose Us
          </span>
          <h2 className="text-3xl lg:text-4xl font-semibold text-[#1a1a1a] mb-6 tracking-tight">
            Exceptional Architectural Hardware
          </h2>
          <p className="text-[#1a1a1a]/60 text-base lg:text-lg font-light">
            From concept to installation, we provide premium hardware solutions
            with uncompromising quality, elegant design, and lasting durability.
          </p>
        </div>
      </div>

      {/* Mobile / Tablet: static grid (no scrolling) */}
      <div
        className="lg:hidden grid w-full grid-cols-1 md:grid-cols-2 gap-px border-y border-[#1a1a1a]/10"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        {blockImages.map((url, i) => (
          <div
            key={i}
            className="overflow-hidden bg-[#1a1a1a]"
            style={{ height: `${mobileHeight}px`, minHeight: "180px" }}
          >
            {url && (
              <img
                src={url}
                alt={`Block ${i + 1}`}
                className="w-full h-full object-contain"
              />
            )}
          </div>
        ))}
      </div>

      {/* Desktop: infinite left-scroll, 3 images visible at once */}
      <div
        ref={containerRef}
        className="hidden lg:block overflow-hidden border-y border-[#1a1a1a]/10"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ height: `${DESKTOP_HEIGHT}px` }}
        >
          {/* Images doubled so the wrap-point is visually identical to the start */}
          {[...blockImages, ...blockImages].map((url, i) => (
            <div
              key={i}
              className="flex-shrink-0 overflow-hidden border-r border-[#1a1a1a]/10"
              style={{ height: "100%" }}
            >
              {url && (
                <img
                  src={url}
                  alt={`Block ${i + 1}`}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
