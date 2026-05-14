export const dynamic = 'force-dynamic';

import { getProductsFromDB, getCategoriesFromDB, getSubcategoriesFromDB, getMaterialsFromDB, getFinishesFromDB } from "@/lib/server-data";
import { ProductsClient } from "./ProductsClient";

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
