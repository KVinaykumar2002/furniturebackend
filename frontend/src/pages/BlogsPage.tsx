import { useSiteSettings } from "@/hooks/useApi";
import CmsPageLayout, { CmsHtmlBody } from "@/components/CmsPageLayout";
import { LoadingSection } from "@/components/ui/loader";

export default function BlogsPage() {
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
      <CmsPageLayout title="Blogs">
        <p className="text-muted-foreground">Could not load this page.</p>
      </CmsPageLayout>
    );
  }

  return (
    <CmsPageLayout title="Blogs">
      <CmsHtmlBody html={settings.blogsPageHtml} emptyMessage="No blog content yet. Add it in Admin → Site Settings." />
    </CmsPageLayout>
  );
}
