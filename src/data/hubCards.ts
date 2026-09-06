import type { ImageMetadata } from "astro";

import gallerySectionalDock from "@/content/gallery/sectional-docks/01.webp";
import galleryRollInDock from "@/content/gallery/roll-in-docks/01.webp";
import galleryPlatinumDock from "@/content/gallery/platinum-docks/01.webp";
import galleryFloatingDock from "@/content/gallery/starr-floating-dock/01.webp";
import galleryDockAccessories from "@/content/gallery/dock-accessories/01.webp";
import galleryDockService from "@/content/gallery/dock-service-repairs/01.webp";

import galleryBoatLift from "@/content/gallery/boat-lifts/01.webp";
import galleryPwcLift from "@/content/gallery/pwc-jetski-lifts/01.webp";
import galleryCanopies from "@/content/gallery/canopies/01.webp";
import galleryHoistService from "@/content/gallery/hoist-service-repairs/01.webp";

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
    image: gallerySectionalDock,
    icon: "sectional-docks",
    href: "/docks",
  },
  {
    title: "Lifts",
    description:
      "Boat and pontoon lifts, PWC lifts, canopies, and accessories for effortless launching.",
    image: galleryBoatLift,
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
    image: galleryDockService,
    icon: "wrench",
    href: "/services/dock-service",
  },
  {
    title: "Hoist Service / Repairs",
    description:
      "Cable, winch, and pulley repair, hoist trade-ins, lake-to-lake transport, and new boat adjustments.",
    image: galleryHoistService,
    icon: "wrench",
    href: "/services/hoist-service",
  },
];

export const docksCards: HubCard[] = [
  {
    title: "Sectional Docks",
    description:
      "Our best seller — strength and light weight make this the industry leader for dock.",
    image: gallerySectionalDock,
    icon: "sectional-docks",
    href: "/sectional-docks",
  },
  {
    title: "Roll-In Docks",
    description: "In most situations, the easiest dock to install.",
    image: galleryRollInDock,
    icon: "roll-in-docks",
    href: "/roll-in-docks",
  },
  {
    title: "Platinum Docks",
    description:
      "Soft edges and a classy look take this high-end dock system to a whole new level.",
    image: galleryPlatinumDock,
    icon: "platinum-docks",
    href: "/platinum-docks",
  },
  {
    title: "Floating Docks",
    description:
      "Free-standing docks can get unstable in deeper water, while a floating system maintains its stability.",
    image: galleryFloatingDock,
    icon: "floating-docks",
    href: "/floating-docks",
  },
  {
    title: "Dock Accessories",
    description: "Everything you need to complete your dock.",
    image: galleryDockAccessories,
    icon: "briefcase",
    href: "/dock-accessories",
  },
];

export const liftsCards: HubCard[] = [
  {
    title: "Boat / Pontoon / Tritoon Lifts",
    description:
      "Heavy-gauge aluminum construction providing great strength and long-lasting durability.",
    image: serviceBoatLift,
    icon: "anchor",
    href: "/boat-lifts",
  },
  {
    title: "PWC / Jetski Lifts",
    description:
      "A safe harbor for your personal watercraft — drive-on docking and vertical lifts.",
    image: galleryPwcLift,
    icon: "ship-wheel",
    href: "/pwc-jetski-lifts",
  },
  {
    title: "Canopies",
    description:
      "Starr Pro canopy systems offer maximum coverage and multiple boarding options.",
    image: galleryCanopies,
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