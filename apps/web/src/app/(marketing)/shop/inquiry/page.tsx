import type { Metadata } from "next";
import { ShopInquiry } from "@/components/marketing/shop-inquiry";
export const metadata: Metadata = {
  title: "Prepare an inquiry · JMWired Shop",
  robots: { index: false, follow: false },
};
export default async function Page({ searchParams }: PageProps<"/shop/inquiry">) {
  const params = await searchParams;
  return <ShopInquiry selectedItem={typeof params.item === "string" ? params.item : ""} />;
}
