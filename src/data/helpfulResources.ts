export interface HelpfulResource {
  id: string;
  description: string;
  ctaTextPre: string;
  ctaTextEmphasized: string;
  ctaTextPost: string;
  url: string;
  iconName: "warranty" | "boatLift" | "seawall" | "dock";
}

export const helpfulResources: HelpfulResource[] = [
  {
    id: "warranty",
    description: "View and submit your warranty info.",
    ctaTextPre: "Click ",
    ctaTextEmphasized: "here",
    ctaTextPost: " To Learn How.",
    url: "/contact",
    iconName: "warranty",
  },
  {
    id: "boatLift",
    description: "Ways To Maintain Your Boat Lift.",
    ctaTextPre: "Click ",
    ctaTextEmphasized: "here",
    ctaTextPost: " To Learn How.",
    url: "/services/hoist-service",
    iconName: "boatLift",
  },
  {
    id: "seawall",
    description: "Ways To Maintain Your Seawalls.",
    ctaTextPre: "Click ",
    ctaTextEmphasized: "here",
    ctaTextPost: " To Learn How.",
    url: "/services/seawalls",
    iconName: "seawall",
  },
  {
    id: "dock",
    description: "Best Types Of Docks.",
    ctaTextPre: "Click ",
    ctaTextEmphasized: "here",
    ctaTextPost: " To Learn More.",
    url: "/docks",
    iconName: "dock",
  },
];
