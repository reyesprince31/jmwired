import type { Metadata } from "next";
import { BillingPage } from "@/components/payments/billing-page";
export const metadata: Metadata = { title: "Billing & payments · JMWired" };
export default function Page() {
  return <BillingPage />;
}
