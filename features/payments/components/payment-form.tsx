"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { paymentValidationSchema } from "@/validations/payment.schema";

export function PaymentForm() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="gap-1 font-medium">
          Create Payment
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl ">
        <DialogHeader>
          <DialogTitle>Create Payment</DialogTitle>
          <DialogDescription>
            Create a new payment transaction
          </DialogDescription>
        </DialogHeader>

        <Formik
          initialValues={{
            id: `PAY-${Date.now().toString().slice(-6)}`,
            amount: "",
            recipientName: "",
            currency: "ETB",
            recipientAccount: "",
          }}
          validationSchema={paymentValidationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await new Promise((resolve) => setTimeout(resolve, 1500));
              setSubmitted(true);

              // the api call to the backend endpoint is handled
              // for now i just consoled it here of review purpose
              console.log("--payment creation form values--", values);

              setTimeout(() => {
                setSubmitted(false);

                resetForm({
                  values: {
                    id: `PAY-${Date.now().toString().slice(-6)}`,
                    amount: "",
                    recipientName: "",
                    currency: "ETB",
                    recipientAccount: "",
                  },
                });
              }, 4000);
            } catch (error) {
              console.error("Submission failed:", error);
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting, values }) => (
            <Form className="space-y-6 mt-6">
              {submitted && (
                <Alert className="border-green-500/30 bg-green-500/5">
                  <AlertCircle
                    className="h-4 w-4 text-green-500"
                    color="green"
                  />
                  <AlertDescription className="text-green-400">
                    Payment submitted successfully. Payment ID: {values.id}
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="id">Payment ID (Auto-generated)</Label>
                  <Field
                    as={Input}
                    id="id"
                    name="id"
                    disabled
                    className="bg-muted/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Field
                    as={Input}
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    placeholder="1000.00"
                    className="w-full"
                  />
                  <ErrorMessage
                    name="amount"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Field
                    as="select"
                    id="currency"
                    name="currency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-foreground"
                  >
                    <option value="ETB">ETB</option>
                    <option value="USD">USD</option>
                  </Field>
                  <ErrorMessage
                    name="currency"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientName">Recipient Name</Label>
                  <Field
                    as={Input}
                    id="recipientName"
                    name="recipientName"
                    placeholder="Enter recipient name"
                  />
                  <ErrorMessage
                    name="recipientName"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>

                <div className="col-span-full space-y-2">
                  <Label htmlFor="recipientAccount">
                    Recipient Account Number
                  </Label>
                  <Field
                    as={Input}
                    id="recipientAccount"
                    name="recipientAccount"
                    placeholder="ACC-12345678"
                  />
                  <ErrorMessage
                    name="recipientAccount"
                    component="p"
                    className="text-sm text-red-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 mt-4"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Submitting...
                  </>
                ) : (
                  "Submit Payment"
                )}
              </Button>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
