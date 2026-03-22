import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import {
  useSiteSettings,
  type SiteSettings,
  type PromoStripConfig,
  type PromoStripStat,
  type PromoStripIconKey,
  getDefaultPromoStrip,
} from "@/hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LoadingSection } from "@/components/ui/loader";
import { Plus, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const ICON_OPTIONS: { value: PromoStripIconKey; label: string }[] = [
  { value: "users", label: "People (customers)" },
  { value: "truck", label: "Truck (delivery)" },
  { value: "shield", label: "Shield (warranty)" },
  { value: "factory", label: "Factory (mfg.)" },
];

const emptyStat = (): PromoStripStat => ({
  iconKey: "users",
  value: "",
  label: "",
});

export default function AdminPromoStripPage() {
  const queryClient = useQueryClient();
  const { settings, isPending, isError } = useSiteSettings();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PromoStripConfig>(getDefaultPromoStrip());
  const [saleEndLocal, setSaleEndLocal] = useState("");

  useEffect(() => {
    if (settings?.promoStrip) {
      setForm({
        ...settings.promoStrip,
        stats: settings.promoStrip.stats.map((s) => ({ ...s })),
      });
      setSaleEndLocal(isoToDatetimeLocal(settings.promoStrip.saleEndsAt));
    }
  }, [settings]);

  const updateStat = (index: number, field: keyof PromoStripStat, value: string) => {
    setForm((prev) => {
      const stats = [...prev.stats];
      if (!stats[index]) return prev;
      if (field === "iconKey") {
        stats[index] = { ...stats[index], iconKey: value as PromoStripIconKey };
      } else {
        stats[index] = { ...stats[index], [field]: value };
      }
      return { ...prev, stats };
    });
  };

  const addStat = () => setForm((prev) => ({ ...prev, stats: [...prev.stats, emptyStat()] }));

  const removeStat = (index: number) => {
    setForm((prev) => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const saleEndsAt = datetimeLocalToISO(saleEndLocal) || form.saleEndsAt;
    const promoStrip: PromoStripConfig = {
      ...form,
      saleEndsAt,
      stats: form.stats
        .map((s) => ({
          iconKey: s.iconKey,
          value: s.value.trim(),
          label: s.label.trim(),
        }))
        .filter((s) => s.value || s.label),
    };
    if (!promoStrip.stats.length) {
      toast.error("Add at least one stat row (value or label).");
      return;
    }
    setSaving(true);
    try {
      await api.siteSettings.update({ promoStrip }, { minimal: true });
      queryClient.setQueryData<SiteSettings | undefined>(["siteSettings"], (prev) => {
        if (!prev) return prev;
        return { ...prev, promoStrip };
      });
      toast.success("Promo strip saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const loadDefaults = () => {
    const d = getDefaultPromoStrip();
    setForm(d);
    setSaleEndLocal(isoToDatetimeLocal(d.saleEndsAt));
    toast.info("Defaults loaded — click Save to store.");
  };

  if (isPending) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSection label="Loading promo strip…" size="md" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border bg-card p-6">
        <h1 className="font-display text-2xl font-light text-foreground mb-2">Promo strip</h1>
        <p className="text-sm text-destructive">Unable to load settings.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-light text-foreground mb-2">Promo strip</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Homepage banner: sale countdown, store callout, and trust stats (icons are fixed sets).
      </p>

      <Button type="button" variant="outline" size="sm" className="mb-6" onClick={loadDefaults}>
        Reset form to defaults
      </Button>

      <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Sale countdown</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="saleTitle">Sale title (large)</Label>
              <Input
                id="saleTitle"
                value={form.saleTitle}
                onChange={(e) => setForm((p) => ({ ...p, saleTitle: e.target.value }))}
                placeholder="SALE"
              />
            </div>
            <div>
              <Label htmlFor="saleSubtitle">Sale subtitle</Label>
              <Input
                id="saleSubtitle"
                value={form.saleSubtitle}
                onChange={(e) => setForm((p) => ({ ...p, saleSubtitle: e.target.value }))}
                placeholder="Ends In"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="saleEndsAt">Sale ends at (local time)</Label>
              <Input
                id="saleEndsAt"
                type="datetime-local"
                value={saleEndLocal}
                onChange={(e) => setSaleEndLocal(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Timer counts down to this moment.</p>
            </div>
          </div>
        </section>

        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Store callout</h2>
          <div>
            <Label htmlFor="storeLine1">First line</Label>
            <Input
              id="storeLine1"
              value={form.storeLine1}
              onChange={(e) => setForm((p) => ({ ...p, storeLine1: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="storeLine2">Second line (emphasized)</Label>
            <Input
              id="storeLine2"
              value={form.storeLine2}
              onChange={(e) => setForm((p) => ({ ...p, storeLine2: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="storeHref">Link (path or URL)</Label>
            <Input
              id="storeHref"
              value={form.storeHref}
              onChange={(e) => setForm((p) => ({ ...p, storeHref: e.target.value }))}
              placeholder="/stores"
            />
          </div>
        </section>

        <section className="rounded-lg border bg-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">Trust stats</h2>
          <p className="text-sm text-muted-foreground">Order matches left-to-right on the site.</p>
          {form.stats.map((row, index) => (
            <div
              key={index}
              className="grid gap-3 sm:grid-cols-12 items-end p-4 border rounded-lg bg-muted/30"
            >
              <div className="sm:col-span-3">
                <Label>Icon</Label>
                <Select
                  value={row.iconKey}
                  onValueChange={(v) => updateStat(index, "iconKey", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-4">
                <Label htmlFor={`stat-val-${index}`}>Value (bold)</Label>
                <Input
                  id={`stat-val-${index}`}
                  value={row.value}
                  onChange={(e) => updateStat(index, "value", e.target.value)}
                  placeholder="20 Lakh+"
                />
              </div>
              <div className="sm:col-span-4">
                <Label htmlFor={`stat-lab-${index}`}>Label</Label>
                <Input
                  id={`stat-lab-${index}`}
                  value={row.label}
                  onChange={(e) => updateStat(index, "label", e.target.value)}
                  placeholder="Customers"
                />
              </div>
              <div className="sm:col-span-1 flex justify-end pb-0.5">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeStat(index)}
                  className="text-destructive shrink-0"
                  aria-label="Remove stat"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addStat}>
            <Plus className="h-4 w-4 mr-2" />
            Add stat
          </Button>
        </section>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save promo strip"}
        </Button>
      </form>
    </div>
  );
}
