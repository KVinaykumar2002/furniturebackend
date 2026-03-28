import { useSiteSettings } from "@/hooks/useApi";
import CmsPageLayout, { CmsHtmlBody, CmsStructuredSections } from "@/components/CmsPageLayout";
import { LoadingSection } from "@/components/ui/loader";

export default function ShippingPolicyPage() {
  const { settings, isPending, isError } = useSiteSettings();

  if (isPending) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSection label="Loading…" size="md" />
      </div>
    );
  }

  if (isError || !settings) {
    return (
      <CmsPageLayout title="Shipping Policy">
        <p className="text-muted-foreground">Could not load this page.</p>
      </CmsPageLayout>
    );
  }

  const hasSections = settings.shippingPolicySections.some((s) => s.title.trim() || s.body.trim());

  return (
    <CmsPageLayout title="Shipping Policy">
      {hasSections ? (
        <CmsStructuredSections sections={settings.shippingPolicySections} emptyMessage="No shipping policy yet." />
      ) : (
        <CmsHtmlBody html={settings.shippingPolicyHtml} emptyMessage="No shipping policy yet." />
      )}
    </CmsPageLayout>
  );
}
