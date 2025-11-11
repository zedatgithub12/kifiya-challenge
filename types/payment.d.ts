type PaymentStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "FAILED";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  recipientName: string;
  recipientAccount: string;
  status: PaymentStatus;
  createdAt: Date;
  updatedAt: Date;
  errorMessage?: string;
  processingTime?: number;
}
