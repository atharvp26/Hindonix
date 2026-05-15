import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { parseJSON } from "../../_helpers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    const r = (rows as any[])[0];
    if (!r) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({
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
    });
  } catch (err: any) {
    console.error("Error fetching product:", err);
    return NextResponse.json({ error: err.message || "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, series, category, categoryId, subcategory, subcategoryId, material, materialId,
            description, modelNumber, longDescription, image, finishes, images, videos } = body;
    await pool.query(
      `UPDATE products SET name=?, series=?, category=?, category_id=?, subcategory=?, subcategory_id=?,
        material=?, material_id=?, description=?, model_number=?, long_description=?, image=?,
        finishes=?, images=?, videos=? WHERE id=?`,
      [name, series ?? null, category, categoryId ?? null, subcategory ?? null, subcategoryId ?? null,
       material, materialId ?? null, description, modelNumber ?? null, longDescription ?? null,
       image, JSON.stringify(finishes ?? []), JSON.stringify(images ?? []), JSON.stringify(videos ?? []), id]
    );
    return NextResponse.json({ id: parseInt(id), ...body });
  } catch (err: any) {
    console.error("Error updating product:", err);
    return NextResponse.json({ error: err.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    // First fetch the product to get its image URLs for Cloudinary cleanup
    // Use SELECT * to avoid errors if images/videos columns don't exist yet
    const [rows] = await pool.query("SELECT * FROM products WHERE id = ?", [id]);
    const product = (rows as any[])[0];

    // Delete from database
    await pool.query("DELETE FROM products WHERE id = ?", [id]);

    // Collect all Cloudinary URLs for async cleanup (non-blocking)
    if (product) {
      const cloudinaryUrls: string[] = [];
      if (product.image && product.image.includes("res.cloudinary.com")) {
        cloudinaryUrls.push(product.image);
      }
      const extraImages = parseJSON(product.images);
      const extraVideos = parseJSON(product.videos);
      for (const url of [...extraImages, ...extraVideos]) {
        if (typeof url === "string" && url.includes("res.cloudinary.com")) {
          cloudinaryUrls.push(url);
        }
      }

      // Fire-and-forget Cloudinary cleanup (don't block the delete response)
      if (cloudinaryUrls.length > 0) {
        cleanupCloudinaryAssets(cloudinaryUrls).catch((err) =>
          console.error("Cloudinary cleanup error (non-blocking):", err)
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Error deleting product:", err);
    return NextResponse.json(
      { success: false, error: err.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}

/**
 * Helper to extract public_id from Cloudinary URL and delete via Admin API.
 * This is a fire-and-forget cleanup — failures don't affect the main delete.
 */
async function cleanupCloudinaryAssets(urls: string[]) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn("Cloudinary API credentials not configured — skipping cleanup");
    return;
  }

  const crypto = await import("crypto");

  for (const url of urls) {
    try {
      const publicId = extractPublicId(url);
      if (!publicId) continue;

      const resourceType = url.includes("/video/upload/") ? "video" : "image";
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
      const signature = crypto.createHash("sha1").update(stringToSign).digest("hex");

      const formData = new URLSearchParams();
      formData.append("public_id", publicId);
      formData.append("timestamp", timestamp);
      formData.append("api_key", apiKey);
      formData.append("signature", signature);

      await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/destroy`, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });
    } catch (err) {
      console.error(`Failed to delete Cloudinary asset from URL ${url}:`, err);
    }
  }
}

function extractPublicId(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const parts = urlObj.pathname.split("/");
    const uploadIdx = parts.indexOf("upload");
    if (uploadIdx === -1) return null;
    let startIdx = uploadIdx + 1;
    if (parts[startIdx] && /^v\d+$/.test(parts[startIdx])) startIdx++;
    const withExt = parts.slice(startIdx).join("/");
    const dotIdx = withExt.lastIndexOf(".");
    return dotIdx > 0 ? withExt.substring(0, dotIdx) : withExt;
  } catch {
    return null;
  }
}
