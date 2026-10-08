import type { Metadata } from "next";
import { MultiLocationPage } from "@/components/marketing/marketing-pages";
export const metadata: Metadata = { title: "Organizations and service areas · JMWired" };
export default function Page() {
  return <MultiLocationPage />;
}
