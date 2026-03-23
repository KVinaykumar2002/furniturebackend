import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { useSiteSettings, type SiteSettings, type FaqItem } from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LoadingSection } from "@/components/ui/loader";
import { Plus, Trash2 } from "lucide-react";

const emptyRow = (): FaqItem => ({ question: "", answer: "" });

export default function AdminFaqsPage() {
  const queryClient = useQueryClient();
  const { settings, isPending, isError } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<FaqItem[]>([]);

  useEffect(() => {
    if (!settings) return;
    setRows(settings.faqs.length > 0 ? settings.faqs.map((f) => ({ ...f })) : []);
  }, [settings]);

  const updateRow = (index: number, field: keyof FaqItem, value: string) => {
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
    const faqs: FaqItem[] = rows
      .map((f) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
      }))
      .filter((f) => f.question && f.answer);

    setSaving(true);
    try {
      await api.siteSettings.update({ faqs }, { minimal: true });
      queryClient.setQueryData<SiteSettings | undefined>(["siteSettings"], (prev) => {
        if (!prev) return prev;
        return { ...prev, faqs };
      });
      toast.success("FAQs saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSection label="Loading FAQs…" size="md" />
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
      <h1 className="font-display text-2xl font-light text-foreground mb-2">FAQs</h1>
      <p className="text-muted-foreground text-sm mb-8 max-w-xl">
        Questions and answers shown on the public <strong>/faq</strong> page.
      </p>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        {rows.map((row, index) => (
          <div key={index} className="rounded-lg border bg-card p-4 space-y-3">
            <div className="flex justify-between gap-2">
              <span className="text-sm font-medium text-muted-foreground">FAQ {index + 1}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => removeRow(index)}
                aria-label="Remove FAQ"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label htmlFor={`faq-q-${index}`}>Question</Label>
              <Input
                id={`faq-q-${index}`}
                value={row.question}
                onChange={(e) => updateRow(index, "question", e.target.value)}
                placeholder="Question"
              />
            </div>
            <div>
              <Label htmlFor={`faq-a-${index}`}>Answer</Label>
              <Textarea
                id={`faq-a-${index}`}
                value={row.answer}
                onChange={(e) => updateRow(index, "answer", e.target.value)}
                placeholder="Answer"
                rows={4}
              />
            </div>
          </div>
        ))}
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="outline" onClick={addRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}
