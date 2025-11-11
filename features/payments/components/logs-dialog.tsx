"use client";


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LogsDialogProps {
  payment: Payment;
}

export function LogsDialog({ payment }: LogsDialogProps) {
  const mockLogs = [
    {
      timestamp: new Date(payment.createdAt.getTime()).toISOString(),
      level: "INFO",
      message: `Payment ${payment.id} submitted to gateway`,
    },
    {
      timestamp: new Date(payment.createdAt.getTime() + 1000).toISOString(),
      level: "INFO",
      message: "Validating payment details",
    },
    {
      timestamp: new Date(payment.createdAt.getTime() + 2000).toISOString(),
      level: payment.status === "FAILED" ? "ERROR" : "INFO",
      message:
        payment.status === "FAILED"
          ? "Payment validation failed: Insufficient funds"
          : "Payment routed to processing",
    },
    {
      timestamp: new Date(payment.createdAt.getTime() + 3000).toISOString(),
      level: payment.status === "COMPLETED" ? "SUCCESS" : "INFO",
      message:
        payment.status === "COMPLETED"
          ? "Payment processed successfully"
          : "Awaiting bank confirmation",
    },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1">
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">View</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Payment Logs</DialogTitle>
          <DialogDescription>
            Processing logs for {payment.id}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {mockLogs.map((log, idx) => (
            <Card key={idx} className="bg-muted/30 border-border">
              <CardContent className="pt-4 font-mono text-xs">
                <div className="flex gap-3">
                  <span className="text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                  <span
                    className={`font-bold ${
                      log.level === "ERROR"
                        ? "text-destructive"
                        : log.level === "SUCCESS"
                        ? "text-success"
                        : log.level === "INFO"
                        ? "text-info"
                        : "text-muted-foreground"
                    }`}
                  >
                    [{log.level}]
                  </span>
                  <span className="text-foreground flex-1">{log.message}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
