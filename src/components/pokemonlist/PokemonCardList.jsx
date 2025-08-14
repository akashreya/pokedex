import { getGradientClass } from "../../utils/pokemonUtils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TypeLogoBadge from "../ui/TypeLogoBadge";
import ReactGA from "react-ga4";
import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoritesContext";

export default function PokemonCardList({ pokemon, index = 0, isFocused = false, onKeyboardNavigate }) {
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
        className={`pokemon-card-list ${getGradientClass(type1, type2)} ${isFocused ? 'pokemon-card-list-focused' : ''}`}
        tabIndex={isFocused ? 0 : -1}
        onKeyDown={handleKeyDown}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          delay: index * 0.1,
          scale: { type: "spring", visualDuration: index * 0.1, bounce: 0.5 },
        }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
      >
        <div className="pokemon-card-list-inner-panel">
          <span className="pokemon-card-number">
            #{pokemon.id.toString().padStart(3, "0")}
          </span>
          <span className="flex-shrink-0">
            <img
              className="w-12 h-12 object-contain"
              src={pokemon.sprite}
              alt={pokemon.name}
              loading="lazy"
            />
          </span>
          <span className="pokemon-card-name truncate max-w-[120px] inline-block">
            {pokemon.name}
          </span>
        </div>
        <div className="pokemon-card-types">
          {pokemon.types?.map((type) => (
            <TypeLogoBadge key={type.type.name} type={type.type.name} />
          ))}
        </div>
      </motion.div>
    </Link>
  );
}
