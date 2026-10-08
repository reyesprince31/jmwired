import type { Metadata } from "next";
import { BillingPage } from "@/components/marketing/marketing-pages";
export const metadata: Metadata = { title: "QR payments and billing · JMWired" };
export default function Page() {
  return <BillingPage />;
}
