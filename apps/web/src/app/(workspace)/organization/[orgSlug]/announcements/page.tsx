import type { Metadata } from "next";
import { AnnouncementsPage } from "@/components/announcements/announcement-pages";
export const metadata: Metadata = { title: "Announcements · JMWired" };
export default function Page() {
  return <AnnouncementsPage />;
}
