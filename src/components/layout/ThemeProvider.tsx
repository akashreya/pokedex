import { useEffect } from "react";
import { useUserPreferences } from "@/context/UserPreferencesContext";

export default function ThemeProvider() {
  const { theme } = useUserPreferences();

  useEffect(() => {
    const root = document.documentElement;

    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return null;
}
