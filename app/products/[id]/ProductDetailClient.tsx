"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { type Product } from "@/lib/data";

// Parse "Code: HCL 03 Unit: Pair Weight: 0.98 Kg ..." into [{key,value}]
function parseOverview(desc: string): { key: string; value: string }[] {
  const entries: { key: string; value: string }[] = [];
  const regex = /([A-Z][a-zA-Z]*):\s*(.*?)(?=\s+[A-Z][a-zA-Z]*:|$)/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(desc)) !== null) {
    const key = match[1].trim();
    const value = match[2].trim();
    if (key && value) entries.push({ key, value });
  }
  return entries;
}

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();

  const extras = (product.images || []).filter(Boolean);
  const allImages = extras.length > 0
    ? [...extras.slice(0, -1), product.image, extras[extras.length - 1]].filter(Boolean)
    : [product.image].filter(Boolean);

  const [activeIndex, setActiveIndex]   = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [zoomPos, setZoomPos]           = useState({ x: 50, y: 50 });
  const [isZooming, setIsZooming]       = useState(false);
  const [lbZoomPos, setLbZoomPos]       = useState({ x: 50, y: 50 });
  const [lbIsZooming, setLbIsZooming]   = useState(false);

  const videos = product.videos || [];
  const overviewPairs = parseOverview(product.description || "");

  // Lock body scroll while lightbox is open
  useEffect(() => {
    document.body.style.overflow = lightboxOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightboxOpen]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft")  setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length);
      if (e.key === "ArrowRight") setLightboxIndex(i => (i + 1) % allImages.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxOpen, allImages.length]);

  return (
    <main className="min-h-screen">
      <section className="pt-16 pb-8">
        <div className="container mx-auto px-4 lg:px-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

            {/* ── Image gallery ── */}
            <div className="space-y-2">

              {/* Main image — hover to zoom, click to open lightbox */}
              <div
                className="relative bg-card rounded-2xl overflow-hidden border border-border/50 aspect-[4/3] cursor-zoom-in select-none"
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setZoomPos({
                    x: ((e.clientX - r.left) / r.width)  * 100,
                    y: ((e.clientY - r.top)  / r.height) * 100,
                  });
                }}
                onMouseEnter={() => setIsZooming(true)}
                onMouseLeave={() => setIsZooming(false)}
                onClick={() => { setLightboxIndex(activeIndex); setLightboxOpen(true); }}
              >
                <ImageDisplay
                  src={allImages[activeIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isZooming ? "scale(2)" : "scale(1)",
                    transition: isZooming ? "none" : "transform 0.2s ease-out",
                  }}
                />

                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveIndex(i => (i - 1 + allImages.length) % allImages.length); }}
                      onMouseEnter={() => setIsZooming(false)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-colors z-10 cursor-default"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setActiveIndex(i => (i + 1) % allImages.length); }}
                      onMouseEnter={() => setIsZooming(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-colors z-10 cursor-default"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors ${i === activeIndex ? "border-accent" : "border-transparent"}`}
                    >
                      <ImageDisplay src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Videos */}
              {videos.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h2 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
                    <Play className="w-4 h-4 text-accent" /> Product Videos
                  </h2>
                  {videos.map((url, i) => (
                    <video key={i} src={url} controls className="w-full rounded-xl border border-border/50 bg-black" preload="metadata" />
                  ))}
                </div>
              )}
            </div>

            {/* ── Product info ── */}
            <div className="flex flex-col">
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground mb-2">{product.name}</h1>

              {product.modelNumber && (
                <p className="text-muted-foreground text-sm mb-4">
                  Model: <span className="font-medium text-foreground">{product.modelNumber}</span>
                </p>
              )}

              {/* Overview — 2-column spec grid */}
              <div className="mb-4">
                <h2 className="font-heading text-base font-semibold text-foreground mb-3">Overview</h2>
                {overviewPairs.length > 1 ? (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {overviewPairs.map(({ key, value }) => (
                      <div key={key}>
                        <p className="text-xs font-semibold text-foreground uppercase tracking-wide">{key}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{value}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
                )}
              </div>

              {product.longDescription && (
                <div className="mb-4">
                  <h2 className="font-heading text-base font-semibold text-foreground mb-1.5">Details</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">{product.longDescription}</p>
                </div>
              )}

              {product.finishes && product.finishes.length > 0 && (
                <div className="mb-5">
                  <h2 className="font-heading text-base font-semibold text-foreground mb-3">Available Finishes</h2>
                  <div className="flex flex-wrap gap-4">
                    {product.resolvedFinishes && product.resolvedFinishes.length > 0
                      ? product.resolvedFinishes.map(({ name, image }) => (
                          <div key={name} className="flex flex-col items-center gap-1.5 w-14">
                            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border hover:border-accent transition-colors flex-shrink-0">
                              <img src={image} alt={name} className="w-full h-full object-cover" />
                            </div>
                            <span className="text-xs text-muted-foreground text-center leading-tight">{name}</span>
                          </div>
                        ))
                      : product.finishes.map((finish, index) => (
                          <span key={index} className="px-3 py-1.5 bg-secondary rounded-lg text-sm font-medium text-foreground border border-border hover:border-accent transition-colors">
                            {finish}
                          </span>
                        ))
                    }
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button size="lg" asChild className="w-full sm:w-auto gap-2">
                  <Link href={`/contact?product=${encodeURIComponent(product.name)}`}>
                    Request Quote <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lightbox ── */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightboxOpen(false)}
          >
            <X className="w-8 h-8" />
          </button>

          {/* Prev / Next */}
          {allImages.length > 1 && (
            <>
              <button
                className="absolute left-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-default"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i - 1 + allImages.length) % allImages.length); }}
                onMouseEnter={() => setLbIsZooming(false)}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                className="absolute right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-default"
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i => (i + 1) % allImages.length); }}
                onMouseEnter={() => setLbIsZooming(false)}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Full image — hover to zoom */}
          <div
            className="overflow-hidden rounded-lg cursor-zoom-in max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              setLbZoomPos({
                x: ((e.clientX - r.left) / r.width)  * 100,
                y: ((e.clientY - r.top)  / r.height) * 100,
              });
            }}
            onMouseEnter={() => setLbIsZooming(true)}
            onMouseLeave={() => setLbIsZooming(false)}
          >
            <img
              src={allImages[lightboxIndex] ?? ""}
              alt={product.name}
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg block"
              style={{
                transformOrigin: `${lbZoomPos.x}% ${lbZoomPos.y}%`,
                transform: lbIsZooming ? "scale(2)" : "scale(1)",
                transition: lbIsZooming ? "none" : "transform 0.2s ease-out",
              }}
            />
          </div>

          {/* Dot indicators */}
          {allImages.length > 1 && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${i === lightboxIndex ? "bg-white" : "bg-white/35"}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}
