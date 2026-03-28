import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import hero2 from "@/assets/hero-2.jpg";
import type { AboutSection } from "@/hooks/useApi";

/** Plain-text CMS sections (title + paragraphs split on blank lines). No HTML. */
export function CmsStructuredSections({
  sections,
  emptyMessage,
}: {
  sections: AboutSection[];
  emptyMessage: string;
}) {
  const visible = sections.filter((s) => s.title.trim() || s.body.trim());
  if (visible.length === 0) {
    return <p className="text-muted-foreground">{emptyMessage}</p>;
  }
  return (
    <div className="space-y-10">
      {visible.map((section, i) => (
        <section key={i}>
          {section.title.trim() ? (
            <h2 className="font-display text-2xl font-light text-foreground mb-4">{section.title}</h2>
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
  );
}

export function CmsHtmlBody({
  html,
  emptyMessage,
}: {
  html: string;
  emptyMessage: string;
}) {
  const trimmed = html.trim();
  if (!trimmed) {
    return <p className="text-muted-foreground">{emptyMessage}</p>;
  }
  return (
    <div
      className="cms-html text-muted-foreground leading-relaxed [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_h2:first-child]:mt-0 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline [&_a]:text-foreground"
      dangerouslySetInnerHTML={{ __html: trimmed }}
    />
  );
}

export default function CmsPageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="relative pt-24 pb-20 overflow-hidden">
        <img src={hero2} alt="" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-foreground/50" />
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <h1 className="font-display text-4xl md:text-5xl font-light text-white text-center">{title}</h1>
        </div>
      </section>
      <div className="container max-w-3xl py-16 px-4">{children}</div>
      <Footer />
    </div>
  );
}
