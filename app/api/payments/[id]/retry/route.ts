import { retryPayment } from "@/lib/utils/payment-context";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Simulate server-side processing delay
  await new Promise((resolve) => setTimeout(resolve, 200));

  const payment = retryPayment(id);

  if (!payment) {
    return Response.json({ error: "Payment not found" }, { status: 404 });
  }

  return Response.json(payment);
}
