import type { Metadata } from "next";
import { PlansPage } from "@/components/marketing/plans-pages";

export const metadata: Metadata = {
  title: "High-speed fiber internet plans · JMWired",
  description:
    "Explore reliable, unlimited residential and business fiber plans built for local communities. Fast speeds, zero data caps, and local technician support.",
  alternates: { canonical: "/plans" },
};

export default function Page() {
  return <PlansPage />;
}
