import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeStore {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (value: Theme) => void;
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "dark",
      toggleTheme: () =>
        set({
          theme: get().theme === "light" ? "dark" : "light",
        }),
      setTheme: (value) => set({ theme: value }),
    }),
    {
      name: "theme-storage",
    }
  )
);
