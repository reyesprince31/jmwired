import type { Route } from "next";

export type PlanTier = {
  id: string;
  name: string;
  category: "residential" | "business";
  speed: number; // in Mbps
  price: number; // in PHP
  badge?: string;
  tagline: string;
  description: string;
  idealFor: string;
  features: string[];
  specs: {
    downloadSpeed: string;
    uploadSpeed: string;
    dataCap: string;
    routerIncluded: string;
    lockInPeriod: string;
    supportSla: string;
  };
  ctaText: string;
  ctaHref: Route;
};

export const residentialPlans: PlanTier[] = [
  {
    id: "home-35",
    name: "Home Fiber 35",
    category: "residential",
    speed: 35,
    price: 999,
    badge: "Starter",
    tagline: "Essential connectivity for small households",
    description:
      "Reliable fiber for everyday online schooling, social media, voice calls, and standard HD streaming.",
    idealFor: "1 to 4 devices, online classes, messaging, HD video",
    features: [
      "35 Mbps symmetric upload and download",
      "Unlimited monthly data with zero data caps",
      "Dual-band Wi-Fi ONU modem included",
      "Free standard installation (12-month lock-in)",
      "Subscriber portal account for bill tracking & GCash/Maya receipts",
      "Local barangay lineman dispatch support",
    ],
    specs: {
      downloadSpeed: "Up to 35 Mbps",
      uploadSpeed: "Up to 35 Mbps",
      dataCap: "Unlimited / No FUP throttling",
      routerIncluded: "Dual-band Wi-Fi ONU",
      lockInPeriod: "12 months",
      supportSla: "Standard (within 24 hours)",
    },
    ctaText: "Apply for Home 35",
    ctaHref: "/join/poblacion?plan=35" as Route,
  },
  {
    id: "home-60",
    name: "Home Fiber 60",
    category: "residential",
    speed: 60,
    price: 1199,
    badge: "Most popular",
    tagline: "High-speed bandwidth for active families",
    description:
      "Smooth 4K video streaming, lag-free multiplayer gaming, and simultaneous video conference meetings.",
    idealFor: "5 to 8 devices, work-from-home, 4K streaming, online gaming",
    features: [
      "60 Mbps symmetric upload and download",
      "Unlimited data with zero throttling or speed drops",
      "High-gain dual-band Wi-Fi 6 ONU included",
      "Free standard installation with optical test certification",
      "Portal access with automated due-date reminders",
      "Priority scheduling for field technician visits",
    ],
    specs: {
      downloadSpeed: "Up to 60 Mbps",
      uploadSpeed: "Up to 60 Mbps",
      dataCap: "Unlimited / No FUP throttling",
      routerIncluded: "Dual-band Wi-Fi 6 ONU",
      lockInPeriod: "12 months",
      supportSla: "Priority (same-day dispatch)",
    },
    ctaText: "Apply for Home 60",
    ctaHref: "/join/poblacion?plan=60" as Route,
  },
  {
    id: "home-100",
    name: "Home Fiber 100",
    category: "residential",
    speed: 100,
    price: 1499,
    badge: "Power user",
    tagline: "Maximum speed for heavy digital demands",
    description:
      "Designed for power users, content creators, multiple remote professionals, and smart homes with dozens of connected gadgets.",
    idealFor: "8+ devices, heavy downloads, streaming creators, remote professionals",
    features: [
      "100 Mbps symmetric upload and download",
      "Dedicated fiber allocation with low-latency routing",
      "Gigabit dual-band Wi-Fi 6 ONU included",
      "Free installation with drop line optical verification",
      "Subscriber portal with detailed data usage graphs",
      "Expedited technician ticket review",
    ],
    specs: {
      downloadSpeed: "Up to 100 Mbps",
      uploadSpeed: "Up to 100 Mbps",
      dataCap: "Unlimited / No FUP throttling",
      routerIncluded: "Gigabit Wi-Fi 6 ONU",
      lockInPeriod: "12 months",
      supportSla: "Expedited (within 12 hours)",
    },
    ctaText: "Apply for Home 100",
    ctaHref: "/join/poblacion?plan=100" as Route,
  },
];

export const businessPlans: PlanTier[] = [
  {
    id: "biz-200",
    name: "Business Fiber 200",
    category: "business",
    speed: 200,
    price: 2499,
    badge: "Retail & Office",
    tagline: "Commercial connectivity for local businesses and shops",
    description:
      "Dedicated daytime priority bandwidth for point-of-sale systems, office staff, cloud backups, and customer Wi-Fi.",
    idealFor: "Retail stores, clinics, accounting offices, co-working spaces",
    features: [
      "200 Mbps symmetric business-grade fiber",
      "99.5% network uptime service commitment",
      "Commercial dual-band gateway router included",
      "Official BIR-registered receipts and billing statements",
      "4-hour field response guarantee during business hours",
      "Multi-user organization billing via portal",
    ],
    specs: {
      downloadSpeed: "Up to 200 Mbps",
      uploadSpeed: "Up to 200 Mbps",
      dataCap: "Unlimited commercial traffic",
      routerIncluded: "Business Gateway ONU",
      lockInPeriod: "12 or 24 months",
      supportSla: "4-hour business dispatch",
    },
    ctaText: "Inquire for Business",
    ctaHref: "/shop/inquiry?product=business-fiber-200" as Route,
  },
  {
    id: "biz-500",
    name: "Dedicated Enterprise 500",
    category: "business",
    speed: 500,
    price: 4999,
    badge: "Enterprise",
    tagline: "Dedicated trunk bandwidth with mission-critical SLA",
    description:
      "Uncompromised capacity for schools, municipal offices, multi-tenant properties, and enterprises requiring dedicated routing.",
    idealFor: "Institutions, hotels, commercial plazas, IT operations",
    features: [
      "500 Mbps dedicated symmetric fiber link",
      "Static public IPv4 address option",
      "Dedicated fiber core from distribution hub",
      "Dedicated technical account manager and direct hotline",
      "2-hour emergency fiber restoration SLA",
      "Custom multi-access point and VLAN configuration support",
    ],
    specs: {
      downloadSpeed: "Up to 500 Mbps",
      uploadSpeed: "Up to 500 Mbps",
      dataCap: "Unlimited unmetered dedicated bandwidth",
      routerIncluded: "Managed Enterprise Gateway / SFP ONU",
      lockInPeriod: "24 months",
      supportSla: "2-hour dedicated SLA",
    },
    ctaText: "Inquire for Enterprise",
    ctaHref: "/shop/inquiry?product=enterprise-fiber-500" as Route,
  },
];

export const allPlans = [...residentialPlans, ...businessPlans];

export const planFaqs = [
  {
    question: "What documents do I need to apply for a connection?",
    answer:
      "For residential accounts, you only need one valid government-issued ID (such as PhilID, Driver's License, UMID, or Passport) and proof of billing or a Barangay Certificate of Residency. For business accounts, please provide your DTI or SEC registration and Mayor's Permit.",
  },
  {
    question: "How long does installation take after I submit my application?",
    answer:
      "Once you submit your application through our portal or local branch, our field team performs a line survey to check port availability at the nearest Network Access Point (NAP) box. Standard installation is typically scheduled and completed within 24 to 48 hours.",
  },
  {
    question: "Is there really no data cap or daily throttling?",
    answer:
      "Yes! All JMWired plans are truly unlimited. We do not enforce Fair Usage Policy (FUP) limits, daily gigabyte quotas, or speed drops. You enjoy full symmetric bandwidth 24/7.",
  },
  {
    question: "What payment methods are supported for monthly dues?",
    answer:
      "You can pay conveniently via GCash, Maya, or online bank transfer directly through our customer portal by attaching your payment screenshot and reference number. You can also pay in cash at our local branch offices during office hours.",
  },
  {
    question: "Can I upgrade my plan if our bandwidth needs increase?",
    answer:
      "Yes, plan upgrades are seamless. Because our fiber drop cable and optical network unit (ONU) support gigabit speeds, upgrades are provisioned remotely by our staff without requiring a line change or technician visit.",
  },
  {
    question: "What happens if there is an area outage or line cut?",
    answer:
      "Outage announcements and scheduled maintenance notices are published directly in your customer portal. Our local linemen are stationed within your municipality to ensure rapid on-site fiber splicing and repair.",
  },
];
