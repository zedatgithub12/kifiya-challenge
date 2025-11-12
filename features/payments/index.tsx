"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PaymentFeed } from "./components/payment-feed";
import { AnalyticsDashboard } from "./components/analytics-dashboard";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ThemeToggler } from "@/components/kifiya-ui/theme-toggler";

export function DashboardShell() {
  const [activeTab, setActiveTab] = useState("feed");
  const [rateLimitWarning, setRateLimitWarning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const tps = Math.random() * 2;
      setRateLimitWarning(tps > 1.8);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="w-full flex items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Kifiya Payments
              </h1>
              <p className="text-xs text-muted-foreground">
                Operation Dashboard
              </p>
            </div>
          </div>
          <ThemeToggler />
        </div>
      </header>

      {rateLimitWarning && (
        <div className="border-b border-border bg-warning/10 px-4 py-3 sm:px-6">
          <Alert className="border-warning/30 bg-secondary/10 flex items-center justify-between">
            <AlertDescription className="text-orange-400">
              System approaching rate limit (2 TPS). Current throughput is high.
            </AlertDescription>
            <AlertTriangle
              className="h-8 w-8 text-orange-400 animate-bounce"
              color="oklch(75% 0.183 55.934)"
            />
          </Alert>
        </div>
      )}

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid min-w-xs grid-cols-2 bg-primary/5 h-10 gap-2 ">
            <TabsTrigger value="feed" className="shadow-none font-semibold">
              Payment Feed
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="shadow-none font-semibold"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="mt-6">
            <PaymentFeed />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <AnalyticsDashboard />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
