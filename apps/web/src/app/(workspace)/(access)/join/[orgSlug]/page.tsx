import { JoinPage } from "@/components/account/onboarding-pages";
export default async function Page({ params }: { params: Promise<{ orgSlug: string }> }) {
  const { orgSlug } = await params;
  return <JoinPage orgSlug={orgSlug} />;
}
