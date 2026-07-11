export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import pool from "@/lib/db";
import { parseJSON } from "@/app/api/_helpers";
import { ProductDetailClient } from "./ProductDetailClient";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
  const r = (rows as any[])[0];
  if (!r) return {};

  const title = `${r.name} - ${r.category ?? "Architectural Hardware"}`;
  const description =
    r.description ||
    `${r.name} is a premium ${r.material ?? ""} ${r.category ?? "architectural hardware"} product from Hindonix, available in multiple finishes.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: r.image ? [r.image] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
  const r = (rows as any[])[0];
  if (!r) notFound();

  const finishNames: string[] = parseJSON(r.finishes) ?? [];

  // Look up finish images by name from the finishes table
  let resolvedFinishes: { name: string; image: string }[] = [];
  if (finishNames.length > 0) {
    const placeholders = finishNames.map(() => "?").join(",");
    const [finishRows] = await pool.query(
      `SELECT name, image FROM finishes WHERE name IN (${placeholders})`,
      finishNames
    );
    // Preserve the original order
    const finishMap = new Map((finishRows as { name: string; image: string }[]).map(f => [f.name, f.image]));
    resolvedFinishes = finishNames
      .filter(n => finishMap.has(n))
      .map(n => ({ name: n, image: finishMap.get(n)! }));
  }

  const product = {
    ...r,
    categoryId: r.category_id,
    subcategoryId: r.subcategory_id,
    materialId: r.material_id,
    modelNumber: r.model_number,
    longDescription: r.long_description,
    finishes: finishNames,
    images: parseJSON(r.images),
    videos: parseJSON(r.videos),
    resolvedFinishes,
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: r.name,
    description: r.description || product.longDescription || undefined,
    image: product.images?.length ? product.images : r.image ? [r.image] : undefined,
    category: r.category || undefined,
    material: r.material || undefined,
    model: r.model_number || undefined,
    brand: { "@type": "Brand", name: "Hindonix" },
    manufacturer: { "@type": "Organization", name: "Hindonix" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://hindonix.com/" },
      { "@type": "ListItem", position: 2, name: "Products", item: "https://hindonix.com/products" },
      { "@type": "ListItem", position: 3, name: r.name, item: `https://hindonix.com/products/${r.id}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductDetailClient product={product} />
    </>
  );
}
