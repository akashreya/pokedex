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
    <div className="evolution-inner-panel md:items-start">
      {evolutionPath.map((name, idx) => {
        const isCurrent = name === pokemonName;
        const pokemonData = pokemonCache[name];
        const isLoading = !pokemonData;

        const gradientClass = getPokemonGradientClass(pokemonData);

        return (
          <Fragment key={name}>
            {idx > 0 && <EvolutionArrow />}
            <div className="evolution-sprite-outer-panel">
              <div className="evo-single-sprite-panel">
                <div
                  className={`evo-image-panel ${gradientClass}
                     ${isCurrent ? "ring-3 ring-blue-400" : ""}`}
                >
                  {isLoading ? (
                    <div className="evo-loading-panel">
                      <div className="evo-spinner"></div>
                    </div>
                  ) : (
                    <img
                      src={getSpriteUrl(pokemonData)}
                      alt={name}
                      className="evo-image"
                    />
                  )}
                </div>
              </div>
              <div className="evo-details">
                {isCurrent ? (
                  <span className="evo-name">{name}</span>
                ) : (
                  <Link
                    to={`/pokemon/${name}`}
                    className="evo-name hover:text-blue-500 transition-colors duration-200"
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
                  <div className="evo-trigger-details">
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
