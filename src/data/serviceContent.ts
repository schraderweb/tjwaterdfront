export interface ServiceContent {
  eyebrow: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  note?: string;
  cta?: {
    label: string;
    href: string;
  };
}

export const serviceContent: Record<string, ServiceContent> = {
  landscaping: {
    eyebrow: "WATERFRONT LANDSCAPING",
    heading: "Landscaping for your lawn or business",
    paragraphs: [
      "Looking to spruce up your lawn or business? No problem for T&J Waterfront Services. Whether you have a small garden needing some work, a whole yard redesign, or a new home build needing complete landscaping, we're the one-stop shop that has you covered.",
    ],
  },
  seawalls: {
    eyebrow: "SEAWALLS",
    heading: "Protection that keeps your shoreline in place",
    paragraphs: [
      "Seawalls come in a variety of styles and materials. It's crucial to protect your home and yard investment. Whether you're on a small pond, a river, or a large lake, protection is the key to eliminating erosion.",
      "We take great care and pride in the wide variety of seawalls we offer — from steel, boulders, ledge rock, and rip rap. Keeping water out of areas it shouldn't be is the key to stopping erosion near any body of water.",
    ],
    bullets: ["Steel", "Boulders", "Ledge Rock", "Rip Rap"],
    note: "6-month labor warranty included. Materials not covered.",
  },
  "retaining-walls": {
    eyebrow: "RETAINING WALLS",
    heading: "Walls that hold your land and add appeal",
    paragraphs: [
      "We provide many styles of walls — from large walls that hold up your land or create more usable space in your yard, to small retaining or garden walls that add appeal to your landscaping at home or business.",
    ],
    bullets: ["Boulders", "Ledge Rock", "Slate Rock", "Wood", "Timbers", "Block", "Brick"],
    note: "6-month labor warranty included. Materials not covered.",
  },
  patios: {
    eyebrow: "PATIOS",
    heading: "A variety of patio options for every space",
    paragraphs: [
      "We carry a variety of patio options. Whether it's a space to enjoy and relax, or a place to gather friends and family for a BBQ or a fire, we have it covered.",
      "Sizes vary from large, expansive areas to small home entrances and walkway areas.",
    ],
  },
  beaches: {
    eyebrow: "BEACHES",
    heading: "Your backyard dream destination",
    paragraphs: [
      "Any type of beach, large or small, we have it covered. Mason sand, 2NS, Florida sand, Santa Barbara beach — many types are available to make your beach the next dream destination in your backyard.",
    ],
    bullets: ["Mason Sand", "2NS", "Florida Sand", "Santa Barbara Beach"],
  },
  "decks-boardwalks": {
    eyebrow: "DECKS & BOARDWALKS",
    heading: "Boardwalks for any terrain, big or small",
    paragraphs: [
      "Whether you need a boardwalk walkway over marshland, through your yard, up to your front door, or around to your garage, there's no job too big or too small that we can't handle. A variety of options are available.",
    ],
  },
  "dock-service": {
    eyebrow: "DOCK SERVICES & REPAIR",
    heading: "Complete dock service, installs, and repairs",
    paragraphs: [
      "We provide many service options for any of your lakefront needs. If you don't see it in the list below, contact us — we can likely take care of it for you, and if not, point you in the right direction. Any and all docks and accessories can be serviced.",
    ],
    bullets: [
      "Yearly installs, removals, and leveling/adjustments",
      "Stringer repair",
      "Dock and deck repair",
      "Wheel kit or leg frame repair/replace",
      "Accessory repair/replace",
      "Dock or accessory add-ons",
      "Storm or wind damage services",
      "Insurance claim assistance and services",
    ],
  },
  "hoist-service": {
    eyebrow: "HOIST SERVICES & REPAIR",
    heading: "Complete hoist service, installs, and repairs",
    paragraphs: [
      "We provide many service options for any of your lakefront needs. If you don't see it in the list below, contact us — we can likely take care of it for you, and if not, point you in the right direction. Any and all hoists and accessories can be serviced.",
    ],
    bullets: [
      "Yearly installs, removals, and leveling/adjustments",
      "Cable, winch, and pulley repair",
      "Hoist trade-in and upgrade",
      "Winch upgrades",
      "Lake-to-lake hoist transport",
      "New boat adjustments",
      "Accessory repair/replace",
      "Accessory add-ons or upgrades",
      "Storm or wind damage services",
      "Insurance claim assistance and services",
    ],
  },
  about: {
    eyebrow: "OUR STORY",
    heading: "About T&J Waterfront Services",
    paragraphs: [
      "T&J Waterfront Services was founded by Tyler Severs. Tyler used to work for Diversified Dock and Lift, but with Diversified's growing manufacturing business, Great Lakes Entry Systems, the area needed someone with more availability to perform services such as installs, removals, service calls, and maintenance. That is where T&J Waterfront Services comes in.",
      "We are experts in the industry. Working side by side with the manufacturers helps us get a better understanding of what your lakefront needs. Over the years, expanding into a vast array of different services has helped us become a one-stop shop for customers in any location.",
      "Give us a call or send us an email to get scheduled, so you can maximize your time enjoying your waterfront products. Dock and hoist sales, installs, removals, seawalls, beaches, patios, retaining walls, landscaping, and more — we have a variety of services. Give us a call today!",
    ],
    cta: {
      label: "CONTACT US",
      href: "/contact",
    },
  },
};