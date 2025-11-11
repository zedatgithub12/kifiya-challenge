"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PaymentFormData {
  id: string;
  amount: string;
  recipientName: string;
  currency: string;
  recipientAccount: string;
}

export function PaymentForm() {
  const [formData, setFormData] = useState<PaymentFormData>(() => ({
    id: `PAY-${Date.now().toString().slice(-6)}`,
    amount: "",
    recipientName: "",
    currency: "ETB",
    recipientAccount: "",
  }));
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.amount ||
      !formData.recipientName ||
      !formData.recipientAccount
    ) {
      alert("Please fill in all fields");
      return;
    }

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        id: `PAY-${Date.now().toString().slice(-6)}`,
        amount: "",
        recipientName: "",
        currency: "ETB",
        recipientAccount: "",
      });
    }, 4000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-1 font-medium">
          Create Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create Payment</DialogTitle>
          <DialogDescription>
            Create a new payment transaction
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {submitted && (
            <Alert className="border-green-500/30 bg-green-500/5">
              <AlertCircle className="h-4 w-4 text-green-500" color="green" />
              <AlertDescription className="text-green-400">
                Payment submitted successfully. Payment ID: {formData.id}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="id">Payment ID (Auto-generated)</Label>
              <Input
                id="id"
                name="id"
                value={formData.id}
                disabled
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                placeholder="1000.00"
                value={formData.amount}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
              >
                <option value="ETB">ETB</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div className="space-y-2 ">
              <Label htmlFor="recipientName">Recipient Name</Label>
              <Input
                id="recipientName"
                name="recipientName"
                placeholder="Enter recipient name"
                value={formData.recipientName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="col-span-full space-y-2">
              <Label htmlFor="recipientAccount">Recipient Account Number</Label>
              <Input
                id="recipientAccount"
                name="recipientAccount"
                placeholder="ACC-12345678"
                value={formData.recipientAccount}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 mt-4"
          >
            Submit Payment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
