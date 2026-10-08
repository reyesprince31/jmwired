import WorkspaceProvider from "@/components/workspace/workspace-provider";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <WorkspaceProvider>{children}</WorkspaceProvider>;
}
