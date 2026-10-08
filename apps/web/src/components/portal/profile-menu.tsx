"use client";

import Link from "@/components/workspace/organization-link";
import { Button } from "@jmwired/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@jmwired/ui/components/dropdown-menu";
import { ArrowUpRight, Building2, Settings, ShieldCheck, UserRound, LogOut } from "lucide-react";
import { Avatar } from "./portal-ui";
import { useWorkspace } from "@/components/workspace/workspace-provider";

export function ProfileMenu({ platform = false }: { platform?: boolean }) {
  const { state } = useWorkspace();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Open user menu"
        render={<Button variant="ghost" size="icon-touch" />}
      >
        <Avatar name={state.profile.name} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block font-medium text-foreground">{state.profile.name}</span>
            <span className="mt-1 block">{state.profile.email}</span>
            <span className="mt-1 block">{platform ? "Super admin" : "Organization owner"}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/account" />}>
            <UserRound />
            Account & security
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/organization" />}>
            <Building2 />
            Organization workspace
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/organization/settings" />}>
            <Settings />
            Organization settings
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link href="/portal" />}>
            <ArrowUpRight />
            Customer portal
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/admin" />}>
            <ShieldCheck />
            Platform admin
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link href="/sign-in" />}>
            <LogOut />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
