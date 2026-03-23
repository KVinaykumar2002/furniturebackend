import { useSiteSettings } from "@/hooks/useApi";
import CmsPageLayout, { CmsHtmlBody } from "@/components/CmsPageLayout";
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

  return (
    <CmsPageLayout title="Shipping Policy">
      <CmsHtmlBody
        html={settings.shippingPolicyHtml}
        emptyMessage="No shipping policy yet. Add it in Admin → Site Settings."
      />
    </CmsPageLayout>
  );
}
