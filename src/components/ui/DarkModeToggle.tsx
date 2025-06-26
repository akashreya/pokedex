import { useUserPreferences } from "@/context/UserPreferencesContext";

export default function DarkModeToggle() {
  const { theme, setTheme } = useUserPreferences();
  const isDark = theme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={handleToggle}
      className="p-2 rounded-full bg-transparent border border-black dark:border-rose-50
       transition-colors cursor-pointer"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <img
          className="w-6"
          title="Light"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/338.svg"
        />
      ) : (
        <img
          className="w-6"
          title="Dark"
          src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/337.svg"
        />
      )}
    </button>
  );
}
