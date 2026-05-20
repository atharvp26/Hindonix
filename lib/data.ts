import {
  getAllProducts,
  addProductToRedis,
  updateProductInRedis,
  deleteProductFromRedis,
  getAllBlogs,
  addBlogToRedis,
  updateBlogInRedis,
  deleteBlogFromRedis,
  getAllTestimonials,
  addTestimonialToRedis,
  updateTestimonialInRedis,
  deleteTestimonialFromRedis,
  getAllCaseStudies,
  addCaseStudyToRedis,
  updateCaseStudyInRedis,
  deleteCaseStudyFromRedis,
  getAllCategories,
  addCategoryToRedis,
  updateCategoryInRedis,
  deleteCategoryFromRedis,
  getAllSubcategories,
  addSubcategoryToRedis,
  updateSubcategoryInRedis,
  deleteSubcategoryFromRedis,
  getAllMaterials,
  addMaterialToRedis,
  updateMaterialInRedis,
  deleteMaterialFromRedis,
  getAllFinishes,
  addFinishToRedis,
  updateFinishInRedis,
  deleteFinishFromRedis,
  getAllFinishCategories,
  addFinishCategoryToRedis,
  updateFinishCategoryInRedis,
  deleteFinishCategoryFromRedis,
  getHeroImagesFromRedis,
  setHeroImagesInRedis,
  getCTAImageFromDB,
  setCTAImageInDB,
  getCTAMobileImageFromDB,
  setCTAMobileImageInDB,
  getOverviewImagesFromDB,
  setOverviewImagesInDB,
  getOverviewBlockImagesFromDB,
  setOverviewBlockImagesInDB,
  getCaseStudyById,
  getProductById,
} from "./api";

// Taxonomy interfaces
export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface Subcategory {
  id: number;
  name: string;
  categoryId: number;
  description?: string;
}

export interface Material {
  id: number;
  name: string;
  categoryId?: number;
  subcategoryId?: number;
  description?: string;
}

export interface FinishCategory {
  id: number;
  name: string;
  description?: string;
}

export interface Finish {
  id: number;
  name: string;
  categoryId: number;
  image: string;
  description?: string;
}

export interface Product {
  id: number;
  name: string;
  series?: string;
  category: string;
  categoryId?: number;
  subcategory?: string;
  subcategoryId?: number;
  material: string;
  materialId?: number;
  description: string;
  modelNumber?: string;
  longDescription?: string;
  image: string;
  images?: string[];
  videos?: string[];
  finishes: string[];
  finishIds?: number[];
}

export interface Blog {
  id: number;
  image: string;
  content: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  location: string;
  content: string;
  image?: string;
  rating?: number;
}

export interface CaseStudy {
  id: number;
  title: string;
  client: string;
  category: string;
  location: string;
  image: string;
  problem: string;
  solution: string;
  outcome: string;
  stats: { label: string; value: string }[];
}

// ============================================
// DATA ACCESS LAYER
// ============================================

export const getProducts = async (): Promise<Product[]> => getAllProducts();
export const addProduct = async (product: Omit<Product, "id">): Promise<Product> => addProductToRedis(product);
export const updateProduct = async (id: number, updates: Partial<Product>): Promise<Product | null> => updateProductInRedis(id, updates);
export const deleteProduct = async (id: number): Promise<boolean> => deleteProductFromRedis(id);

export const getBlogs = async (): Promise<Blog[]> => getAllBlogs();
export const addBlog = async (blog: Omit<Blog, "id">): Promise<Blog> => addBlogToRedis(blog);
export const updateBlog = async (id: number, updates: Partial<Blog>): Promise<Blog | null> => updateBlogInRedis(id, updates);
export const deleteBlog = async (id: number): Promise<boolean> => deleteBlogFromRedis(id);

export const getTestimonials = async (): Promise<Testimonial[]> => getAllTestimonials();
export const addTestimonial = async (testimonial: Omit<Testimonial, "id">): Promise<Testimonial> => addTestimonialToRedis(testimonial);
export const updateTestimonial = async (id: number, updates: Partial<Testimonial>): Promise<Testimonial | null> => updateTestimonialInRedis(id, updates);
export const deleteTestimonial = async (id: number): Promise<boolean> => deleteTestimonialFromRedis(id);

export const getCaseStudies = async (): Promise<CaseStudy[]> => getAllCaseStudies();
export const addCaseStudy = async (caseStudy: Omit<CaseStudy, "id">): Promise<CaseStudy> => addCaseStudyToRedis(caseStudy);
export const updateCaseStudy = async (id: number, updates: Partial<CaseStudy>): Promise<CaseStudy | null> => updateCaseStudyInRedis(id, updates);
export const deleteCaseStudy = async (id: number): Promise<boolean> => deleteCaseStudyFromRedis(id);

export const getHeroImages = async (): Promise<string[]> => getHeroImagesFromRedis();
export const setHeroImages = async (images: string[]): Promise<string[]> => setHeroImagesInRedis(images);

export const getCTAImage = async (): Promise<string> => getCTAImageFromDB();
export const setCTAImage = async (url: string): Promise<string> => setCTAImageInDB(url);

export const getCTAMobileImage = async (): Promise<string> => getCTAMobileImageFromDB();
export const setCTAMobileImage = async (url: string): Promise<string> => setCTAMobileImageInDB(url);

export const getOverviewImages = async (): Promise<string[]> => getOverviewImagesFromDB();
export const setOverviewImages = async (urls: string[]): Promise<string[]> => setOverviewImagesInDB(urls);

export const getOverviewBlockImages = async (): Promise<string[]> => getOverviewBlockImagesFromDB();
export const setOverviewBlockImages = async (urls: string[]): Promise<string[]> => setOverviewBlockImagesInDB(urls);

export const getCategories = async (): Promise<Category[]> => getAllCategories();
export const addCategory = async (category: Omit<Category, "id">): Promise<Category> => addCategoryToRedis(category);
export const updateCategory = async (id: number, updates: Partial<Category>): Promise<Category | null> => updateCategoryInRedis(id, updates);
export const deleteCategory = async (id: number): Promise<boolean> => {
  const products = await getAllProducts();
  const categories = await getAllCategories();
  const categoryName = categories.find((c) => c.id === id)?.name;
  const hasProducts = products.some((p) => p.categoryId === id || (categoryName && p.category === categoryName));
  if (hasProducts) return false;
  const subcategories = await getAllSubcategories();
  const materials = await getAllMaterials();
  await Promise.all(subcategories.filter((s) => s.categoryId === id).map((s) => deleteSubcategoryFromRedis(s.id)));
  await Promise.all(materials.filter((m) => m.categoryId === id).map((m) => deleteMaterialFromRedis(m.id)));
  return deleteCategoryFromRedis(id);
};

export const getSubcategories = async (): Promise<Subcategory[]> => getAllSubcategories();
export const addSubcategory = async (subcategory: Omit<Subcategory, "id">): Promise<Subcategory> => addSubcategoryToRedis(subcategory);
export const updateSubcategory = async (id: number, updates: Partial<Subcategory>): Promise<Subcategory | null> => updateSubcategoryInRedis(id, updates);
export const deleteSubcategory = async (id: number): Promise<boolean> => {
  const products = await getAllProducts();
  const subcategories = await getAllSubcategories();
  const subcategoryName = subcategories.find((s) => s.id === id)?.name;
  const hasProducts = products.some((p) => p.subcategoryId === id || (subcategoryName && p.subcategory === subcategoryName));
  if (hasProducts) return false;
  const materials = await getAllMaterials();
  await Promise.all(materials.filter((m) => m.subcategoryId === id).map((m) => deleteMaterialFromRedis(m.id)));
  return deleteSubcategoryFromRedis(id);
};

export const getMaterials = async (): Promise<Material[]> => getAllMaterials();
export const addMaterial = async (material: Omit<Material, "id">): Promise<Material> => addMaterialToRedis(material);
export const updateMaterial = async (id: number, updates: Partial<Material>): Promise<Material | null> => updateMaterialInRedis(id, updates);
export const deleteMaterial = async (id: number): Promise<boolean> => {
  const products = await getAllProducts();
  const materials = await getAllMaterials();
  const materialName = materials.find((m) => m.id === id)?.name;
  const hasMaterial = products.some((p) => p.materialId === id || (materialName && p.material === materialName));
  if (hasMaterial) return false;
  return deleteMaterialFromRedis(id);
};

export const getFinishes = async (): Promise<Finish[]> => getAllFinishes();
export const addFinish = async (finish: Omit<Finish, "id">): Promise<Finish> => addFinishToRedis(finish);
export const updateFinish = async (id: number, updates: Partial<Finish>): Promise<Finish | null> => updateFinishInRedis(id, updates);
export const deleteFinish = async (id: number): Promise<boolean> => deleteFinishFromRedis(id);

export const getFinishCategories = async (): Promise<FinishCategory[]> => getAllFinishCategories();
export const addFinishCategory = async (category: Omit<FinishCategory, "id">): Promise<FinishCategory> => addFinishCategoryToRedis(category);
export const updateFinishCategory = async (id: number, updates: Partial<FinishCategory>): Promise<FinishCategory | null> => updateFinishCategoryInRedis(id, updates);
export const deleteFinishCategory = async (id: number): Promise<boolean> => {
  const finishes = await getAllFinishes();
  const hasFinishes = finishes.some((f) => f.categoryId === id);
  if (hasFinishes) return false;
  return deleteFinishCategoryFromRedis(id);
};
