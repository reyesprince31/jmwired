import type { Metadata } from "next";
import { CustomerBillsPage } from "@/components/payments/customer-billing";
export const metadata: Metadata = { title: "Billing & payments · JMWired" };
export default function Page() {
  return <CustomerBillsPage />;
}
