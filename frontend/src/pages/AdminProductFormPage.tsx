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
import { CATEGORY_OPTIONS, MAIN_CATEGORY_OPTIONS, SUBCATEGORY_OPTIONS } from "@/data/adminProductOptions";
import { toast } from "sonner";

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
};

export default function AdminProductFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);

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
      toast.error("Image URL is required");
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
          <div className="sm:col-span-2">
            <Label htmlFor="image">Image URL *</Label>
            <Input
              id="image"
              type="url"
              value={form.image}
              onChange={(e) => update("image", e.target.value)}
              placeholder="https://..."
              required
            />
            {form.image && (
              <img
                src={form.image}
                alt="Preview"
                className="mt-2 h-32 w-32 rounded object-cover border"
                onError={(e) => (e.currentTarget.style.display = "none")}
              />
            )}
          </div>
          <div>
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => update("category", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Main category</Label>
            <Select value={form.mainCategory} onValueChange={(v) => update("mainCategory", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAIN_CATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Subcategory</Label>
            <Select value={form.subcategory || "none"} onValueChange={(v) => update("subcategory", v === "none" ? "" : v)}>
              <SelectTrigger>
                <SelectValue placeholder="Optional" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">— None —</SelectItem>
                {SUBCATEGORY_OPTIONS.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 sm:col-span-2">
            <Switch
              id="isNew"
              checked={form.isNew}
              onCheckedChange={(v) => update("isNew", v)}
            />
            <Label htmlFor="isNew">Mark as New arrival</Label>
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
