import { getGradientClass, getRegion } from "../../utils/pokemonUtils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TypeLogoBadge from "../ui/TypeLogoBadge";
import ReactGA from "react-ga4";
import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";

export default function PokemonCard({
  pokemon,
  index = 0,
  isFocused = false,
  onKeyboardNavigate,
}) {
  const type1 = pokemon?.types?.[0]?.type?.name;
  const type2 = pokemon?.types?.[1]?.type?.name || type1;
  const { favorites, toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(pokemon.id);

  const handleCardClick = () => {
    ReactGA.event({
      category: "Pokemon",
      action: "Card Click",
      label: `${pokemon.name} (#${pokemon.id})`,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onKeyboardNavigate) {
      e.preventDefault();
      onKeyboardNavigate(pokemon.id);
    }
  };

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const wasAlreadyFavorite = isFavorite;
    toggleFavorite(pokemon.id);
    ReactGA.event({
      category: "Pokemon",
      action: wasAlreadyFavorite ? "Remove Favorite" : "Add Favorite",
      label: `${pokemon.name} (#${pokemon.id})`,
    });
  };

  return (
    <Link
      to={`/pokemon/${pokemon.id}`}
      className="block focus:outline-none"
      onClick={handleCardClick}
    >
      <motion.div
        className={`pokemon-card ${getGradientClass(type1, type2)} ${
          isFocused ? "pokemon-card-focused" : ""
        }`}
        tabIndex={isFocused ? 0 : -1}
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          delay: index * 0.3,
          scale: { type: "spring", visualDuration: index * 0.3, bounce: 0.5 },
        }}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
      >
        <div className="w-full flex justify-end mb-2">
          <button
            className="p-2 transition-all duration-200 cursor-pointer"
            onClick={handleFavoriteClick}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            <Heart
              className={`w-5 h-5 transition-all duration-200 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        </div>
        <img src={pokemon.sprite} alt={pokemon.name} loading="lazy" />
        <div className="pokemon-card-number">
          #{pokemon.id.toString().padStart(3, "0")}
        </div>
        <div className="pokemon-card-name">{pokemon.name}</div>
        <div className="pokemon-card-types">
          {pokemon.types?.map((type) => (
            <TypeLogoBadge key={type.type.name} type={type.type.name} />
          ))}
        </div>
        <div className="pokemon-card-rarity">
          {getRegion(pokemon.id)} |{" "}
          {pokemon.rarity.charAt(0).toUpperCase() + pokemon.rarity.slice(1)}
        </div>
      </motion.div>
    </Link>
  );
}
