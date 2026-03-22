import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useSiteSettings, type SiteSettings } from "@/hooks/useApi";

type SiteSettingsForm = Omit<SiteSettings, "completedProjectStats" | "testimonials">;
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LoadingSection } from "@/components/ui/loader";
import { Plus, Trash2, Upload, Link as LinkIcon } from "lucide-react";
import { cn, readFileAsDataUrl } from "@/lib/utils";

export default function AdminSiteSettingsPage() {
  const queryClient = useQueryClient();
  const { settings, isPending, isError } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [uploadingStoreImage, setUploadingStoreImage] = useState(false);
  const [storeImageDropZoneActive, setStoreImageDropZoneActive] = useState(false);
  const [form, setForm] = useState<SiteSettingsForm>({
    contactPhone: "",
    contactEmail: "",
    address: "",
    brandTagline: "",
    ourStoresImage: "",
    heroSlides: [],
    socialLinks: [],
  });

  useEffect(() => {
    if (settings) {
      setForm({
        contactPhone: settings.contactPhone ?? "",
        contactEmail: settings.contactEmail ?? "",
        address: settings.address ?? "",
        brandTagline: settings.brandTagline ?? "",
        ourStoresImage: settings.ourStoresImage ?? "",
        heroSlides: settings.heroSlides?.length ? [...settings.heroSlides] : [],
        socialLinks: settings.socialLinks?.length ? [...settings.socialLinks] : [],
      });
    }
  }, [settings]);

  const update = <K extends keyof SiteSettingsForm>(key: K, value: SiteSettingsForm[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const setStoreImageFromFile = async (file: File) => {
    setUploadingStoreImage(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      update("ourStoresImage", dataUrl);
      toast.success("Store image set (stored as base64)");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to read image");
    } finally {
      setUploadingStoreImage(false);
    }
  };

  const handleStoreImageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setStoreImageDropZoneActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void setStoreImageFromFile(file);
  };

  const handleStoreImageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setStoreImageDropZoneActive(true);
  };

  const handleStoreImageDragLeave = () => setStoreImageDropZoneActive(false);

  const addHeroSlide = () => {
    setForm((prev) => ({
      ...prev,
      heroSlides: [...prev.heroSlides, { image: "", title: "", subtitle: "" }],
    }));
  };

  const updateHeroSlide = (index: number, field: "image" | "title" | "subtitle", value: string) => {
    setForm((prev) => {
      const next = [...prev.heroSlides];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, heroSlides: next };
    });
  };

  const removeHeroSlide = (index: number) => {
    setForm((prev) => ({
      ...prev,
      heroSlides: prev.heroSlides.filter((_, i) => i !== index),
    }));
  };

  const addSocialLink = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { name: "", href: "#" }],
    }));
  };

  const updateSocialLink = (index: number, field: "name" | "href", value: string) => {
    setForm((prev) => {
      const next = [...prev.socialLinks];
      next[index] = { ...next[index], [field]: value };
      return { ...prev, socialLinks: next };
    });
  };

  const removeSocialLink = (index: number) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.siteSettings.update({
        contactPhone: form.contactPhone.trim(),
        contactEmail: form.contactEmail.trim(),
        address: form.address.trim(),
        brandTagline: form.brandTagline.trim(),
        ourStoresImage: form.ourStoresImage.trim(),
        heroSlides: form.heroSlides.filter((s) => s.image.trim()),
        socialLinks: form.socialLinks.filter((l) => l.name.trim()),
      });
      queryClient.invalidateQueries({ queryKey: ["siteSettings"] });
      toast.success("Site settings saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (isPending || isError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSection label="Loading site settings…" size="md" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-light text-foreground mb-2">Site Settings</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Manage contact details, store image, hero carousel, and footer links for the storefront.
      </p>

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Contact & Address */}
        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Contact & Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={form.contactPhone}
                onChange={(e) => update("contactPhone", e.target.value)}
                placeholder="e.g. 8121806688"
              />
            </div>
            <div>
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={form.contactEmail}
                onChange={(e) => update("contactEmail", e.target.value)}
                placeholder="e.g. info@designerzhub.co.in"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                placeholder="Full address (shown in footer)"
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="brandTagline">Brand tagline (footer)</Label>
              <Input
                id="brandTagline"
                value={form.brandTagline}
                onChange={(e) => update("brandTagline", e.target.value)}
                placeholder="e.g. Premium furniture for inspired living."
              />
            </div>
          </div>
        </section>

        {/* Our Stores section */}
        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Our Stores section</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Update the image shown in the "Our Stores" block on the homepage.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-3">
              <Label>Store image</Label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div
                  className={cn(
                    "flex flex-col gap-2 rounded-lg border-2 border-dashed p-4 transition-colors min-w-[200px]",
                    storeImageDropZoneActive ? "border-primary bg-primary/5" : "border-muted-foreground/30 bg-muted/20"
                  )}
                  onDrop={handleStoreImageDrop}
                  onDragOver={handleStoreImageDragOver}
                  onDragLeave={handleStoreImageDragLeave}
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    className="hidden"
                    id="our-stores-image-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) void setStoreImageFromFile(file);
                      e.target.value = "";
                    }}
                  />
                  <p className="text-xs text-muted-foreground mb-1">Drag and drop an image here, or</p>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={uploadingStoreImage}
                    onClick={() => document.getElementById("our-stores-image-upload")?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {uploadingStoreImage ? "Reading…" : "Choose file"}
                  </Button>
                  <p className="text-xs text-muted-foreground">JPEG, PNG, GIF or WebP (max 5MB)</p>
                </div>
                <div className="flex-1">
                  <Label htmlFor="ourStoresImage" className="text-muted-foreground font-normal flex items-center gap-1.5">
                    <LinkIcon className="h-3.5 w-3.5" />
                    Or paste image URL
                  </Label>
                  <Input
                    id="ourStoresImage"
                    value={form.ourStoresImage.startsWith("data:") ? "" : form.ourStoresImage}
                    onChange={(e) => update("ourStoresImage", e.target.value)}
                    placeholder={
                      form.ourStoresImage.startsWith("data:")
                        ? "Image from file (paste URL to replace)"
                        : "https://… (recommended: wide image)"
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
            {form.ourStoresImage?.trim() && (
              <div className="sm:col-span-2">
                <div className="text-xs text-muted-foreground mb-2">Preview</div>
                <div className="w-full overflow-hidden rounded-md border bg-muted/20">
                  <img
                    src={form.ourStoresImage}
                    alt="Our Stores image preview"
                    className="w-full h-[180px] sm:h-[220px] object-cover"
                    loading="lazy"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Hero carousel */}
        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Hero section (homepage carousel)</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Add slides with image URL, title, and subtitle. Order is preserved.
          </p>
          <div className="space-y-6">
            {form.heroSlides.map((slide, index) => (
              <div key={index} className="flex flex-col gap-4 p-4 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Slide {index + 1}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeHeroSlide(index)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Image URL</Label>
                  <Input
                    value={slide.image}
                    onChange={(e) => updateHeroSlide(index, "image", e.target.value)}
                    placeholder="https://… or base64 data URL"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={slide.title}
                    onChange={(e) => updateHeroSlide(index, "title", e.target.value)}
                    placeholder="e.g. Modern Furniture for Inspired Living"
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={slide.subtitle}
                    onChange={(e) => updateHeroSlide(index, "subtitle", e.target.value)}
                    placeholder="Short tagline"
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addHeroSlide}>
              <Plus className="h-4 w-4 mr-2" />
              Add slide
            </Button>
          </div>
        </section>

        {/* Social links */}
        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Social links (footer)</h2>
          <div className="space-y-4">
            {form.socialLinks.map((link, index) => (
              <div key={index} className="flex flex-wrap gap-2 items-center">
                <Input
                  placeholder="Name (e.g. Instagram)"
                  value={link.name}
                  onChange={(e) => updateSocialLink(index, "name", e.target.value)}
                  className="w-32"
                />
                <Input
                  placeholder="URL"
                  value={link.href}
                  onChange={(e) => updateSocialLink(index, "href", e.target.value)}
                  className="flex-1 min-w-[180px]"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSocialLink(index)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSocialLink}>
              <Plus className="h-4 w-4 mr-2" />
              Add social link
            </Button>
          </div>
        </section>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save site settings"}
        </Button>
      </form>
    </div>
  );
}
