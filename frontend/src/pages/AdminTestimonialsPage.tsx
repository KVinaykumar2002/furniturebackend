import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  useSiteSettings,
  type SiteSettings,
  type Testimonial,
  DEFAULT_TESTIMONIALS,
} from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LoadingSection } from "@/components/ui/loader";
import { Plus, Trash2 } from "lucide-react";

const emptyRow = (): Testimonial => ({
  name: "",
  role: "",
  rating: 5,
  text: "",
  avatar: "",
  imageUrl: "",
  videoUrl: "",
});

export default function AdminTestimonialsPage() {
  const queryClient = useQueryClient();
  const { settings, isPending, isError } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (!settings) return;
    if (settings.testimonials.length > 0) {
      setRows(settings.testimonials.map((t) => ({ ...t })));
    } else {
      setRows([]);
    }
  }, [settings]);

  const updateRow = (index: number, field: keyof Testimonial, value: string | number) => {
    setRows((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addRow = () => setRows((prev) => [...prev, emptyRow()]);

  const removeRow = (index: number) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const testimonials: Testimonial[] = rows
      .map((t) => ({
        name: t.name.trim(),
        role: t.role.trim(),
        rating: Math.min(5, Math.max(1, Math.round(Number(t.rating)) || 5)),
        text: t.text.trim(),
        avatar: t.avatar.trim(),
        imageUrl: t.imageUrl.trim(),
        videoUrl: t.videoUrl.trim(),
      }))
      .filter((t) => t.name && t.text);

    setSaving(true);
    try {
      await api.siteSettings.update({ testimonials }, { minimal: true });
      queryClient.setQueryData<SiteSettings | undefined>(["siteSettings"], (prev) => {
        if (!prev) return prev;
        return { ...prev, testimonials };
      });
      toast.success("Testimonials saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const loadDefaults = () => {
    setRows(DEFAULT_TESTIMONIALS.map((t) => ({ ...t })));
    toast.info("Defaults loaded — click Save to store them.");
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSection label="Loading testimonials…" size="md" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h1 className="font-display text-2xl font-light text-foreground mb-2">Testimonials</h1>
        <p className="text-sm text-destructive">Unable to load settings. Please refresh.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-light text-foreground mb-2">Testimonials</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Homepage carousel under &quot;What Our Customers Say&quot;. Each card can include an image URL and optional
        video (direct file URL or YouTube/Vimeo link). Order is preserved.
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        <Button type="button" variant="outline" size="sm" onClick={loadDefaults}>
          Load default examples
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-6">
          {rows.length === 0 && (
            <p className="text-sm text-muted-foreground border rounded-lg p-4 bg-muted/30">
              No testimonials — the homepage section will show an empty state until you add one.
            </p>
          )}
          {rows.map((row, index) => (
            <div key={index} className="rounded-lg border bg-card p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">Testimonial {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRow(index)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`t-name-${index}`}>Name *</Label>
                  <Input
                    id={`t-name-${index}`}
                    value={row.name}
                    onChange={(e) => updateRow(index, "name", e.target.value)}
                    placeholder="e.g. Priya S."
                  />
                </div>
                <div>
                  <Label htmlFor={`t-role-${index}`}>Location / role</Label>
                  <Input
                    id={`t-role-${index}`}
                    value={row.role}
                    onChange={(e) => updateRow(index, "role", e.target.value)}
                    placeholder="e.g. Hyderabad"
                  />
                </div>
                <div>
                  <Label htmlFor={`t-avatar-${index}`}>Avatar initials</Label>
                  <Input
                    id={`t-avatar-${index}`}
                    value={row.avatar}
                    onChange={(e) => updateRow(index, "avatar", e.target.value)}
                    placeholder="e.g. PS"
                    maxLength={8}
                  />
                </div>
                <div>
                  <Label htmlFor={`t-rating-${index}`}>Rating (1–5)</Label>
                  <Input
                    id={`t-rating-${index}`}
                    type="number"
                    min={1}
                    max={5}
                    value={row.rating}
                    onChange={(e) => updateRow(index, "rating", Number(e.target.value) || 5)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`t-text-${index}`}>Quote *</Label>
                  <Textarea
                    id={`t-text-${index}`}
                    value={row.text}
                    onChange={(e) => updateRow(index, "text", e.target.value)}
                    placeholder="Customer review text"
                    rows={3}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`t-image-${index}`}>Image URL (card photo)</Label>
                  <Input
                    id={`t-image-${index}`}
                    value={row.imageUrl}
                    onChange={(e) => updateRow(index, "imageUrl", e.target.value)}
                    placeholder="https://…"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`t-video-${index}`}>Video URL (optional)</Label>
                  <Input
                    id={`t-video-${index}`}
                    value={row.videoUrl}
                    onChange={(e) => updateRow(index, "videoUrl", e.target.value)}
                    placeholder="YouTube, Vimeo, or direct .mp4 URL"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={addRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add testimonial
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save testimonials"}
          </Button>
        </div>
      </form>
    </div>
  );
}
