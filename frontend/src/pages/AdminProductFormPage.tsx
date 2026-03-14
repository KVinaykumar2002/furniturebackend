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
import { toast } from "sonner";
import { Upload, Link as LinkIcon } from "lucide-react";
import { cn, readFileAsDataUrl } from "@/lib/utils";

const defaultForm = {
  name: "",
  description: "",
  price: "",
  oldPrice: "",
  save: "",
  rating: "0",
  reviews: "0",
  image: "",
  category: "furniture",
  mainCategory: "living",
  subcategory: "",
  isNew: false,
  featured: false,
};

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
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

  const setImageFromFile = async (file: File) => {
    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setForm((prev) => ({ ...prev, image: dataUrl }));
      toast.success("Image set (stored as base64)");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to read image");
    } finally {
      setUploading(false);
    }
  };

  const handleImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDropZoneActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) setImageFromFile(file);
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
        setForm({
          name: String(p.name ?? ""),
          description: String(p.description ?? ""),
          price: String(p.price ?? ""),
          oldPrice: p.oldPrice != null ? String(p.oldPrice) : "",
          save: p.save != null ? String(p.save) : "",
          rating: String(p.rating ?? 0),
          reviews: String(p.reviews ?? 0),
          image: String(p.image ?? ""),
          category: String(p.category ?? "furniture"),
          mainCategory: String(p.mainCategory ?? "living"),
          subcategory: p.subcategory ? String(p.subcategory) : "",
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
    if (!form.image.trim()) {
      toast.error("Image is required");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price,
        oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
        save: form.save ? Number(form.save) : undefined,
        rating: Number(form.rating) || 0,
        reviews: Number(form.reviews) || 0,
        image: form.image.trim(),
        category: form.category,
        mainCategory: form.mainCategory,
        subcategory: form.subcategory || undefined,
        isNew: form.isNew,
        featured: form.featured,
      };
      if (isEdit) {
        await api.products.update(id!, payload);
        toast.success("Product updated");
      } else {
        await api.products.create(payload);
        toast.success("Product created");
      }
      navigate("/admin/products");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground py-8">Loading product...</p>;
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
            <Label>Product image *</Label>
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setImageFromFile(file);
                    e.target.value = "";
                  }}
                />
                <p className="text-xs text-muted-foreground mb-1">Drag and drop an image here, or</p>
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => document.getElementById("product-image-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Reading…" : "Choose file"}
                </Button>
                <p className="text-xs text-muted-foreground">JPEG, PNG, GIF or WebP (max 5MB)</p>
              </div>
              <div className="flex-1">
                <Label htmlFor="image" className="text-muted-foreground font-normal flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5" />
                  Or paste image URL
                </Label>
                <Input
                  id="image"
                  type="text"
                  value={form.image.startsWith("data:") ? "" : form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder={form.image.startsWith("data:") ? "Image from file (paste URL to replace)" : "https://..."}
                  className="mt-1.5"
                />
              </div>
            </div>
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="h-32 w-32 rounded object-cover border"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
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
