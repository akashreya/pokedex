import { getGradientClass } from "../../utils/pokemonUtils";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import TypeLogoBadge from "../ui/TypeLogoBadge";

export default function PokemonCardList({ pokemon, index = 0 }) {
  const type1 = pokemon?.types?.[0]?.type?.name;
  const type2 = pokemon?.types?.[1]?.type?.name || type1;
  return (
    <Link to={`/pokemon/${pokemon.id}`} className="block focus:outline-none">
      <motion.div
        className={`w-full flex items-center gap-4 border border-blue-200 rounded-3xl
           shadow-sm px-4 py-2 hover:shadow-lg transition-all object-contain
           duration-200 bg-gradient-to-r  ${getGradientClass(type1, type2)}`}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.3,
          delay: index * 0.1,
          scale: { type: "spring", visualDuration: index * 0.1, bounce: 0.5 },
        }}
        whileHover={{ y: -3, transition: { duration: 0.2 } }}
      >
        <div className="flex items-center gap-3 flex-grow">
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
          <span className="pokemon-card-name">{pokemon.name}</span>
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
