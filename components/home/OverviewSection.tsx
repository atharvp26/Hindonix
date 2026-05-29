// v1.0.7
"use client";
import { useState, useEffect, useRef } from "react";
import { getOverviewBlockImages } from "@/lib/data";

const VISIBLE = 3;      // images visible at once (desktop)
const STEP_MS = 3000;   // pause between steps
const ANIM_MS = 600;    // slide animation duration

interface OverviewSectionProps {
  initialBlockImages?: string[];
}

export function OverviewSection({ initialBlockImages }: OverviewSectionProps) {
  const [blockImages, setBlockImages] = useState<string[]>(initialBlockImages ?? []);
  const [mobileHeight, setMobileHeight] = useState(240);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const indexRef     = useRef(0);
  const busyRef      = useRef(false);
  const imagesRef    = useRef<string[]>([]);
  const aspectRef    = useRef(1.0); // width/height of overview images
  imagesRef.current  = blockImages;

  /* ── fetch / sync images ── */
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

  /* ── load first image to derive aspect ratio ──────────────────────────
     This drives both the mobile grid height and the desktop track height
     so images are shown at their natural ratio with zero cropping.
  ── */
  useEffect(() => {
    if (!blockImages.length) return;
    let cancelled = false;
    let removeResize: (() => void) | null = null;

    const img = new Image();
    img.onload = () => {
      if (cancelled || !img.naturalWidth || !img.naturalHeight) return;
      const ratio = img.naturalWidth / img.naturalHeight;
      aspectRef.current = ratio;

      // Mobile: one image per row, height = width / ratio
      const calcMobile = () =>
        setMobileHeight(Math.max(180, Math.round((window.innerWidth - 32) / ratio)));
      calcMobile();
      window.addEventListener("resize", calcMobile);
      removeResize = () => window.removeEventListener("resize", calcMobile);

      // Desktop: update track height immediately if DOM is ready
      if (containerRef.current && trackRef.current) {
        const slideW = containerRef.current.offsetWidth / VISIBLE;
        trackRef.current.style.height = `${Math.round(slideW / ratio)}px`;
        Array.from(trackRef.current.children as HTMLCollectionOf<HTMLElement>).forEach(
          el => { el.style.width = `${slideW}px`; }
        );
      }
    };
    img.src = blockImages[0];

    return () => {
      cancelled = true;
      removeResize?.();
    };
  }, [blockImages]);

  /* ── desktop step carousel ────────────────────────────────────────────
     Track layout (N images, shown 3 at a time):
       [ 1  2  3  4  5 | 1* 2* 3* 4* 5* ]
          real set         clone set

     index 0 → translateX(0)   → shows 1 2 3
     index 1 → translateX(-1w) → shows 2 3 4
     index 2 → translateX(-2w) → shows 3 4 5
     index 3 → translateX(-3w) → shows 4 5 1*   (451)
     index 4 → translateX(-4w) → shows 5 1* 2*  (512)
     index N → translateX(-Nw) → shows 1*2*3*   ← identical to index 0
               ↑ snap to 0 silently, no visible jump
  ── */
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    if (!blockImages.length) return;

    const container = containerRef.current;
    const track     = trackRef.current;
    if (!container || !track) return;

    let active = true;

    const getSlideW = () => container.offsetWidth / VISIBLE;

    // Set pixel widths on all slides AND correct track height
    const applyLayout = () => {
      const w = getSlideW();
      const h = Math.round(w / aspectRef.current);
      Array.from(track.children as HTMLCollectionOf<HTMLElement>).forEach(
        el => { el.style.width = `${w}px`; }
      );
      track.style.height = `${h}px`;
    };

    const moveTo = (idx: number, animated: boolean) => {
      track.style.transition = animated
        ? `transform ${ANIM_MS}ms ease-in-out`
        : "none";
      track.style.transform = `translateX(-${idx * getSlideW()}px)`;
    };

    indexRef.current = 0;
    busyRef.current  = false;
    applyLayout();
    moveTo(0, false);

    const advance = () => {
      if (!active || busyRef.current) return;
      const N = imagesRef.current.length;
      if (N === 0) return;

      busyRef.current = true;
      const next = indexRef.current + 1;

      moveTo(next, true); // animate one step left

      const onEnd = () => {
        track.removeEventListener("transitionend", onEnd);
        if (!active) return;
        if (next >= N) {
          // Clone region — visually same as index 0, snap back silently
          indexRef.current = 0;
          moveTo(0, false);
        } else {
          indexRef.current = next;
        }
        busyRef.current = false;
      };
      track.addEventListener("transitionend", onEnd);
    };

    const timer = setInterval(advance, STEP_MS);

    const onResize = () => {
      applyLayout();
      moveTo(indexRef.current, false);
    };
    window.addEventListener("resize", onResize);

    return () => {
      active = false;
      clearInterval(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [blockImages]); // eslint-disable-line react-hooks/exhaustive-deps

  const doubled = [...blockImages, ...blockImages];

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

      {/* Mobile / Tablet: static grid, no scrolling */}
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

      {/* Desktop: step carousel — 3 visible, height auto-fits image ratio */}
      <div
        ref={containerRef}
        className="hidden lg:block overflow-hidden border-y border-[#1a1a1a]/10"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        {/* minHeight prevents zero-height flash before aspect ratio loads */}
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ minHeight: "300px" }}
        >
          {doubled.map((url, i) => (
            <div
              key={i}
              className="flex-shrink-0 overflow-hidden border-r border-[#1a1a1a]/10"
              style={{ height: "100%" }}
            >
              {url && (
                <img
                  src={url}
                  alt={`Block ${i + 1}`}
                  className="w-full h-full object-contain"
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
