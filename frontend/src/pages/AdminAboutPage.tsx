import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useSiteSettings, type SiteSettings, type AboutSection } from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LoadingSection } from "@/components/ui/loader";
import { Plus, Trash2 } from "lucide-react";

const emptySection = (): AboutSection => ({ title: "", body: "" });

export default function AdminAboutPage() {
  const queryClient = useQueryClient();
  const { settings, isPending, isError } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<AboutSection[]>([]);

  useEffect(() => {
    if (!settings) return;
    setSections(
      settings.aboutSections.length > 0
        ? settings.aboutSections.map((s) => ({ ...s }))
        : [emptySection()]
    );
  }, [settings]);

  const updateSection = (index: number, field: keyof AboutSection, value: string) => {
    setSections((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addSection = () => setSections((prev) => [...prev, emptySection()]);
  const removeSection = (index: number) => setSections((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const aboutSections = sections
      .map((s) => ({
        title: s.title.trim(),
        body: s.body.trim(),
      }))
      .filter((s) => s.title || s.body);
    setSaving(true);
    try {
      await api.siteSettings.update({ aboutSections }, { minimal: true });
      queryClient.setQueryData<SiteSettings | undefined>(["siteSettings"], (prev) =>
        prev ? { ...prev, aboutSections } : prev
      );
      toast.success("About page saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSection label="Loading…" size="md" />
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-destructive text-sm">Could not load site settings. Try again later.</p>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-light text-foreground mb-2">About page</h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-xl">
        Content for the public <strong>/about</strong> page. Add sections with title and paragraph text.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
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
              <Label htmlFor={`about-title-${index}`}>Section title</Label>
              <Input
                id={`about-title-${index}`}
                value={section.title}
                onChange={(e) => updateSection(index, "title", e.target.value)}
                placeholder="e.g. Brand Story"
              />
            </div>
            <div>
              <Label htmlFor={`about-body-${index}`}>Section content</Label>
              <Textarea
                id={`about-body-${index}`}
                value={section.body}
                onChange={(e) => updateSection(index, "body", e.target.value)}
                rows={6}
                placeholder="Write section content here..."
              />
            </div>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addSection}>
          <Plus className="h-4 w-4 mr-2" />
          Add section
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </form>
    </div>
  );
}
