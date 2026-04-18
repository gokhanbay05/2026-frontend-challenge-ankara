import { create } from "zustand";

const useThemeStore = create((set, get) => ({
  darkMode:
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") &&
      window.matchMedia("(prefers-color-scheme: dark)").matches),

  toggleDarkMode: () => {
    const newMode = !get().darkMode;
    set({ darkMode: newMode });

    localStorage.setItem("theme", newMode ? "dark" : "light");
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  initTheme: () => {
    const isDark = get().darkMode;
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  },
}));

export default useThemeStore;
