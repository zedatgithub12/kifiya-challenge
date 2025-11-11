//This generate mock payments record
export function generateMockPayments(): Payment[] {
  const statuses: PaymentStatus[] = [
    "PENDING",
    "IN_PROGRESS",
    "COMPLETED",
    "FAILED",
  ];
  const payments: Payment[] = [];

  for (let i = 0; i < 25; i++) {
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const createdAt = new Date(Date.now() - Math.random() * 86400000 * 7);

    payments.push({
      id: `PAY-${String(i + 1).padStart(6, "0")}`,
      amount: Math.floor(Math.random() * 100000) + 100,
      currency: "ETB",
      recipientName: [
        "Abebe Kebede",
        "Solomon Alemu",
        "Tihtina Tsegaye",
        "Bontu Merga",
        "Yonas Tesfaye",
      ][Math.floor(Math.random() * 5)],
      recipientAccount: `ACC-${String(
        Math.floor(Math.random() * 1000000)
      ).padStart(8, "0")}`,
      status,
      createdAt,
      updatedAt:
        status === "COMPLETED"
          ? new Date(createdAt.getTime() + Math.random() * 3600000)
          : createdAt,
      errorMessage:
        status === "FAILED" ? "Insufficient funds in account" : undefined,
      processingTime:
        status === "COMPLETED"
          ? Math.floor(Math.random() * 3600) + 30
          : undefined,
    });
  }

  return payments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

//This generate & return the payments analytics data
export function calculateAnalytics(payments: Payment[]): AnalyticsData {
  const completed = payments.filter((p) => p.status === "COMPLETED").length;
  const failed = payments.filter((p) => p.status === "FAILED").length;
  const pending = payments.filter((p) => p.status === "PENDING").length;
  const inProgress = payments.filter((p) => p.status === "IN_PROGRESS").length;

  const completedPayments = payments.filter((p) => p.status === "COMPLETED");
  const avgTime =
    completedPayments.length > 0
      ? completedPayments.reduce((sum, p) => sum + (p.processingTime || 0), 0) /
        completedPayments.length
      : 0;

  const currentTps = Math.floor(Math.random() * 2) + 0.5 + Math.random();

  return {
    totalPayments: payments.length,
    completedCount: completed,
    failedCount: failed,
    pendingCount: pending,
    inProgressCount: inProgress,
    averageProcessingTime: avgTime,
    currentTps: Number.parseFloat(currentTps.toFixed(2)),
    maxTps: 2.0,
  };
}
