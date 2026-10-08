import type { Metadata } from "next";
import { SupportPage } from "@/components/marketing/marketing-pages";
export const metadata: Metadata = { title: "Customer conversations and support · JMWired" };
export default function Page() {
  return <SupportPage />;
}
