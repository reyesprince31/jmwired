import type { Metadata } from "next";
import { PayBillPage } from "@/components/payments/payment-pages";
export const metadata: Metadata = { title: "Pay your bill · JMWired" };
export default function Page() {
  return <PayBillPage />;
}
