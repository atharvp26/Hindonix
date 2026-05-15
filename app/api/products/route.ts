import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { parseJSON } from "../_helpers";

export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id DESC");
    const products = (rows as any[]).map((r) => ({
      ...r,
      series: r.series ?? undefined,
      categoryId: r.category_id,
      subcategoryId: r.subcategory_id,
      materialId: r.material_id,
      modelNumber: r.model_number,
      longDescription: r.long_description,
      finishes: parseJSON(r.finishes),
      images: parseJSON(r.images),
      videos: parseJSON(r.videos),
    }));
    return NextResponse.json(products);
  } catch (err: any) {
    console.error("Error fetching products:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, series, category, categoryId, subcategory, subcategoryId, material, materialId,
            description, modelNumber, longDescription, image, finishes, images, videos } = body;
    const [result] = await pool.query(
      `INSERT INTO products (name, series, category, category_id, subcategory, subcategory_id, material,
        material_id, description, model_number, long_description, image, finishes, images, videos)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, series ?? null, category, categoryId ?? null, subcategory ?? null, subcategoryId ?? null,
       material, materialId ?? null, description, modelNumber ?? null, longDescription ?? null,
       image, JSON.stringify(finishes ?? []), JSON.stringify(images ?? []), JSON.stringify(videos ?? [])]
    );
    const id = (result as any).insertId;
    return NextResponse.json(
      { id, name, series, category, categoryId, subcategory, subcategoryId, material, materialId,
        description, modelNumber, longDescription, image, finishes: finishes ?? [],
        images: images ?? [], videos: videos ?? [] },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error creating product:", err);
    return NextResponse.json({ error: err.message || "Failed to create product" }, { status: 500 });
  }
}
