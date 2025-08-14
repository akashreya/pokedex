import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext();

const FAVORITES_STORAGE_KEY = "pokemon-favorites";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setFavorites(parsed);
      }
    } catch (error) {
      console.error("Error loading favorites from localStorage:", error);
    }
  }, []);

  const toggleFavorite = (pokemonId) => {
    setFavorites((prevFavorites) => {
      const newFavorites = prevFavorites.includes(pokemonId)
        ? prevFavorites.filter((id) => id !== pokemonId)
        : [...prevFavorites, pokemonId];
      
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newFavorites));
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
      }
      
      return newFavorites;
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    try {
      localStorage.removeItem(FAVORITES_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing favorites from localStorage:", error);
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        toggleFavorite,
        clearFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}