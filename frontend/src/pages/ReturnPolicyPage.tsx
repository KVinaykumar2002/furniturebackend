import { useSiteSettings } from "@/hooks/useApi";
import CmsPageLayout, { CmsHtmlBody, CmsStructuredSections } from "@/components/CmsPageLayout";
import { LoadingSection } from "@/components/ui/loader";

export default function ReturnPolicyPage() {
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
      <CmsPageLayout title="Return Policy">
        <p className="text-muted-foreground">Could not load this page.</p>
      </CmsPageLayout>
    );
  }

  const hasSections = settings.returnPolicySections.some((s) => s.title.trim() || s.body.trim());

  return (
    <CmsPageLayout title="Return Policy">
      {hasSections ? (
        <CmsStructuredSections sections={settings.returnPolicySections} emptyMessage="No return policy yet." />
      ) : (
        <CmsHtmlBody html={settings.returnPolicyHtml} emptyMessage="No return policy yet." />
      )}
    </CmsPageLayout>
  );
}
