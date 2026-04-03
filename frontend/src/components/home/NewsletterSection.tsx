import { useState } from "react";
import SectionWrapper from "@/components/SectionWrapper";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getWhatsAppOrderUrl } from "@/lib/constants";

export default function NewsletterSection() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const ref = useScrollReveal<HTMLDivElement>(0.08);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = [
      "Hi, I have an enquiry from Stay in the loop section.",
      `Name: ${formData.name.trim()}`,
      `Email: ${formData.email.trim()}`,
      `Phone: ${formData.phone.trim() || "N/A"}`,
      `Message: ${formData.message.trim() || "N/A"}`,
    ].join("\n");

    window.open(getWhatsAppOrderUrl(message), "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp with your enquiry details.");
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <div ref={ref} className="animate-on-scroll">
    <SectionWrapper className="border-t border-border">
      <div className="max-w-xl mx-auto text-center">
        <div className="w-14 h-14 mx-auto mb-6 bg-primary/10 flex items-center justify-center">
          <Mail className="w-7 h-7 text-primary" />
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-light text-foreground mb-2">Stay in the loop</h2>
        <p className="text-muted-foreground text-sm mb-8">
          Share your details and we&apos;ll help you find the perfect furniture for your space.
        </p>
        <form onSubmit={handleSubmit} className="grid gap-4 text-left max-w-xl mx-auto">
          <div className="grid gap-2">
            <Label htmlFor="stay-loop-name">Name</Label>
            <Input
              id="stay-loop-name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stay-loop-email">Email</Label>
            <Input
              id="stay-loop-email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stay-loop-phone">Phone</Label>
            <Input
              id="stay-loop-phone"
              type="tel"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stay-loop-message">Message</Label>
            <Textarea
              id="stay-loop-message"
              placeholder="Tell us what you're looking for..."
              value={formData.message}
              onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
              rows={3}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit">Submit enquiry</Button>
          </div>
        </form>
      </div>
    </SectionWrapper>
    </div>
  );
}
