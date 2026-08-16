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
};

export interface NavChild {
  label: string;
  href: string;
}

export interface NavLink {
  label: string;
  href: string;
  children?: NavChild[];
}

export const navLinks: NavLink[] = [
  { label: "Home", href: "/" },
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Landscaping", href: "/services/landscaping" },
      { label: "Seawalls", href: "/services/seawalls" },
      { label: "Retaining Walls", href: "/services/retaining-walls" },
      { label: "Patios", href: "/services/patios" },
      { label: "Beaches", href: "/services/beaches" },
      { label: "Decks & Boardwalks", href: "/services/decks-boardwalks" },
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
    title: "Sectional Docks",
    description:
      "Our best seller! With its strength and light weight, this is easily the industry leader for dock.",
    icon: "dock-sectional",
    href: "/services/sectional-docks",
  },
  {
    title: "Roll-In Docks",
    description: "In most situations, the easiest dock to install.",
    icon: "dock-rollin",
    href: "/services/roll-in-docks",
  },
  {
    title: "Platinum Docks",
    description:
      "The soft edges and classy look took this high-end dock system to a whole new level.",
    icon: "dock-platinum",
    href: "/services/platinum-docks",
  },
  {
    title: "Floating Docks",
    description:
      "Free-standing docks can get unstable in deeper water, while a floating system maintains its stability.",
    icon: "dock-floating",
    href: "/services/floating-docks",
  },
];
