import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="hero">
      <Card className="hero-card">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9 }}
            className="hero-image"
          >
            <img
              src="Pokémon_logo.svg"
              alt="pokemon_logo"
              className="mx-auto"
            />
          </motion.div>
          <h1 className="hero-heading font-poppins">
            Discover the World of Pokémon
          </h1>
          <p className="hero-description">
            Explore the vast collection of Pokémon, their types, abilities, and
            more.
          </p>
          <SearchBar onSelect={(name) => navigate(`/pokemon/${name}`)} />
        </div>
      </Card>
    </section>
  );
}
