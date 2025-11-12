"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LogsDialog } from "./logs-dialog";
import {
  Search,
  RefreshCw,
  AlertCircle,
  RefreshCcw,
  Loader,
  ChevronLeft,
  ChevronRight,
  RefreshCcwIcon,
} from "lucide-react";
import { getStatusColor } from "@/lib/utils/get-status-color";
import { PaymentForm } from "./payment-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ITEMS_PER_PAGE = 15;

export function PaymentFeed() {
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "ALL">(
    "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [retry, setRetry] = useState("");

  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = useQuery<PaymentsResponse>({
    queryKey: ["payments", selectedStatus, searchQuery, currentPage],
    queryFn: async () => {
      const params = new URLSearchParams({
        status: selectedStatus,
        search: searchQuery,
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      });

      const response = await fetch(`/api/payments?${params}`);
      if (!response.ok) throw new Error("Failed to fetch payments");
      return response.json();
    },
  });

  const filteredPayments = data?.data || [];
  const pagination = data?.pagination;

  const retryMutation = useMutation({
    mutationFn: async (paymentId: string) => {
      const response = await fetch(`/api/payments/${paymentId}/retry`, {
        method: "POST",
      });
      if (!response.ok) throw new Error("Retry failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payments"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
  });

  const handleRetry = (id: string) => {
    retryMutation.mutate(id);
    setRetry(id);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    queryClient.invalidateQueries({ queryKey: ["payments"] });
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (status: PaymentStatus | "ALL") => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  const formatMoney = (
    amount: number | string | null | undefined,
    currency = "ETB"
  ) => {
    if (amount == null || amount === "") return "";
    const value = typeof amount === "number" ? amount : Number(amount);
    if (Number.isNaN(value)) return `${amount} ${currency}`;
    try {
      return new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
      }).format(value);
    } catch {
      return `${value} ${currency}`;
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <div>
            <CardTitle>Payment Orders</CardTitle>
            <CardDescription>
              Real-time payment feed and status tracking
            </CardDescription>
          </div>
          <div>
            <PaymentForm />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Payment ID, recipient name, or account..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isLoading || isFetching}
              className="flex items-center gap-2 bg-transparent min-w-20"
            >
              {isFetching ? (
                <Loader
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
              ) : (
                "Refresh"
              )}
            </Button>
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            {(
              ["ALL", "PENDING", "IN_PROGRESS", "COMPLETED", "FAILED"] as const
            ).map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => handleStatusFilter(status)}
                className={selectedStatus === status ? "bg-primary" : ""}
              >
                {status === "ALL" ? "All" : status}
              </Button>
            ))}
          </div>

          <div className="relative overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Payment ID
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Recipient
                  </th>
                  <th className="px-4 py-3 text-right font-semibold text-foreground">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-foreground">
                    Created
                  </th>
                  <th className="px-4 py-3 text-center font-semibold text-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      <div className="w-full p-4 flex items-center justify-center gap-2">
                        <Loader className="animate-spin" />{" "}
                        <span>Loading payments... </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No payments found
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-border/50 hover:bg-secondary/10 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono text-secondary font-medium">
                          {payment.id}
                        </code>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm">
                          <p className="font-medium text-foreground">
                            {payment.recipientName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {payment.recipientAccount}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="font-bold text-foreground">
                          {formatMoney(payment.amount, payment.currency)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`${getStatusColor(payment.status)} border`}
                        >
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {payment.createdAt
                          ? new Date(payment.createdAt).toLocaleString(
                              undefined,
                              {
                                dateStyle: "long",
                                timeStyle: "short",
                              }
                            )
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-between gap-2">
                          <LogsDialog payment={payment} />
                          {payment.status === "FAILED" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRetry(payment.id)}
                              className="text-warning hover:text-warning"
                            >
                              <RefreshCcwIcon
                                className={`${
                                  retry === payment?.id ? "animate-spin" : ""
                                }`}
                              />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.total > 0 && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="text-sm text-muted-foreground hidden md:block">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total} payments
              </div>

              <div className="text-sm text-muted-foreground block md:hidden">
                {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                of {pagination.total}
              </div>

              <div className="flex items-center  md:gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={pagination.page === 1 || isLoading}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="hidden md:block"> Previous </span>
                </Button>
                <div className="flex items-center gap-1 px-2">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      disabled={isLoading}
                      className={currentPage === page ? "min-w-9" : "min-w-9"}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(pagination.totalPages, prev + 1)
                    )
                  }
                  disabled={
                    pagination.page === pagination.totalPages || isLoading
                  }
                  className="flex items-center gap-1"
                >
                  <span className="hidden md:block"> Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {filteredPayments.some(
            (p) => p.status === "FAILED" && p.errorMessage
          ) && (
            <Alert className="border-destructive/30 bg-destructive/5 mt-4">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <AlertDescription className="text-destructive/90">
                {
                  filteredPayments.find((p) => p.status === "FAILED")
                    ?.errorMessage
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
