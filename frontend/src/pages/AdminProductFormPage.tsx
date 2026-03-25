import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories, useShopCategories } from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, Link as LinkIcon } from "lucide-react";
import { cn, readFileAsDataUrl } from "@/lib/utils";
import { LoadingSection } from "@/components/ui/loader";

const COLOR_OPTIONS = ["Black", "White", "Grey", "Brown", "Beige", "Blue"];
const SIZE_OPTIONS = ["S", "M", "L", "XL"];
const PRODUCT_LOCATION_OPTIONS = [
  { value: "", label: "Not set" },
  { value: "showroom", label: "Showroom" },
  { value: "warehouse", label: "Warehouse" },
];

const defaultForm = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  save: "",
  rating: "0",
  reviews: "0",
  image: "",
  images: [] as string[],
  category: "furniture",
  mainCategory: "living",
  subcategory: "",
  color: "",
  size: "",
  inStock: true,
  productLocation: "",
  has3d: false,
  isNew: false,
  featured: false,
};

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const queryClient = useQueryClient();
  const { list: categoryList } = useCategories();
  const { list: shopCategoryList } = useShopCategories();
  const mainCategoryOptions = shopCategoryList.map((c) => ({ value: c.slug, label: c.title }));
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dropZoneActive, setDropZoneActive] = useState(false);
  const [form, setForm] = useState(defaultForm);

  // Category dropdown: API categories (exclude "all"), plus current value if not in list (e.g. legacy)
  const categoryOptions = (() => {
    const fromApi = categoryList.filter((c) => String(c.slug) !== "all").map((c) => ({ value: c.slug, label: c.title }));
    const current = form.category;
    if (current && !fromApi.some((o) => o.value === current)) {
      return [{ value: current, label: current }, ...fromApi];
    }
    return fromApi;
  })();

  const addImagesFromFiles = async (files: FileList | File[]) => {
    setUploading(true);
    try {
      const list = Array.from(files).slice(0, 10);
      const dataUrls = await Promise.all(list.map((f) => readFileAsDataUrl(f)));
      setForm((prev) => {
        const nextImages = [...(prev.images ?? [])];
        for (const u of dataUrls) {
          if (u && !nextImages.includes(u)) nextImages.push(u);
        }
        const primary = (prev.image || "").trim() || nextImages[0] || "";
        return { ...prev, images: nextImages, image: primary };
      });
      toast.success(`${dataUrls.length} image(s) added`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to read image");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropZoneActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) void addImagesFromFiles(files);
  };

  const handleImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setDropZoneActive(true);
  };

  const handleImageDragLeave = () => setDropZoneActive(false);

  useEffect(() => {
    if (!isEdit) {
      setForm(defaultForm);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const p = await api.products.byId(id!);
        if (cancelled) return;
        const colorVal = p.color ?? "";
        const sizeVal = p.size ?? "";
        const locationVal = p.productLocation ?? "";
        setForm({
          name: String(p.name ?? ""),
          description: String(p.description ?? ""),
          price: String(p.price ?? ""),
          oldPrice: p.oldPrice != null ? String(p.oldPrice) : "",
          save: p.save != null ? String(p.save) : "",
          rating: String(p.rating ?? 0),
          reviews: String(p.reviews ?? 0),
          image: String(p.image ?? ""),
          images: Array.isArray((p as any).images)
            ? ((p as any).images as unknown[]).map((u) => String(u)).filter((u) => u.trim())
            : String(p.image ?? "").trim()
              ? [String(p.image ?? "").trim()]
              : [],
          category: String(p.category ?? "furniture"),
          mainCategory: String(p.mainCategory ?? "living"),
          subcategory: p.subcategory ? String(p.subcategory) : "",
          color: typeof colorVal === "string" && colorVal.trim() !== "" ? colorVal.trim() : "",
          size: typeof sizeVal === "string" && sizeVal.trim() !== "" ? sizeVal.trim() : "",
          inStock: p.inStock !== false,
          productLocation: typeof locationVal === "string" && locationVal.trim() !== "" ? locationVal.trim() : "",
          has3d: Boolean(p.has3d),
          isNew: Boolean(p.isNew),
          featured: Boolean(p.featured),
        });
      } catch (e) {
        toast.error("Product not found");
        navigate("/admin/products");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, isEdit, navigate]);

  const update = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const price = Number(form.price);
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (Number.isNaN(price) || price < 0) {
      toast.error("Price must be a number ≥ 0");
      return;
    }
    const images = (form.images ?? []).map((u) => u.trim()).filter(Boolean);
    if (images.length === 0 && !form.image.trim()) {
      toast.error("Add at least one image");
      return;
    }
    setSaving(true);
    try {
      const finalImages = images.length ? images : [form.image.trim()];
      const primaryImage = finalImages[0] || form.image.trim();
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        save: form.save ? Number(form.save) : undefined,
        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,
        image: primaryImage,
        images: finalImages,
        category: form.category,
        mainCategory: form.mainCategory,
        subcategory: (form.subcategory || "").trim() || undefined,
        color: (form.color || "").trim() || null,
        size: (form.size || "").trim() || null,
        inStock: form.inStock,
        productLocation: (form.productLocation || "").trim() || null,
        has3d: form.has3d,
        isNew: form.isNew,
        featured: form.featured,
      };
      if (isEdit) {
        await api.products.update(id!, payload);
        toast.success("Product updated");
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } else {
        await api.products.create(payload);
        toast.success("Product created");
        queryClient.invalidateQueries({ queryKey: ["products"] });
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSection label="Loading product…" size="md" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link
        to="/admin/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>
      <h1 className="font-display text-2xl font-light text-foreground mb-8">
        {isEdit ? "Edit product" : "Add product"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Product name"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Short description"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="price">Price (₹) *</Label>
            <Input
              id="price"
              type="number"
              min={0}
              step={1}
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="oldPrice">Old price (₹)</Label>
            <Input
              id="oldPrice"
              type="number"
              min={0}
              step={1}
              value={form.oldPrice}
              onChange={(e) => update("oldPrice", e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div>
            <Label htmlFor="save">Save amount (₹)</Label>
            <Input
              id="save"
              type="number"
              min={0}
              value={form.save}
              onChange={(e) => update("save", e.target.value)}
              placeholder="Optional"
            />
          </div>
          <div>
            <Label htmlFor="rating">Rating (0–5)</Label>
            <Input
              id="rating"
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={form.rating}
              onChange={(e) => update("rating", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="reviews">Review count</Label>
            <Input
              id="reviews"
              type="number"
              min={0}
              value={form.reviews}
              onChange={(e) => update("reviews", e.target.value)}
            />
          </div>
          <div className="sm:col-span-2 space-y-3">
            <Label>Product images *</Label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div
                className={cn(
                  "flex flex-col gap-2 rounded-lg border-2 border-dashed p-4 transition-colors min-w-[200px]",
                  dropZoneActive ? "border-primary bg-primary/5" : "border-muted-foreground/30 bg-muted/20"
                )}
                onDrop={handleImageDrop}
                onDragOver={handleImageDragOver}
                onDragLeave={handleImageDragLeave}
              >
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  className="hidden"
                  id="product-image-upload"
                  multiple
                  onChange={(e) => {
                    const files = e.target.files;
                    if (files && files.length > 0) void addImagesFromFiles(files);
                    e.target.value = "";
                  }}
                />
                <p className="text-xs text-muted-foreground mb-1">Drag and drop images here, or</p>
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => document.getElementById("product-image-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Reading…" : "Choose file"}
                </Button>
                <p className="text-xs text-muted-foreground">Up to 10 images. First image will be the main image.</p>
              </div>
              <div className="flex-1">
                <Label htmlFor="image" className="text-muted-foreground font-normal flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5" />
                  Or paste image URL (adds to gallery)
                </Label>
                <Input
                  id="image"
                  type="text"
                  value={form.image.startsWith("data:") ? "" : form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder={form.image.startsWith("data:") ? "Image from file (paste URL to add another)" : "https://..."}
                  className="mt-1.5"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      const url = form.image.trim();
                      if (!url || url.startsWith("data:")) return;
                      setForm((prev) => {
                        const nextImages = [...(prev.images ?? [])];
                        if (!nextImages.includes(url)) nextImages.push(url);
                        return { ...prev, images: nextImages, image: nextImages[0] || url };
                      });
                      toast.success("Image URL added");
                    }}
                  >
                    Add URL
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setForm((prev) => ({ ...prev, image: "" }))}
                    className="text-muted-foreground"
                  >
                    Clear URL
                  </Button>
                </div>
              </div>
            </div>
            {form.images?.length ? (
              <div className="rounded-lg border bg-muted/20 p-3">
                <p className="text-xs text-muted-foreground mb-3">
                  Main image is the first one. Use “Set as main” or remove images.
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {form.images.map((src, idx) => (
                    <div key={`${src}-${idx}`} className="group relative rounded-md overflow-hidden border bg-background">
                      <img src={src} alt={`Product image ${idx + 1}`} className="h-20 w-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 flex gap-1 p-1 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-7 px-2 text-xs"
                          onClick={() => {
                            setForm((prev) => {
                              const next = [...prev.images];
                              const [picked] = next.splice(idx, 1);
                              next.unshift(picked);
                              return { ...prev, images: next, image: next[0] || "" };
                            });
                          }}
                        >
                          Set as main
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-xs text-destructive"
                          onClick={() => {
                            setForm((prev) => {
                              const next = prev.images.filter((_, i) => i !== idx);
                              return { ...prev, images: next, image: next[0] || "" };
                            });
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => update("category", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Main category</Label>
            <Select value={form.mainCategory} onValueChange={(v) => update("mainCategory", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {mainCategoryOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Subcategory (optional)</Label>
            <Input
              value={form.subcategory}
              onChange={(e) => update("subcategory", e.target.value)}
              placeholder="e.g. sofas, beds"
            />
          </div>
          <div>
            <Label>Color (for filtering)</Label>
            <Select
              key={isEdit ? `color-${id}-${loading}` : "color-new"}
              value={form.color || "__none__"}
              onValueChange={(v) => update("color", v === "__none__" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select color" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Not set</SelectItem>
                {COLOR_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Size (for filtering)</Label>
            <Select
              key={isEdit ? `size-${id}-${loading}` : "size-new"}
              value={form.size || "__none__"}
              onValueChange={(v) => update("size", v === "__none__" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">Not set</SelectItem>
                {SIZE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch
              id="inStock"
              checked={form.inStock}
              onCheckedChange={(v) => update("inStock", v)}
            />
            <Label htmlFor="inStock">In stock (availability)</Label>
          </div>
          <div>
            <Label>Product location (for filtering)</Label>
            <Select
              key={isEdit ? `location-${id}-${loading}` : "location-new"}
              value={form.productLocation || "__none__"}
              onValueChange={(v) => update("productLocation", v === "__none__" ? "" : v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {PRODUCT_LOCATION_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value || "__none__"} value={opt.value || "__none__"}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch
              id="has3d"
              checked={form.has3d}
              onCheckedChange={(v) => update("has3d", v)}
            />
            <Label htmlFor="has3d">Has 3D model</Label>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch
              id="isNew"
              checked={form.isNew}
              onCheckedChange={(v) => update("isNew", v)}
            />
            <Label htmlFor="isNew">Mark as New arrival</Label>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch
              id="featured"
              checked={form.featured}
              onCheckedChange={(v) => update("featured", v)}
            />
            <Label htmlFor="featured">Mark as Best Deal</Label>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Update product" : "Create product"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/products")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
