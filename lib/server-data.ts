/**
 * Server-side data access functions.
 * These query the database directly and are safe to use only in Server Components.
 * Do NOT import this file from "use client" components.
 */

import pool from "@/lib/db";
import type {
  Product,
  Category,
  Subcategory,
  Material,
  Finish,
  Blog,
  Testimonial,
  CaseStudy,
} from "@/lib/data";

function parseJSON(val: unknown, fallback: unknown = []): any {
  if (Array.isArray(val)) return val;
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return fallback;
    }
  }
  return fallback;
}

export async function getProductsFromDB(): Promise<Product[]> {
  try {
    const [rows] = await pool.query("SELECT * FROM products ORDER BY id DESC");
    return (rows as any[]).map((r) => ({
      ...r,
      categoryId: r.category_id,
      subcategoryId: r.subcategory_id,
      materialId: r.material_id,
      modelNumber: r.model_number,
      longDescription: r.long_description,
      finishes: parseJSON(r.finishes),
      images: parseJSON(r.images),
      videos: parseJSON(r.videos),
    }));
  } catch (err) {
    console.error("[server-data] getProductsFromDB failed:", err);
    return [];
  }
}

export async function getCategoriesFromDB(): Promise<Category[]> {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY id ASC");
    return rows as Category[];
  } catch (err) {
    console.error("[server-data] getCategoriesFromDB failed:", err);
    return [];
  }
}

export async function getSubcategoriesFromDB(): Promise<Subcategory[]> {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM subcategories ORDER BY id ASC"
    );
    return (rows as any[]).map((r) => ({ ...r, categoryId: r.category_id }));
  } catch (err) {
    console.error("[server-data] getSubcategoriesFromDB failed:", err);
    return [];
  }
}

export async function getMaterialsFromDB(): Promise<Material[]> {
  try {
    const [rows] = await pool.query("SELECT * FROM materials ORDER BY id ASC");
    return (rows as any[]).map((r) => ({
      ...r,
      categoryId: r.category_id,
      subcategoryId: r.subcategory_id,
    }));
  } catch (err) {
    console.error("[server-data] getMaterialsFromDB failed:", err);
    return [];
  }
}

export async function getFinishesFromDB(): Promise<Finish[]> {
  try {
    const [rows] = await pool.query("SELECT * FROM finishes ORDER BY id ASC");
    return (rows as any[]).map((r) => ({ ...r, categoryId: r.category_id }));
  } catch (err) {
    console.error("[server-data] getFinishesFromDB failed:", err);
    return [];
  }
}

export async function getBlogsFromDB(): Promise<Blog[]> {
  try {
    const [rows] = await pool.query("SELECT * FROM blogs ORDER BY id DESC");
    return rows as Blog[];
  } catch (err) {
    console.error("[server-data] getBlogsFromDB failed:", err);
    return [];
  }
}

export async function getTestimonialsFromDB(): Promise<Testimonial[]> {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM testimonials ORDER BY id ASC"
    );
    return rows as Testimonial[];
  } catch (err) {
    console.error("[server-data] getTestimonialsFromDB failed:", err);
    return [];
  }
}

export async function getCaseStudiesFromDB(): Promise<CaseStudy[]> {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM case_studies ORDER BY id DESC"
    );
    return (rows as any[]).map((r) => ({
      ...r,
      stats: parseJSON(r.stats),
    }));
  } catch (err) {
    console.error("[server-data] getCaseStudiesFromDB failed:", err);
    return [];
  }
}
