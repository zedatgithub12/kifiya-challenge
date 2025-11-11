"use client";

import { useState, useEffect, useMemo } from "react";
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
import { generateMockPayments } from "@/data/mock";
import { LogsDialog } from "./logs-dialog";
import {
  Search,
  RefreshCw,
  AlertCircle,
  RefreshCcw,
  Loader,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getStatusColor } from "@/lib/utils/get-status-color";
import { PaymentForm } from "./payment-form";

const ITEMS_PER_PAGE = 15;

export function PaymentFeed() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "ALL">(
    "ALL"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadPayments = async () => {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPayments(generateMockPayments());
      setLoading(false);
    };

    loadPayments();
    const interval = setInterval(() => {
      setPayments((prev) => {
        const updated = [...prev];
        const randomIndex = Math.floor(Math.random() * updated.length);
        const statuses: PaymentStatus[] = [
          "PENDING",
          "IN_PROGRESS",
          "COMPLETED",
          "FAILED",
        ];
        const randomStatus =
          statuses[Math.floor(Math.random() * statuses.length)];

        if (
          updated[randomIndex].status !== "COMPLETED" &&
          updated[randomIndex].status !== "FAILED"
        ) {
          updated[randomIndex].status = randomStatus;
          updated[randomIndex].updatedAt = new Date();
        }

        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const filteredPayments = useMemo(() => {
    let filtered = payments;

    if (selectedStatus !== "ALL") {
      filtered = filtered.filter(
        (payment) => payment?.status === selectedStatus
      );
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (payment) =>
          payment?.id.toLowerCase().includes(q) ||
          payment?.recipientName.toLowerCase().includes(q) ||
          payment?.recipientAccount.toLowerCase().includes(q)
      );
    }

    return filtered;
  }, [payments, selectedStatus, searchQuery]);

  const handleRetry = (id: string) => {
    setPayments((prev) =>
      prev.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              status: "PENDING" as PaymentStatus,
              errorMessage: undefined,
            }
          : payment
      )
    );
  };

  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPayments(generateMockPayments())}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
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
                onClick={() => setSelectedStatus(status)}
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
                {loading ? (
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
                  paginatedPayments.map((payment) => (
                    <tr
                      key={payment.id}
                      className="border-b border-border/50 hover:bg-secondary/10 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <code className="text-xs font-mono text-primary">
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
                        <span className="font-medium text-foreground">
                          {payment.amount} {payment.currency}
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
                        {payment.createdAt.toLocaleString()}
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
                              <RefreshCcw className="" />
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

          {filteredPayments.length > 0 && (
            <div className="flex items-center justify-between border-t border-border pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredPayments.length)} of{" "}
                {filteredPayments.length} payments
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center gap-1 px-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "min-w-9" : "min-w-9"}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {filteredPayments.some(
            (p) => p.status === "FAILED" && p.errorMessage
          ) && (
            <Alert className="border-destructive/30 bg-destructive/5 mt-4">
              <AlertCircle
                className="h-4 w-4"
                color="oklch(70.4% 0.191 22.216) "
              />
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
