import dockImage from "../assets/services/dock-repair.webp";
import boatLiftImage from "../assets/services/boat-lift.webp";
import seawallImage from "../assets/services/seawall.webp";
import decksImage from "../content/gallery/decks-boardwalks/01.webp";
import beachImage from "../assets/services/beach.webp";
import retainingWallImage from "../assets/services/retaining-wall.webp";

export const popularServices = [
  {
    title: "Docks",
    description: "From sectional and roll-in to platinum and floating systems, find the right dock for your shoreline.",
    image: dockImage,
    icon: "sectional-docks",
    href: "/docks",
  },
  {
    title: "Lifts",
    description: "Boat, pontoon, tritoon, and personal watercraft lifts built for long-lasting durability and easy launching.",
    image: boatLiftImage,
    icon: "anchor",
    href: "/lifts",
  },
  {
    title: "Seawalls",
    description: "Steel, boulders, ledge rock, and rip rap walls engineered to stop erosion and protect your waterfront investment.",
    image: seawallImage,
    icon: "shield-check",
    href: "/services/seawalls",
  },
  {
    title: "Decks & Boardwalks",
    description: "Custom boardwalk walkways over marshland, through your yard, or to the shoreline — no job too big or small.",
    image: decksImage,
    icon: "house",
    href: "/services/decks-boardwalks",
  },
  {
    title: "Beaches",
    description: "Mason sand, 2NS, Florida sand, and Santa Barbara beach options to turn your shoreline into a backyard destination.",
    image: beachImage,
    icon: "map-pin",
    href: "/services/beaches",
  },
  {
    title: "Retaining Walls",
    description: "From large walls that hold up your land to small garden walls that add character and usable yard space.",
    image: retainingWallImage,
    icon: "shield",
    href: "/services/retaining-walls",
  },
];
