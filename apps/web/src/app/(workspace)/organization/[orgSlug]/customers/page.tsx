import type { Metadata } from "next";
import { CustomersPage } from "@/components/customers/customer-pages";
export const metadata: Metadata = { title: "Customers · JMWired" };
export default function Page() {
  return <CustomersPage />;
}
