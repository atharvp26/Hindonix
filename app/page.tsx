import { HeroSection } from "@/components/home/HeroSection";
import { OverviewSection } from "@/components/home/OverviewSection";
import { WhyChooseUsSection } from "@/components/home/WhyChooseUsSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
export const dynamic = 'force-dynamic';

import { getTestimonialsFromDB } from "@/lib/server-data";
import pool from "@/lib/db";

async function getHeroImagesFromDB(): Promise<string[]> {
  try {
    const [rows] = await pool.query("SELECT urls FROM hero_images ORDER BY id DESC LIMIT 1");
    const r = (rows as any[])[0];
    if (!r) return [];
    const urls = typeof r.urls === "string" ? JSON.parse(r.urls) : r.urls;
    return Array.isArray(urls) && urls.length > 0 ? urls : [];
  } catch (err) {
    console.error("[HomePage] getHeroImagesFromDB failed:", err);
    return [];
  }
}

async function getHeroDesktopImageFromDB(): Promise<string> {
  try {
    const [rows] = await pool.query("SELECT url FROM hero_desktop_image ORDER BY id ASC LIMIT 1");
    const r = (rows as any[])[0];
    return r?.url || "";
  } catch {
    return "";
  }
}

async function getCTAImageFromDB(): Promise<string> {
  try {
    const [rows] = await pool.query("SELECT url FROM cta_image ORDER BY id ASC LIMIT 1");
    const r = (rows as any[])[0];
    return r?.url || "";
  } catch {
    return "";
  }
}

async function getTestimonialsMobileBgFromDB(): Promise<string[]> {
  try {
    const [rows] = await pool.query("SELECT urls FROM testimonials_mobile_bg ORDER BY id ASC LIMIT 1");
    const r = (rows as any[])[0];
    if (!r) return [];
    const urls = typeof r.urls === "string" ? JSON.parse(r.urls) : r.urls;
    return Array.isArray(urls) ? urls : [];
  } catch {
    return [];
  }
}

async function getOverviewImagesFromDB(): Promise<string[]> {
  try {
    const [rows] = await pool.query("SELECT urls FROM overview_images ORDER BY id ASC LIMIT 1");
    const r = (rows as any[])[0];
    if (!r) return [];
    const urls = typeof r.urls === "string" ? JSON.parse(r.urls) : r.urls;
    return Array.isArray(urls) ? urls : [];
  } catch {
    return [];
  }
}

async function getOverviewBlockImagesFromDB(): Promise<string[]> {
  try {
    const [rows] = await pool.query("SELECT urls FROM overview_block_images ORDER BY id ASC LIMIT 1");
    const r = (rows as any[])[0];
    if (!r) return [];
    const urls = typeof r.urls === "string" ? JSON.parse(r.urls) : r.urls;
    return Array.isArray(urls) ? urls : [];
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [heroImages, heroDesktopImage, testimonials, testimonialsMobileBg, ctaBgImage, overviewImages, blockImages] = await Promise.all([
    getHeroImagesFromDB(),
    getHeroDesktopImageFromDB(),
    getTestimonialsFromDB(),
    getTestimonialsMobileBgFromDB(),
    getCTAImageFromDB(),
    getOverviewImagesFromDB(),
    getOverviewBlockImagesFromDB(),
  ]);

  return (
    <main className="min-h-screen">
      <HeroSection initialImages={heroImages} initialDesktopImage={heroDesktopImage} />
      <OverviewSection initialBlockImages={blockImages} />
      <WhyChooseUsSection />
      <TestimonialsSection initialTestimonials={testimonials} initialBackgroundImages={overviewImages} initialMobileBgImages={testimonialsMobileBg} />
      <CTASection initialBgImage={ctaBgImage} />
    </main>
  );
}
