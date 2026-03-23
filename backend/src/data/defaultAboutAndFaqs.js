/** Default About page HTML and FAQs — SiteSettings seed, seed scripts, and GET backfill when empty. */

export const DEFAULT_ABOUT_PAGE_HTML = `
<section>
  <h2>Brand Story</h2>
  <p>DesignerZhub is your destination for premium furniture and luxury home interiors. We curate pieces and full-room solutions that balance comfort, durability, and timeless design—so your space tells your story with clarity and style.</p>
  <p>Based in Hyderabad, we work with homeowners and professionals across India who expect honest materials, careful finishing, and support from selection to delivery.</p>
</section>
<section>
  <h2>What We Offer</h2>
  <p>Living, dining, bedroom, office, outdoor, lighting, décor, and more—plus guidance on layout, finishes, and fit-out when you need it. Shop online or visit our showrooms to experience textures and proportions in person.</p>
</section>
<section>
  <h2>Our Philosophy</h2>
  <p>Whether you prefer modern minimalism or classic warmth, we help you build a home that feels right every day. Explore the catalog, book a visit, or reach out—we are here to help you design the space you have always imagined.</p>
</section>
`.trim();

export const DEFAULT_FAQS = [
  {
    question: "Do you deliver across India?",
    answer:
      "We ship to most pin codes. Delivery cost and time depend on product size, weight, and your location. You will see available options at checkout, or our team can confirm details when you send an enquiry.",
  },
  {
    question: "How long does delivery take?",
    answer:
      "In-stock items are usually dispatched within a few business days. Made-to-order or custom pieces follow a production timeline we share at order confirmation. You will receive tracking or updates once your order ships.",
  },
  {
    question: "Can I see furniture in person before buying?",
    answer:
      "Yes. Visit our showrooms to view materials, finishes, and scale. Use Store Locator on the site for addresses, maps, and timings.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We support common online payment options where enabled on the storefront. For large orders or trade enquiries, our team can guide you on available modes and any applicable documentation.",
  },
  {
    question: "Do you offer interior or fit-out consultation?",
    answer:
      "Yes. We can help with space planning, product selection, and coordination for furnishing and fit-out projects. Contact us or WhatsApp with your requirement and city—we will connect you with the right team member.",
  },
  {
    question: "What is your return and exchange policy?",
    answer:
      "Eligibility depends on product type (e.g. custom vs ready-made), condition, and timelines. Please read our Return Policy page for full terms, or write to us with your order ID for case-specific help.",
  },
  {
    question: "What about warranty or manufacturing defects?",
    answer:
      "Warranty coverage varies by manufacturer and product category. We will share warranty terms relevant to your purchase. Report transit damage or defects promptly with photos so we can assist under applicable policy.",
  },
  {
    question: "Can I customize size, fabric, or wood finish?",
    answer:
      "Many collections support options for dimensions, upholstery, and finishes. Custom work may extend lead times. Share your needs in store or via enquiry and we will confirm feasibility and timelines.",
  },
  {
    question: "How should I care for wood and upholstered furniture?",
    answer:
      "Keep wood away from prolonged direct moisture and heat; use coasters and felt pads. For fabrics, follow the care label; blot spills quickly and use professional cleaning for deep stains. We can share product-specific tips after purchase.",
  },
  {
    question: "How do I track my order or get support after delivery?",
    answer:
      "Use the contact details in your confirmation email or the Contact / WhatsApp options on the website. Have your order number ready so we can resolve questions about delivery, assembly, or service quickly.",
  },
];
