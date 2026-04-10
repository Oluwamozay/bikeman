import bikeBajaj from "@/assets/bike-bajaj-boxer.png";
import bikeHonda from "@/assets/bike-honda-ace.png";
import bikeTvs from "@/assets/bike-tvs-apache.png";
import bikeSuzuki from "@/assets/bike-suzuki-gn.png";
import bikeYamaha from "@/assets/bike-yamaha-ybr.png";

export interface BikeSpec {
  label: string;
  value: string;
}

export interface FeaturedBike {
  id: string;
  name: string;
  price: string;
  tag: string;
  img: string;
  description: string;
  specs: BikeSpec[];
  gallery: string[];
}

export const featuredBikes: FeaturedBike[] = [
  {
    id: "bajaj-boxer-150",
    name: "Bajaj Boxer 150",
    price: "₦485,000",
    tag: "Popular",
    img: bikeBajaj,
    description: "The Bajaj Boxer 150 is Nigeria's most trusted workhorse. Built for durability and fuel efficiency, it's the top choice for commercial riders across the country.",
    specs: [
      { label: "Engine", value: "149.5cc" },
      { label: "Power", value: "12 BHP" },
      { label: "Mileage", value: "70 km/l" },
      { label: "Weight", value: "135 kg" },
      { label: "Tank", value: "14 L" },
      { label: "Top Speed", value: "100 km/h" },
    ],
    gallery: [bikeBajaj],
  },
  {
    id: "honda-ace-125",
    name: "Honda ACE 125",
    price: "₦620,000",
    tag: "New",
    img: bikeHonda,
    description: "Honda ACE 125 delivers unmatched reliability with Honda's legendary build quality. Perfect for daily commuting with excellent fuel economy.",
    specs: [
      { label: "Engine", value: "124.9cc" },
      { label: "Power", value: "10.1 BHP" },
      { label: "Mileage", value: "65 km/l" },
      { label: "Weight", value: "118 kg" },
      { label: "Tank", value: "11 L" },
      { label: "Top Speed", value: "95 km/h" },
    ],
    gallery: [bikeHonda],
  },
  {
    id: "tvs-apache-160",
    name: "TVS Apache 160",
    price: "₦750,000",
    tag: "Premium",
    img: bikeTvs,
    description: "The TVS Apache 160 is a performance-oriented motorcycle with sporty design and advanced features. Ideal for riders who want power and style.",
    specs: [
      { label: "Engine", value: "159.7cc" },
      { label: "Power", value: "15.6 BHP" },
      { label: "Mileage", value: "50 km/l" },
      { label: "Weight", value: "145 kg" },
      { label: "Tank", value: "12 L" },
      { label: "Top Speed", value: "114 km/h" },
    ],
    gallery: [bikeTvs],
  },
  {
    id: "suzuki-gn-125",
    name: "Suzuki GN 125",
    price: "₦520,000",
    tag: "Best Value",
    img: bikeSuzuki,
    description: "The Suzuki GN 125 offers the perfect blend of affordability and quality. A dependable everyday bike with Suzuki's proven engineering.",
    specs: [
      { label: "Engine", value: "124cc" },
      { label: "Power", value: "11 BHP" },
      { label: "Mileage", value: "60 km/l" },
      { label: "Weight", value: "128 kg" },
      { label: "Tank", value: "13 L" },
      { label: "Top Speed", value: "100 km/h" },
    ],
    gallery: [bikeSuzuki],
  },
  {
    id: "yamaha-ybr-125",
    name: "Yamaha YBR 125",
    price: "₦580,000",
    tag: "Trending",
    img: bikeYamaha,
    description: "Yamaha YBR 125 combines Yamaha's sporty DNA with everyday practicality. Smooth ride, refined engine, and a trusted brand name.",
    specs: [
      { label: "Engine", value: "124cc" },
      { label: "Power", value: "10.7 BHP" },
      { label: "Mileage", value: "55 km/l" },
      { label: "Weight", value: "125 kg" },
      { label: "Tank", value: "13 L" },
      { label: "Top Speed", value: "105 km/h" },
    ],
    gallery: [bikeYamaha],
  },
];

export const bikeTags = ["All", ...new Set(featuredBikes.map((b) => b.tag))];
