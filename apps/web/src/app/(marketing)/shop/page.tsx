import type { Metadata } from "next";
import { ShopPage } from "@/components/marketing/shop-pages";
export const metadata: Metadata = {
  title: "Equipment & local services · JMWired",
  description:
    "Browse networking equipment, CCTV, office supplies, document assistance, and local installation services.",
  alternates: { canonical: "/shop" },
};
export default async function Page({ searchParams }: PageProps<"/shop">) {
  const params = await searchParams;
  return (
    <ShopPage
      category={typeof params.category === "string" ? params.category : "all"}
      query={typeof params.q === "string" ? params.q.slice(0, 100) : ""}
    />
  );
}
