import type { Metadata } from "next";
import { NewOrganizationPage } from "@/components/organization/organization-pages";
export const metadata: Metadata = { title: "Create organization · JMWired" };
export default function Page() {
  return <NewOrganizationPage />;
}
