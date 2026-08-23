export const site = {
  name: "T&J Waterfront Services",
  legalName: "T&J Waterfront Services LLC",
  url: "https://tjwaterfrontservices.com",
  title:
    "T&J Waterfront Services | Dock, Boat Lift & Seawall Specialists — Howell, MI",
  description:
    "T&J Waterfront Services installs, maintains and repairs docks, boat lifts, seawalls, patios, beaches, retaining walls and shorelines across Michigan. One trusted team for your entire lakefront.",
  phone: "517-294-5577",
  phoneDisplay: "(517) 294-5577",
  phoneHref: "tel:+15172945577",
  email: "tjwaterfrontservices@gmail.com",
  address: {
    street: "5385 Mack Rd",
    city: "Howell",
    state: "MI",
    zip: "48855",
  },
  hours: "7:00 AM – 7:00 PM",
  facebook: "https://www.facebook.com/Tjwaterfrontservices/",
  googleReviewUrl: "https://g.page/r/CcIG8n67r2DxEB0/review",
  facebookReviewUrl: "https://www.facebook.com/Tjwaterfrontservices/reviews",
  facebookPixelId: "",
};

export interface NavChild {
  label: string;
  href: string;
  children?: NavChild[];
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavChild[];
}

export const navLinks: NavLink[] = [
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Landscaping", href: "/services/landscaping" },
      { label: "Seawalls", href: "/services/seawalls" },
      { label: "Retaining Walls", href: "/services/retaining-walls" },
      { label: "Patios", href: "/services/patios" },
      { label: "Beaches", href: "/services/beaches" },
    ],
  },
  {
    label: "Marine",
    href: "#",
    children: [
      {
        label: "Docks",
        href: "#",
        children: [
          { label: "Sectional Docks", href: "#" },
          { label: "Roll-In Docks", href: "#" },
          { label: "Platinum Docks", href: "#" },
          { label: "Floating Docks", href: "#" },
          { label: "Dock Accessories", href: "#" },
        ],
      },
      {
        label: "Lifts",
        href: "#",
        children: [
          { label: "Boat & Pontoon Lifts", href: "#" },
          { label: "PWC / Jet Lifts", href: "#" },
          { label: "Canopies", href: "#" },
          { label: "Lift Accessories", href: "#" },
        ],
      },
      { label: "Decks & Boardwalks", href: "#" },
      { label: "Dock Service / Repairs", href: "#" },
      { label: "Hoist Service / Repairs", href: "#" },
    ],
  },
  { label: "Service Areas", href: "/service-areas" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

export interface HeroService {
  title: string;
  description: string;
  icon: string;
  href: string;
}

export const heroServices: HeroService[] = [
  {
    title: "Sectional Docks",
    description:
      "Our best seller! With its strength and light weight, this is easily the industry leader for dock.",
    icon: "sectional-docks",
    href: "/services/sectional-docks",
  },
  {
    title: "Roll-In Docks",
    description: "In most situations, the easiest dock to install.",
    icon: "roll-in-docks",
    href: "/services/roll-in-docks",
  },
  {
    title: "Platinum Docks",
    description:
      "The soft edges and classy look took this high-end dock system to a whole new level.",
    icon: "platinum-docks",
    href: "/services/platinum-docks",
  },
  {
    title: "Floating Docks",
    description:
      "Free-standing docks can get unstable in deeper water, while a floating system maintains its stability.",
    icon: "floating-docks",
    href: "/services/floating-docks",
  },
];
