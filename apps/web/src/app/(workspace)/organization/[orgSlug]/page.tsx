import type { Metadata } from "next";
import { OrganizationOverview } from "@/components/portal/organization-overview";
export const metadata: Metadata = { title: "Overview · JMWired" };
export default function Page() {
  return <OrganizationOverview />;
}
