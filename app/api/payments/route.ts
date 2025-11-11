import { getPayments } from "@/lib/utils/payment-context";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");
  const page = Number.parseInt(searchParams.get("page") || "1");
  const limit = Number.parseInt(searchParams.get("limit") || "10");

  await new Promise((resolve) => setTimeout(resolve, 200));

  let payments = getPayments();

  if (status && status !== "ALL") {
    payments = payments.filter((p) => p.status === status);
  }

  if (search) {
    const q = search.toLowerCase();
    payments = payments.filter(
      (p) =>
        p.id.toLowerCase().includes(q) ||
        p.recipientName.toLowerCase().includes(q) ||
        p.recipientAccount.toLowerCase().includes(q)
    );
  }

  const total = payments.length;
  const offset = (page - 1) * limit;
  const paginatedPayments = payments.slice(offset, offset + limit);

  return Response.json({
    data: paginatedPayments,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  });
}
