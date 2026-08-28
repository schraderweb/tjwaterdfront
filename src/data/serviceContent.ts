export interface ContentSegment {
  text: string;
  strong?: boolean;
}

export type ContentLine = string | ContentSegment[];

export interface ServiceContent {
  eyebrow: string;
  heading: string;
  paragraphs: ContentLine[];
  bullets?: ContentLine[];
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
      [
        { text: "Looking to spruce up your lawn or business? No problem for " },
        { text: "T&J Waterfront Services", strong: true },
        { text: ". Whether you have a small garden needing some work, a whole yard redesign, or a new home build needing complete landscaping, we're the one-stop shop that has you covered." },
      ],
      "A thoughtful landscape should make the property easier to enjoy, not harder to maintain. We can help shape the space around the way you use your yard, from a focused garden refresh to a complete outdoor redesign.",
      "The right layout brings the home, yard, and waterfront together so the finished space feels intentional from every direction.",
    ],
  },
  seawalls: {
    eyebrow: "SEAWALLS",
    heading: "Protection that keeps your shoreline in place",
    paragraphs: [
      "Seawalls come in a variety of styles and materials. It's crucial to protect your home and yard investment. Whether you're on a small pond, a river, or a large lake, protection is the key to eliminating erosion.",
      "We take great care and pride in the wide variety of seawalls we offer — from steel, boulders, ledge rock, and rip rap. Keeping water out of areas it shouldn't be is the key to stopping erosion near any body of water.",
      "Every shoreline is different. The water, property, and level of protection you need all help determine the right approach, which is why we take time to understand the site before work begins.",
    ],
    bullets: ["Steel", "Boulders", "Ledge Rock", "Rip Rap"],
    note: "6-month labor warranty included. Materials not covered.",
  },
  "retaining-walls": {
    eyebrow: "RETAINING WALLS",
    heading: "Walls that hold your land and add appeal",
    paragraphs: [
      "We provide many styles of walls — from large walls that hold up your land or create more usable space in your yard, to small retaining or garden walls that add appeal to your landscaping at home or business.",
      "Retaining walls can do more than hold soil. They can define planting areas, create usable space, and bring structure to the landscape while complementing the character of your property.",
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
      "We help think through the size, layout, and connection to the surrounding yard so the finished patio feels like a natural extension of your home.",
    ],
  },
  beaches: {
    eyebrow: "BEACHES",
    heading: "Your backyard dream destination",
    paragraphs: [
      "Any type of beach, large or small, we have it covered. Mason sand, 2NS, Florida sand, Santa Barbara beach — many types are available to make your beach the next dream destination in your backyard.",
      "We can help you compare options that fit the look and use of your shoreline, whether you want a place for swimming, relaxing, or spending time with family.",
      "With the right preparation and finish, your beach becomes an inviting part of the waterfront rather than an afterthought.",
    ],
    bullets: ["Mason Sand", "2NS", "Florida Sand", "Santa Barbara Beach"],
  },
  "decks-boardwalks": {
    eyebrow: "DECKS & BOARDWALKS",
    heading: "Boardwalks for any terrain, big or small",
    paragraphs: [
      "Whether you need a boardwalk walkway over marshland, through your yard, up to your front door, or around to your garage, there's no job too big or too small that we can't handle. A variety of options are available.",
      "Every property has its own access points and grade changes. We plan the route around how you move through the space and how you want to use it.",
      "From a simple walkway to a larger waterfront connection, the finished structure should feel safe, practical, and at home on the property.",
    ],
  },
  "dock-service": {
    eyebrow: "DOCK SERVICES & REPAIR",
    heading: "Complete dock service, installs, and repairs",
    paragraphs: [
      "We provide many service options for any of your lakefront needs. If you don't see it in the list below, contact us — we can likely take care of it for you, and if not, point you in the right direction. Any and all docks and accessories can be serviced.",
      "From seasonal setup to unexpected damage, we focus on getting your dock safe, functional, and ready for the way you use your waterfront.",
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
      "Whether you are preparing for the season or dealing with a problem mid-season, we help keep your lift dependable and ready for your boat.",
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
      [
        { text: "T&J Waterfront Services", strong: true },
        { text: " was founded by " },
        { text: "Tyler Severs", strong: true },
        { text: ". Tyler used to work for " },
        { text: "Diversified Dock and Lift", strong: true },
        { text: ", but with Diversified's growing manufacturing business, " },
        { text: "Great Lakes Entry Systems", strong: true },
        { text: ", the area needed someone with more availability to perform services such as installs, removals, service calls, and maintenance. That is where T&J Waterfront Services comes in." },
      ],
      "We are experts in the industry. Working side by side with manufacturers helps us get a better understanding of what your lakefront needs. Over the years, expanding into a wide range of different services has helped us become a one-stop shop for customers in any location.",
      "Give us a call or send us an email to get scheduled, so you can maximize your time enjoying your waterfront products. Dock and hoist sales, installs, removals, seawalls, beaches, patios, retaining walls, landscaping, and more - we have a variety of services. Give us a call today!",
    ],
    cta: {
      label: "CONTACT US",
      href: "/contact",
    },
  },
  "personal-watercraft-lift": {
    eyebrow: "PWC / JET LIFTS",
    heading: "Personal Watercraft Lift",
    paragraphs: [
      [
        { text: "Need a place to dock your PWC or jet ski? " },
        { text: "T&J Waterfront Services", strong: true },
        { text: " offers " },
        { text: "PWC docking", strong: true },
        { text: " to add a safe harbor for your one-, two-, three-, or four-place personal watercraft - just roll off and you're ready to go!" },
      ],
      [
        { text: "The " },
        { text: "Connect-A-Port XL6", strong: true },
        { text: " features a six-foot-plus walking surface around the edges, with a universal hull design and adjustable Stoltz rollers that make it easy to launch and dock - idle up to dock, roll off to launch. It connects to 2000 Series docks, floating docks, or fixed docks." },
      ],
      [
        { text: "Where a more compact footprint is the better fit, the " },
        { text: "Connect-A-Port XL5", strong: true },
        { text: " uses universal hull support and adjustable rollers to make personal watercraft easier to dock." },
      ],
    ],
    bullets: [
      "XL6 | Model: CAPXL6",
      'XL6 | 72" x 156" x 23"',
      "XL6 | Maximum flotation: 2,000 lbs",
      "XL6 | Weight: 375 lbs",
      "XL5 | Model: CAPXL5",
      'XL5 | 59" x 156" x 23"',
      "XL5 | Maximum flotation: 1,800 lbs",
      "XL5 | Weight: 325 lbs",
    ],
  },
  canopies: {
    eyebrow: "CANOPIES",
    heading: "Canopy Systems",
    paragraphs: [
      [
        { text: "Starr Pro Canopy Systems", strong: true },
        { text: " offer more coverage for your investment, along with different boarding options." },
      ],
      "The right canopy helps protect your boat while keeping access practical for the way you use your dock. Choose the coverage and boarding arrangement that best fits your setup.",
    ],
    bullets: [
      '12" drop side gives 50" of coverage from peak to bottom of valance',
      '24" drop side gives maximum coverage of 60" from peak of canopy to bottom of valance — the most coverage in the industry',
      "Front boarding access",
      "Rear boarding access",
      "Side boarding access",
      "Options that allow you to leave the bimini in travel position, or leave the arch up",
    ],
  },
};
