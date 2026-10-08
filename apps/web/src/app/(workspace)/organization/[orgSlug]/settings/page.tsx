import type { Metadata } from "next";
import { OrganizationPage } from "@/components/organization/organization-pages";
export const metadata: Metadata = { title: "Organization · JMWired" };
export default function Page() {
  return <OrganizationPage />;
}
