export const site = {
  name: "T&J Waterfront Services",
  legalName: "T&J Waterfront Services LLC",
  url: "https://tjwaterfrontservices.com",
  title:
    "T&J Waterfront Services | Dock, Boat Lift & Seawall Specialists — Howell, MI",
  description:
    "T&J Waterfront Services installs, maintains and repairs docks, boat lifts, seawalls, patios, beaches, retaining walls and shorelines across All of Michigan, Northern Indiana, and Northern Ohio. One trusted team for your entire lakefront.",
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
  gtmId: "GTM-P7FMJFW",
  ga4Id: "",
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
    label: "Marine",
    href: "/marine",
    children: [
      {
        label: "Docks",
        href: "/docks",
        children: [
          { label: "Sectional Docks", href: "/sectional-docks" },
          {
            label: "Connect a Dock",
            href: "#",
            children: [
              { label: "Floating Dock", href: "/floating-docks" },
              { label: "PWC / Jetski Lifts", href: "/pwc-jetski-lifts" },
            ],
          },
          { label: "Roll-In Docks", href: "/roll-in-docks" },
          { label: "Platinum Docks", href: "/platinum-docks" },
          { label: "Dock Accessories", href: "/dock-accessories" },
        ],
      },
      {
        label: "Lifts",
        href: "/lifts",
        children: [
          { label: "Boat / Pontoon / Tritoon Lifts", href: "/boat-lifts" },
          { label: "PWC / Jetski Lifts", href: "/pwc-jetski-lifts" },
          { label: "Canopies", href: "/canopies" },
          { label: "Lift Accessories", href: "/lift-accessories" },
        ],
      },
      { label: "Decks & Boardwalks", href: "/services/decks-boardwalks" },
    ],
  },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Landscaping", href: "/services/landscaping" },
      { label: "Seawalls", href: "/services/seawalls" },
      { label: "Retaining Walls", href: "/services/retaining-walls" },
      { label: "Patios", href: "/services/patios" },
      { label: "Beaches", href: "/services/beaches" },
      { label: "Dock Service / Repairs", href: "/services/dock-service" },
      { label: "Hoist Service / Repairs", href: "/services/hoist-service" },
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
    title: "Docks",
    description:
      "Sectional, roll-in, platinum, and floating systems built for Michigan waters.",
    icon: "docks",
    href: "/docks",
  },
  {
    title: "Lifts",
    description:
      "Boat, pontoon, tritoon, and PWC lifts with custom bunks and canopies.",
    icon: "lifts",
    href: "/lifts",
  },
  {
    title: "Seawalls",
    description:
      "Steel, boulder, and rip rap walls engineered to protect your shoreline.",
    icon: "seawalls",
    href: "/services/seawalls",
  },
  {
    title: "Decks & Boardwalks",
    description:
      "Custom boardwalks and lakefront walkways designed for any terrain.",
    icon: "decks-boardwalks",
    href: "/services/decks-boardwalks",
  },
];
