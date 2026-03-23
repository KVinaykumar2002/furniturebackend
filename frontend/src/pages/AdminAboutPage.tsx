import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useSiteSettings, type SiteSettings } from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LoadingSection } from "@/components/ui/loader";

export default function AdminAboutPage() {
  const queryClient = useQueryClient();
  const { settings, isPending, isError } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [aboutPageHtml, setAboutPageHtml] = useState("");

  useEffect(() => {
    if (!settings) return;
    setAboutPageHtml(settings.aboutPageHtml ?? "");
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.siteSettings.update({ aboutPageHtml }, { minimal: true });
      queryClient.setQueryData<SiteSettings | undefined>(["siteSettings"], (prev) =>
        prev ? { ...prev, aboutPageHtml } : prev
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
        Content for the public <strong>/about</strong> page. You can use basic HTML (headings, paragraphs,
        lists, links).
      </p>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        <div>
          <Label htmlFor="aboutPageHtml">About page HTML</Label>
          <Textarea
            id="aboutPageHtml"
            value={aboutPageHtml}
            onChange={(e) => setAboutPageHtml(e.target.value)}
            rows={20}
            className="font-mono text-sm mt-2"
            placeholder="<p>Your brand story…</p>"
          />
        </div>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save"}
        </Button>
      </form>
    </div>
  );
}
