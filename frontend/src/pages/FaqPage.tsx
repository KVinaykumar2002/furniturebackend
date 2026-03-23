import { useSiteSettings } from "@/hooks/useApi";
import { FALLBACK_FAQS } from "@/data/defaultFaqs";
import CmsPageLayout from "@/components/CmsPageLayout";
import { LoadingSection } from "@/components/ui/loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FaqPage() {
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
      <CmsPageLayout title="FAQs">
        <p className="text-muted-foreground">Could not load this page.</p>
      </CmsPageLayout>
    );
  }

  const faqs = settings.faqs.length > 0 ? settings.faqs : FALLBACK_FAQS;

  return (
    <CmsPageLayout title="FAQs">
      {settings.faqs.length === 0 ? (
        <p className="text-xs text-muted-foreground mb-6 border-b border-border pb-4">
          Showing default FAQs because the API returned none (check deploy and{" "}
          <code className="text-[0.7rem]">GET /api/site-settings</code>). Edit in Admin → FAQs.
        </p>
      ) : null}
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((f, i) => (
          <AccordionItem key={i} value={`faq-${i}`}>
            <AccordionTrigger className="text-left text-foreground">{f.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {f.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </CmsPageLayout>
  );
}
