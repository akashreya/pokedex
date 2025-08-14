import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import App from "./App.jsx";
import "./utils/performanceUtils";
import { UserPreferencesProvider } from "./context/UserPreferencesContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import ErrorBoundary from "./components/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <UserPreferencesProvider>
        <FavoritesProvider>
          <App />
        </FavoritesProvider>
      </UserPreferencesProvider>
    </ErrorBoundary>
  </StrictMode>
);
