import { PaymentPage } from "@/components/payments/payment-pages";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PaymentPage admin id={id} />;
}
