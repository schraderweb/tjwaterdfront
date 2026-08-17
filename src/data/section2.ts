import type { ImageMetadata } from "astro";

import starrLift01 from "../assets/section2/starr-lift-01.webp";
import starrLift02 from "../assets/section2/starr-lift-02.webp";
import starrLift03 from "../assets/section2/starr-lift-03.webp";
import starrLift04 from "../assets/section2/starr-lift-04.webp";
import starrLift05 from "../assets/section2/starr-lift-05.webp";
import starrLift06 from "../assets/section2/starr-lift-06.webp";
import dockEssentialsImage from "../assets/section2/dock-essentials.webp";

export interface Section2Image {
  src: ImageMetadata;
  alt: string;
  focalPoint?: string;
}

export const featuredService = {
  eyebrow: "PREMIUM BOAT LIFTS",
  title: "Starr Boat Lifts",
  description:
    'Starr boat lifts (BLs) are constructed with heavy gauge aluminum providing great strength and long lasting durability. Standard inside width of "120" wide.',
  href: "/services/boat-lifts",
};

export const showcaseImages: Section2Image[] = [
  {
    src: starrLift01,
    alt: "Starr boat lift installation on a Michigan lakefront",
    focalPoint: "center 55%",
  },
  {
    src: starrLift02,
    alt: "Starr boat lift on a dock at a Michigan lake",
    focalPoint: "center 52%",
  },
  {
    src: starrLift03,
    alt: "Completed dock and lift project on a Michigan lake",
    focalPoint: "center 50%",
  },
  {
    src: starrLift04,
    alt: "Waterfront dock project with boat lift",
    focalPoint: "center 50%",
  },
  {
    src: starrLift05,
    alt: "Boat lift and dock work at a residential waterfront",
    focalPoint: "center 50%",
  },
  {
    src: starrLift06,
    alt: "Dock and lift installation on a Michigan waterfront",
    focalPoint: "center 50%",
  },
];

export const dockEssentials = {
  eyebrow: "DOCK ESSENTIALS",
  title: "Docks Accessories",
  description:
    "Everything you need for a safer, stronger, and more enjoyable dock.",
  imageSrc: dockEssentialsImage,
  imageAlt: "A finished dock and boat lift extending over a Michigan lake",
  href: "/services/dock-accessories",
  benefits: [
    {
      icon: "anchor",
      title: "PREMIUM QUALITY",
      description: "High quality materials built to withstand Michigan's conditions.",
    },
    {
      icon: "shield",
      title: "BUILT TO LAST",
      description: "Corrosion resistant & engineered for long term performance.",
    },
    {
      icon: "wrench",
      title: "WIDE SELECTION",
      description: "Dock hardware, bumpers, cleats, ladders & more.",
    },
  ],
};
