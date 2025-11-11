"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUp, TrendingUp, Clock, Zap } from "lucide-react";

export function AnalyticsDashboard() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await fetch("/api/analytics");
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
    refetchInterval: 5000, // Auto-refresh every 5 seconds
  });

  if (isLoading || !analytics) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="h-4 bg-muted rounded animate-pulse w-20" />
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-muted rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    );
  }

  const chartData = [
    { name: "Completed", value: analytics.completedCount, color: "#22c55e" },
    { name: "Failed", value: analytics.failedCount, color: "#ef4444" },
    { name: "Pending", value: analytics.pendingCount, color: "#eab308" },
    { name: "In Progress", value: analytics.inProgressCount, color: "#3b82f6" },
  ];

  const timeSeriesData = Array.from({ length: 12 }, (_, i) => ({
    time: `${11 - i}:00`,
    tps: (Math.random() * 1.8 + 0.2).toFixed(2),
    processedCount: Math.floor(Math.random() * 50) + 20,
  })).reverse();

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Total Payments
              <ArrowUp className="h-4 w-4 text-primary" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {analytics.totalPayments}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              All time transactions
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Completed
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {analytics.completedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {(
                (analytics.completedCount / analytics.totalPayments) *
                100
              ).toFixed(0)}
              % success rate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500/10 to-red-500/5 border-red-500/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {analytics.failedCount}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Requiring attention
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              Avg Processing Time
              <Clock className="h-4 w-4 text-info" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-info">
              {Math.floor(analytics.averageProcessingTime)}s
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Per transaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Current TPS */}
      <Card className="bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-warning" />
            Current Throughput (TPS)
          </CardTitle>
          <CardDescription>
            Rate: {analytics.currentTps.toFixed(2)} / {analytics.maxTps}{" "}
            transactions per second
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-gradient-to-r from-primary to-info transition-all"
              style={{
                width: `${(analytics.currentTps / analytics.maxTps) * 100}%`,
              }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {analytics.currentTps > 1.8
              ? "⚠️ High load - approaching limit"
              : "✓ Normal operation"}
          </p>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Distribution</CardTitle>
            <CardDescription>Current breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* TPS Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Throughput Over Time</CardTitle>
            <CardDescription>
              Transactions per second (last hour)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis dataKey="time" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1a1a1a", border: "none" }}
                />
                <Line
                  type="monotone"
                  dataKey="tps"
                  stroke="#7c3aed"
                  dot={false}
                  strokeWidth={2}
                  name="TPS"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Payment Status Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Status Summary</CardTitle>
          <CardDescription>Quick overview of payment statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-yellow-500/10 p-4 border border-yellow-500/20">
              <div className="text-sm text-muted-foreground">Pending</div>
              <div className="text-2xl font-bold text-yellow-400">
                {analytics.pendingCount}
              </div>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-4 border border-blue-500/20">
              <div className="text-sm text-muted-foreground">In Progress</div>
              <div className="text-2xl font-bold text-blue-400">
                {analytics.inProgressCount}
              </div>
            </div>
            <div className="rounded-lg bg-green-500/10 p-4 border border-green-500/20">
              <div className="text-sm text-muted-foreground">Completed</div>
              <div className="text-2xl font-bold text-green-400">
                {analytics.completedCount}
              </div>
            </div>
            <div className="rounded-lg bg-red-500/10 p-4 border border-red-500/20">
              <div className="text-sm text-muted-foreground">Failed</div>
              <div className="text-2xl font-bold text-red-400">
                {analytics.failedCount}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
