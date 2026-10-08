import type { Metadata } from "next";
import { PaymentHistoryPage } from "@/components/payments/payment-pages";
export const metadata: Metadata = { title: "Payment history · JMWired" };
export default function Page() {
  return <PaymentHistoryPage />;
}
