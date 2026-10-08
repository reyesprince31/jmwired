import type { Metadata } from "next";
import { CustomerUpdatesPage } from "@/components/announcements/customer-updates";
export const metadata: Metadata = { title: "Network updates · JMWired" };
export default function Page() {
  return <CustomerUpdatesPage />;
}
