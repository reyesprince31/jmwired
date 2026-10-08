import { CustomerPage } from "@/components/customers/customer-pages";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CustomerPage id={id} />;
}
