import type { Metadata } from "next";
import { HomePage } from "@/components/marketing/marketing-pages";
export const metadata: Metadata = { title: "Local internet. Connected operations. · JMWired" };
export default function Page() {
  return <HomePage />;
}
