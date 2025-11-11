export const getStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "FAILED":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "IN_PROGRESS":
      return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    default:
      return "bg-muted text-muted-foreground";
  }
};
