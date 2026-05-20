import type {
  Product,
  CaseStudy,
  Blog,
  Testimonial,
  Category,
  Subcategory,
  Material,
  Finish,
  FinishCategory,
} from "./data";

const BASE = "/api";

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${options?.method ?? "GET"} ${path} failed (${res.status}): ${text}`);
  }
  return res.json() as Promise<T>;
}

// ============================================
// PRODUCT OPERATIONS
// ============================================

export const getAllProducts = (): Promise<Product[]> =>
  apiFetch<Product[]>("/products");

export const getProductById = (id: number): Promise<Product | null> =>
  apiFetch<Product>(`/products/${id}`).catch(() => null);

export const addProductToRedis = (product: Omit<Product, "id">): Promise<Product> =>
  apiFetch<Product>("/products", { method: "POST", body: JSON.stringify(product) });

export const updateProductInRedis = (id: number, updates: Partial<Product>): Promise<Product | null> =>
  apiFetch<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(updates) }).catch(() => null);

export const deleteProductFromRedis = async (id: number): Promise<boolean> => {
  const r = await apiFetch<{ success: boolean }>(`/products/${id}`, { method: "DELETE" });
  return r.success;
};

export const getAllProductIds = async (): Promise<number[]> => {
  const products = await getAllProducts();
  return products.map((p) => p.id);
};

// ============================================
// CASE STUDY OPERATIONS
// ============================================

export const getAllCaseStudies = (): Promise<CaseStudy[]> =>
  apiFetch<CaseStudy[]>("/case-studies");

export const getCaseStudyById = (id: number): Promise<CaseStudy | null> =>
  apiFetch<CaseStudy>(`/case-studies/${id}`).catch(() => null);

export const addCaseStudyToRedis = (caseStudy: Omit<CaseStudy, "id">): Promise<CaseStudy> =>
  apiFetch<CaseStudy>("/case-studies", { method: "POST", body: JSON.stringify(caseStudy) });

export const updateCaseStudyInRedis = (id: number, updates: Partial<CaseStudy>): Promise<CaseStudy | null> =>
  apiFetch<CaseStudy>(`/case-studies/${id}`, { method: "PUT", body: JSON.stringify(updates) }).catch(() => null);

export const deleteCaseStudyFromRedis = async (id: number): Promise<boolean> => {
  const r = await apiFetch<{ success: boolean }>(`/case-studies/${id}`, { method: "DELETE" });
  return r.success;
};

export const getAllCaseStudyIds = async (): Promise<number[]> => {
  const cs = await getAllCaseStudies();
  return cs.map((c) => c.id);
};

// ============================================
// BLOG OPERATIONS
// ============================================

export const getAllBlogs = (): Promise<Blog[]> =>
  apiFetch<Blog[]>("/blogs");

export const addBlogToRedis = (blog: Omit<Blog, "id">): Promise<Blog> =>
  apiFetch<Blog>("/blogs", { method: "POST", body: JSON.stringify(blog) });

export const updateBlogInRedis = (id: number, updates: Partial<Blog>): Promise<Blog | null> =>
  apiFetch<Blog>(`/blogs/${id}`, { method: "PUT", body: JSON.stringify(updates) }).catch(() => null);

export const deleteBlogFromRedis = async (id: number): Promise<boolean> => {
  const r = await apiFetch<{ success: boolean }>(`/blogs/${id}`, { method: "DELETE" });
  return r.success;
};

// ============================================
// TESTIMONIAL OPERATIONS
// ============================================

export const getAllTestimonials = (): Promise<Testimonial[]> =>
  apiFetch<Testimonial[]>("/testimonials");

export const addTestimonialToRedis = (testimonial: Omit<Testimonial, "id">): Promise<Testimonial> =>
  apiFetch<Testimonial>("/testimonials", { method: "POST", body: JSON.stringify(testimonial) });

export const updateTestimonialInRedis = (id: number, updates: Partial<Testimonial>): Promise<Testimonial | null> =>
  apiFetch<Testimonial>(`/testimonials/${id}`, { method: "PUT", body: JSON.stringify(updates) }).catch(() => null);

export const deleteTestimonialFromRedis = async (id: number): Promise<boolean> => {
  const r = await apiFetch<{ success: boolean }>(`/testimonials/${id}`, { method: "DELETE" });
  return r.success;
};

// ============================================
// CATEGORY OPERATIONS
// ============================================

export const getAllCategories = (): Promise<Category[]> =>
  apiFetch<Category[]>("/categories");

export const addCategoryToRedis = (category: Omit<Category, "id">): Promise<Category> =>
  apiFetch<Category>("/categories", { method: "POST", body: JSON.stringify(category) });

export const updateCategoryInRedis = (id: number, updates: Partial<Category>): Promise<Category | null> =>
  apiFetch<Category>(`/categories/${id}`, { method: "PUT", body: JSON.stringify(updates) }).catch(() => null);

export const deleteCategoryFromRedis = async (id: number): Promise<boolean> => {
  const r = await apiFetch<{ success: boolean }>(`/categories/${id}`, { method: "DELETE" });
  return r.success;
};

// ============================================
// SUBCATEGORY OPERATIONS
// ============================================

export const getAllSubcategories = (): Promise<Subcategory[]> =>
  apiFetch<Subcategory[]>("/subcategories");

export const addSubcategoryToRedis = (subcategory: Omit<Subcategory, "id">): Promise<Subcategory> =>
  apiFetch<Subcategory>("/subcategories", { method: "POST", body: JSON.stringify(subcategory) });

export const updateSubcategoryInRedis = (id: number, updates: Partial<Subcategory>): Promise<Subcategory | null> =>
  apiFetch<Subcategory>(`/subcategories/${id}`, { method: "PUT", body: JSON.stringify(updates) }).catch(() => null);

export const deleteSubcategoryFromRedis = async (id: number): Promise<boolean> => {
  const r = await apiFetch<{ success: boolean }>(`/subcategories/${id}`, { method: "DELETE" });
  return r.success;
};

// ============================================
// MATERIAL OPERATIONS
// ============================================

export const getAllMaterials = (): Promise<Material[]> =>
  apiFetch<Material[]>("/materials");

export const addMaterialToRedis = (material: Omit<Material, "id">): Promise<Material> =>
  apiFetch<Material>("/materials", { method: "POST", body: JSON.stringify(material) });

export const updateMaterialInRedis = (id: number, updates: Partial<Material>): Promise<Material | null> =>
  apiFetch<Material>(`/materials/${id}`, { method: "PUT", body: JSON.stringify(updates) }).catch(() => null);

export const deleteMaterialFromRedis = async (id: number): Promise<boolean> => {
  const r = await apiFetch<{ success: boolean }>(`/materials/${id}`, { method: "DELETE" });
  return r.success;
};

// ============================================
// FINISH CATEGORY OPERATIONS
// ============================================

export const getAllFinishCategories = (): Promise<FinishCategory[]> =>
  apiFetch<FinishCategory[]>("/finish-categories");

export const addFinishCategoryToRedis = (fc: Omit<FinishCategory, "id">): Promise<FinishCategory> =>
  apiFetch<FinishCategory>("/finish-categories", { method: "POST", body: JSON.stringify(fc) });

export const updateFinishCategoryInRedis = (id: number, updates: Partial<FinishCategory>): Promise<FinishCategory | null> =>
  apiFetch<FinishCategory>(`/finish-categories/${id}`, { method: "PUT", body: JSON.stringify(updates) }).catch(() => null);

export const deleteFinishCategoryFromRedis = async (id: number): Promise<boolean> => {
  const r = await apiFetch<{ success: boolean }>(`/finish-categories/${id}`, { method: "DELETE" });
  return r.success;
};

// ============================================
// FINISH OPERATIONS
// ============================================

export const getAllFinishes = (): Promise<Finish[]> =>
  apiFetch<Finish[]>("/finishes");

export const addFinishToRedis = (finish: Omit<Finish, "id">): Promise<Finish> =>
  apiFetch<Finish>("/finishes", { method: "POST", body: JSON.stringify(finish) });

export const updateFinishInRedis = (id: number, updates: Partial<Finish>): Promise<Finish | null> =>
  apiFetch<Finish>(`/finishes/${id}`, { method: "PUT", body: JSON.stringify(updates) }).catch(() => null);

export const deleteFinishFromRedis = async (id: number): Promise<boolean> => {
  const r = await apiFetch<{ success: boolean }>(`/finishes/${id}`, { method: "DELETE" });
  return r.success;
};

// ============================================
// HERO IMAGES
// ============================================

export const getHeroImagesFromRedis = (): Promise<string[]> =>
  apiFetch<string[]>("/hero-images");

export const setHeroImagesInRedis = (urls: string[]): Promise<string[]> =>
  apiFetch<string[]>("/hero-images", { method: "PUT", body: JSON.stringify({ urls }) });

// ============================================
// CTA IMAGE
// ============================================

export const getCTAImageFromDB = (): Promise<string> =>
  apiFetch<{ url: string }>("/cta-image").then((r) => r.url || "");

export const setCTAImageInDB = (url: string): Promise<string> =>
  apiFetch<{ url: string }>("/cta-image", { method: "PUT", body: JSON.stringify({ url }) }).then((r) => r.url || "");

// ============================================
// CTA IMAGE (MOBILE)
// ============================================

export const getCTAMobileImageFromDB = (): Promise<string> =>
  apiFetch<{ url: string }>("/cta-image-mobile").then((r) => r.url || "");

export const setCTAMobileImageInDB = (url: string): Promise<string> =>
  apiFetch<{ url: string }>("/cta-image-mobile", { method: "PUT", body: JSON.stringify({ url }) }).then((r) => r.url || "");

// ============================================
// OVERVIEW IMAGES
// ============================================

export const getOverviewImagesFromDB = (): Promise<string[]> =>
  apiFetch<string[]>("/overview-images");

export const setOverviewImagesInDB = (urls: string[]): Promise<string[]> =>
  apiFetch<string[]>("/overview-images", { method: "PUT", body: JSON.stringify({ urls }) });

// ============================================
// OVERVIEW BLOCK IMAGES (5 individual block images)
// ============================================

export const getOverviewBlockImagesFromDB = (): Promise<string[]> =>
  apiFetch<string[]>("/overview-block-images");

export const setOverviewBlockImagesInDB = (urls: string[]): Promise<string[]> =>
  apiFetch<string[]>("/overview-block-images", { method: "PUT", body: JSON.stringify(urls) });
