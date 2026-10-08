import { OrganizationRedirect } from "@/components/workspace/organization-link";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrganizationRedirect path={`/customers/${id}`} />;
}
