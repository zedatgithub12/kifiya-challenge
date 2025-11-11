import { getAnalytics } from "@/lib/utils/payment-context";

export async function GET() {
  await new Promise((resolve) => setTimeout(resolve, 100));

  const analytics = getAnalytics();

  return Response.json(analytics);
}
