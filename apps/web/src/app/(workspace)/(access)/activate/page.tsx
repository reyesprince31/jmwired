import { ActivationPage } from "@/components/account/onboarding-pages";
export default async function Page({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const { code } = await searchParams;
  return <ActivationPage initialCode={code} />;
}
