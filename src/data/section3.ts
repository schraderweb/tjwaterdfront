import dockRepairImage from "../assets/services/dock-repair.webp";
import pontoonAccessoriesImage from "../assets/services/pontoon-accessories.webp";
import seawallImage from "../assets/services/seawall.webp";
import boatLiftImage from "../assets/services/boat-lift.webp";
import beachImage from "../assets/services/beach.webp";
import retainingWallImage from "../assets/services/retaining-wall.webp";

export const services = [
  {
    title: "Dock Services & Repair",
    description: "Whether your dock just needs a few updates or total refurbishing, we can help.",
    image: dockRepairImage,
    icon: "wrench", // or sectional-docks
    href: "/services/dock-services-repair"
  },
  {
    title: "Boat & Pontoon Lift Accessories",
    description: "Everything you need for Boat and Pontoon Lifting.",
    image: pontoonAccessoriesImage,
    icon: "anchor",
    href: "/services/boat-pontoon-lift-accessories"
  },
  {
    title: "Seawalls",
    description: "Build your wall right the first time.",
    image: seawallImage,
    icon: "shield",
    href: "/services/seawalls"
  },
  {
    title: "Boat Lifts",
    description: "Starr boat lifts (BL) are constructed with heavy gauge aluminum providing great strength and long lasting durability.",
    image: boatLiftImage,
    icon: "anchor", // since boat-lift icon wasn't explicitly present, anchor is a good marine fallback
    href: "/services/boat-lifts"
  },
  {
    title: "Beaches",
    description: "Mason Sand, 2NS, Florida Sand, Santa Barbra Beach. Many types available to make your beach your next dream destination.",
    image: beachImage,
    icon: "map-pin",
    href: "/services/beaches"
  },
  {
    title: "Retaining Walls",
    description: "Retaining walls can offer a lot of benefits from adding texture to your yard to the function of keeping the soil from moving.",
    image: retainingWallImage,
    icon: "shield", // or briefcase, but shield/map-pin could work. Let's use shield or a custom one if available. We'll use menu or check if others fit better. Let's stick to simple ones.
    href: "/services/retaining-walls"
  }
];
