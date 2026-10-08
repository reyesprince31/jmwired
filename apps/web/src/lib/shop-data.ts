export const shopCategories = [
  { id: "all", name: "All items" },
  { id: "networking", name: "Networking" },
  { id: "security", name: "CCTV & security" },
  { id: "office", name: "Office essentials" },
  { id: "services", name: "Local services" },
] as const;

export type ShopItem = {
  slug: string;
  name: string;
  category: Exclude<(typeof shopCategories)[number]["id"], "all">;
  kind: "Equipment" | "Service";
  description: string;
  image: string;
  imageAlt: string;
  options: string[];
};

const networking = {
  image: "/images/shop/network-equipment.png",
  imageAlt: "Wired router, Ethernet switch, and USB hub on a studio surface",
};
const cable = {
  image: "/images/shop/cat6-cable.png",
  imageAlt: "Blue and gray Ethernet cables with RJ45 connectors",
};
const security = {
  image: "/images/shop/cctv-equipment.png",
  imageAlt: "Bullet and dome security cameras with a video recorder",
};
const wireless = {
  image: "/images/shop/outdoor-wireless.png",
  imageAlt: "Outdoor panel radio and dish antenna with mounting brackets",
};
const office = {
  image: "/images/shop/office-services.png",
  imageAlt: "Printer, paper ream, and document folder on a desk",
};

export const shopItems: ShopItem[] = [
  {
    slug: "cat6-cable",
    name: "CAT6 cables",
    category: "networking",
    kind: "Equipment",
    ...cable,
    description: "Patch leads and cable for a tidy home or office network.",
    options: [
      "Tell us the length or quantity you need",
      "Pre-made leads or cable runs",
      "Termination and installation available",
    ],
  },
  {
    slug: "rj45-connectors",
    name: "RJ45 connectors & accessories",
    category: "networking",
    kind: "Equipment",
    ...cable,
    description: "The small parts that bring a cable installation together.",
    options: [
      "Connectors, boots, and cable accessories",
      "Match parts to your cable",
      "Ask about termination tools",
    ],
  },
  {
    slug: "network-switches",
    name: "Network switches",
    category: "networking",
    kind: "Equipment",
    ...networking,
    description: "Connect more wired devices at home, in a shop, or in the office.",
    options: [
      "Choose a port count for your devices",
      "Ask about managed and PoE options",
      "Installation and cable layout assistance",
    ],
  },
  {
    slug: "usb-hubs",
    name: "USB hubs & adapters",
    category: "office",
    kind: "Equipment",
    ...networking,
    description: "More connections for laptops, printers, and desk accessories.",
    options: [
      "USB and USB-C options",
      "Confirm your laptop's connector",
      "Ask about Ethernet and display adapters",
    ],
  },
  {
    slug: "mikrotik-routers",
    name: "MikroTik routers",
    category: "networking",
    kind: "Equipment",
    ...networking,
    description: "Routing equipment and setup assistance for your network.",
    options: [
      "Model selected around your requirements",
      "Tell us your connection and device count",
      "Configuration assistance available",
    ],
  },
  {
    slug: "wireless-access-points",
    name: "Wireless access points",
    category: "networking",
    kind: "Equipment",
    ...networking,
    description: "Plan Wi-Fi coverage around your rooms, floors, and connected devices.",
    options: [
      "Indoor coverage planning",
      "Ask about mounting and power requirements",
      "Installation and setup available",
    ],
  },
  {
    slug: "outdoor-cpe",
    name: "Outdoor CPE radios",
    category: "networking",
    kind: "Equipment",
    ...wireless,
    description: "Outdoor wireless equipment for links between locations.",
    options: [
      "Share both locations and intended use",
      "Site assessment before model selection",
      "Mounting and alignment assistance",
    ],
  },
  {
    slug: "antennas",
    name: "Antennas & mounting kits",
    category: "networking",
    kind: "Equipment",
    ...wireless,
    description: "Antenna and mounting options to suit your outdoor equipment.",
    options: [
      "Confirm compatibility with your radio",
      "Brackets and mounting accessories",
      "Ask about a site visit",
    ],
  },
  {
    slug: "cctv-cameras",
    name: "CCTV cameras & recorders",
    category: "security",
    kind: "Equipment",
    ...security,
    description: "Camera and recording options for homes, offices, and small businesses.",
    options: [
      "Indoor and outdoor camera options",
      "Plan the camera count and viewing areas",
      "Recorder and storage options confirmed in your quote",
    ],
  },
  {
    slug: "cctv-installation",
    name: "CCTV installation",
    category: "services",
    kind: "Service",
    ...security,
    description: "Get help planning, mounting, cabling, and setting up your cameras.",
    options: [
      "Share the property type and camera count",
      "Site visit and installation scope",
      "Recording and viewing setup",
    ],
  },
  {
    slug: "a4-paper",
    name: "A4 paper & office supplies",
    category: "office",
    kind: "Equipment",
    ...office,
    description: "Paper and everyday supplies for your desk or small office.",
    options: [
      "Tell us the paper size and quantity",
      "Ask about paper weight and availability",
      "Pickup arrangements confirmed with the team",
    ],
  },
  {
    slug: "printing-scanning",
    name: "Printing, scanning & photocopying",
    category: "services",
    kind: "Service",
    ...office,
    description: "A local stop for documents, copies, and digital scans.",
    options: [
      "Tell us page count and color preference",
      "Single- or double-sided requirements",
      "File handover arranged after inquiry",
    ],
  },
  {
    slug: "document-assistance",
    name: "Document preparation assistance",
    category: "services",
    kind: "Service",
    ...office,
    description: "Help organizing, printing, and preparing your paperwork.",
    options: [
      "Describe the paperwork you need help with",
      "Ask about forms, copies, and document organization",
      "Keep personal documents out of this inquiry",
    ],
  },
  {
    slug: "registration-assistance",
    name: "Registration assistance",
    category: "services",
    kind: "Service",
    ...office,
    description: "Get help preparing forms and organizing a registration request.",
    options: [
      "Tell us which registration you need",
      "Scope and requirements confirmed by the team",
      "Service charges and any official fees quoted separately",
    ],
  },
  {
    slug: "network-installation",
    name: "Network installation & setup",
    category: "services",
    kind: "Service",
    ...networking,
    description: "Cabling, router setup, and a practical plan for your connected space.",
    options: [
      "Home, office, and small-business projects",
      "Share the layout and number of devices",
      "Equipment and labor included in the proposed scope",
    ],
  },
];

export function findShopItems(category: string, query: string) {
  const selected = shopCategories.some((entry) => entry.id === category) ? category : "all";
  const search = query.trim().toLowerCase();
  return shopItems.filter(
    (item) =>
      (selected === "all" || item.category === selected) &&
      `${item.name} ${item.description} ${item.options.join(" ")}`.toLowerCase().includes(search),
  );
}
