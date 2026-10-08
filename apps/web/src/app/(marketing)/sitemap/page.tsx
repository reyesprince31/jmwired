import Link from "next/link";
import type { Metadata } from "next";
import { publicPages } from "@/lib/site";
import { shopItems } from "@/lib/shop-data";
export const metadata: Metadata = {
  title: "Sitemap · JMWired",
  alternates: { canonical: "/sitemap" },
};
export default function Page() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
      <h1 className="text-4xl font-semibold tracking-tight">Find your way around.</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Public pages, equipment, and local services in one place.
      </p>
      <div className="mt-10 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-5 text-xl font-semibold">Explore JMWired</h2>
          <ul className="grid gap-4">
            {publicPages
              .filter((page) => page.href !== "/sitemap")
              .map((page) => (
                <li key={page.href}>
                  <Link href={page.href} className="text-sm hover:underline">
                    {page.label}
                  </Link>
                </li>
              ))}
          </ul>
          <a
            href="/sitemap.xml"
            className="mt-8 inline-block text-sm text-muted-foreground hover:underline"
          >
            XML sitemap
          </a>
        </div>
        <div>
          <h2 className="mb-5 text-xl font-semibold">Equipment & services</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {shopItems.map((item) => (
              <li key={item.slug}>
                <Link href={`/shop/${item.slug}`} className="text-sm hover:underline">
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
