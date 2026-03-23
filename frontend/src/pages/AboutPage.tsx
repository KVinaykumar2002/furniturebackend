import { Link } from "react-router-dom";
import { useSiteSettings } from "@/hooks/useApi";
import CmsPageLayout from "@/components/CmsPageLayout";
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

  const sections = settings.aboutSections;

  return (
    <CmsPageLayout title="About Us">
      {sections.length === 0 ? (
        <p className="text-muted-foreground">
          No about content yet. Add sections in Admin → About page.
        </p>
      ) : (
        <div className="space-y-10">
          {sections.map((section, i) => (
            <section key={i}>
              {section.title.trim() ? (
                <h2 className="font-display text-2xl font-light text-foreground mb-4">
                  {section.title}
                </h2>
              ) : null}
              <div className="space-y-4">
                {section.body
                  .split(/\n{2,}/)
                  .map((p) => p.trim())
                  .filter(Boolean)
                  .map((p, pi) => (
                    <p key={pi} className="text-muted-foreground leading-relaxed">
                      {p}
                    </p>
                  ))}
              </div>
            </section>
          ))}
        </div>
      )}
      <Link
        to="/#contact"
        className="inline-flex items-center justify-center h-12 px-8 border border-foreground/40 font-medium hover:bg-muted/50 uppercase tracking-wide text-sm mt-8"
      >
        Contact Us
      </Link>
    </CmsPageLayout>
  );
}
