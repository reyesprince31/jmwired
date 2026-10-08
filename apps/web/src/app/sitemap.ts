import type { MetadataRoute } from "next";
import { publicPages, siteUrl } from "@/lib/site";
import { shopItems } from "@/lib/shop-data";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...publicPages.map((page) => ({
      url: `${siteUrl}${page.href}`,
      changeFrequency: "monthly" as const,
    })),
    ...shopItems.map((item) => ({
      url: `${siteUrl}/shop/${item.slug}`,
      images: [`${siteUrl}${item.image}`],
      changeFrequency: "monthly" as const,
    })),
  ];
}
