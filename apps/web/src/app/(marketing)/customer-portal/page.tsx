import type { Metadata } from "next";
import { CustomerPortalPage } from "@/components/marketing/marketing-pages";
export const metadata: Metadata = { title: "Your customer portal · JMWired" };
export default function Page() {
  return <CustomerPortalPage />;
}
