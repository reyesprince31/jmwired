import Link from "next/link";
import { Button } from "@jmwired/ui/components/button";
import { ArrowUpRight, Menu } from "lucide-react";
import { Brand } from "@/components/portal/portal-ui";

export const marketingNavigation = [
  { href: "/platform", label: "Platform" },
  { href: "/billing", label: "Billing" },
  { href: "/customer-portal", label: "Customer portal" },
  { href: "/support", label: "Support" },
  { href: "/multi-location", label: "Multiple locations" },
  { href: "/about", label: "About" },
] as const;

export function MarketingShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
      >
        Skip to content
      </a>
      <header className="relative z-30 border-b bg-background">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-5 lg:px-8">
          <Link href="/" aria-label="JMWired home">
            <Brand />
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
            {marketingNavigation.slice(0, 4).map((entry) => (
              <Link
                key={entry.href}
                href={entry.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {entry.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              size="touch"
              nativeButton={false}
              role="link"
              render={<Link href="/organization" />}
            >
              Open workspace
              <ArrowUpRight />
            </Button>
            <details className="group lg:hidden">
              <summary
                aria-label="Open navigation"
                className="flex size-11 cursor-pointer list-none items-center justify-center border outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Menu className="size-5" />
              </summary>
              <nav
                aria-label="Mobile navigation"
                className="absolute inset-x-0 top-full grid gap-1 border-b bg-background p-5 shadow-sm"
              >
                {marketingNavigation.map((entry) => (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className="px-3 py-3 text-sm hover:bg-muted"
                  >
                    {entry.label}
                  </Link>
                ))}
                <Link href="/portal" className="px-3 py-3 text-sm hover:bg-muted">
                  View customer portal
                </Link>
              </nav>
            </details>
          </div>
        </div>
      </header>
      <main id="main-content">{children}</main>
      <footer className="border-t bg-muted/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[2fr_1fr_1fr] lg:px-8">
          <div className="space-y-4">
            <Link href="/" aria-label="JMWired home">
              <Brand />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A closer connection between your internet business and the people you serve.
            </p>
            <p className="font-mono text-xs text-muted-foreground">
              Built around local connections.
            </p>
          </div>
          <div>
            <p className="mb-4 text-sm font-medium">Explore the platform</p>
            <nav aria-label="Footer navigation" className="grid gap-3">
              {marketingNavigation.map((entry) => (
                <Link
                  key={entry.href}
                  href={entry.href}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {entry.label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="mb-4 text-sm font-medium">Your workspace</p>
            <nav aria-label="Workspace links" className="grid gap-3">
              <Link href="/sign-in" className="text-sm text-muted-foreground hover:text-foreground">
                Sign in
              </Link>
              <Link href="/sign-up" className="text-sm text-muted-foreground hover:text-foreground">
                Create account
              </Link>
              <a
                href="http://127.0.0.1:4001/docs"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Help center
              </a>
              <Link
                href="/organization"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Open workspace
              </Link>
              <Link href="/portal" className="text-sm text-muted-foreground hover:text-foreground">
                View customer portal
              </Link>
              <Link
                href="/organization/settings"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Manage your organization
              </Link>
            </nav>
          </div>
        </div>
        <div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-3 border-t px-5 py-5 text-xs text-muted-foreground lg:px-8">
          <span>© 2026 JMWired</span>
          <span>Internet operations, with people in mind.</span>
        </div>
      </footer>
    </>
  );
}
