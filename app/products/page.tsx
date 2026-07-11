export const dynamic = 'force-dynamic';

import type { Metadata } from "next";
import { getProductsFromDB, getCategoriesFromDB, getSubcategoriesFromDB, getMaterialsFromDB, getFinishesFromDB } from "@/lib/server-data";
import { ProductsClient } from "./ProductsClient";

export const metadata: Metadata = {
  title: "Architectural Hardware Products - Door Handles & Door Knobs",
  description:
    "Browse Hindonix's catalog of premium stainless steel and brass architectural hardware, including door handles, door knobs, and more finishes.",
};

export default async function ProductsPage() {
  const [products, categories, subcategories, materials, finishes] = await Promise.all([
    getProductsFromDB(),
    getCategoriesFromDB(),
    getSubcategoriesFromDB(),
    getMaterialsFromDB(),
    getFinishesFromDB(),
  ]);

  return (
    <ProductsClient
      initialProducts={products}
      initialCategories={categories}
      initialSubcategories={subcategories}
      initialMaterials={materials}
      initialFinishes={finishes}
    />
  );
}
