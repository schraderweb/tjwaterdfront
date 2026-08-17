export interface Review {
  name: string;
  timeAgo: string;
  content: string;
  stars: number;
}

export const reviewSummary = {
  rating: 4.9,
  count: 220,
  source: "Google",
  url: "https://www.google.com/maps/search/?api=1&query=T%26J%20Waterfront%20Services%2C%205385%20Mack%20Rd%2C%20Howell%2C%20MI%2048855",
};

const baseReviews: Review[] = [
  {
    name: "Jeremy Poegel",
    timeAgo: "2 months ago",
    content: "Tyler was a pleasure to deal with and runs a first class operation. Couldn't be more pleased with my experience purchasing a jet ski floating dock. Even got the pleasure of meeting his beautiful family! Thank you and I'm a customer for life.",
    stars: 5
  },
  {
    name: "Brian Bielat",
    timeAgo: "3 months ago",
    content: "I'm happy with my dock and had a great experience working with TJ Waterfront Services. They listened to my needs, worked with me on my concerns. Top notch installation and crew.",
    stars: 5
  },
  {
    name: "Mike Meyer",
    timeAgo: "a year ago",
    content: "T&J Waterfront Services was awesome to work with for our HOA dock. Follow up on questions was timely and helpful. Price and quality was great. Installation team did a super job. Would highly recommend!",
    stars: 5
  },
  {
    name: "Phil Pirkola",
    timeAgo: "a year ago",
    content: "We had an incredible experience with T&J Waterfront Services. Tyler was incredibly detailed and thoughtful from our initial questions, through the design and planning phase, and all the way through the install.",
    stars: 5
  },
  {
    name: "Mary Dean",
    timeAgo: "2 years ago",
    content: "Our experience with T&J was truly exceptional. From the first consultation to the final installation, their team demonstrated knowledge and professionalism. They listened to our needs, ensuring we found the perfect dock within our budget.",
    stars: 5
  },
  {
    name: "Mel Roy",
    timeAgo: "2 years ago",
    content: "Worked with the owner, Tyler, at the Detroit Boat Show to get us the perfect dock for our deep mucky shore. Husband and I needed time to think over such a large expense.",
    stars: 5
  }
];

const rotate = <T,>(arr: T[], offset: number): T[] => [
  ...arr.slice(offset),
  ...arr.slice(0, offset),
];

export const reviews: Review[] = [
  ...baseReviews,
  ...rotate(baseReviews, 2),
  ...rotate(baseReviews, 4),
  ...rotate(baseReviews, 3),
].slice(0, 24);
