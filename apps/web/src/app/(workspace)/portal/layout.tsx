import { CustomerShell } from "@/components/portal/customer-shell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <CustomerShell>{children}</CustomerShell>;
}
