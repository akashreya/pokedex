import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import EvolutionArrow from "./EvolutionArrow";
import { getPokemonGradientClass } from "@/utils/pokemonUtils";
// @ts-ignore
import TypeLogoBadge from "../../ui/TypeLogoBadge";

interface PokemonType {
  type: {
    name: string;
  };
}

interface EvolutionPokemonProps {
  isFirst?: boolean;
  name: string | number;
  pokemonData: any;
  isLoading: boolean;
  getSpriteUrl: (pokemonData: any) => string;
  children?: React.ReactNode;
  className?: string;
  arrowColor?: string;
  delay?: number;
  isTarget?: boolean;
}

export default function EvolutionPokemon({
  isFirst = false,
  name,
  pokemonData,
  isLoading,
  getSpriteUrl,
  children,
  className = "",
  delay,
  isTarget = false,
}: EvolutionPokemonProps) {
  const gradientClass = getPokemonGradientClass(pokemonData);
  return (
    <div
      className={`flex flex-col md:flex-row items-center md:items-start pb-2 ${className}`}
    >
      {!isFirst && (
        <div className="flex flex-col justify-center items-center m-2">
          <div className="-mt-18">
            <EvolutionArrow />
          </div>
        </div>
      )}
      <div className="evolution-sprite-outer-panel">
        <div className="evo-single-sprite-panel">
          <div
            className={`evo-image-panel ${gradientClass}${
              isTarget ? " shadow-black ring-3 ring-blue-400" : ""
            }`}
          >
            {isLoading ? (
              <div className="evo-loading-panel">
                <div className="evo-spinner"></div>
              </div>
            ) : (
              <motion.img
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: delay || 0 }}
                src={getSpriteUrl(pokemonData)}
                alt={pokemonData.name}
                className="evo-image"
              />
            )}
          </div>
        </div>
        <div className="evo-details">
          {isTarget ? (
            <span className="evo-name">{pokemonData?.name}</span>
          ) : (
            <Link
              to={`/pokemon/${name}`}
              className="evo-name transition-colors duration-200 hover:text-blue-500 "
            >
              {pokemonData?.name}
            </Link>
          )}
          <div className="pokemon-card-types mt-1">
            {pokemonData?.types?.map((type: PokemonType) => (
              <TypeLogoBadge key={type.type.name} type={type.type.name} />
            ))}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
