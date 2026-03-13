import { useState, useEffect } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowLeft, Upload, Link as LinkIcon } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

function slugFromTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

const defaultForm = {
  slug: "",
  title: "",
  description: "",
  image: "",
};

export default function AdminCategoryFormPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(slug);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (!isEdit) {
      setForm(defaultForm);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const { bySlug } = await api.categories.list();
        const c = bySlug[decodeURIComponent(slug!)];
        if (cancelled) return;
        if (!c) {
          toast.error("Category not found");
          navigate("/admin/categories");
          return;
        }
        setForm({
          slug: String(c.slug ?? ""),
          title: String(c.title ?? ""),
          description: String(c.description ?? ""),
          image: String(c.image ?? ""),
        });
      } catch (e) {
        toast.error("Failed to load category");
        navigate("/admin/categories");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug, isEdit, navigate]);

  const update = (key: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (!isEdit && key === "title") {
        next.slug = slugFromTitle(next.title);
      }
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!form.image.trim()) {
      toast.error("Image is required (upload or paste URL)");
      return;
    }
    const safeSlug = isEdit ? decodeURIComponent(slug!) : slugFromTitle(form.slug || form.title);
    if (!safeSlug) {
      toast.error("Slug is required");
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        await api.categories.update(decodeURIComponent(slug!), {
          title: form.title.trim(),
          description: form.description.trim(),
          image: form.image.trim(),
        });
        toast.success("Category updated");
      } else {
        await api.categories.create({
          slug: safeSlug,
          title: form.title.trim(),
          description: form.description.trim(),
          image: form.image.trim(),
        });
        toast.success("Category created");
      }
      navigate("/admin/categories");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="text-muted-foreground py-8">Loading category...</p>;
  }

  return (
    <div className="max-w-2xl">
      <Link
        to="/admin/categories"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to categories
      </Link>
      <h1 className="font-display text-2xl font-light text-foreground mb-8">
        {isEdit ? "Edit category" : "Add category"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="e.g. Curtains"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="slug">Slug (URL-friendly name)</Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => update("slug", e.target.value)}
              placeholder="e.g. curtains"
              disabled={isEdit}
              className="font-mono"
            />
            {isEdit && (
              <p className="text-xs text-muted-foreground mt-1">Slug cannot be changed when editing.</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Optional short description"
              rows={2}
            />
          </div>
          <div className="sm:col-span-2 space-y-3">
            <Label>Category image *</Label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  className="hidden"
                  id="category-image-upload"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploading(true);
                    try {
                      const { url } = await api.uploadImage(file);
                      update("image", url);
                      toast.success("Image uploaded");
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : "Upload failed");
                    } finally {
                      setUploading(false);
                      e.target.value = "";
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => document.getElementById("category-image-upload")?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {uploading ? "Uploading…" : "Upload image"}
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
                  type="url"
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder="https://..."
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
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Update category" : "Create category"}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate("/admin/categories")}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
