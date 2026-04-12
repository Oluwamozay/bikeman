import { Moon, Sun, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type ThemeMode = "dark" | "light" | "auto";

const ThemeToggle = () => {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("theme") as ThemeMode) || "auto";
  });

  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (dark: boolean) => {
      root.classList.toggle("dark", dark);
      root.classList.toggle("light", !dark);
    };

    if (mode === "auto") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mq.matches);
      const handler = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mq.addEventListener("change", handler);
      localStorage.setItem("theme", "auto");
      return () => mq.removeEventListener("change", handler);
    }

    applyTheme(mode === "dark");
    localStorage.setItem("theme", mode);
  }, [mode]);

  const cycle = () => setMode((m) => (m === "dark" ? "light" : m === "light" ? "auto" : "dark"));

  const Icon = mode === "dark" ? Moon : mode === "light" ? Sun : Monitor;

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={cycle}
      className="w-9 h-9 rounded-xl glass flex items-center justify-center hover:glow-ring transition-all duration-300"
      aria-label="Toggle theme"
    >
      <Icon className="h-4 w-4 text-primary" />
    </motion.button>
  );
};

export default ThemeToggle;
