import * as React from "react";

export type Theme = "light" | "dark";

export interface UserPreferences {
  favorites: number[]; // Array of Pokémon IDs
  theme: Theme;
}

interface UserPreferencesContextType extends UserPreferences {
  addFavorite: (id: number) => void;
  removeFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
  setTheme: (theme: Theme) => void;
}

const defaultPrefs: UserPreferences = {
  favorites: [],
  theme: "light",
};

const UserPreferencesContext = React.createContext<UserPreferencesContextType | undefined>(undefined);

function getInitialPrefs(): UserPreferences {
  try {
    const stored = localStorage.getItem("userPreferences");
    if (stored) return { ...defaultPrefs, ...JSON.parse(stored) };
  } catch {}
  return defaultPrefs;
}

export const UserPreferencesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [favorites, setFavorites] = React.useState<number[]>(getInitialPrefs().favorites);
  const [theme, setTheme] = React.useState<Theme>(getInitialPrefs().theme);

  React.useEffect(() => {
    localStorage.setItem(
      "userPreferences",
      JSON.stringify({ favorites, theme })
    );
  }, [favorites, theme]);

  const addFavorite = (id: number) => {
    setFavorites((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };
  const removeFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((fav) => fav !== id));
  };
  const isFavorite = (id: number) => favorites.includes(id);

  return (
    <UserPreferencesContext.Provider
      value={{ favorites, theme, addFavorite, removeFavorite, isFavorite, setTheme }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};

export function useUserPreferences() {
  const ctx = React.useContext(UserPreferencesContext);
  if (!ctx) throw new Error("useUserPreferences must be used within a UserPreferencesProvider");
  return ctx;
} 