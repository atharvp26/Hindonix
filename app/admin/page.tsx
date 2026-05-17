"use client";



import { ImageDisplay } from "@/components/ImageDisplay";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Package,
  FileText,
  Tags,
  Layers,
  Paintbrush,
  Loader2,
  Inbox,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getProducts,
  getBlogs,
  getTestimonials,
  addProduct,
  updateProduct,
  deleteProduct,
  addBlog,
  updateBlog,
  deleteBlog,
  addTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getHeroImages,
  setHeroImages,
  getCTAImage,
  setCTAImage,
  getOverviewImages,
  setOverviewImages,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getSubcategories,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getMaterials,
  addMaterial,
  updateMaterial,
  deleteMaterial,
  getFinishes,
  addFinish,
  updateFinish,
  deleteFinish,
  getFinishCategories,
  addFinishCategory,
  updateFinishCategory,
  deleteFinishCategory,
  type Product,
  type Blog,
  type Testimonial,
  type Category,
  type Subcategory,
  type Material,
  type Finish,
  type FinishCategory,
} from "@/lib/data";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const productCategories = ["Knob", "Door Handle"];
const materials = ["Stainless Steel", "Brass"];
const doorHandleSubcategories = ["Cabinet Handle", "Door Handle"];

const availableFinishes = [
  "Brass",
  "Polished Stainless Steel",
  "PVD Satin Black",
  "PVD Satin Gold",
  "PVD Satin Bronze",
  "PVD Satin Nickel",
  "PVD Polished Copper",
  "PVD Satin Stainless Steel",
  "Satin Black",
  "Satin Stainless Steel",
  "Satin Nickel",
];

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  // Taxonomy state
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [materialsList, setMaterialsList] = useState<Material[]>([]);
  const [finishesList, setFinishesList] = useState<Finish[]>([]);
  const [finishCategoriesList, setFinishCategoriesList] = useState<
    FinishCategory[]
  >([]);

  const [heroImages, setHeroImagesState] = useState<string[]>([]);
  const [selectedHeroImages, setSelectedHeroImages] = useState<string[]>([]);

  const [ctaImage, setCTAImageState] = useState<string>("");
  const [ctaImageFile, setCTAImageFile] = useState<File | null>(null);
  const [ctaImagePreview, setCTAImagePreview] = useState<string>("");

  const [overviewImages, setOverviewImagesState] = useState<string[]>([]);
  const [selectedOverviewImages, setSelectedOverviewImages] = useState<string[]>([]);
  const [overviewImageFiles, setOverviewImageFiles] = useState<File[]>([]);

  // Controlled tabs state to persist current selection
  const [mainTab, setMainTab] = useState<string>("products");
  const [taxonomyTab, setTaxonomyTab] = useState<string>("categories");

  // Inquiries
  interface Inquiry {
    id: number;
    name: string;
    email: string;
    phone: string;
    company?: string;
    country: string;
    city: string;
    product?: string;
    subject?: string;
    message: string;
    submission_id?: string;
    created_at: string;
  }
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [expandedInquiry, setExpandedInquiry] = useState<number | null>(null);

  // Role gate
  const [roleChecked, setRoleChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Users management
  interface AppUser {
    id: number;
    clerk_id: string;
    email: string;
    name?: string;
    role: "user" | "admin";
    created_at: string;
    last_login: string;
  }
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [roleUpdating, setRoleUpdating] = useState<string | null>(null);

  // Loading and uploading states
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Dialog states
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [blogDialogOpen, setBlogDialogOpen] = useState(false);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [finishCategoryDialogOpen, setFinishCategoryDialogOpen] =
    useState(false);

  // Editing states
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingSubcategory, setEditingSubcategory] =
    useState<Subcategory | null>(null);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [editingFinish, setEditingFinish] = useState<Finish | null>(null);
  const [editingFinishCategory, setEditingFinishCategory] =
    useState<FinishCategory | null>(null);

  // Image file states
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [productExtraImageFiles, setProductExtraImageFiles] = useState<File[]>([]);
  const [productVideoFiles, setProductVideoFiles] = useState<File[]>([]);
  const [blogImageFile, setBlogImageFile] = useState<File | null>(null);
  const [testimonialImageFile, setTestimonialImageFile] = useState<File | null>(
    null
  );
  const [heroImageFiles, setHeroImageFiles] = useState<File[]>([]);
  const [finishImageFile, setFinishImageFile] = useState<File | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  // Role gate check on mount
  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((user) => {
        if (user?.role === "admin") {
          setIsAdmin(true);
        } else {
          router.replace("/");
        }
        setRoleChecked(true);
      })
      .catch(() => router.replace("/"));
  }, []);

  // Load data on component mount
  useEffect(() => {
    const reloadData = async () => {
      try {
        setLoading(true);
        const [
          productsData,
          blogsData,
          testimonialsData,
          categoriesData,
          subcategoriesData,
          materialsData,
          finishesData,
          finishCategoriesData,
          heroImagesData,
          ctaImageData,
          overviewImagesData,
        ] = await Promise.all([
          getProducts(),
          getBlogs(),
          getTestimonials(),
          getCategories(),
          getSubcategories(),
          getMaterials(),
          getFinishes(),
          getFinishCategories(),
          getHeroImages(),
          getCTAImage(),
          getOverviewImages(),
        ]);

        setProducts(productsData);
        setBlogs(blogsData);
        setTestimonials(testimonialsData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setMaterialsList(materialsData);
        setFinishesList(finishesData);
        setFinishCategoriesList(finishCategoriesData);
        setHeroImagesState(heroImagesData);
        setSelectedHeroImages(heroImagesData);
        setCTAImageState(ctaImageData);
        setCTAImagePreview(ctaImageData);
        setOverviewImagesState(overviewImagesData);
        setSelectedOverviewImages(overviewImagesData);
      } catch (error) {
        console.error("Error loading data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    // Reload on mount
    reloadData();

    // Listen for storage changes from other tabs/windows
    window.addEventListener("storage", reloadData);

    // Custom event for same-tab updates
    window.addEventListener("dataUpdated", reloadData);

    return () => {
      window.removeEventListener("storage", reloadData);
      window.removeEventListener("dataUpdated", reloadData);
    };
  }, []);

  // Product form state
  const [productForm, setProductForm] = useState({
    name: "",
    series: "",
    categoryId: undefined as number | undefined,
    subcategoryId: undefined as number | undefined,
    materialId: undefined as number | undefined,
    description: "",
    modelNumber: "",
    longDescription: "",
    image: "",
    images: [] as string[],
    videos: [] as string[],
    finishIds: [] as number[],
  });

  // Blog form state
  const [blogForm, setBlogForm] = useState({
    image: "",
    content: "",
  });

  // Testimonial form state
  const [testimonialForm, setTestimonialForm] = useState({
    name: "",
    role: "",
    company: "",
    location: "",
    content: "",
    image: "",
    rating: 5,
  });

  // Taxonomy form states
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  });

  const [subcategoryForm, setSubcategoryForm] = useState({
    name: "",
    categoryId: 0,
    description: "",
  });

  const [materialForm, setMaterialForm] = useState({
    name: "",
    categoryId: undefined as number | undefined,
    subcategoryId: undefined as number | undefined,
    description: "",
  });

  const [finishForm, setFinishForm] = useState({
    name: "",
    categoryId: 0,
    image: "",
    description: "",
  });

  const [finishCategoryForm, setFinishCategoryForm] = useState({
    name: "",
    description: "",
  });

  // Image upload handlers with Cloudinary
  const handleProductImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        setProductImageFile(file);
        const response = await uploadImageToCloudinary(file);
        setProductForm({ ...productForm, image: response.secure_url });
        toast({
          title: "Image Uploaded",
          description: "Product image uploaded successfully.",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleProductExtraImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploading(true);
      setProductExtraImageFiles(files);
      const urls: string[] = [];
      for (const file of files) {
        const res = await uploadImageToCloudinary(file);
        urls.push(res.secure_url);
      }
      setProductForm((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
      toast({ title: "Images Uploaded", description: `${files.length} image(s) added.` });
    } catch {
      toast({ title: "Upload Error", description: "Failed to upload images.", variant: "destructive" });
    } finally { setUploading(false); }
  };

  const handleProductVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    try {
      setUploading(true);
      setProductVideoFiles(files);
      const urls: string[] = [];
      for (const file of files) {
        const res = await uploadImageToCloudinary(file);
        urls.push(res.secure_url);
      }
      setProductForm((prev) => ({ ...prev, videos: [...prev.videos, ...urls] }));
      toast({ title: "Videos Uploaded", description: `${files.length} video(s) added.` });
    } catch {
      toast({ title: "Upload Error", description: "Failed to upload videos.", variant: "destructive" });
    } finally { setUploading(false); }
  };

  const handleBlogImageUpload = async (    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        setBlogImageFile(file);
        const response = await uploadImageToCloudinary(file);
        setBlogForm({ ...blogForm, image: response.secure_url });
        toast({
          title: "Image Uploaded",
          description: "Blog image uploaded successfully.",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleTestimonialImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        setTestimonialImageFile(file);
        const response = await uploadImageToCloudinary(file);
        setTestimonialForm({ ...testimonialForm, image: response.secure_url });
        toast({
          title: "Image Uploaded",
          description: "Testimonial image uploaded successfully.",
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  // Hero Image handler
  const handleHeroImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      setHeroImageFiles(files);
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const response = await uploadImageToCloudinary(file);
        uploadedUrls.push(response.secure_url);
      }
      setSelectedHeroImages((prev) => [...prev, ...uploadedUrls]);
      toast({
        title: "Images Uploaded",
        description: `${files.length} image(s) uploaded to Cloudinary. Click "Update Hero Images" to save.`,
      });
    } catch (error) {
      console.error("Error uploading hero images:", error);
      toast({
        title: "Cloudinary Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload image(s).",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveHeroImages = async () => {
    if (selectedHeroImages.length > 0) {
      try {
        setUploading(true);
        await setHeroImages(selectedHeroImages);
        setHeroImagesState(selectedHeroImages);
        toast({
          title: "Hero Images Updated",
          description: "The hero images have been successfully saved.",
        });
        window.dispatchEvent(new Event("heroImageUpdated"));
      } catch (error) {
        console.error("Error saving hero images:", error);
        toast({
          title: "Save Error",
          description: error instanceof Error ? error.message : "Failed to save hero images.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Please upload at least one image.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveHeroImage = (index: number) => {
    setSelectedHeroImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAllHeroImages = () => {
    setSelectedHeroImages([]);
  };

  // CTA Image handlers
  const handleCTAImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading(true);
      setCTAImageFile(file);
      const response = await uploadImageToCloudinary(file);
      setCTAImagePreview(response.secure_url);
      toast({
        title: "Image Uploaded",
        description: "CTA background image uploaded. Click \"Save CTA Image\" to apply.",
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveCTAImage = async () => {
    if (!ctaImagePreview) {
      toast({ title: "Error", description: "Please upload an image first.", variant: "destructive" });
      return;
    }
    try {
      setUploading(true);
      await setCTAImage(ctaImagePreview);
      setCTAImageState(ctaImagePreview);
      toast({ title: "CTA Image Saved", description: "The CTA background image has been updated." });
      window.dispatchEvent(new Event("ctaImageUpdated"));
    } catch (error) {
      toast({
        title: "Save Error",
        description: error instanceof Error ? error.message : "Failed to save CTA image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveCTAImage = async () => {
    try {
      setUploading(true);
      await setCTAImage("");
      setCTAImageState("");
      setCTAImagePreview("");
      setCTAImageFile(null);
      toast({ title: "CTA Image Removed", description: "Background image removed from CTA section." });
      window.dispatchEvent(new Event("ctaImageUpdated"));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to remove CTA image.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Overview Images handlers
  const handleOverviewImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    try {
      setUploading(true);
      setOverviewImageFiles(files);
      const uploadedUrls: string[] = [];
      for (const file of files) {
        const response = await uploadImageToCloudinary(file);
        uploadedUrls.push(response.secure_url);
      }
      setSelectedOverviewImages((prev) => [...prev, ...uploadedUrls]);
      toast({
        title: "Images Uploaded",
        description: `${files.length} image(s) uploaded. Click "Save Overview Images" to apply.`,
      });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload image(s).",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveOverviewImages = async () => {
    try {
      setUploading(true);
      await setOverviewImages(selectedOverviewImages);
      setOverviewImagesState(selectedOverviewImages);
      toast({ title: "Overview Images Saved", description: "The overview background images have been updated." });
      window.dispatchEvent(new Event("overviewImagesUpdated"));
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save overview images.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveOverviewImage = (index: number) => {
    setSelectedOverviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAllOverviewImages = () => {
    setSelectedOverviewImages([]);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setProductImageFile(null);
    setProductExtraImageFiles([]);
    setProductVideoFiles([]);
    setProductForm({
      name: "",
      series: "",
      categoryId: undefined,
      subcategoryId: undefined,
      materialId: undefined,
      description: "",
      modelNumber: "",
      longDescription: "",
      image: "",
      images: [],
      videos: [],
      finishIds: [],
    });
    setProductDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    // Map existing string-based fields to IDs when possible
    const categoryId =
      product.categoryId ??
      categories.find((c) => c.name === product.category)?.id;
    const subcategoryId =
      product.subcategoryId ??
      (product.subcategory
        ? subcategories.find((s) => s.name === product.subcategory)?.id
        : undefined);
    const materialId =
      product.materialId ??
      materialsList.find((m) => m.name === product.material)?.id;
    const finishIds =
      product.finishIds ??
      (product.finishes
        ? product.finishes
            .map((name) => {
              const f = finishesList.find((x) => x.name === name);
              return f?.id;
            })
            .filter((id): id is number => !!id)
        : []);

    setProductForm({
      name: product.name,
      series: product.series || "",
      categoryId,
      subcategoryId,
      materialId,
      description: product.description,
      modelNumber: product.modelNumber || "",
      longDescription: product.longDescription || "",
      image: product.image,
      images: product.images || [],
      videos: product.videos || [],
      finishIds,
    });
    setProductDialogOpen(true);
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        setLoading(true);
        const success = await deleteProduct(id);
        if (!success) {
          toast({
            title: "Error",
            description: "Failed to delete product from database.",
            variant: "destructive",
          });
          return;
        }
        const updatedProducts = await getProducts();
        setProducts(updatedProducts);
        toast({
          title: "Product Deleted",
          description: "The product has been successfully deleted.",
        });
      } catch (error: any) {
        console.error("Error deleting product:", error);
        toast({
          title: "Error",
          description: error?.message || "Failed to delete product. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveProduct = async () => {
    if (
      !productForm.name ||
      !productForm.categoryId ||
      !productForm.materialId ||
      !productForm.description
    ) {
      toast({
        title: "Validation Error",
        description:
          "Please fill in all required fields (name, category, material, description).",
        variant: "destructive",
      });
      return;
    }

    // Validate subcategory if selected category has subcategories
    const selectedCategory = categories.find(
      (c) => c.id === productForm.categoryId
    );
    const hasSubcategories =
      selectedCategory &&
      subcategories.some((sub) => sub.categoryId === selectedCategory.id);

    if (hasSubcategories && !productForm.subcategoryId) {
      toast({
        title: "Validation Error",
        description: "Please select a subcategory for this category.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      if (editingProduct) {
        // Derive string fields from IDs for backward compatibility
        const catName =
          categories.find((c) => c.id === productForm.categoryId)?.name || "";
        const subName = productForm.subcategoryId
          ? subcategories.find((s) => s.id === productForm.subcategoryId)
              ?.name || ""
          : "";
        const matName =
          materialsList.find((m) => m.id === productForm.materialId)?.name ||
          "";
        const finishNames = productForm.finishIds
          .map((id) => finishesList.find((f) => f.id === id)?.name || "")
          .filter((n) => !!n);

        await updateProduct(editingProduct.id, {
          name: productForm.name,
          series: productForm.series || undefined,
          categoryId: productForm.categoryId,
          subcategoryId: productForm.subcategoryId,
          materialId: productForm.materialId,
          description: productForm.description,
          modelNumber: productForm.modelNumber,
          longDescription: productForm.longDescription,
          image: productForm.image,
          images: productForm.images,
          videos: productForm.videos,
          finishIds: productForm.finishIds,
          // legacy string fields
          category: catName,
          subcategory: subName || undefined,
          material: matName,
          finishes: finishNames,
        });
        toast({
          title: "Product Updated",
          description: "The product has been successfully updated.",
        });
      } else {
        const catName =
          categories.find((c) => c.id === productForm.categoryId)?.name || "";
        const subName = productForm.subcategoryId
          ? subcategories.find((s) => s.id === productForm.subcategoryId)
              ?.name || ""
          : "";
        const matName =
          materialsList.find((m) => m.id === productForm.materialId)?.name ||
          "";
        const finishNames = productForm.finishIds
          .map((id) => finishesList.find((f) => f.id === id)?.name || "")
          .filter((n) => !!n);

        await addProduct({
          name: productForm.name,
          series: productForm.series || undefined,
          categoryId: productForm.categoryId!,
          subcategoryId: productForm.subcategoryId,
          materialId: productForm.materialId!,
          description: productForm.description,
          modelNumber: productForm.modelNumber,
          longDescription: productForm.longDescription,
          image: productForm.image,
          images: productForm.images,
          videos: productForm.videos,
          finishIds: productForm.finishIds,
          // legacy string fields
          category: catName,
          subcategory: subName || undefined,
          material: matName,
          finishes: finishNames,
        });
        toast({
          title: "Product Added",
          description: "The product has been successfully added.",
        });
      }

      const updatedProducts = await getProducts();
      setProducts(updatedProducts);
      setProductDialogOpen(false);
      setProductImageFile(null);
      setProductExtraImageFiles([]);
      setProductVideoFiles([]);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Blog handlers
  const handleAddBlog = () => {
    setEditingBlog(null);
    setBlogImageFile(null);
    setBlogForm({
      image: "",
      content: "",
    });
    setBlogDialogOpen(true);
  };

  // Testimonial handlers
  const handleAddTestimonial = () => {
    setEditingTestimonial(null);
    setTestimonialImageFile(null);
    setTestimonialForm({
      name: "",
      role: "",
      company: "",
      location: "",
      content: "",
      image: "",
      rating: 5,
    });
    setTestimonialDialogOpen(true);
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setTestimonialForm({
      name: testimonial.name,
      role: testimonial.role,
      company: testimonial.company,
      location: testimonial.location,
      content: testimonial.content,
      image: testimonial.image || "",
      rating: testimonial.rating || 5,
    });
    setTestimonialDialogOpen(true);
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this testimonial?")) {
      try {
        setLoading(true);
        await deleteTestimonial(id);
        const updatedTestimonials = await getTestimonials();
        setTestimonials(updatedTestimonials);
        toast({
          title: "Testimonial Deleted",
          description: "The testimonial has been successfully deleted.",
        });
      } catch (error: any) {
        console.error("Error deleting testimonial:", error);
        toast({
          title: "Error",
          description: error?.message || "Failed to delete testimonial. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditBlog = (blog: Blog) => {
    setEditingBlog(blog);
    setBlogForm({
      image: blog.image,
      content: blog.content,
    });
    setBlogDialogOpen(true);
  };

  const handleDeleteBlog = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        setLoading(true);
        await deleteBlog(id);
        const updatedBlogs = await getBlogs();
        setBlogs(updatedBlogs);
        toast({
          title: "Blog Deleted",
          description: "The blog has been successfully deleted.",
        });
      } catch (error: any) {
        console.error("Error deleting blog:", error);
        toast({
          title: "Error",
          description: error?.message || "Failed to delete blog. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveBlog = async () => {
    if (!blogForm.image || !blogForm.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      if (editingBlog) {
        await updateBlog(editingBlog.id, {
          image: blogForm.image,
          content: blogForm.content,
        });
        toast({
          title: "Blog Updated",
          description: "The blog has been successfully updated.",
        });
      } else {
        await addBlog({
          image: blogForm.image,
          content: blogForm.content,
        });
        toast({
          title: "Blog Added",
          description: "The blog has been successfully added.",
        });
      }

      const updatedBlogs = await getBlogs();
      setBlogs(updatedBlogs);
      setBlogDialogOpen(false);
      setBlogImageFile(null);
    } catch (error) {
      console.error("Error saving blog:", error);
      toast({
        title: "Error",
        description: "Failed to save blog. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTestimonial = async () => {
    if (
      !testimonialForm.name ||
      !testimonialForm.role ||
      !testimonialForm.company ||
      !testimonialForm.location ||
      !testimonialForm.content
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      if (editingTestimonial) {
        await updateTestimonial(editingTestimonial.id, {
          name: testimonialForm.name,
          role: testimonialForm.role,
          company: testimonialForm.company,
          location: testimonialForm.location,
          content: testimonialForm.content,
          image: testimonialForm.image || undefined,
          rating: testimonialForm.rating,
        });
        toast({
          title: "Testimonial Updated",
          description: "The testimonial has been successfully updated.",
        });
      } else {
        await addTestimonial({
          name: testimonialForm.name,
          role: testimonialForm.role,
          company: testimonialForm.company,
          location: testimonialForm.location,
          content: testimonialForm.content,
          image: testimonialForm.image || undefined,
          rating: testimonialForm.rating,
        });
        toast({
          title: "Testimonial Added",
          description: "The testimonial has been successfully added.",
        });
      }

      const updatedTestimonials = await getTestimonials();
      setTestimonials(updatedTestimonials);
      setTestimonialDialogOpen(false);
      setTestimonialImageFile(null);
    } catch (error) {
      console.error("Error saving testimonial:", error);
      toast({
        title: "Error",
        description: "Failed to save testimonial. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // Taxonomy Management Handlers
  // ========================================

  // Category handlers
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({ name: "", description: "" });
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      description: category.description || "",
    });
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = async (id: number) => {
    if (
      window.confirm(
        "Are you sure? This will also delete related subcategories and materials if they have no products."
      )
    ) {
      try {
        setLoading(true);
        const success = await deleteCategory(id);
        if (success) {
          const [categoriesData, subcategoriesData, materialsData] =
            await Promise.all([
              getCategories(),
              getSubcategories(),
              getMaterials(),
            ]);
          setCategories(categoriesData);
          setSubcategories(subcategoriesData);
          setMaterialsList(materialsData);
          toast({
            title: "Category Deleted",
            description: "The category and related items have been deleted.",
          });
        } else {
          toast({
            title: "Cannot Delete",
            description:
              "This category has products. Please reassign or delete products first.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        toast({
          title: "Error",
          description: "Failed to delete category. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
        toast({
          title: "Category Updated",
          description: "The category has been updated.",
        });
      } else {
        await addCategory(categoryForm);
        toast({
          title: "Category Added",
          description: "The category has been added.",
        });
      }

      const categoriesData = await getCategories();
      setCategories(categoriesData);
      setCategoryDialogOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Subcategory handlers
  const handleAddSubcategory = () => {
    setEditingSubcategory(null);
    setSubcategoryForm({
      name: "",
      categoryId: categories[0]?.id || 0,
      description: "",
    });
    setSubcategoryDialogOpen(true);
  };

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryForm({
      name: subcategory.name,
      categoryId: subcategory.categoryId,
      description: subcategory.description || "",
    });
    setSubcategoryDialogOpen(true);
  };

  const handleDeleteSubcategory = async (id: number) => {
    if (
      window.confirm(
        "Are you sure? This will also delete related materials if they have no products."
      )
    ) {
      try {
        setLoading(true);
        const success = await deleteSubcategory(id);
        if (success) {
          const [subcategoriesData, materialsData] = await Promise.all([
            getSubcategories(),
            getMaterials(),
          ]);
          setSubcategories(subcategoriesData);
          setMaterialsList(materialsData);
          toast({
            title: "Subcategory Deleted",
            description: "The subcategory has been deleted.",
          });
        } else {
          toast({
            title: "Cannot Delete",
            description:
              "This subcategory has products. Please reassign or delete products first.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting subcategory:", error);
        toast({
          title: "Error",
          description: "Failed to delete subcategory. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveSubcategory = async () => {
    if (!subcategoryForm.name || !subcategoryForm.categoryId) {
      toast({
        title: "Validation Error",
        description: "Please enter a name and select a category.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      if (editingSubcategory) {
        await updateSubcategory(editingSubcategory.id, subcategoryForm);
        toast({
          title: "Subcategory Updated",
          description: "The subcategory has been updated.",
        });
      } else {
        await addSubcategory(subcategoryForm);
        toast({
          title: "Subcategory Added",
          description: "The subcategory has been added.",
        });
      }

      const subcategoriesData = await getSubcategories();
      setSubcategories(subcategoriesData);
      setSubcategoryDialogOpen(false);
    } catch (error) {
      console.error("Error saving subcategory:", error);
      toast({
        title: "Error",
        description: "Failed to save subcategory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Material handlers
  const handleAddMaterial = () => {
    setEditingMaterial(null);
    setMaterialForm({
      name: "",
      categoryId: undefined,
      subcategoryId: undefined,
      description: "",
    });
    setMaterialDialogOpen(true);
  };

  const handleEditMaterial = (material: Material) => {
    setEditingMaterial(material);
    setMaterialForm({
      name: material.name,
      categoryId: material.categoryId,
      subcategoryId: material.subcategoryId,
      description: material.description || "",
    });
    setMaterialDialogOpen(true);
  };

  const handleDeleteMaterial = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        setLoading(true);
        const success = await deleteMaterial(id);
        if (success) {
          const materialsData = await getMaterials();
          setMaterialsList(materialsData);
          toast({
            title: "Material Deleted",
            description: "The material has been deleted.",
          });
        } else {
          toast({
            title: "Cannot Delete",
            description:
              "This material has products. Please reassign or delete products first.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting material:", error);
        toast({
          title: "Error",
          description: "Failed to delete material. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveMaterial = async () => {
    if (!materialForm.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a material name.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      if (editingMaterial) {
        await updateMaterial(editingMaterial.id, materialForm);
        toast({
          title: "Material Updated",
          description: "The material has been updated.",
        });
      } else {
        await addMaterial(materialForm);
        toast({
          title: "Material Added",
          description: "The material has been added.",
        });
      }

      const materialsData = await getMaterials();
      setMaterialsList(materialsData);
      setMaterialDialogOpen(false);
    } catch (error) {
      console.error("Error saving material:", error);
      toast({
        title: "Error",
        description: "Failed to save material. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Finish handlers
  const handleAddFinish = () => {
    setEditingFinish(null);
    setFinishImageFile(null);
    setFinishForm({
      name: "",
      categoryId: finishCategoriesList[0]?.id || 0,
      image: "",
      description: "",
    });
    setFinishDialogOpen(true);
  };

  const handleEditFinish = (finish: Finish) => {
    setEditingFinish(finish);
    setFinishForm({
      name: finish.name,
      categoryId: finish.categoryId,
      image: finish.image,
      description: finish.description || "",
    });
    setFinishDialogOpen(true);
  };

  const handleDeleteFinish = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this finish?")) {
      try {
        setLoading(true);
        await deleteFinish(id);
        const finishesData = await getFinishes();
        setFinishesList(finishesData);
        toast({
          title: "Finish Deleted",
          description: "The finish has been deleted.",
        });
      } catch (error) {
        console.error("Error deleting finish:", error);
        toast({
          title: "Error",
          description: "Failed to delete finish. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFinishImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setUploading(true);
        setFinishImageFile(file);
        const response = await uploadImageToCloudinary(file);
        setFinishForm({ ...finishForm, image: response.secure_url });
        toast({
          title: "Image Uploaded",
          description: "Finish image uploaded successfully.",
        });
      } catch (error) {
        console.error("Error uploading finish image:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSaveFinish = async () => {
    if (!finishForm.name || !finishForm.categoryId || !finishForm.image) {
      toast({
        title: "Validation Error",
        description:
          "Please enter a name, select a category, and upload an image.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      if (editingFinish) {
        await updateFinish(editingFinish.id, finishForm);
        toast({
          title: "Finish Updated",
          description: "The finish has been updated.",
        });
      } else {
        await addFinish(finishForm);
        toast({
          title: "Finish Added",
          description: "The finish has been added.",
        });
      }

      const finishesData = await getFinishes();
      setFinishesList(finishesData);
      setFinishDialogOpen(false);
      setFinishImageFile(null);
    } catch (error) {
      console.error("Error saving finish:", error);
      toast({
        title: "Error",
        description: "Failed to save finish. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Finish Category handlers
  const handleAddFinishCategory = () => {
    setEditingFinishCategory(null);
    setFinishCategoryForm({ name: "", description: "" });
    setFinishCategoryDialogOpen(true);
  };

  const handleEditFinishCategory = (category: FinishCategory) => {
    setEditingFinishCategory(category);
    setFinishCategoryForm({
      name: category.name,
      description: category.description || "",
    });
    setFinishCategoryDialogOpen(true);
  };

  const handleDeleteFinishCategory = async (id: number) => {
    if (
      window.confirm(
        "Are you sure? This will prevent deleting if finishes exist in this category."
      )
    ) {
      try {
        setLoading(true);
        const success = await deleteFinishCategory(id);
        if (success) {
          const finishCategoriesData = await getFinishCategories();
          setFinishCategoriesList(finishCategoriesData);
          toast({
            title: "Finish Category Deleted",
            description: "The finish category has been deleted.",
          });
        } else {
          toast({
            title: "Cannot Delete",
            description:
              "This finish category has finishes. Please reassign or delete finishes first.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error deleting finish category:", error);
        toast({
          title: "Error",
          description: "Failed to delete finish category. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveFinishCategory = async () => {
    if (!finishCategoryForm.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      if (editingFinishCategory) {
        await updateFinishCategory(
          editingFinishCategory.id,
          finishCategoryForm
        );
        toast({
          title: "Category Updated",
          description: "The finish category has been updated.",
        });
      } else {
        await addFinishCategory(finishCategoryForm);
        toast({
          title: "Category Added",
          description: "The finish category has been added.",
        });
      }

      const finishCategoriesData = await getFinishCategories();
      setFinishCategoriesList(finishCategoriesData);
      setFinishCategoryDialogOpen(false);
    } catch (error) {
      console.error("Error saving finish category:", error);
      toast({
        title: "Error",
        description: "Failed to save finish category. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading admin data...</p>
          </div>
        </div>
        
      </main>
    );
  }

  if (!roleChecked || !isAdmin) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      

      {/* Hero Section */}
      <section className="pt-32 pb-12 gradient-hero">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
              Admin Dashboard
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Manage products and blogs
            </p>
          </div>
        </div>
      </section>

      {/* Admin Content */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Hero Images Management */}
          <div className="mb-12 bg-card rounded-xl p-8 border border-border/50">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-6">
              Manage Hero Images
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="hero-image">Hero Images</Label>
                <Input
                  id="hero-image"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleHeroImageUpload}
                  disabled={uploading}
                  className="cursor-pointer mt-2"
                />
                {uploading && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading to Cloudinary...
                  </div>
                )}
                {selectedHeroImages.length > 0 && !uploading && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    ✓ {selectedHeroImages.length} image(s) ready
                  </p>
                )}
                {heroImages.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Current: {heroImages.length} image(s)
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleSaveHeroImages}
                    disabled={selectedHeroImages.length === 0 || uploading}
                  >
                    {uploading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                    ) : "Update Hero Images"}
                  </Button>
                  {selectedHeroImages.length > 0 && (
                    <Button
                      onClick={handleClearAllHeroImages}
                      variant="outline"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <Label>Preview</Label>
                <div className="mt-2 bg-secondary rounded-lg overflow-hidden h-48">
                  {selectedHeroImages.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No images selected
                    </div>
                  ) : selectedHeroImages.length === 1 ? (
                    <ImageDisplay
                      src={selectedHeroImages[0]}
                      alt="Hero Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex w-full h-full overflow-x-auto gap-2 p-2">
                      {selectedHeroImages.map((url, idx) => (
                        <div key={idx} className="relative group h-full flex-shrink-0">
                          <img src={url} alt={`Preview ${idx + 1}`} className="h-full object-cover rounded-md" />
                          <button
                            onClick={() => handleRemoveHeroImage(idx)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Remove image"
                          >
                            Ã—
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section Background Image */}
          <div className="mb-12 bg-card rounded-xl p-8 border border-border/50">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
              CTA Section Background Image
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Upload a background image for the &ldquo;Ready to Elevate Your Next Project?&rdquo; section.
              Recommended size: <strong>1920 × 600 px</strong>. A dark overlay is applied automatically so all text stays readable.
            </p>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="cta-image">Background Image</Label>
                <Input
                  id="cta-image"
                  type="file"
                  accept="image/*"
                  onChange={handleCTAImageUpload}
                  disabled={uploading}
                  className="cursor-pointer mt-2"
                />
                {uploading && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading to Cloudinary...
                  </div>
                )}
                {ctaImagePreview && !uploading && (
                  <p className="text-sm text-green-600 mt-2 font-medium">✓ Image ready to save</p>
                )}
                {ctaImage && (
                  <p className="text-sm text-muted-foreground mt-1">Current: image set</p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleSaveCTAImage}
                    disabled={!ctaImagePreview || uploading}
                  >
                    {uploading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                    ) : "Save CTA Image"}
                  </Button>
                  {ctaImage && (
                    <Button variant="outline" onClick={handleRemoveCTAImage} disabled={uploading}>
                      Remove Image
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <Label>Preview</Label>
                <div className="mt-2 rounded-lg overflow-hidden h-36 relative" style={{ backgroundColor: "#1a1a1a" }}>
                  {ctaImagePreview ? (
                    <>
                      <img src={ctaImagePreview} alt="CTA Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ backgroundColor: "rgba(0,0,0,0.60)" }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <p className="text-white text-xs tracking-widest uppercase opacity-70">CTA Section Preview</p>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No image set (dark background will be used)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Overview Images Slideshow (between Testimonials and CTA) */}
          <div className="mb-12 bg-card rounded-xl p-8 border border-border/50">
            <h2 className="font-heading text-2xl font-bold text-foreground mb-2">
              Overview Section Background Images
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Upload background images displayed as a slideshow between the &ldquo;Client Testimonials&rdquo; and &ldquo;Ready to Elevate Your Next Project?&rdquo; sections.
              Recommended size: <strong>1920 × 800 px (Landscape)</strong>. Images auto-advance every 2.5 seconds.
            </p>
            <div className="grid lg:grid-cols-2 gap-8">
              <div>
                <Label htmlFor="overview-image">Background Images</Label>
                <Input
                  id="overview-image"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleOverviewImageUpload}
                  disabled={uploading}
                  className="cursor-pointer mt-2"
                />
                {uploading && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-primary">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading to Cloudinary...
                  </div>
                )}
                {selectedOverviewImages.length > 0 && !uploading && (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    ✓ {selectedOverviewImages.length} image(s) ready
                  </p>
                )}
                {overviewImages.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Current: {overviewImages.length} image(s)
                  </p>
                )}
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={handleSaveOverviewImages}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                    ) : "Save Overview Images"}
                  </Button>
                  {selectedOverviewImages.length > 0 && (
                    <Button onClick={handleClearAllOverviewImages} variant="outline">
                      Clear All
                    </Button>
                  )}
                </div>
              </div>
              <div>
                <Label>Preview</Label>
                <div className="mt-2 bg-secondary rounded-lg overflow-hidden h-48">
                  {selectedOverviewImages.length === 0 ? (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No images selected (section will be hidden)
                    </div>
                  ) : selectedOverviewImages.length === 1 ? (
                    <ImageDisplay
                      src={selectedOverviewImages[0]}
                      alt="Overview Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex w-full h-full overflow-x-auto gap-2 p-2">
                      {selectedOverviewImages.map((url, idx) => (
                        <div key={idx} className="relative group h-full flex-shrink-0">
                          <img src={url} alt={`Preview ${idx + 1}`} className="h-full object-cover rounded-md" />
                          <button
                            onClick={() => handleRemoveOverviewImage(idx)}
                            className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                            title="Remove image"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <Tabs value={mainTab} onValueChange={setMainTab} className="w-full">
            <TabsList className="grid w-full max-w-4xl mx-auto grid-cols-6 mb-8">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="taxonomy">Taxonomy</TabsTrigger>
              <TabsTrigger value="blogs">Blogs</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="inquiries" onClick={() => {
                if (inquiries.length === 0) {
                  setInquiriesLoading(true);
                  fetch("/api/inquiries").then(r => r.json()).then(data => {
                    setInquiries(Array.isArray(data) ? data : []);
                  }).catch(console.error).finally(() => setInquiriesLoading(false));
                }
              }}>Inquiries</TabsTrigger>
              <TabsTrigger value="users" onClick={() => {
                setUsersLoading(true);
                fetch("/api/users").then(r => r.json()).then(data => {
                  setAppUsers(Array.isArray(data) ? data : []);
                }).catch(console.error).finally(() => setUsersLoading(false));
              }}>Users</TabsTrigger>
            </TabsList>

            {/* Products Tab */}
            <TabsContent value="products">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Manage Products
                </h2>
                <Button onClick={handleAddProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </div>

              <div className="grid gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-xl p-6 border border-border/50 flex items-start gap-4"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                      <ImageDisplay
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {(product.categoryId
                          ? categories.find((c) => c.id === product.categoryId)
                              ?.name
                          : product.category) || ""}
                        {(() => {
                          const subName = product.subcategoryId
                            ? subcategories.find(
                                (s) => s.id === product.subcategoryId
                              )?.name
                            : product.subcategory;
                          return subName ? ` â€¢ ${subName}` : "";
                        })()}
                        {(() => {
                          const matName = product.materialId
                            ? materialsList.find(
                                (m) => m.id === product.materialId
                              )?.name
                            : product.material;
                          return matName ? ` â€¢ ${matName}` : "";
                        })()}
                      </p>
                      <p className="text-sm text-foreground">
                        {product.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(product.finishIds && product.finishIds.length > 0
                          ? product.finishIds
                              .map(
                                (id) =>
                                  finishesList.find((f) => f.id === id)?.name
                              )
                              .filter((n): n is string => !!n)
                          : product.finishes || []
                        ).map((finish, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-secondary rounded text-secondary-foreground"
                          >
                            {finish}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-black text-black"
                        onClick={() => handleEditProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Taxonomy Tab */}
            <TabsContent value="taxonomy">
              <Tabs
                value={taxonomyTab}
                onValueChange={setTaxonomyTab}
                className="w-full"
              >
                <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-5 mb-8">
                  <TabsTrigger value="categories">Categories</TabsTrigger>
                  <TabsTrigger value="subcategories">Subcategories</TabsTrigger>
                  <TabsTrigger value="materials">Materials</TabsTrigger>
                  <TabsTrigger value="finish-categories">
                    Finish Categories
                  </TabsTrigger>
                  <TabsTrigger value="finishes">Finishes</TabsTrigger>
                </TabsList>

                {/* Categories Sub-tab */}
                <TabsContent value="categories">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-2xl font-bold text-foreground">
                      Manage Categories
                    </h2>
                    <Button onClick={handleAddCategory}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Category
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="bg-card rounded-xl p-6 border border-border/50 flex items-start justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-black text-black"
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Subcategories Sub-tab */}
                <TabsContent value="subcategories">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-2xl font-bold text-foreground">
                      Manage Subcategories
                    </h2>
                    <Button onClick={handleAddSubcategory}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Subcategory
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {subcategories.map((subcategory) => {
                      const category = categories.find(
                        (c) => c.id === subcategory.categoryId
                      );
                      return (
                        <div
                          key={subcategory.id}
                          className="bg-card rounded-xl p-6 border border-border/50 flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                              {subcategory.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                              Category: {category?.name || "Unknown"}
                            </p>
                            {subcategory.description && (
                              <p className="text-sm text-muted-foreground">
                                {subcategory.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-black text-black"
                              onClick={() => handleEditSubcategory(subcategory)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteSubcategory(subcategory.id)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Materials Sub-tab */}
                <TabsContent value="materials">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-2xl font-bold text-foreground">
                      Manage Materials
                    </h2>
                    <Button onClick={handleAddMaterial}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Material
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {materialsList.map((material) => {
                      const category = material.categoryId
                        ? categories.find((c) => c.id === material.categoryId)
                        : null;
                      const subcategory = material.subcategoryId
                        ? subcategories.find(
                            (s) => s.id === material.subcategoryId
                          )
                        : null;
                      return (
                        <div
                          key={material.id}
                          className="bg-card rounded-xl p-6 border border-border/50 flex items-start justify-between"
                        >
                          <div className="flex-1">
                            <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                              {material.name}
                            </h3>
                            {(category || subcategory) && (
                              <p className="text-sm text-muted-foreground mb-1">
                                {category && `Category: ${category.name}`}
                                {category && subcategory && " â€¢ "}
                                {subcategory &&
                                  `Subcategory: ${subcategory.name}`}
                              </p>
                            )}
                            {material.description && (
                              <p className="text-sm text-muted-foreground">
                                {material.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-black text-black"
                              onClick={() => handleEditMaterial(material)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteMaterial(material.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>

                {/* Finish Categories Sub-tab */}
                <TabsContent value="finish-categories">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-2xl font-bold text-foreground">
                      Manage Finish Categories
                    </h2>
                    <Button onClick={handleAddFinishCategory}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Finish Category
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {finishCategoriesList.map((category) => (
                      <div
                        key={category.id}
                        className="bg-card rounded-xl p-6 border border-border/50 flex items-start justify-between"
                      >
                        <div className="flex-1">
                          <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                            {category.name}
                          </h3>
                          {category.description && (
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            {
                              finishesList.filter(
                                (f) => f.categoryId === category.id
                              ).length
                            }{" "}
                            finish(es)
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-black text-black"
                            onClick={() => handleEditFinishCategory(category)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              handleDeleteFinishCategory(category.id)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Finishes Sub-tab */}
                <TabsContent value="finishes">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-heading text-2xl font-bold text-foreground">
                      Manage Finishes
                    </h2>
                    <Button onClick={handleAddFinish}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Finish
                    </Button>
                  </div>

                  <div className="grid gap-4">
                    {finishesList.map((finish) => {
                      const category = finishCategoriesList.find(
                        (c) => c.id === finish.categoryId
                      );
                      return (
                        <div
                          key={finish.id}
                          className="bg-card rounded-xl p-6 border border-border/50 flex items-start gap-4"
                        >
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                            <ImageDisplay
                              src={finish.image}
                              alt={finish.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
                              {finish.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-1">
                              Category: {category?.name || "Unknown"}
                            </p>
                            {finish.description && (
                              <p className="text-sm text-muted-foreground">
                                {finish.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-black text-black"
                              onClick={() => handleEditFinish(finish)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteFinish(finish.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Blogs Tab */}
            <TabsContent value="blogs">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Manage Blogs
                </h2>
                <Button onClick={handleAddBlog}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Blog
                </Button>
              </div>

              <div className="grid gap-4">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="bg-card rounded-xl p-6 border border-border/50 flex items-start gap-4"
                  >
                    <div className="w-32 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                      <ImageDisplay
                        src={blog.image}
                        alt="Blog"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground line-clamp-3">
                        {blog.content}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-black text-black"
                        onClick={() => handleEditBlog(blog)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBlog(blog.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Testimonials Tab */}
            <TabsContent value="testimonials">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Manage Testimonials
                </h2>
                <Button onClick={handleAddTestimonial}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>

              <div className="grid gap-4">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-card rounded-xl p-6 border border-border/50 flex items-start gap-4"
                  >
                    {testimonial.image ? (
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-secondary flex-shrink-0">
                        <ImageDisplay
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="font-heading font-semibold text-foreground">
                          {testimonial.name}
                        </p>
                        <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                          {testimonial.role}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.company} â€¢ {testimonial.location}
                      </p>
                      <p className="text-sm text-foreground mt-2 line-clamp-3">
                        {testimonial.content}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-black text-black"
                        onClick={() => handleEditTestimonial(testimonial)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Inquiries Tab */}
            <TabsContent value="inquiries">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground flex items-center gap-2">
                  <Inbox className="w-6 h-6" /> Inquiries
                </h2>
                <Button variant="outline" size="sm" onClick={() => {
                  setInquiriesLoading(true);
                  fetch("/api/inquiries").then(r => r.json()).then(data => {
                    setInquiries(Array.isArray(data) ? data : []);
                  }).catch(console.error).finally(() => setInquiriesLoading(false));
                }}>
                  Refresh
                </Button>
              </div>

              {inquiriesLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Inbox className="w-12 h-12 mx-auto mb-3 opacity-40" />
                  <p>No inquiries yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary text-left">
                        <th className="px-4 py-3 font-semibold text-foreground">#</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Date</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Name</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Email</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Phone</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Country</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Product</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Subject</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Message</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inquiries.map((inq, idx) => (
                        <tr
                          key={inq.id}
                          className={`border-t border-border/50 cursor-pointer transition-colors ${
                            expandedInquiry === inq.id ? "bg-accent/5" : idx % 2 === 0 ? "bg-background" : "bg-secondary/40"
                          } hover:bg-accent/5`}
                          onClick={() => setExpandedInquiry(expandedInquiry === inq.id ? null : inq.id)}
                        >
                          <td className="px-4 py-3 text-muted-foreground">{inq.id}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                            {new Date(inq.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{inq.name}</td>
                          <td className="px-4 py-3">
                            <a href={`mailto:${inq.email}`} className="text-accent hover:underline" onClick={e => e.stopPropagation()}>{inq.email}</a>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <a href={`tel:${inq.phone}`} className="hover:text-accent transition-colors" onClick={e => e.stopPropagation()}>{inq.phone}</a>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">{inq.city}{inq.country ? `, ${inq.country}` : ""}</td>
                          <td className="px-4 py-3">{inq.product || <span className="text-muted-foreground/50">—</span>}</td>
                          <td className="px-4 py-3 max-w-[180px] truncate">{inq.subject || <span className="text-muted-foreground/50">—</span>}</td>
                          <td className="px-4 py-3 max-w-[200px]">
                            {expandedInquiry === inq.id ? (
                              <span className="whitespace-pre-wrap break-words">{inq.message}</span>
                            ) : (
                              <span className="truncate block max-w-[200px]">{inq.message}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-heading text-2xl font-bold text-foreground">Users</h2>
                <Button variant="outline" size="sm" onClick={() => {
                  setUsersLoading(true);
                  fetch("/api/users").then(r => r.json()).then(data => {
                    setAppUsers(Array.isArray(data) ? data : []);
                  }).catch(console.error).finally(() => setUsersLoading(false));
                }}>Refresh</Button>
              </div>
              {usersLoading ? (
                <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
              ) : appUsers.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">No users found.</div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border/50">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary text-left">
                        <th className="px-4 py-3 font-semibold text-foreground">#</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Name</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Email</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Role</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Joined</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Last Login</th>
                        <th className="px-4 py-3 font-semibold text-foreground">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appUsers.map((u, idx) => (
                        <tr key={u.id} className={`border-t border-border/50 ${idx % 2 === 0 ? "bg-background" : "bg-secondary/40"}`}>
                          <td className="px-4 py-3 text-muted-foreground">{u.id}</td>
                          <td className="px-4 py-3 font-medium text-foreground">{u.name || "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              u.role === "admin"
                                ? "bg-accent/15 text-accent"
                                : "bg-secondary text-muted-foreground"
                            }`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {new Date(u.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                            {new Date(u.last_login).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                          </td>
                          <td className="px-4 py-3">
                            <Button
                              size="sm"
                              variant={u.role === "admin" ? "outline" : "default"}
                              disabled={roleUpdating === u.clerk_id}
                              onClick={async () => {
                                const newRole = u.role === "admin" ? "user" : "admin";
                                setRoleUpdating(u.clerk_id);
                                try {
                                  const res = await fetch("/api/users", {
                                    method: "PATCH",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ clerk_id: u.clerk_id, role: newRole }),
                                  });
                                  const data = await res.json();
                                  if (!res.ok) throw new Error(data.error);
                                  setAppUsers(prev => prev.map(x => x.clerk_id === u.clerk_id ? { ...x, role: newRole } : x));
                                  toast({ title: "Role Updated", description: `${u.email} is now ${newRole}.` });
                                } catch (e: any) {
                                  toast({ title: "Error", description: e.message, variant: "destructive" });
                                } finally {
                                  setRoleUpdating(null);
                                }
                              }}
                            >
                              {roleUpdating === u.clerk_id ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : u.role === "admin" ? "Remove Admin" : "Make Admin"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Product Dialog */}
      <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={productForm.name}
                onChange={(e) =>
                  setProductForm({ ...productForm, name: e.target.value })
                }
                placeholder="Classic Brass Knob"
              />
            </div>
            <div>
              <Label htmlFor="modelNumber">Model Number (optional)</Label>
              <Input
                id="modelNumber"
                value={productForm.modelNumber}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    modelNumber: e.target.value,
                  })
                }
                placeholder="BK-2024-01"
              />
            </div>
            <div>
              <Label htmlFor="series">Series *</Label>
              <Select
                value={productForm.series}
                onValueChange={(value) =>
                  setProductForm({ ...productForm, series: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select series" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Minimal">Minimal</SelectItem>
                  <SelectItem value="Classical">Classical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={productForm.categoryId?.toString() || ""}
                  onValueChange={(value) => {
                    setProductForm({
                      ...productForm,
                      categoryId: Number(value),
                      // Clear subcategory if switching categories
                      subcategoryId: undefined,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="material">Material *</Label>
                <Select
                  value={productForm.materialId?.toString() || ""}
                  onValueChange={(value) =>
                    setProductForm({
                      ...productForm,
                      materialId: Number(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materialsList.map((mat) => (
                      <SelectItem key={mat.id} value={mat.id.toString()}>
                        {mat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Show subcategory dropdown if selected category has subcategories */}
            {productForm.categoryId &&
              subcategories.some(
                (sub) => productForm.categoryId === sub.categoryId
              ) && (
                <div>
                  <Label htmlFor="subcategory">
                    Subcategory{" "}
                    {subcategories.some(
                      (sub) => productForm.categoryId === sub.categoryId
                    )
                      ? "*"
                      : "(optional)"}
                  </Label>
                  <Select
                    value={productForm.subcategoryId?.toString() || ""}
                    onValueChange={(value) =>
                      setProductForm({
                        ...productForm,
                        subcategoryId: Number(value),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subcategories
                        .filter(
                          (sub) => productForm.categoryId === sub.categoryId
                        )
                        .map((sub) => (
                          <SelectItem key={sub.id} value={sub.id.toString()}>
                            {sub.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={productForm.description}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    description: e.target.value,
                  })
                }
                placeholder="Product description..."
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="longDescription">
                Long Description (optional)
              </Label>
              <Textarea
                id="longDescription"
                value={productForm.longDescription}
                onChange={(e) =>
                  setProductForm({
                    ...productForm,
                    longDescription: e.target.value,
                  })
                }
                placeholder="Detailed product description for product detail page..."
                rows={5}
              />
            </div>
            <div>
              <Label htmlFor="image">Thumbnail Image (main)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleProductImageUpload}
                className="cursor-pointer"
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-primary mt-1 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Uploading to Cloudinary...
                </p>
              )}
              {productForm.image && !uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  URL: {productForm.image}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="extra-images">Additional Images (up to 3–4, optional)</Label>
              <Input
                id="extra-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleProductExtraImagesUpload}
                className="cursor-pointer mt-1"
                disabled={uploading}
              />
              {productForm.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {productForm.images.map((url, i) => (
                    <div key={i} className="relative group w-16 h-16 rounded-lg overflow-hidden border border-border">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setProductForm((prev) => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }))}
                        className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs transition-opacity"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="product-videos">Product Videos (1–2, optional)</Label>
              <Input
                id="product-videos"
                type="file"
                accept="video/*"
                multiple
                onChange={handleProductVideoUpload}
                className="cursor-pointer mt-1"
                disabled={uploading}
              />
              {productForm.videos.length > 0 && (
                <div className="space-y-1 mt-2">
                  {productForm.videos.map((url, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="truncate flex-1">{url.split('/').pop()}</span>
                      <button
                        type="button"
                        onClick={() => setProductForm((prev) => ({ ...prev, videos: prev.videos.filter((_, idx) => idx !== i) }))}
                        className="text-destructive hover:underline text-xs"
                      >Remove</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="finishes">Available Finishes (optional)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {finishesList.map((finish) => (
                  <label
                    key={finish.id}
                    className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg cursor-pointer hover:bg-accent/5 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={productForm.finishIds.includes(finish.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setProductForm({
                            ...productForm,
                            finishIds: [...productForm.finishIds, finish.id],
                          });
                        } else {
                          setProductForm({
                            ...productForm,
                            finishIds: productForm.finishIds.filter(
                              (fid) => fid !== finish.id
                            ),
                          });
                        }
                      }}
                      className="rounded border-border"
                    />
                    <span className="text-sm">{finish.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProductDialogOpen(false)}
              disabled={uploading || loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveProduct} disabled={uploading || loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                `${editingProduct ? "Update" : "Add"} Product`
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Blog Dialog */}
      <Dialog open={blogDialogOpen} onOpenChange={setBlogDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingBlog ? "Edit Blog" : "Add New Blog"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="blog-image" className="text-foreground">
                Blog Image *
              </Label>
              <Input
                id="blog-image"
                type="file"
                accept="image/*"
                onChange={handleBlogImageUpload}
                className="cursor-pointer bg-background text-foreground"
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-primary mt-1 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Uploading to Cloudinary...
                </p>
              )}
              {blogForm.image && !uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  URL: {blogForm.image.substring(0, 50)}...
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="content" className="text-foreground">
                Blog Content *
              </Label>
              <Textarea
                id="content"
                value={blogForm.content}
                onChange={(e) =>
                  setBlogForm({ ...blogForm, content: e.target.value })
                }
                placeholder="Write your blog content here..."
                rows={6}
                className="bg-background text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBlogDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveBlog}>
              {editingBlog ? "Update" : "Add"} Blog
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Testimonial Dialog */}
      <Dialog
        open={testimonialDialogOpen}
        onOpenChange={setTestimonialDialogOpen}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testimonial-name" className="text-foreground">
                  Name *
                </Label>
                <Input
                  id="testimonial-name"
                  value={testimonialForm.name}
                  onChange={(e) =>
                    setTestimonialForm({
                      ...testimonialForm,
                      name: e.target.value,
                    })
                  }
                  placeholder="Jane Doe"
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <Label htmlFor="testimonial-role" className="text-foreground">
                  Role *
                </Label>
                <Input
                  id="testimonial-role"
                  value={testimonialForm.role}
                  onChange={(e) =>
                    setTestimonialForm({
                      ...testimonialForm,
                      role: e.target.value,
                    })
                  }
                  placeholder="Interior Designer"
                  className="bg-background text-foreground"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="testimonial-company"
                  className="text-foreground"
                >
                  Company *
                </Label>
                <Input
                  id="testimonial-company"
                  value={testimonialForm.company}
                  onChange={(e) =>
                    setTestimonialForm({
                      ...testimonialForm,
                      company: e.target.value,
                    })
                  }
                  placeholder="Design Studio"
                  className="bg-background text-foreground"
                />
              </div>
              <div>
                <Label
                  htmlFor="testimonial-location"
                  className="text-foreground"
                >
                  Location *
                </Label>
                <Input
                  id="testimonial-location"
                  value={testimonialForm.location}
                  onChange={(e) =>
                    setTestimonialForm({
                      ...testimonialForm,
                      location: e.target.value,
                    })
                  }
                  placeholder="London, UK"
                  className="bg-background text-foreground"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="testimonial-rating" className="text-foreground">
                Rating (1-5)
              </Label>
              <Input
                id="testimonial-rating"
                type="number"
                min={1}
                max={5}
                value={testimonialForm.rating}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    rating: Number(e.target.value) || 5,
                  })
                }
                className="bg-background text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="testimonial-image" className="text-foreground">
                Author Image (optional)
              </Label>
              <Input
                id="testimonial-image"
                type="file"
                accept="image/*"
                onChange={handleTestimonialImageUpload}
                className="cursor-pointer bg-background text-foreground"
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-primary mt-1 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Uploading to Cloudinary...
                </p>
              )}
              {testimonialForm.image && !uploading && (
                <p className="text-sm text-muted-foreground mt-1">
                  URL: {testimonialForm.image.substring(0, 50)}...
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="testimonial-content" className="text-foreground">
                Testimonial *
              </Label>
              <Textarea
                id="testimonial-content"
                value={testimonialForm.content}
                onChange={(e) =>
                  setTestimonialForm({
                    ...testimonialForm,
                    content: e.target.value,
                  })
                }
                placeholder="Write the testimonial here..."
                rows={5}
                className="bg-background text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setTestimonialDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveTestimonial}>
              {editingTestimonial ? "Update" : "Add"} Testimonial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name" className="text-foreground">
                Category Name *
              </Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) =>
                  setCategoryForm({ ...categoryForm, name: e.target.value })
                }
                placeholder="e.g., Door Handle, Knob"
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="category-description" className="text-foreground">
                Description (optional)
              </Label>
              <Textarea
                id="category-description"
                value={categoryForm.description}
                onChange={(e) =>
                  setCategoryForm({
                    ...categoryForm,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of this category"
                rows={3}
                className="bg-background text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCategory}>
              {editingCategory ? "Update" : "Add"} Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Subcategory Dialog */}
      <Dialog
        open={subcategoryDialogOpen}
        onOpenChange={setSubcategoryDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="subcategory-category" className="text-foreground">
                Parent Category *
              </Label>
              <Select
                value={subcategoryForm.categoryId.toString()}
                onValueChange={(value) =>
                  setSubcategoryForm({
                    ...subcategoryForm,
                    categoryId: Number(value),
                  })
                }
              >
                <SelectTrigger className="bg-background text-foreground">
                  <SelectValue placeholder="Select parent category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subcategory-name" className="text-foreground">
                Subcategory Name *
              </Label>
              <Input
                id="subcategory-name"
                value={subcategoryForm.name}
                onChange={(e) =>
                  setSubcategoryForm({
                    ...subcategoryForm,
                    name: e.target.value,
                  })
                }
                placeholder="e.g., Cabinet Handle, Door Handle"
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <Label
                htmlFor="subcategory-description"
                className="text-foreground"
              >
                Description (optional)
              </Label>
              <Textarea
                id="subcategory-description"
                value={subcategoryForm.description}
                onChange={(e) =>
                  setSubcategoryForm({
                    ...subcategoryForm,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of this subcategory"
                rows={3}
                className="bg-background text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSubcategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSubcategory}>
              {editingSubcategory ? "Update" : "Add"} Subcategory
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Material Dialog */}
      <Dialog open={materialDialogOpen} onOpenChange={setMaterialDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingMaterial ? "Edit Material" : "Add New Material"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="material-name" className="text-foreground">
                Material Name *
              </Label>
              <Input
                id="material-name"
                value={materialForm.name}
                onChange={(e) =>
                  setMaterialForm({ ...materialForm, name: e.target.value })
                }
                placeholder="e.g., Stainless Steel, Brass"
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="material-category" className="text-foreground">
                Category (optional)
              </Label>
              <Select
                value={materialForm.categoryId?.toString() || "none"}
                onValueChange={(value) =>
                  setMaterialForm({
                    ...materialForm,
                    categoryId: value === "none" ? undefined : Number(value),
                    subcategoryId:
                      value === "none" ? undefined : materialForm.subcategoryId,
                  })
                }
              >
                <SelectTrigger className="bg-background text-foreground">
                  <SelectValue placeholder="Select category (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (All Categories)</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {materialForm.categoryId && (
              <div>
                <Label htmlFor="material-subcategory">
                  Subcategory (optional)
                </Label>
                <Select
                  value={materialForm.subcategoryId?.toString() || "none"}
                  onValueChange={(value) =>
                    setMaterialForm({
                      ...materialForm,
                      subcategoryId:
                        value === "none" ? undefined : Number(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subcategory (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">
                      None (All Subcategories)
                    </SelectItem>
                    {subcategories
                      .filter(
                        (sub) => sub.categoryId === materialForm.categoryId
                      )
                      .map((sub) => (
                        <SelectItem key={sub.id} value={sub.id.toString()}>
                          {sub.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div>
              <Label htmlFor="material-description">
                Description (optional)
              </Label>
              <Textarea
                id="material-description"
                value={materialForm.description}
                onChange={(e) =>
                  setMaterialForm({
                    ...materialForm,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of this material"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setMaterialDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveMaterial}>
              {editingMaterial ? "Update" : "Add"} Material
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finish Dialog */}
      <Dialog open={finishDialogOpen} onOpenChange={setFinishDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingFinish ? "Edit Finish" : "Add New Finish"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="finish-category" className="text-foreground">
                Finish Category *
              </Label>
              <Select
                value={finishForm.categoryId.toString()}
                onValueChange={(value) =>
                  setFinishForm({ ...finishForm, categoryId: Number(value) })
                }
              >
                <SelectTrigger className="bg-background text-foreground">
                  <SelectValue placeholder="Select finish category" />
                </SelectTrigger>
                <SelectContent>
                  {finishCategoriesList.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="finish-name" className="text-foreground">
                Finish Name *
              </Label>
              <Input
                id="finish-name"
                value={finishForm.name}
                onChange={(e) =>
                  setFinishForm({ ...finishForm, name: e.target.value })
                }
                placeholder="e.g., Matt, Glossy Chrome, PVD Gold"
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <Label htmlFor="finish-image" className="text-foreground">
                Finish Image *
              </Label>
              <Input
                id="finish-image"
                type="file"
                accept="image/*"
                onChange={handleFinishImageUpload}
                className="cursor-pointer bg-background text-foreground"
                disabled={uploading}
              />
              {uploading && (
                <p className="text-sm text-primary mt-1 flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Uploading to Cloudinary...
                </p>
              )}
              {finishForm.image && !uploading && (
                <div className="mt-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Current image: {finishForm.image.substring(0, 50)}...
                  </p>
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-secondary">
                    <ImageDisplay
                      src={finishForm.image}
                      alt="Finish preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="finish-description" className="text-foreground">
                Description (optional)
              </Label>
              <Textarea
                id="finish-description"
                value={finishForm.description}
                onChange={(e) =>
                  setFinishForm({ ...finishForm, description: e.target.value })
                }
                placeholder="Brief description of this finish"
                rows={3}
                className="bg-background text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFinishDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveFinish}>
              {editingFinish ? "Update" : "Add"} Finish
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Finish Category Dialog */}
      <Dialog
        open={finishCategoryDialogOpen}
        onOpenChange={setFinishCategoryDialogOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              {editingFinishCategory
                ? "Edit Finish Category"
                : "Add New Finish Category"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="finish-category-name" className="text-foreground">
                Category Name *
              </Label>
              <Input
                id="finish-category-name"
                value={finishCategoryForm.name}
                onChange={(e) =>
                  setFinishCategoryForm({
                    ...finishCategoryForm,
                    name: e.target.value,
                  })
                }
                placeholder="e.g., Stainless Steel Finish, Brass Finish"
                className="bg-background text-foreground"
              />
            </div>
            <div>
              <Label
                htmlFor="finish-category-description"
                className="text-foreground"
              >
                Description (optional)
              </Label>
              <Textarea
                id="finish-category-description"
                value={finishCategoryForm.description}
                onChange={(e) =>
                  setFinishCategoryForm({
                    ...finishCategoryForm,
                    description: e.target.value,
                  })
                }
                placeholder="Brief description of this finish category"
                rows={3}
                className="bg-background text-foreground"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFinishCategoryDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveFinishCategory}>
              {editingFinishCategory ? "Update" : "Add"} Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      
    </main>
  );
};

export default Admin;

