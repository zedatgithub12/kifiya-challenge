"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentForm } from "./components/payment-form";
import { PaymentFeed } from "./components/payment-feed";
import { AnalyticsDashboard } from "./components/analytics-dashboard";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function DashboardShell() {
  const [activeTab, setActiveTab] = useState("feed");

  // const [rateLimitWarning, setRateLimitWarning] = useState(false);
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const tps = Math.random() * 2;
  //     setRateLimitWarning(tps > 1.8);
  //   }, 2000);

  //   return () => clearInterval(interval);
  // }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Kifiya Payments
              </h1>
              <p className="text-xs text-muted-foreground">
                Operations Dashboard
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* {rateLimitWarning && (
        <div className="border-b border-border bg-warning/10 px-4 py-3 sm:px-6">
          <Alert className="border-warning/30 bg-warning/5">
            <AlertTriangle className="h-4 w-4 text-warning" />
            <AlertDescription className="text-warning">
              System approaching rate limit (2 TPS). Current throughput is high.
            </AlertDescription>
          </Alert>
        </div>
      )} */}

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-secondary/20">
            <TabsTrigger value="feed">Payment Feed</TabsTrigger>
            <TabsTrigger value="submit">Submit Payment</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-6">
            <PaymentFeed />
          </TabsContent>

          <TabsContent value="submit" className="mt-6">
            <div className="mx-auto max-w-xl">
              <Card>
                <CardHeader>
                  <CardTitle>Submit Payment Order</CardTitle>
                  <CardDescription>
                    Create a new payment transaction
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PaymentForm />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
