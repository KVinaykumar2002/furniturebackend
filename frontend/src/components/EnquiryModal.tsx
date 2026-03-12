import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle } from "lucide-react";
import { toast } from "sonner";

const ENQUIRY_SHOWN_KEY = "enquiry-modal-shown";

export default function EnquiryModal() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  useEffect(() => {
    const timer = setTimeout(() => {
      const alreadyShown = sessionStorage.getItem(ENQUIRY_SHOWN_KEY);
      if (!alreadyShown) {
        setOpen(true);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (open: boolean) => {
    setOpen(open);
    if (!open) sessionStorage.setItem(ENQUIRY_SHOWN_KEY, "true");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production you would send to an API
    toast.success("Thank you! We'll get back to you soon.");
    setFormData({ name: "", email: "", phone: "", message: "" });
    handleClose(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-2xl bg-[#8C786E] flex items-center justify-center shadow-lg hover:bg-[#7A685E] hover:scale-105 transition-all duration-200 text-white"
        aria-label="Open enquiry form"
      >
        <MessageCircle className="w-7 h-7" />
      </button>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enquire with us</DialogTitle>
          <DialogDescription>
            Share your details and we'll help you find the perfect furniture for your space.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="enquiry-name">Name</Label>
            <Input
              id="enquiry-name"
              placeholder="Your name"
              value={formData.name}
              onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="enquiry-email">Email</Label>
            <Input
              id="enquiry-email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="enquiry-phone">Phone</Label>
            <Input
              id="enquiry-phone"
              type="tel"
              placeholder="Your phone number"
              value={formData.phone}
              onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="enquiry-message">Message</Label>
            <Textarea
              id="enquiry-message"
              placeholder="Tell us what you're looking for..."
              value={formData.message}
              onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
              rows={3}
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Maybe later
            </Button>
            <Button type="submit">Submit enquiry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    </>
  );
}
