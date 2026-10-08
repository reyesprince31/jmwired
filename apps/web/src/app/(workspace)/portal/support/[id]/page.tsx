import { SupportPage } from "@/components/support/support-pages";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SupportPage id={id} />;
}
