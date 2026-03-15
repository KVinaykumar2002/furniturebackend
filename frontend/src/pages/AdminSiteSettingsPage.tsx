import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useSiteSettings, type SiteSettings } from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LoadingSection } from "@/components/ui/loader";
import { Plus, Trash2 } from "lucide-react";

export default function AdminSiteSettingsPage() {
  const queryClient = useQueryClient();
  const { settings, isPending, isError } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<SiteSettings>({
    contactPhone: "",
    contactEmail: "",
    address: "",
    brandTagline: "",
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
        heroSlides: settings.heroSlides?.length ? [...settings.heroSlides] : [],
        socialLinks: settings.socialLinks?.length ? [...settings.socialLinks] : [],
      });
    }
  }, [settings]);

  const update = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

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
        Manage contact details, address, and hero section for the storefront.
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
