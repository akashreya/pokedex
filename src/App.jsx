import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import PokemonListing from "./pages/PokemonListingPage";
import PokemonDetailPage from "./pages/PokemonDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ScrollToTop from "./components/layout/ScrollToTop";
import ThemeProvider from "./components/layout/ThemeProvider";
import { PokemonProvider } from "@/context/PokemonContext";
import { AnimatePresence } from "framer-motion";

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
