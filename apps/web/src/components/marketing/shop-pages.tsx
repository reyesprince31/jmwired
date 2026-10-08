import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Search } from "lucide-react";
import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";
import { findShopItems, shopCategories, shopItems } from "@/lib/shop-data";
import type { ShopItem } from "@/lib/shop-data";

export function ShopPage({ category, query }: { category: string; query: string }) {
  const items = findShopItems(category, query);
  const selected = shopCategories.some((entry) => entry.id === category) ? category : "all";
  return (
    <>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 md:grid-cols-2 lg:px-8 lg:py-16">
        <div>
          <p className="mb-5 text-sm font-medium text-muted-foreground">
            JMWired equipment & services
          </p>
          <h1 className="text-5xl font-semibold leading-tight tracking-tight lg:text-6xl">
            Good gear.
            <br />
            Local help.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
            Build your network, secure your space, or get your paperwork done. Find what you need,
            with a local team to help you set it up.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="touch" nativeButton={false} role="link" render={<Link href="#catalog" />}>
              Browse the shop <ArrowRight />
            </Button>
            <Button
              variant="outline"
              size="touch"
              nativeButton={false}
              role="link"
              render={<Link href="/shop?category=services#catalog" />}
            >
              Explore services
            </Button>
          </div>
        </div>
        <Image
          src="/images/shop/network-equipment.png"
          alt="Router, network switch, and USB hub arranged on a studio surface"
          width={1024}
          height={1024}
          sizes="(min-width: 768px) 50vw, 100vw"
          loading="eager"
          className="aspect-[4/3] w-full object-cover"
        />
      </section>
      <section id="catalog" className="mx-auto max-w-7xl scroll-mt-6 px-5 pb-16 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-5 border-b pb-6">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">Equipment & everyday services</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tell us what you need. We’ll confirm the model, availability, and price.
            </p>
          </div>
          <form action="/shop" role="search" className="flex w-full gap-2 sm:w-auto">
            <label htmlFor="shop-search" className="sr-only">
              Search products and services
            </label>
            <Input
              key={query}
              id="shop-search"
              name="q"
              type="search"
              density="comfortable"
              defaultValue={query}
              placeholder="Search the shop"
              maxLength={100}
            />
            <input type="hidden" name="category" value={selected} />
            <Button variant="outline" size="icon-touch" type="submit" aria-label="Search shop">
              <Search />
            </Button>
          </form>
        </div>
        <nav aria-label="Shop categories" className="flex flex-wrap gap-2 py-6">
          {shopCategories.map((entry) => (
            <Button
              key={entry.id}
              variant={selected === entry.id ? "default" : "outline"}
              size="touch"
              nativeButton={false}
              role="link"
              render={
                <Link
                  href={`/shop?category=${entry.id}${query ? `&q=${encodeURIComponent(query)}` : ""}#catalog`}
                  aria-current={selected === entry.id ? "page" : undefined}
                />
              }
            >
              {entry.name}
            </Button>
          ))}
        </nav>
        <p role="status" className="mb-6 text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
          {query && ` matching “${query}”`}
        </p>
        {items.length ? (
          <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <li key={item.slug}>
                <ShopCard item={item} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="grid justify-items-start gap-4 border bg-muted/20 p-8">
            <h3 className="text-xl font-semibold">No items match your search.</h3>
            <p className="text-sm text-muted-foreground">
              Try another name, browse all items, or ask us about a custom request.
            </p>
            <Button
              variant="outline"
              nativeButton={false}
              role="link"
              render={<Link href="/shop#catalog" />}
            >
              View all items
            </Button>
          </div>
        )}
      </section>
      <section className="border-t bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-[2fr_1fr] lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              A little help goes a long way.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
              Not sure which router, camera, or cable fits your project? Describe your space and
              what you want to connect. We can help put the right equipment and services together.
            </p>
          </div>
          <div className="grid content-center justify-items-start gap-4">
            <p className="text-sm text-muted-foreground">
              For a home, a new shop, or your next office setup.
            </p>
            <Button
              size="touch"
              nativeButton={false}
              role="link"
              render={<Link href="/shop/inquiry" />}
            >
              Build an inquiry <ArrowUpRight />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

export function ShopCard({ item }: { item: ShopItem }) {
  return (
    <article>
      <Link
        href={`/shop/${item.slug}`}
        aria-label={`View ${item.name}`}
        className="block overflow-hidden bg-muted/30 outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Image
          src={item.image}
          alt={item.imageAlt}
          width={1024}
          height={1024}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="aspect-[4/3] w-full object-cover transition-transform duration-200 motion-safe:hover:scale-105"
        />
      </Link>
      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>{shopCategories.find((entry) => entry.id === item.category)?.name}</span>
        <span>{item.kind}</span>
      </div>
      <h3 className="mt-2 text-xl font-semibold tracking-tight">
        <Link href={`/shop/${item.slug}`} className="hover:underline">
          {item.name}
        </Link>
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
      <Link
        href={`/shop/${item.slug}`}
        className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium hover:underline"
      >
        View details <ArrowUpRight className="size-4" />
      </Link>
    </article>
  );
}

export function ShopItemPage({ item }: { item: ShopItem }) {
  const related = shopItems
    .filter((entry) => entry.slug !== item.slug && entry.category === item.category)
    .slice(0, 3);
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex flex-wrap gap-2 text-sm text-muted-foreground"
        >
          <Link href="/shop" className="hover:underline">
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <span>{item.name}</span>
        </nav>
        <div className="grid items-start gap-10 md:grid-cols-2 lg:gap-16">
          <Image
            src={item.image}
            alt={item.imageAlt}
            width={1024}
            height={1024}
            sizes="(min-width: 768px) 50vw, 100vw"
            loading="eager"
            className="aspect-square w-full bg-muted/30 object-cover"
          />
          <div className="py-3">
            <p className="text-sm text-muted-foreground">
              {item.kind} · {shopCategories.find((entry) => entry.id === item.category)?.name}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight lg:text-5xl">{item.name}</h1>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{item.description}</p>
            <p className="mt-7 text-xl font-semibold">Price on request</p>
            <p className="mt-2 text-sm text-muted-foreground">
              We’ll confirm availability and the options that fit your needs.
            </p>
            <ul className="my-7 grid gap-4">
              {item.options.map((option) => (
                <li key={option} className="flex gap-3 text-sm">
                  <Check className="size-4 shrink-0" />
                  {option}
                </li>
              ))}
            </ul>
            <Button
              size="touch"
              nativeButton={false}
              role="link"
              render={<Link href={`/shop/inquiry?item=${item.slug}`} />}
            >
              Request a quote <ArrowRight />
            </Button>
            <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
              Images illustrate the product category. Exact models, included items, service scope,
              and price are confirmed in your quote.
            </p>
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8">
          <h2 className="mb-7 text-2xl font-semibold tracking-tight">You might also need</h2>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((entry) => (
              <li key={entry.slug}>
                <ShopCard item={entry} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
