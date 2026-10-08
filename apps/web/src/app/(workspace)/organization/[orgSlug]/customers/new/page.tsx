import type { Metadata } from "next";
import { NewCustomerPage } from "@/components/customers/customer-pages";
export const metadata: Metadata = { title: "Add customer · JMWired" };
export default function Page() {
  return <NewCustomerPage />;
}
