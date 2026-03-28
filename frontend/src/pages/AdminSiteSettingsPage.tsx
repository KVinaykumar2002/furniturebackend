import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { api } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";
import {
  useSiteSettings,
  type SiteSettings,
  type AboutSection,
  getDefaultPromoStrip,
  type PromoStripStat,
  type PromoStripIconKey,
} from "@/hooks/useApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { LoadingSection } from "@/components/ui/loader";
import { Plus, Trash2, Upload, Link as LinkIcon } from "lucide-react";
import AdminStoresSection from "@/components/admin/AdminStoresSection";
import { cn, readFileAsDataUrl, htmlToPlainText } from "@/lib/utils";

type SiteSettingsForm = Omit<
  SiteSettings,
  | "completedProjectStats"
  | "testimonials"
  | "aboutPageHtml"
  | "aboutSections"
  | "faqs"
  | "blogsPageHtml"
  | "shippingPolicyHtml"
  | "returnPolicyHtml"
>;

const emptyCmsSection = (): AboutSection => ({ title: "", body: "" });

function sectionsForForm(apiSections: AboutSection[], legacyHtml: string): AboutSection[] {
  if (apiSections.length > 0) {
    return apiSections.map((s) => ({ ...s }));
  }
  const html = legacyHtml.trim();
  if (!html) return [emptyCmsSection()];
  return [{ title: "", body: htmlToPlainText(html) }];
}

function packCmsSections(arr: AboutSection[]): AboutSection[] {
  return arr
    .map((s) => ({ title: s.title.trim(), body: s.body.trim() }))
    .filter((s) => s.title || s.body);
}

function CmsPageSectionsEditor({
  idPrefix,
  heading,
  description,
  sections,
  onChange,
}: {
  idPrefix: string;
  heading: string;
  description?: string;
  sections: AboutSection[];
  onChange: (next: AboutSection[]) => void;
}) {
  const updateSection = (index: number, field: keyof AboutSection, value: string) => {
    const next = [...sections];
    if (!next[index]) return;
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };
  const addSection = () => onChange([...sections, emptyCmsSection()]);
  const removeSection = (index: number) => onChange(sections.filter((_, i) => i !== index));

  return (
    <div className="sm:col-span-2 space-y-4 rounded-lg border border-muted p-4 bg-muted/20">
      <div>
        <h3 className="text-base font-semibold text-foreground">{heading}</h3>
        {description ? <p className="text-sm text-muted-foreground mt-1">{description}</p> : null}
      </div>
      {sections.map((section, index) => (
        <div key={index} className="rounded-lg border bg-card p-4 space-y-3">
          <div className="flex justify-between gap-2">
            <span className="text-sm font-medium text-muted-foreground">Section {index + 1}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 text-muted-foreground hover:text-destructive"
              onClick={() => removeSection(index)}
              aria-label="Remove section"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div>
            <Label htmlFor={`${idPrefix}-title-${index}`}>Section title</Label>
            <Input
              id={`${idPrefix}-title-${index}`}
              value={section.title}
              onChange={(e) => updateSection(index, "title", e.target.value)}
              placeholder="e.g. Delivery timelines"
            />
          </div>
          <div>
            <Label htmlFor={`${idPrefix}-body-${index}`}>Section content</Label>
            <Textarea
              id={`${idPrefix}-body-${index}`}
              value={section.body}
              onChange={(e) => updateSection(index, "body", e.target.value)}
              rows={6}
              placeholder="Plain text. Use a blank line between paragraphs."
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" onClick={addSection}>
        <Plus className="h-4 w-4 mr-2" />
        Add section
      </Button>
    </div>
  );
}

function isoToDatetimeLocal(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function datetimeLocalToISO(s: string): string {
  if (!s.trim()) return "";
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString();
}

const PROMO_ICON_OPTIONS: { value: PromoStripIconKey; label: string }[] = [
  { value: "users", label: "People (customers)" },
  { value: "truck", label: "Truck (delivery)" },
  { value: "shield", label: "Shield (warranty)" },
  { value: "factory", label: "Factory (mfg.)" },
];

const emptyPromoStat = (): PromoStripStat => ({
  iconKey: "users",
  value: "",
  label: "",
});

export default function AdminSiteSettingsPage() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const { settings, isPending, isError } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [uploadingStoreImage, setUploadingStoreImage] = useState(false);
  const [storeImageDropZoneActive, setStoreImageDropZoneActive] = useState(false);
  const [promoSaleEndLocal, setPromoSaleEndLocal] = useState("");
  const [form, setForm] = useState<SiteSettingsForm>({
    contactPhone: "",
    contactEmail: "",
    address: "",
    brandTagline: "",
    ourStoresImage: "",
    heroSlides: [],
    socialLinks: [],
    promoStrip: getDefaultPromoStrip(),
    blogsFooterLabel: "Blogs",
    blogsFooterHref: "/blogs",
    blogsSections: [emptyCmsSection()],
    shippingPolicySections: [emptyCmsSection()],
    returnPolicySections: [emptyCmsSection()],
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
        promoStrip: {
          ...settings.promoStrip,
          stats: settings.promoStrip.stats.map((s) => ({ ...s })),
        },
        blogsFooterLabel: settings.blogsFooterLabel ?? "Blogs",
        blogsFooterHref: settings.blogsFooterHref ?? "/blogs",
        blogsSections: sectionsForForm(settings.blogsSections, settings.blogsPageHtml),
        shippingPolicySections: sectionsForForm(
          settings.shippingPolicySections,
          settings.shippingPolicyHtml
        ),
        returnPolicySections: sectionsForForm(settings.returnPolicySections, settings.returnPolicyHtml),
      });
      setPromoSaleEndLocal(isoToDatetimeLocal(settings.promoStrip.saleEndsAt));
    }
  }, [settings]);

  useEffect(() => {
    if (location.hash === "#admin-store-locations") {
      requestAnimationFrame(() => {
        document.getElementById("admin-store-locations")?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [location.hash, location.pathname]);

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

  const updatePromoStat = (index: number, field: keyof PromoStripStat, value: string) => {
    setForm((prev) => {
      const stats = [...prev.promoStrip.stats];
      if (!stats[index]) return prev;
      if (field === "iconKey") {
        stats[index] = { ...stats[index], iconKey: value as PromoStripIconKey };
      } else {
        stats[index] = { ...stats[index], [field]: value };
      }
      return { ...prev, promoStrip: { ...prev.promoStrip, stats } };
    });
  };

  const addPromoStat = () => {
    setForm((prev) => ({
      ...prev,
      promoStrip: { ...prev.promoStrip, stats: [...prev.promoStrip.stats, emptyPromoStat()] },
    }));
  };

  const removePromoStat = (index: number) => {
    setForm((prev) => ({
      ...prev,
      promoStrip: {
        ...prev.promoStrip,
        stats: prev.promoStrip.stats.filter((_, i) => i !== index),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const saleEndsAt =
      datetimeLocalToISO(promoSaleEndLocal) || form.promoStrip.saleEndsAt;
    const promoStrip = {
      ...form.promoStrip,
      saleEndsAt,
      stats: form.promoStrip.stats
        .map((s) => ({
          iconKey: s.iconKey,
          value: s.value.trim(),
          label: s.label.trim(),
        }))
        .filter((s) => s.value || s.label),
    };
    if (!promoStrip.stats.length) {
      toast.error("Promo strip: add at least one stat (value or label).");
      return;
    }
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
        promoStrip,
        blogsFooterLabel: form.blogsFooterLabel.trim() || "Blogs",
        blogsFooterHref: form.blogsFooterHref.trim() || "/blogs",
        blogsSections: packCmsSections(form.blogsSections),
        shippingPolicySections: packCmsSections(form.shippingPolicySections),
        returnPolicySections: packCmsSections(form.returnPolicySections),
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
        Manage contact details, store locations, homepage store image, promo banner, hero carousel, and footer
        links. The same promo fields are on the{" "}
        <Link to="/admin/promo-strip" className="text-foreground underline hover:no-underline">
          Promo strip
        </Link>{" "}
        page.
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

        {/* Footer: Blogs link + policy page content (About & FAQs have their own admin pages) */}
        <section className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Blogs & policy pages</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Footer “Blogs” link and structured content for <code className="text-xs">/blogs</code>,{" "}
            <code className="text-xs">/shipping-policy</code>, and <code className="text-xs">/return-policy</code>.
            Add sections with a title and plain text (blank line = new paragraph). Edit{" "}
            <strong>About</strong> and <strong>FAQs</strong> from the admin sidebar.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="blogsFooterLabel">Footer label (Blogs)</Label>
              <Input
                id="blogsFooterLabel"
                value={form.blogsFooterLabel}
                onChange={(e) => update("blogsFooterLabel", e.target.value)}
                placeholder="Blogs"
              />
            </div>
            <div>
              <Label htmlFor="blogsFooterHref">Footer URL</Label>
              <Input
                id="blogsFooterHref"
                value={form.blogsFooterHref}
                onChange={(e) => update("blogsFooterHref", e.target.value)}
                placeholder="/blogs or https://…"
              />
            </div>
            <CmsPageSectionsEditor
              idPrefix="cms-blogs"
              heading="Blogs page"
              description="Shown on /blogs."
              sections={form.blogsSections}
              onChange={(next) => setForm((p) => ({ ...p, blogsSections: next }))}
            />
            <CmsPageSectionsEditor
              idPrefix="cms-shipping"
              heading="Shipping policy"
              description="Shown on /shipping-policy."
              sections={form.shippingPolicySections}
              onChange={(next) => setForm((p) => ({ ...p, shippingPolicySections: next }))}
            />
            <CmsPageSectionsEditor
              idPrefix="cms-return"
              heading="Return policy"
              description="Shown on /return-policy."
              sections={form.returnPolicySections}
              onChange={(next) => setForm((p) => ({ ...p, returnPolicySections: next }))}
            />
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

        <AdminStoresSection />

        {/* Promo strip (homepage banner) */}
        <section className="rounded-lg border bg-card p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Promo strip (homepage banner)</h2>
            <p className="text-sm text-muted-foreground">
              Sale countdown, store callout, and trust stats below the hero.
            </p>
          </div>

          <div className="space-y-4 border-b pb-6">
            <h3 className="text-sm font-medium text-foreground">Sale countdown</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="site-promo-saleTitle">Sale title (large)</Label>
                <Input
                  id="site-promo-saleTitle"
                  value={form.promoStrip.saleTitle}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      promoStrip: { ...p.promoStrip, saleTitle: e.target.value },
                    }))
                  }
                  placeholder="SALE"
                />
              </div>
              <div>
                <Label htmlFor="site-promo-saleSubtitle">Sale subtitle</Label>
                <Input
                  id="site-promo-saleSubtitle"
                  value={form.promoStrip.saleSubtitle}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      promoStrip: { ...p.promoStrip, saleSubtitle: e.target.value },
                    }))
                  }
                  placeholder="Ends In"
                />
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="site-promo-saleEndsAt">Sale ends at (local time)</Label>
                <Input
                  id="site-promo-saleEndsAt"
                  type="datetime-local"
                  value={promoSaleEndLocal}
                  onChange={(e) => setPromoSaleEndLocal(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 border-b pb-6">
            <h3 className="text-sm font-medium text-foreground">Store callout</h3>
            <div>
              <Label htmlFor="site-promo-storeLine1">First line</Label>
              <Input
                id="site-promo-storeLine1"
                value={form.promoStrip.storeLine1}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    promoStrip: { ...p.promoStrip, storeLine1: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="site-promo-storeLine2">Second line (emphasized)</Label>
              <Input
                id="site-promo-storeLine2"
                value={form.promoStrip.storeLine2}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    promoStrip: { ...p.promoStrip, storeLine2: e.target.value },
                  }))
                }
              />
            </div>
            <div>
              <Label htmlFor="site-promo-storeHref">Link</Label>
              <Input
                id="site-promo-storeHref"
                value={form.promoStrip.storeHref}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    promoStrip: { ...p.promoStrip, storeHref: e.target.value },
                  }))
                }
                placeholder="/stores"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground">Trust stats</h3>
            {form.promoStrip.stats.map((row, index) => (
              <div
                key={index}
                className="grid gap-3 sm:grid-cols-12 items-end p-4 border rounded-lg bg-muted/30"
              >
                <div className="sm:col-span-3">
                  <Label>Icon</Label>
                  <Select
                    value={row.iconKey}
                    onValueChange={(v) => updatePromoStat(index, "iconKey", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PROMO_ICON_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="sm:col-span-4">
                  <Label htmlFor={`site-promo-stat-val-${index}`}>Value (bold)</Label>
                  <Input
                    id={`site-promo-stat-val-${index}`}
                    value={row.value}
                    onChange={(e) => updatePromoStat(index, "value", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-4">
                  <Label htmlFor={`site-promo-stat-lab-${index}`}>Label</Label>
                  <Input
                    id={`site-promo-stat-lab-${index}`}
                    value={row.label}
                    onChange={(e) => updatePromoStat(index, "label", e.target.value)}
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end pb-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => removePromoStat(index)}
                    aria-label="Remove stat"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addPromoStat}>
              <Plus className="h-4 w-4 mr-2" />
              Add stat
            </Button>
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
