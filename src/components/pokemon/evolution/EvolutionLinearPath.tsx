import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useMultiplePokemon } from "../../../hooks/useMultiplePokemon";
import { EvolutionDescription, EvolutionArrow } from "./index";
import { getPokemonGradientClass } from "@/utils/pokemonUtils";
// @ts-ignore
import TypeLogoBadge from "../../ui/TypeLogoBadge";

interface PokemonType {
  type: {
    name: string;
  };
}
interface EvolutionLinearPathProps {
  evolutionPath: string[];
  pokemonName: string;
  getSpriteUrl: (pokemonData: any, fallbackId?: string | number) => string;
  evolutionDetails: (any | null)[];
}

export default function EvolutionLinearPath({
  evolutionPath,
  pokemonName,
  getSpriteUrl,
  evolutionDetails,
}: EvolutionLinearPathProps) {
  // Fetch all Pokémon data for the evolution path using the hook
  const pokemonCache = useMultiplePokemon(evolutionPath);

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-4">
      {evolutionPath.map((name, idx) => {
        const isCurrent = name === pokemonName;
        const pokemonData = pokemonCache[name];
        const isLoading = !pokemonData;

        const gradientClass = getPokemonGradientClass(pokemonData);

        return (
          <Fragment key={name}>
            {idx > 0 && <EvolutionArrow />}
            <div className="flex flex-col items-center min-h-[200px]">
              <div className="flex-shrink-0">
                <div
                  className={`w-50 h-50 rounded-full shadow-lg shadow-black
                     bg-gradient-to-t ${gradientClass}
                     ${isCurrent ? "ring-3 ring-blue-400" : ""}`}
                >
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <img
                      src={getSpriteUrl(pokemonData)}
                      alt={name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center mt-4">
                {isCurrent ? (
                  <span className="capitalize font-semibold text-xl text-gray-600">
                    {name}
                  </span>
                ) : (
                  <Link
                    to={`/pokemon/${name}`}
                    className="capitalize font-semibold text-xl text-gray-600 hover:text-blue-500 transition-colors"
                  >
                    {name}
                  </Link>
                )}
                <div className="pokemon-card-types mt-1">
                  {pokemonData?.types?.map((type: PokemonType) => (
                    <TypeLogoBadge key={type.type.name} type={type.type.name} />
                  ))}
                </div>
                {/* Render evolution description if available */}
                {evolutionDetails && evolutionDetails[idx] && (
                  <div className="mt-2 text-center backdrop-blur px-2 py-1 rounded-full text-xs">
                    <EvolutionDescription
                      evolutionDetail={evolutionDetails[idx]}
                    />
                  </div>
                )}
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
