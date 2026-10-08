import type { Metadata } from "next";
import { PlatformPage } from "@/components/platform/platform-page";
export const metadata: Metadata = { title: "Platform admin · JMWired" };
export default function Page() {
  return <PlatformPage />;
}
