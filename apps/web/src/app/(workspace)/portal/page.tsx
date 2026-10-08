import type { Metadata } from "next";
import { CustomerOverview } from "@/components/portal/customer-overview";
export const metadata: Metadata = { title: "Your internet · JMWired" };
export default function Page() {
  return <CustomerOverview />;
}
