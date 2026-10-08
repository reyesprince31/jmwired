import type { Metadata } from "next";
import { AboutPage } from "@/components/marketing/marketing-pages";
export const metadata: Metadata = { title: "Built around the last mile · JMWired" };
export default function Page() {
  return <AboutPage />;
}
