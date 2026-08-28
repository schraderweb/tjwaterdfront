import type { ImageMetadata } from "astro";

import galleryDock01 from "@/content/gallery/dock-service-repairs/01.webp";
import galleryDock02 from "@/content/gallery/dock-service-repairs/02.webp";
import galleryDock03 from "@/content/gallery/dock-service-repairs/03.webp";
import galleryDock04 from "@/content/gallery/dock-service-repairs/04.webp";
import galleryDock05 from "@/content/gallery/dock-service-repairs/05.webp";
import galleryDock06 from "@/content/gallery/dock-service-repairs/06.webp";
import galleryDock07 from "@/content/gallery/dock-service-repairs/07.webp";

import galleryHoist01 from "@/content/gallery/hoist-service-repairs/01.webp";
import galleryHoist02 from "@/content/gallery/hoist-service-repairs/02.webp";
import galleryHoist03 from "@/content/gallery/hoist-service-repairs/03.webp";
import galleryHoist04 from "@/content/gallery/hoist-service-repairs/04.webp";

import galleryDecks01 from "@/content/gallery/decks-boardwalks/01.webp";
import galleryLandscaping01 from "@/content/gallery/landscaping/01.webp";
import galleryPatios01 from "@/content/gallery/patios/01.webp";

import serviceBoatLift from "@/assets/services/boat-lift.webp";
import servicePontoonAccessories from "@/assets/services/pontoon-accessories.webp";
import serviceSeawall from "@/assets/services/seawall.webp";
import serviceRetainingWall from "@/assets/services/retaining-wall.webp";
import serviceBeach from "@/assets/services/beach.webp";
import serviceDockRepair from "@/assets/services/dock-repair.webp";

export interface HubCard {
  title: string;
  description: string;
  image: ImageMetadata;
  icon: string;
  href: string;
}

export const marineCards: HubCard[] = [
  {
    title: "Docks",
    description:
      "From sectional and roll-in to platinum and floating, we offer a dock system for every shoreline.",
    image: galleryDock01,
    icon: "sectional-docks",
    href: "/docks",
  },
  {
    title: "Lifts",
    description:
      "Boat and pontoon lifts, PWC lifts, canopies, and accessories for effortless launching.",
    image: galleryHoist01,
    icon: "anchor",
    href: "/lifts",
  },
  {
    title: "Decks & Boardwalks",
    description:
      "Boardwalk walkways over marshland, through your yard, or up to your door — no job too big or small.",
    image: galleryDecks01,
    icon: "house",
    href: "/services/decks-boardwalks",
  },
  {
    title: "Dock Service / Repairs",
    description:
      "Yearly installs and removals, repairs, add-ons, storm damage, and insurance claim assistance.",
    image: galleryDock02,
    icon: "wrench",
    href: "/services/dock-service",
  },
  {
    title: "Hoist Service / Repairs",
    description:
      "Cable, winch, and pulley repair, hoist trade-ins, lake-to-lake transport, and new boat adjustments.",
    image: galleryHoist02,
    icon: "wrench",
    href: "/services/hoist-service",
  },
];

export const docksCards: HubCard[] = [
  {
    title: "Sectional Docks",
    description:
      "Our best seller — strength and light weight make this the industry leader for dock.",
    image: galleryDock03,
    icon: "sectional-docks",
    href: "/sectional-docks",
  },
  {
    title: "Roll-In Docks",
    description: "In most situations, the easiest dock to install.",
    image: galleryDock04,
    icon: "roll-in-docks",
    href: "/roll-in-docks",
  },
  {
    title: "Platinum Docks",
    description:
      "Soft edges and a classy look take this high-end dock system to a whole new level.",
    image: galleryDock05,
    icon: "platinum-docks",
    href: "/platinum-docks",
  },
  {
    title: "Floating Docks",
    description:
      "Free-standing docks can get unstable in deeper water, while a floating system maintains its stability.",
    image: galleryDock06,
    icon: "floating-docks",
    href: "/floating-docks",
  },
  {
    title: "Dock Accessories",
    description: "Everything you need to complete your dock.",
    image: galleryDock07,
    icon: "briefcase",
    href: "/dock-accessories",
  },
];

export const liftsCards: HubCard[] = [
  {
    title: "Boat & Pontoon Lifts",
    description:
      "Heavy-gauge aluminum construction providing great strength and long-lasting durability.",
    image: serviceBoatLift,
    icon: "anchor",
    href: "/boat-lifts",
  },
  {
    title: "PWC / Jet Lifts",
    description:
      "A safe harbor for your personal watercraft — just roll off and you're ready to go.",
    image: galleryHoist03,
    icon: "ship-wheel",
    href: "/personal-watercraft-lift",
  },
  {
    title: "Canopies",
    description:
      "Starr Pro canopy systems offer maximum coverage and multiple boarding options.",
    image: galleryHoist04,
    icon: "shield-check",
    href: "/canopies",
  },
  {
    title: "Lift Accessories",
    description: "Everything you need for boat and pontoon lifting.",
    image: servicePontoonAccessories,
    icon: "briefcase",
    href: "/lift-accessories",
  },
];

export const allServicesCards: HubCard[] = [
  {
    title: "Landscaping",
    description:
      "Whether it's a small garden, a whole yard redesign, or a new build, we have it covered.",
    image: galleryLandscaping01,
    icon: "house",
    href: "/services/landscaping",
  },
  {
    title: "Seawalls",
    description: "Build your wall right the first time.",
    image: serviceSeawall,
    icon: "shield-check",
    href: "/services/seawalls",
  },
  {
    title: "Retaining Walls",
    description:
      "From large land-holding walls to small garden walls that add appeal to your yard.",
    image: serviceRetainingWall,
    icon: "shield",
    href: "/services/retaining-walls",
  },
  {
    title: "Patios",
    description: "A space to relax or a place to gather for a BBQ or fire — we have it covered.",
    image: galleryPatios01,
    icon: "house",
    href: "/services/patios",
  },
  {
    title: "Beaches",
    description:
      "Mason sand, 2NS, Florida sand, Santa Barbara beach — many types available.",
    image: serviceBeach,
    icon: "map-pin",
    href: "/services/beaches",
  },
  {
    title: "Decks & Boardwalks",
    description:
      "Walkways over marshland, through your yard, or up to your door — no job too big or small.",
    image: galleryDecks01,
    icon: "house",
    href: "/services/decks-boardwalks",
  },
  {
    title: "Dock Service & Repairs",
    description:
      "Whether your dock needs a few updates or total refurbishing, we can help.",
    image: serviceDockRepair,
    icon: "wrench",
    href: "/services/dock-service",
  },
  {
    title: "Hoist Service & Repairs",
    description:
      "Cable, winch, and pulley repair, hoist trade-ins, transport, and new boat adjustments.",
    image: galleryHoist01,
    icon: "wrench",
    href: "/services/hoist-service",
  },
];