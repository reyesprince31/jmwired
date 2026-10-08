"use client";

import { useState } from "react";

import { Button } from "@jmwired/ui/components/button";
import { Input } from "@jmwired/ui/components/input";

import { Plus } from "lucide-react";
import { toast } from "sonner";

import type { Organization, Member } from "@/lib/mock-data";
import { useWorkspace } from "@/components/workspace/workspace-provider";
import { Avatar, Field, Modal, PageHeading, Panel, Select } from "@/components/portal/portal-ui";

import { useWorkspaceRouter as useRouter } from "@/components/workspace/organization-link";
import { FormFrame } from "@/components/portal/portal-ui";
import { TextLink } from "@/components/portal/portal-ui";

const staffRoles = ["admin", "billing", "technician", "support", "member"] as const;

function OrganizationSettings({ org, onCreate }: { org: Organization; onCreate: () => void }) {
  const { dispatch } = useWorkspace();
  const [invite, setInvite] = useState(false);
  const [initial] = useState(org);
  return (
    <>
      <PageHeading title="Organization" description="Your workspace, your team, your service area.">
        <Button variant="outline" size="lg" onClick={onCreate}>
          <Plus />
          Create organization
        </Button>
      </PageHeading>
      <Panel title="Workspace details">
        <form
          key={org.id}
          className="grid gap-4 border-t p-5 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            dispatch({
              type: "organization-settings",
              orgId: org.id,
              changes: {
                name: String(data.get("name")).trim(),
                area: String(data.get("area")).trim(),
                phone: String(data.get("phone")).trim(),
                contactEmail: String(data.get("email")).trim(),
                officeHours: String(data.get("hours")).trim(),
              },
            });
            toast.success("Workspace details saved");
          }}
        >
          <Field label="Organization name">
            <Input name="name" defaultValue={initial.name} required minLength={2} maxLength={80} />
          </Field>
          <Field label="Service areas">
            <Input name="area" defaultValue={initial.area} required maxLength={100} />
          </Field>
          <Field label="Contact phone">
            <Input name="phone" type="tel" defaultValue={initial.phone} maxLength={30} />
          </Field>
          <Field label="Contact email">
            <Input name="email" type="email" defaultValue={initial.contactEmail} />
          </Field>
          <Field label="Office hours">
            <Input
              name="hours"
              defaultValue={initial.officeHours ?? "Monday–Saturday, 8 AM–5 PM"}
              maxLength={100}
            />
          </Field>
          <div className="self-end">
            <Button type="submit">Save workspace details</Button>
          </div>
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Workspace address: /organization/{org.id} · Your membership: Owner
          </p>
        </form>
        <div className="flex flex-wrap gap-4 border-t p-5">
          <TextLink href={`/join/${org.id}`}>Open connection application</TextLink>
          <TextLink href="/organization/payments/settings">Collection QR settings</TextLink>
        </div>
      </Panel>
      <Panel
        title="Team members"
        action={
          <Button variant="outline" size="sm" onClick={() => setInvite(true)}>
            <Plus />
            Invite member
          </Button>
        }
      >
        <div className="divide-y border-t">
          {org.members.map((member) => (
            <div
              key={member.id}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
            >
              <div className="flex items-center gap-3">
                <Avatar name={member.name} />
                <div>
                  <p className="text-sm font-medium">
                    {member.name}
                    {member.invited && (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        Invitation pending
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{member.email}</p>
                </div>
              </div>
              {member.role === "owner" ? (
                <span className="text-xs text-muted-foreground">Owner</span>
              ) : (
                <div className="w-28">
                  <Select
                    aria-label={`Role for ${member.name}`}
                    value={member.role}
                    onChange={(event) => {
                      dispatch({
                        type: "member-role",
                        orgId: org.id,
                        id: member.id,
                        role: event.target.value as Member["role"],
                      });
                      toast.success("Member role updated");
                    }}
                  >
                    {staffRoles.map((role) => (
                      <option key={role} value={role}>
                        {role[0]!.toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </Select>
                </div>
              )}
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Access roles">
        <div className="space-y-3 border-t p-5 text-sm leading-relaxed text-muted-foreground">
          <p>
            <strong className="text-foreground">Workspace roles:</strong> owner, admin, and member
            roles represent access inside each workspace. Billing handles collections and expenses;
            technicians handle assigned field tickets; support handles conversations and
            announcements.
          </p>
          <p>
            <strong className="text-foreground">Platform role:</strong> a separate platform admin
            role manages users across organizations.
          </p>
          <p>
            Workspace roles apply within an organization. Platform administration is managed
            separately.
          </p>
        </div>
      </Panel>
      {invite && (
        <Modal
          title="Invite a team member"
          description="Choose the team member’s workspace role."
          onClose={() => setInvite(false)}
        >
          <form
            className="grid gap-5"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const email = String(data.get("email")).trim();
              if (
                org.members.some((member) => member.email.toLowerCase() === email.toLowerCase())
              ) {
                toast.error("This email is already in your team");
                return;
              }
              dispatch({
                type: "member",
                orgId: org.id,
                member: {
                  id: crypto.randomUUID(),
                  name: String(data.get("name")).trim(),
                  email,
                  role: String(data.get("role")) as Member["role"],
                  invited: true,
                },
              });
              setInvite(false);
              toast.success("Invitation created");
            }}
          >
            <Field label="Name">
              <Input name="name" required minLength={2} maxLength={100} />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" required />
            </Field>
            <Field label="Organization role">
              <Select name="role" defaultValue="member">
                {staffRoles.map((role) => (
                  <option key={role} value={role}>
                    {role[0]!.toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </Select>
            </Field>
            <Button type="submit">Create invitation</Button>
          </form>
        </Modal>
      )}
    </>
  );
}

export function CreateOrganization({
  onClose,
  onCreated,
  page = false,
}: {
  onClose: () => void;
  onCreated: (id: string) => void;
  page?: boolean;
}) {
  const { state, dispatch } = useWorkspace();
  return (
    <FormFrame
      page={page}
      title="Create an organization"
      description="A separate workspace for another branch or service area."
      onClose={onClose}
    >
      <form
        className="grid gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const id = String(data.get("slug")).trim().toLowerCase();
          if (
            state.organizations.some((org) => org.id === id) ||
            [
              "new",
              "customers",
              "payments",
              "support",
              "settings",
              "announcements",
              "expenses",
              "ledger",
              "applications",
              "network",
            ].includes(id)
          ) {
            toast.error("Choose a different workspace address.");
            return;
          }
          dispatch({
            type: "organization",
            organization: {
              id,
              name: String(data.get("name")).trim(),
              area: String(data.get("area")).trim(),
              members: [
                {
                  id: "owner",
                  name: state.profile.name,
                  email: state.profile.email,
                  role: "owner",
                },
              ],
            },
          });
          onCreated(id);
          toast.success("Organization created. Add your first customer to get started.");
        }}
      >
        <Field label="Organization name">
          <Input name="name" placeholder="e.g. JMWired" required minLength={2} maxLength={80} />
        </Field>
        <Field label="Location or service area">
          <Input name="area" placeholder="e.g. San Isidro" required minLength={2} maxLength={80} />
        </Field>
        <Field label="Workspace address">
          <Input
            name="slug"
            placeholder="e.g. san-isidro"
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            required
            minLength={2}
            maxLength={60}
          />
        </Field>
        <p className="text-xs leading-relaxed text-muted-foreground">
          You will be the owner. Customers, payments, support, and announcements are separate for
          each organization.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Create organization</Button>
        </div>
      </form>
    </FormFrame>
  );
}
export function OrganizationPage() {
  const { state, orgId } = useWorkspace();
  const org = state.organizations.find((entry) => entry.id === orgId)!;
  const router = useRouter();
  return (
    <OrganizationSettings key={orgId} org={org} onCreate={() => router.push("/organization/new")} />
  );
}
export function NewOrganizationPage() {
  const { setOrgId } = useWorkspace();
  const router = useRouter();
  return (
    <CreateOrganization
      page
      onCreated={(id) => {
        setOrgId(id);
        router.push(`/organization/${id}/settings`);
      }}
      onClose={() => router.push("/organization/settings")}
    />
  );
}
