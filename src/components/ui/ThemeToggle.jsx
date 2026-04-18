import React from "react";
import useThemeStore from "../../store/useThemeStore.js";
import { Moon, Sun } from "lucide-react";
import Button from "./Button.jsx";

export default function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useThemeStore();

  return (
    <Button
      variant="ghost"
      className="p-2 h-10 w-10 shrink-0"
      onClick={toggleDarkMode}
    >
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
}
