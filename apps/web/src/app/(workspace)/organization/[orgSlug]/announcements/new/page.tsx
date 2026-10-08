import type { Metadata } from "next";
import { PublishPage } from "@/components/announcements/announcement-pages";
export const metadata: Metadata = { title: "Publish update · JMWired" };
export default function Page() {
  return <PublishPage />;
}
