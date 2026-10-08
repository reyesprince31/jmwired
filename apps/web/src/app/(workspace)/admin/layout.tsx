import { PlatformShell } from "@/components/platform/platform-shell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <PlatformShell>{children}</PlatformShell>;
}
