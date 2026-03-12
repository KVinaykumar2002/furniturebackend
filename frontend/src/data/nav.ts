export type MainCategorySlug = "living" | "dining" | "bedroom";

export interface NavDropdownItem {
  label: string;
  href: string;
}

export interface NavItemWithDropdown {
  label: string;
  items: NavDropdownItem[];
}

export interface NavItemLink {
  label: string;
  href: string;
}

export const livingDropdown: NavDropdownItem[] = [
  { label: "Sofas", href: "/living?sub=sofas" },
  { label: "Center Tables", href: "/living?sub=center-tables" },
  { label: "Coffee Tables", href: "/living?sub=coffee-tables" },
  { label: "Relax Chairs", href: "/living?sub=relax-chairs" },
  { label: "Bar Stools", href: "/living?sub=bar-stools" },
];

export const diningDropdown: NavDropdownItem[] = [
  { label: "Dining Chairs", href: "/dining?sub=dining-chairs" },
  { label: "Dining Tables", href: "/dining?sub=dining-tables" },
  { label: "Bar Stools", href: "/dining?sub=bar-stools" },
];

export const bedroomDropdown: NavDropdownItem[] = [
  { label: "Beds", href: "/bedroom?sub=beds" },
];

export const aboutDropdown: NavDropdownItem[] = [
  { label: "About Us", href: "/about" },
  { label: "Brand Story", href: "/about#brand-story" },
  { label: "Our Philosophy", href: "/about#philosophy" },
];

export const mainNavWithDropdowns: NavItemWithDropdown[] = [
  { label: "Living", items: livingDropdown },
  { label: "Dining", items: diningDropdown },
  { label: "Bedroom", items: bedroomDropdown },
  { label: "About", items: aboutDropdown },
];

export const mainNavLinks: NavItemLink[] = [
  { label: "Store Locator", href: "/stores" },
  { label: "All Collections", href: "/collections" },
];
