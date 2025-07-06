import React from "react";
import ReactGA from "react-ga4";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PokemonListing from "./pages/PokemonListingPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import PokemonWordlePage from "./pages/PokemonWordlePage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import ThemeProvider from "./components/layout/ThemeProvider";
import { PokemonProvider } from "@/context/PokemonContext";
import { AnimatePresence } from "framer-motion";

// Initialize Google Analytics (GA4) for the whole site
ReactGA.initialize("G-9HW87T642K"); // TODO: Replace with your Measurement ID
ReactGA.send({
  hitType: "pageview",
  page: window.location.pathname + window.location.search,
});
// If using React Router, add a listener here to track pageviews on route change

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <ThemeProvider />
        <ScrollToTop />
        <Header />
        <main className="main-container">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route
                path="/pokemon"
                element={
                  <PokemonProvider>
                    <PokemonListing />
                  </PokemonProvider>
                }
              />
              <Route
                path="/pokemon/:id"
                element={
                  <PokemonProvider>
                    <PokemonDetailPage />
                  </PokemonProvider>
                }
              />
              <Route path="/pokeguess" element={<PokemonWordlePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
