import Link from "next/link";
import { Button } from "@jmwired/ui/components/button";
export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-svh max-w-xl content-center gap-5 px-5">
      <p className="font-mono text-sm text-muted-foreground">404</p>
      <h1 className="text-4xl font-semibold tracking-tight">This page isn’t here.</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        Check the address, or head back to your workspace.
      </p>
      <div className="flex gap-3">
        <Button size="touch" nativeButton={false} role="link" render={<Link href="/" />}>
          Go home
        </Button>
        <Button
          variant="outline"
          size="touch"
          nativeButton={false}
          role="link"
          render={<Link href="/organization" />}
        >
          Open workspace
        </Button>
      </div>
    </main>
  );
}
