import { generateMockPayments, calculateAnalytics } from "@/data/mock";

const payments: Payment[] = generateMockPayments();

export function getPayments(): Payment[] {
  return [...payments];
}

export function getPaymentById(id: string): Payment | undefined {
  return payments.find((p) => p.id === id);
}

export function submitPayment(data: {
  id: string;
  amount: number;
  currency: string;
  recipientName: string;
  recipientAccount: string;
}): Payment {
  const payment: Payment = {
    ...data,
    status: "PENDING",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  payments.unshift(payment);
  return payment;
}

export function updatePaymentStatus(
  id: string,
  status: PaymentStatus,
  errorMessage?: string
): Payment | undefined {
  const payment = payments.find((p) => p.id === id);
  if (payment) {
    payment.status = status;
    payment.updatedAt = new Date();
    payment.errorMessage = errorMessage;
    if (status === "COMPLETED") {
      payment.processingTime = Math.floor(Math.random() * 3600) + 30;
    }
  }
  return payment;
}

export function getAnalytics(): AnalyticsData {
  return calculateAnalytics(payments);
}

export function getPaymentsByStatus(status: PaymentStatus): Payment[] {
  return payments.filter((p) => p.status === status);
}

export function searchPayments(query: string): Payment[] {
  const q = query.toLowerCase();
  return payments.filter(
    (p) =>
      p.id.toLowerCase().includes(q) ||
      p.recipientName.toLowerCase().includes(q) ||
      p.recipientAccount.toLowerCase().includes(q)
  );
}

export function retryPayment(id: string): Payment | undefined {
  const payment = payments.find((p) => p.id === id);
  if (payment && payment.status === "FAILED") {
    payment.status = "PENDING";
    payment.errorMessage = undefined;
    payment.updatedAt = new Date();
  }
  return payment;
}
