"use client";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ComponentProps } from "react";
import { organizationHref } from "@/lib/organization-path";
import { useWorkspace } from "./workspace-provider";

export default function OrganizationLink({
  href,
  ...props
}: Omit<ComponentProps<typeof NextLink>, "href"> & { href: string }) {
  const { orgId } = useWorkspace();
  return <NextLink href={organizationHref(orgId, href)} {...props} />;
}

export function useWorkspaceRouter() {
  const router = useRouter();
  const { orgId } = useWorkspace();
  return {
    push: (href: string) => router.push(organizationHref(orgId, href)),
    replace: (href: string) => router.replace(organizationHref(orgId, href)),
  };
}

export function OrganizationRedirect({ path = "" }: { path?: string }) {
  const { orgId, ready } = useWorkspace();
  const router = useRouter();
  useEffect(() => {
    if (ready) router.replace(organizationHref(orgId, `/organization${path}`));
  }, [ready, orgId, path, router]);
  return (
    <p role="status" className="py-12 text-sm text-muted-foreground">
      Opening your organization…
    </p>
  );
}
