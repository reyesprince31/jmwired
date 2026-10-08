import { OrganizationShell } from "@/components/portal/organization-shell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <OrganizationShell>{children}</OrganizationShell>;
}
