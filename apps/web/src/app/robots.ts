import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/organization",
        "/portal",
        "/account",
        "/dashboard",
        "/api",
        "/sign-in",
        "/sign-up",
        "/forgot-password",
        "/reset-password",
        "/activate",
        "/join",
        "/shop/inquiry",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
