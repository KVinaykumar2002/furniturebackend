import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useApi";
import CmsPageLayout, { CmsStructuredSections } from "@/components/CmsPageLayout";
import { LoadingSection } from "@/components/ui/loader";

export default function AboutPage() {
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
      <CmsPageLayout title="About Us">
        <p className="text-muted-foreground">Could not load this page.</p>
      </CmsPageLayout>
    );
  }

  return (
    <CmsPageLayout title="About Us">
      <CmsStructuredSections sections={settings.aboutSections} emptyMessage="No content yet." />
      <Link
        to="/#contact"
        className="inline-flex items-center justify-center h-12 px-8 border border-foreground/40 font-medium hover:bg-muted/50 uppercase tracking-wide text-sm mt-8"
      >
        Contact Us
      </Link>
    </CmsPageLayout>
  );
}
