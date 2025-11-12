"use client";

import { DashboardShell } from "@/features/payments";
import { useThemeStore } from "@/store/theme.store";

export default function Page() {
  const { theme } = useThemeStore();
  return (
    <div className={theme}>
      <DashboardShell />
    </div>
  );
}
