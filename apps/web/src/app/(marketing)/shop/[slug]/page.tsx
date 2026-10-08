import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopItemPage } from "@/components/marketing/shop-pages";
import { shopItems } from "@/lib/shop-data";
export function generateStaticParams() {
  return shopItems.map((item) => ({ slug: item.slug }));
}
export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const item = shopItems.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return {
    title: `${item.name} · JMWired Shop`,
    description: item.description,
    alternates: { canonical: `/shop/${item.slug}` },
    openGraph: { images: [{ url: item.image, alt: item.imageAlt }] },
  };
}
export default async function Page({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const item = shopItems.find((entry) => entry.slug === slug);
  if (!item) notFound();
  return <ShopItemPage item={item} />;
}
