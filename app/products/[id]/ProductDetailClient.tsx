"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { type Product } from "@/lib/data";

export function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();

  // Build all images: primary first, then extras
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const [activeIndex, setActiveIndex] = useState(0);
  const videos = product.videos || [];

  return (
    <main className="min-h-screen">
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-8 gap-2">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>

          <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
            {/* Image gallery */}
            <div className="space-y-3">
              {/* Main image */}
              <div className="relative bg-card rounded-2xl overflow-hidden border border-border/50 aspect-square">
                <ImageDisplay
                  src={allImages[activeIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {allImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveIndex((i) => (i - 1 + allImages.length) % allImages.length)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveIndex((i) => (i + 1) % allImages.length)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail strip */}
              {allImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {allImages.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveIndex(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeIndex ? "border-accent" : "border-transparent"}`}
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
                    <video
                      key={i}
                      src={url}
                      controls
                      className="w-full rounded-xl border border-border/50 bg-black"
                      preload="metadata"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col">
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

              {product.modelNumber && (
                <p className="text-muted-foreground text-sm mb-6">
                  Model: <span className="font-medium text-foreground">{product.modelNumber}</span>
                </p>
              )}

              <div className="mb-6">
                <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Overview</h2>
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
              </div>

              {product.longDescription && (
                <div className="mb-6">
                  <h2 className="font-heading text-lg font-semibold text-foreground mb-2">Details</h2>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{product.longDescription}</p>
                </div>
              )}

              {product.finishes && product.finishes.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-heading text-lg font-semibold text-foreground mb-3">Available Finishes</h2>
                  <div className="flex flex-wrap gap-2">
                    {product.finishes.map((finish, index) => (
                      <span
                        key={index}
                        className="px-4 py-2 bg-secondary rounded-lg text-sm font-medium text-foreground border border-border hover:border-accent transition-colors"
                      >
                        {finish}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-auto">
                <Button size="lg" asChild className="w-full sm:w-auto gap-2">
                  <Link href="/contact">Request Quote <ArrowRight className="w-4 h-4" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

