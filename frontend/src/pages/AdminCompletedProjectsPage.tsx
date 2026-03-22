import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  useSiteSettings,
  DEFAULT_COMPLETED_PROJECT_STATS,
  type CompletedProjectStat,
  type SiteSettings,
} from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LoadingSection } from "@/components/ui/loader";

export default function AdminCompletedProjectsPage() {
  const queryClient = useQueryClient();
  const { settings, isPending, isError } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<CompletedProjectStat[]>([...DEFAULT_COMPLETED_PROJECT_STATS]);

  useEffect(() => {
    if (settings?.completedProjectStats?.length) {
      setRows([...settings.completedProjectStats]);
    }
  }, [settings]);

  const updateRow = (index: number, field: "label" | "value", value: string) => {
    setRows((prev) => {
      const next = [...prev];
      if (!next[index]) return prev;
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const completedProjectStats: CompletedProjectStat[] = rows.map((row) => ({
        label: row.label.trim(),
        value: row.value.trim(),
      }));
      await api.siteSettings.update({ completedProjectStats }, { minimal: true });
      queryClient.setQueryData<SiteSettings | undefined>(["siteSettings"], (prev) => {
        if (!prev) return prev;
        return { ...prev, completedProjectStats };
      });
      toast.success("Completed projects saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSection label="Loading completed projects…" size="md" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h1 className="font-display text-2xl font-light text-foreground mb-2">Completed projects</h1>
        <p className="text-sm text-destructive">Unable to load settings. Please refresh and try again.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-light text-foreground mb-2">Completed projects</h1>
      <p className="text-muted-foreground text-sm mb-8">
        Manage the three stats under &quot;Completed Projects&quot; on the homepage. Icons stay in order: building,
        sofa, people.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-lg border bg-card p-6">
          <div className="space-y-4">
            {rows.map((row, index) => (
              <div
                key={index}
                className="grid gap-3 sm:grid-cols-2 p-4 border rounded-lg bg-muted/30"
              >
                <div>
                  <Label htmlFor={`completed-stat-label-${index}`}>Row {index + 1} — label</Label>
                  <Input
                    id={`completed-stat-label-${index}`}
                    value={row.label}
                    onChange={(e) => updateRow(index, "label", e.target.value)}
                    placeholder="e.g. Fit-out"
                  />
                </div>
                <div>
                  <Label htmlFor={`completed-stat-value-${index}`}>Display value</Label>
                  <Input
                    id={`completed-stat-value-${index}`}
                    value={row.value}
                    onChange={(e) => updateRow(index, "value", e.target.value)}
                    placeholder="e.g. 553 or 10,154"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save completed projects"}
        </Button>
      </form>
    </div>
  );
}
