import type { MetadataRoute } from "next";
import { getProductsFromDB, getBlogsFromDB } from "@/lib/server-data";

const BASE_URL = "https://hindonix.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, blogs] = await Promise.all([
    getProductsFromDB(),
    getBlogsFromDB(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, priority: 1.0 },
    { url: `${BASE_URL}/products`, priority: 0.8 },
    { url: `${BASE_URL}/about`, priority: 0.8 },
    { url: `${BASE_URL}/services`, priority: 0.8 },
    { url: `${BASE_URL}/case-studies`, priority: 0.8 },
    { url: `${BASE_URL}/blogs`, priority: 0.8 },
    { url: `${BASE_URL}/contact`, priority: 0.8 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${BASE_URL}/products/${product.id}`,
    priority: 0.64,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${BASE_URL}/blogs/${blog.id}`,
    priority: 0.64,
  }));

  return [...staticRoutes, ...productRoutes, ...blogRoutes];
}
