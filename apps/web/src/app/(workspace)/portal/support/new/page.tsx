import type { Metadata } from "next";
import { NewRequestPage } from "@/components/support/support-pages";
export const metadata: Metadata = { title: "New support request · JMWired" };
export default function Page() {
  return <NewRequestPage />;
}
