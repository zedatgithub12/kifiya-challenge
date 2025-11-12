"use client";

import { useThemeStore } from "@/store/theme.store";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggler() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <Button variant="outline" onClick={toggleTheme} className="capitalize">
      {theme === "light" ? (
        <div className="flex items-center gap-4 font-medium">
          <Moon size={4} />
          <p className="font-medium hidden md:block">Switch to Dark</p>
        </div>
      ) : (
        <div className="flex items-center gap-4 font-medium">
          <Sun size={4} />
          <p className="font-medium hidden md:block">Switch to Light</p>
        </div>
      )}
    </Button>
  );
}
