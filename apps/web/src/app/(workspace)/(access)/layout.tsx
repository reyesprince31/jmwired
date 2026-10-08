import { AccessShell } from "@/components/account/onboarding-pages";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <AccessShell>{children}</AccessShell>;
}
