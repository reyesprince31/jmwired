"use client";

import { Children, cloneElement, isValidElement, useEffect, useId, useRef } from "react";
import Link from "@/components/workspace/organization-link";
import type { ReactNode, ReactElement, SelectHTMLAttributes } from "react";
import { Button } from "@jmwired/ui/components/button";
import { X, Wifi, ArrowUpRight } from "lucide-react";
import { initials } from "@/lib/mock-data";

export function Brand() {
  return (
    <span className="flex items-center gap-2 text-xl font-semibold tracking-tight">
      <Wifi className="size-6" aria-hidden="true" />
      JMWired<span className="sr-only">Internet provider portal</span>
    </span>
  );
}
export function Avatar({ name }: { name: string }) {
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium"
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
export function Status({ children }: { children: ReactNode }) {
  const good = ["Active", "Paid", "Online", "Resolved"].includes(String(children));
  const bad = ["Suspended", "Rejected", "Overdue", "Outage"].includes(String(children));
  return (
    <span
      className={
        good
          ? "inline-flex items-center gap-1.5 text-xs font-medium text-success"
          : bad
            ? "inline-flex items-center gap-1.5 text-xs font-medium text-destructive"
            : "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
      }
    >
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {children}
    </span>
  );
}
export function PageHeading({
  title,
  description,
  children,
  greeting = false,
}: {
  title: string;
  description: string;
  children?: ReactNode;
  greeting?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1
          className={
            greeting
              ? "text-4xl font-semibold tracking-tight"
              : "text-3xl font-semibold tracking-tight"
          }
        >
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}
export function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 border bg-card">
      <div className="flex items-center justify-between gap-3 px-5 py-4">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}
export function Metric({
  label,
  value,
  note,
}: {
  label: string;
  value: ReactNode;
  note?: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-2 border-l pl-5 first:border-l-0 first:pl-0">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
      {note && <p className="text-xs text-muted-foreground">{note}</p>}
    </div>
  );
}
export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="h-11 w-full min-w-0 border bg-background px-2.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      {...props}
    >
      {children}
    </select>
  );
}
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-xs font-medium">
      {label}
      {Children.map(children, (child) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<{ "aria-label"?: string }>, {
              "aria-label": (child.props as { "aria-label"?: string })["aria-label"] ?? label,
            })
          : child,
      )}
    </label>
  );
}
export function Empty({
  title,
  description,
  children,
  page = false,
}: {
  title: string;
  description: string;
  children?: ReactNode;
  page?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <Wifi className="size-8 text-muted-foreground" aria-hidden="true" />
      {page ? (
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      ) : (
        <h3 className="font-medium">{title}</h3>
      )}
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}
export function Modal({
  title,
  description,
  onClose,
  children,
}: {
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  useEffect(() => {
    ref.current?.showModal();
  }, []);
  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      className="fixed inset-0 m-auto max-h-[90dvh] w-11/12 max-w-xl overflow-y-auto border bg-background p-0 text-foreground shadow-xl backdrop:bg-foreground/30"
    >
      <div className="flex items-start justify-between gap-4 border-b p-6">
        <div>
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          {description && (
            <p id={descriptionId} className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        <Button variant="ghost" size="icon-touch" aria-label="Close dialog" onClick={onClose}>
          <X />
        </Button>
      </div>
      <div className="p-6">{children}</div>
    </dialog>
  );
}
export function TextLink({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Button variant="link" nativeButton={false} role="link" render={<Link href={href} />}>
      {children}
      <ArrowUpRight />
    </Button>
  );
}

export function FormFrame({
  page = false,
  title,
  description,
  onClose,
  children,
}: {
  page?: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!page)
    return (
      <Modal title={title} description={description} onClose={onClose}>
        {children}
      </Modal>
    );
  return (
    <section className="mx-auto grid w-full max-w-2xl gap-6 border bg-card p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      {children}
    </section>
  );
}
export function WorkspaceLoading() {
  return (
    <div className="grid gap-6 py-3" role="status" aria-label="Loading workspace">
      <div className="h-10 w-48 bg-muted" />
      <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div className="h-20 bg-muted" />
        <div className="h-20 bg-muted" />
        <div className="h-20 bg-muted" />
        <div className="h-20 bg-muted" />
      </div>
      <div className="h-64 border bg-muted/30" />
      <span className="sr-only">Loading workspace</span>
    </div>
  );
}
