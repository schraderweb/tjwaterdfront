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
    ctaTextPost: " to learn how.",
    url: "/contact",
    iconName: "warranty",
  },
  {
    id: "boatLift",
    description: "Ways to maintain your boat lift.",
    ctaTextPre: "Click ",
    ctaTextEmphasized: "here",
    ctaTextPost: " to learn how.",
    url: "/services/hoist-service",
    iconName: "boatLift",
  },
  {
    id: "seawall",
    description: "Ways to maintain your seawalls.",
    ctaTextPre: "Click ",
    ctaTextEmphasized: "here",
    ctaTextPost: " to learn how.",
    url: "/services/seawalls",
    iconName: "seawall",
  },
  {
    id: "dock",
    description: "Best types of docks.",
    ctaTextPre: "Click ",
    ctaTextEmphasized: "here",
    ctaTextPost: " to learn more.",
    url: "/docks",
    iconName: "dock",
  },
];
