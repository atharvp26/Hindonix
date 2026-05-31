export const dynamic = 'force-dynamic';

import pool from "@/lib/db";
import { parseJSON } from "@/app/api/_helpers";
import { ProductDetailClient } from "./ProductDetailClient";
import { notFound } from "next/navigation";

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
  return <ProductDetailClient product={product} />;
}
