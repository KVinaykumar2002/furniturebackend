import { useState, useEffect } from "react";
import { useNavigate, useParams, Link, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { LoadingSection } from "@/components/ui/loader";

const emptyForm = {
  id: "",
  name: "",
  address: "",
  city: "",
  mapLink: "",
  mapEmbedUrl: "",
  mapLat: "",
  mapLng: "",
  mapSearchQuery: "",
  phone: "",
  hours: "",
};

function numToInput(n: number | undefined): string {
  if (n == null || !Number.isFinite(n)) return "";
  return String(n);
}

export default function AdminStoreFormPage() {
  const { id: editId } = useParams<{ id: string }>();
  const location = useLocation();
  const isNew = location.pathname === "/admin/stores/new";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (isNew) {
      setForm(emptyForm);
      setLoading(false);
      return;
    }
    if (!editId) return;
    let cancelled = false;
    (async () => {
      try {
        const s = await api.stores.byId(editId);
        if (cancelled) return;
        setForm({
          id: String(s.id ?? ""),
          name: String(s.name ?? ""),
          address: String(s.address ?? ""),
          city: String(s.city ?? ""),
          mapLink: String(s.mapLink ?? ""),
          mapEmbedUrl: String(s.mapEmbedUrl ?? ""),
          mapLat: numToInput(s.mapLat as number | undefined),
          mapLng: numToInput(s.mapLng as number | undefined),
          mapSearchQuery: String(s.mapSearchQuery ?? ""),
          phone: String(s.phone ?? ""),
          hours: String(s.hours ?? ""),
        });
      } catch {
        toast.error("Failed to load store");
        navigate("/admin/site-settings#admin-store-locations");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isNew, editId, navigate]);

  const update = (key: keyof typeof emptyForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const buildPayload = (forCreate: boolean): Record<string, unknown> => {
    const id = form.id.trim().toLowerCase().replace(/\s+/g, "-");
    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      mapLink: form.mapLink.trim(),
    };
    if (forCreate) payload.id = id;
    const embed = form.mapEmbedUrl.trim();
    if (embed) payload.mapEmbedUrl = embed;
    const lat = form.mapLat.trim();
    const lng = form.mapLng.trim();
    if (lat) payload.mapLat = Number(lat);
    if (lng) payload.mapLng = Number(lng);
    const msq = form.mapSearchQuery.trim();
    if (msq) payload.mapSearchQuery = msq;
    const phone = form.phone.trim();
    if (phone) payload.phone = phone;
    const hours = form.hours.trim();
    if (hours) payload.hours = hours;
    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isNew && !form.id.trim()) {
      toast.error("Store ID is required (e.g. kondapur)");
      return;
    }
    if (!form.name.trim() || !form.address.trim() || !form.city.trim() || !form.mapLink.trim()) {
      toast.error("Name, address, city, and Google Maps link are required");
      return;
    }
    setSaving(true);
    try {
      if (isNew) {
        await api.stores.create(buildPayload(true));
        toast.success("Store created");
      } else if (editId) {
        await api.stores.update(editId, buildPayload(false));
        toast.success("Store updated");
      }
      await queryClient.invalidateQueries({ queryKey: ["stores"] });
      if (editId) await queryClient.invalidateQueries({ queryKey: ["store", editId] });
      navigate("/admin/site-settings#admin-store-locations");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <LoadingSection label="Loading store…" size="md" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <Link
        to="/admin/site-settings#admin-store-locations"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to site settings
      </Link>
      <h1 className="font-display text-2xl font-light text-foreground mb-2">
        {isNew ? "Add store" : "Edit store"}
      </h1>
      <p className="text-sm text-muted-foreground mb-8">
        IDs are used in URLs (e.g. <span className="font-mono">/stores/kondapur</span>). Use lowercase letters, numbers,
        and hyphens only.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="store-id">Store ID *</Label>
            <Input
              id="store-id"
              value={form.id}
              onChange={(e) => update("id", e.target.value)}
              placeholder="e.g. kondapur"
              disabled={!isNew}
              className="font-mono"
              required={isNew}
            />
            {!isNew && <p className="text-xs text-muted-foreground mt-1">ID cannot be changed after creation.</p>}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="store-name">Display name *</Label>
            <Input
              id="store-name"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="e.g. Kondapur"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="store-address">Address *</Label>
            <Textarea
              id="store-address"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="Street, area…"
              rows={2}
              required
            />
          </div>
          <div>
            <Label htmlFor="store-city">City *</Label>
            <Input
              id="store-city"
              value={form.city}
              onChange={(e) => update("city", e.target.value)}
              placeholder="e.g. Hyderabad"
              required
            />
          </div>
          <div>
            <Label htmlFor="store-phone">Phone</Label>
            <Input
              id="store-phone"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="Optional"
              type="tel"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="store-hours">Hours</Label>
            <Input
              id="store-hours"
              value={form.hours}
              onChange={(e) => update("hours", e.target.value)}
              placeholder="Optional, e.g. Mon–Sat 10–8"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="store-map-link">Google Maps link *</Label>
            <Input
              id="store-map-link"
              value={form.mapLink}
              onChange={(e) => update("mapLink", e.target.value)}
              placeholder="https://maps.app.goo.gl/… or maps.google.com/…"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">Used for “Open in Google Maps”.</p>
          </div>
          <div>
            <Label htmlFor="store-lat">Latitude</Label>
            <Input
              id="store-lat"
              value={form.mapLat}
              onChange={(e) => update("mapLat", e.target.value)}
              placeholder="Optional"
              inputMode="decimal"
            />
          </div>
          <div>
            <Label htmlFor="store-lng">Longitude</Label>
            <Input
              id="store-lng"
              value={form.mapLng}
              onChange={(e) => update("mapLng", e.target.value)}
              placeholder="Optional"
              inputMode="decimal"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="store-map-search">Map search query</Label>
            <Input
              id="store-map-search"
              value={form.mapSearchQuery}
              onChange={(e) => update("mapSearchQuery", e.target.value)}
              placeholder="Optional — same place name as in Google Maps for embed pin"
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="store-embed">Embed map URL</Label>
            <Input
              id="store-embed"
              value={form.mapEmbedUrl}
              onChange={(e) => update("mapEmbedUrl", e.target.value)}
              placeholder="Leave blank to auto-build from coordinates or address"
            />
            <p className="text-xs text-muted-foreground mt-1">
              If empty, the server builds an embed URL from lat/lng, or from address + city.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : isNew ? "Create store" : "Save changes"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link to="/admin/site-settings#admin-store-locations">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
