// v1.0.6
"use client";
import { useState, useEffect, useRef } from "react";
import { getOverviewBlockImages } from "@/lib/data";

const VISIBLE = 3;     // images visible at once (desktop)
const STEP_MS = 3000;  // pause between steps
const ANIM_MS = 600;   // slide-transition duration

interface OverviewSectionProps {
  initialBlockImages?: string[];
}

export function OverviewSection({ initialBlockImages }: OverviewSectionProps) {
  const [blockImages, setBlockImages] = useState<string[]>(initialBlockImages ?? []);
  const [mobileHeight, setMobileHeight] = useState(240);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef     = useRef<HTMLDivElement>(null);
  const indexRef     = useRef(0);      // current first-visible index (0 … N)
  const busyRef      = useRef(false);  // true while transition in progress
  const imagesRef    = useRef<string[]>([]);
  imagesRef.current  = blockImages;   // always-current without stale closure

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

  /* ── mobile height from first image's aspect ratio ── */
  useEffect(() => {
    if (!blockImages.length) return;
    let removeResize: (() => void) | null = null;
    const img = new Image();
    img.onload = () => {
      if (!img.naturalWidth) return;
      const ratio = img.naturalWidth / img.naturalHeight;
      const recalc = () =>
        setMobileHeight(Math.max(180, Math.round((window.innerWidth - 32) / ratio)));
      recalc();
      window.addEventListener("resize", recalc);
      removeResize = () => window.removeEventListener("resize", recalc);
    };
    img.src = blockImages[0];
    return () => { removeResize?.(); };
  }, [blockImages]);

  /* ── desktop step-based carousel ──────────────────────────────────────
     Track layout (N = blockImages.length, 5 in this example):
       [ img1 img2 img3 img4 img5 | img1 img2 img3 img4 img5 ]
         ← original set (idx 0–4)  ← clone set (idx 5–9)

     index=0 → shows 1 2 3   (translateX 0)
     index=1 → shows 2 3 4   (translateX -1w)
     index=2 → shows 3 4 5   (translateX -2w)
     index=3 → shows 4 5 1*  (translateX -3w)  * clone
     index=4 → shows 5 1* 2* (translateX -4w)
     index=5 → shows 1* 2* 3*(translateX -5w)  ← identical to index=0

     After animating to index N (clone region), we snap silently to
     index 0. The content is identical, so the jump is invisible.
  ── */
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth < 1024) return;
    if (!blockImages.length) return;

    const container = containerRef.current;
    const track     = trackRef.current;
    if (!container || !track) return;

    let active = true;

    const getW = () => container.offsetWidth / VISIBLE;

    const applyWidths = () => {
      const w = getW();
      Array.from(track.children as HTMLCollectionOf<HTMLElement>).forEach(
        el => { el.style.width = `${w}px`; }
      );
    };

    const moveTo = (idx: number, animated: boolean) => {
      track.style.transition = animated
        ? `transform ${ANIM_MS}ms ease-in-out`
        : "none";
      track.style.transform = `translateX(-${idx * getW()}px)`;
    };

    // reset to clean state
    indexRef.current = 0;
    busyRef.current  = false;
    applyWidths();
    moveTo(0, false);

    const advance = () => {
      if (!active || busyRef.current) return;
      const N = imagesRef.current.length;
      if (N === 0) return;

      busyRef.current = true;
      const next = indexRef.current + 1; // advance by 1 image

      moveTo(next, true); // slide left

      const onEnd = () => {
        track.removeEventListener("transitionend", onEnd);
        if (!active) return; // effect was torn down mid-transition

        if (next >= N) {
          // We just animated into the clone region (index N).
          // Clone content is identical to index 0 — snap back invisibly.
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

    // keep pixel widths correct when window is resized
    const onResize = () => {
      applyWidths();
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

      {/* Desktop: step carousel — exactly 3 visible, 1-image steps */}
      <div
        ref={containerRef}
        className="hidden lg:block overflow-hidden border-y border-[#1a1a1a]/10"
        style={{ backgroundColor: "#1a1a1a" }}
      >
        <div
          ref={trackRef}
          className="flex will-change-transform"
          style={{ height: "500px" }}
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
