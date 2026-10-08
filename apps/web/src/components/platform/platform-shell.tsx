"use client";

import Link from "@/components/workspace/organization-link";
import { ShieldCheck } from "lucide-react";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Brand, WorkspaceLoading } from "@/components/portal/portal-ui";
import { ProfileMenu } from "@/components/portal/profile-menu";
import { usePathname } from "next/navigation";

export function PlatformShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { ready } = useWorkspace();
  return (
    <div className="min-h-svh">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-background focus:p-4"
      >
        Skip to content
      </a>
      <header className="border-b bg-background">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between gap-4 px-5 lg:px-8">
          <Link href="/" aria-label="JMWired home">
            <Brand />
          </Link>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="size-4" />
              Super admin
            </span>
            <ProfileMenu platform />
          </div>
        </div>
      </header>
      <nav
        aria-label="Platform navigation"
        className="flex gap-5 overflow-x-auto border-b px-5 py-3 lg:px-8"
      >
        {[
          { href: "/admin", label: "Organizations & users" },
          { href: "/admin/system", label: "System & AI" },
          { href: "/admin/audit", label: "Audit log" },
        ].map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            aria-current={pathname === entry.href ? "page" : undefined}
            className="shrink-0 text-sm hover:underline"
          >
            {entry.label}
          </Link>
        ))}
      </nav>
      <main id="main-content" className="mx-auto grid max-w-screen-2xl gap-5 p-5 lg:p-8">
        {ready ? children : <WorkspaceLoading />}
      </main>
    </div>
  );
}
