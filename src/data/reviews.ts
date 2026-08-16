export interface Review {
  name: string;
  timeAgo: string;
  content: string;
  stars: number;
}

export const reviews: Review[] = [
  {
    name: "Dan P.",
    timeAgo: "3 weeks ago",
    content: "Very knowledgeable about docks and lifts. Helped us design the perfect setup for our challenging shoreline. Fair pricing and excellent follow-through.",
    stars: 5
  },
  {
    name: "Rachel K.",
    timeAgo: "2 months ago",
    content: "Called for a mooring inspection and got so much more. Kyle dove our site, found issues we didn't know existed, and fixed everything right then. Highly recommend.",
    stars: 5
  },
  {
    name: "Mike J.",
    timeAgo: "3 months ago",
    content: "Used their barging service to transport equipment across Grand Traverse Bay. Seamless operation and great communication. Will definitely use again.",
    stars: 5
  },
  {
    name: "Sarah L.",
    timeAgo: "4 months ago",
    content: "The team was professional, punctual, and their attention to detail is unmatched. Our new dock looks amazing and has completely elevated our waterfront.",
    stars: 5
  },
  {
    name: "Tom & Lisa H.",
    timeAgo: "5 months ago",
    content: "From the initial quote to installation, everything was smooth and stress-free. High quality work at a fair price. Couldn't be happier!",
    stars: 5
  },
  {
    name: "Jeff M.",
    timeAgo: "5 months ago",
    content: "Excellent experience all around. The lift works perfectly and the installers were top notch. Great local company to work with.",
    stars: 5
  }
];
