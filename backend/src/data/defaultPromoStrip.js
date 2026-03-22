function defaultSaleEndsISO() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  d.setHours(d.getHours() + 8);
  d.setMinutes(d.getMinutes() + 11);
  return d.toISOString();
}

export function buildDefaultPromoStrip() {
  return {
    saleTitle: "SALE",
    saleSubtitle: "Ends In",
    saleEndsAt: defaultSaleEndsISO(),
    storeLine1: "Visit Your Nearest Store &",
    storeLine2: "Get Extra Instant Discount",
    storeHref: "/stores",
    stats: [
      { iconKey: "users", value: "20 Lakh+", label: "Customers" },
      { iconKey: "truck", value: "Free", label: "Delivery" },
      { iconKey: "shield", value: "Best", label: "Warranty*" },
      { iconKey: "factory", value: "15 Lakh sq. ft.", label: "Mfg. Unit" },
    ],
  };
}
