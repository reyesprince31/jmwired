"use client";

import { Button } from "@jmwired/ui/components/button";

import { ArrowUpRight, Plus } from "lucide-react";
import { toast } from "sonner";

import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Metric, PageHeading, Panel, Select } from "@/components/portal/portal-ui";

import { useWorkspaceRouter as useRouter } from "@/components/workspace/organization-link";

function PlatformAdmin({
  onCreate,
  onOpen,
}: {
  onCreate: () => void;
  onOpen: (id: string) => void;
}) {
  const { state, dispatch } = useWorkspace();
  const users = [
    ...new Map(
      [...state.organizations.flatMap((org) => org.members), ...state.customers].map((user) => [
        user.id,
        user,
      ]),
    ).values(),
  ];
  return (
    <>
      <PageHeading
        title="Platform administration"
        description="Manage user access and organizations across your business."
      >
        <Button size="lg" onClick={onCreate}>
          <Plus />
          Create organization
        </Button>
      </PageHeading>
      <div className="grid grid-cols-2 gap-y-5 md:grid-cols-4">
        <Metric label="Organizations" value={state.organizations.length} />
        <Metric label="Total customers" value={state.customers.length} />
        <Metric
          label="Active connections"
          value={state.customers.filter((customer) => customer.status === "Active").length}
        />
        <Metric label="Platform users" value={users.length} />
      </div>
      <Panel title="Organizations">
        <div className="divide-y border-t">
          {state.organizations.map((org) => (
            <div key={org.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div>
                <p className="text-sm font-medium">
                  {org.name} · {org.area}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {state.customers.filter((customer) => customer.orgId === org.id).length} customers
                  · {org.members.length} team members
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => onOpen(org.id)}>
                Open workspace
                <ArrowUpRight />
              </Button>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="User access roles">
        <div className="divide-y border-t">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-3"
            >
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
              </div>
              <div className="w-36">
                <Select
                  aria-label={`Platform role for ${user.name}`}
                  value={state.userRoles?.[user.id] ?? "user"}
                  disabled={user.id === "owner"}
                  onChange={(event) => {
                    dispatch({
                      type: "platform-role",
                      id: user.id,
                      role: event.target.value as "user" | "admin",
                    });
                    toast.success("Platform role updated");
                  }}
                >
                  <option value="user">User</option>
                  <option value="admin">Platform admin</option>
                </Select>
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </>
  );
}
export function PlatformPage() {
  const { setOrgId } = useWorkspace();
  const router = useRouter();
  return (
    <PlatformAdmin
      onCreate={() => router.push("/organization/new")}
      onOpen={(id) => {
        setOrgId(id);
        router.push(`/organization/${id}`);
      }}
    />
  );
}
