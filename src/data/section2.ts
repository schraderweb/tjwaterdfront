import type { ImageMetadata } from "astro";

import starrLift01 from "../assets/section2/starr-lift-01.png";
import starrLift02 from "../assets/section2/starr-lift-02.png";
import starrLift03 from "../assets/section2/starr-lift-03.png";
import starrLift04 from "../assets/section2/starr-lift-04.jpg";
import starrLift05 from "../assets/section2/starr-lift-05.jpg";
import starrLift06 from "../assets/section2/starr-lift-06.jpg";
import dockEssentialsImage from "../assets/section2/dock-essentials.jpg";

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
    alt: "Several Starr boat lifts installed along a Michigan lakefront",
    focalPoint: "center 58%",
  },
  {
    src: starrLift02,
    alt: "Covered boat lift and dock reaching into a Michigan lake",
    focalPoint: "center 58%",
  },
  {
    src: starrLift03,
    alt: "Starr boat lift with pontoon and dock on a sunny lake",
    focalPoint: "center 48%",
  },
  {
    src: starrLift04,
    alt: "Boat positioned on a Starr lift beside a waterfront dock",
    focalPoint: "center 54%",
  },
  {
    src: starrLift05,
    alt: "Starr boat lift holding multiple boats at a lake dock",
    focalPoint: "center 52%",
  },
  {
    src: starrLift06,
    alt: "Boat secured on a Starr lift beside a residential waterfront",
    focalPoint: "center 54%",
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
