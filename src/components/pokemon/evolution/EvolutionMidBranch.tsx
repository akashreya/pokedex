import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useMultiplePokemon } from "../../../hooks/useMultiplePokemon";
import { getPokemonGradientClass } from "@/utils/pokemonUtils";
import { EvolutionDescription, EvolutionArrow } from "./index";
// @ts-ignore
import TypeLogoBadge from "../../ui/TypeLogoBadge";

interface PokemonType {
  type: {
    name: string;
  };
}
interface EvolutionMidBranchProps {
  evolutionPath: {
    previous: string[];
    next: string[];
    evolutionMethods?: any; // Full chain node
  };
  pokemonName: string;
  getSpriteUrl: (pokemonData: any) => string;
}

export default function EvolutionMidBranch({
  evolutionPath,
  pokemonName,
  getSpriteUrl,
}: EvolutionMidBranchProps) {
  // Get all Pokémon names from the evolution path
  const allPokemonNames = [
    ...evolutionPath.previous,
    pokemonName,
    ...evolutionPath.next,
  ];

  // Fetch all Pokémon data using the hook
  const pokemonCache = useMultiplePokemon(allPokemonNames);

  // Helper: get evolutionDetails for previous step
  const getPrevEvolutionDetail = (idx: number) => {
    if (
      evolutionPath.evolutionMethods &&
      evolutionPath.evolutionMethods.evolvesTo &&
      evolutionPath.evolutionMethods.evolvesTo[idx] &&
      evolutionPath.evolutionMethods.evolvesTo[idx].evolutionDetails &&
      evolutionPath.evolutionMethods.evolvesTo[idx].name === pokemonName &&
      evolutionPath.evolutionMethods.evolvesTo[idx].evolutionDetails[0]
    ) {
      return evolutionPath.evolutionMethods.evolvesTo[idx].evolutionDetails[0];
    }
    return null;
  };

  // Helper: get evolutionDetails for next step
  const getNextEvolutionDetail = (name: string) => {
    if (
      evolutionPath.evolutionMethods &&
      evolutionPath.evolutionMethods.evolvesTo &&
      evolutionPath.evolutionMethods.evolvesTo[0] &&
      evolutionPath.evolutionMethods.evolvesTo[0].evolvesTo
    ) {
      const nextEvo =
        evolutionPath.evolutionMethods.evolvesTo[0].evolvesTo.find(
          (e: any) => e.name === name
        );
      if (nextEvo && nextEvo.evolutionDetails && nextEvo.evolutionDetails[0]) {
        return nextEvo.evolutionDetails[0];
      }
    }
    return null;
  };

  return (
    <div
      className={`flex flex-col md:flex-row items-center ${
        evolutionPath.next.length > 1 ? "" : "md:items-start "
      } 
      justify-center gap-4`}
    >
      {/* Previous evolution path */}
      {evolutionPath.previous.length > 0 && (
        <div className="flex items-center gap-4">
          {evolutionPath.previous.map((name, idx) => {
            const pokemonData = pokemonCache[name];
            const isLoading = !pokemonData;
            const gradientClass = getPokemonGradientClass(pokemonData);

            return (
              <Fragment key={name}>
                {idx > 0 && <EvolutionArrow color="gray-400" />}
                <div className="flex flex-col items-center min-h-[200px]">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-50 h-50 rounded-full shadow-lg shadow-black
                     bg-gradient-to-r ${gradientClass}`}
                    >
                      {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        <img
                          src={getSpriteUrl(pokemonData)}
                          alt={name}
                          className="w-full h-full object-contain drop-shadow-md"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-start mt-4 min-w-[120px]">
                    <Link
                      to={`/pokemon/${name}`}
                      className="capitalize font-semibold text-xl text-gray-600 text-center hover:text-blue-500 transition-colors"
                    >
                      {name}
                    </Link>
                    <div className="pokemon-card-types mt-1">
                      {pokemonData?.types?.map((type: PokemonType) => (
                        <TypeLogoBadge
                          key={type.type.name}
                          type={type.type.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Fragment>
            );
          })}
        </div>
      )}
      <EvolutionArrow />
      {/* Target Pokémon */}
      <div className="flex flex-col items-center min-h-[200px] p-2">
        {(() => {
          const pokemonData = pokemonCache[pokemonName];
          const isLoading = !pokemonData;
          const gradientClass = getPokemonGradientClass(pokemonData);

          return (
            <>
              <div className="flex-shrink-0">
                <div
                  className={`w-50 h-50 rounded-full shadow-lg bg-gradient-to-r ${gradientClass} shadow-black ring-3 ring-blue-400 p-2`}
                >
                  {isLoading ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <img
                      src={getSpriteUrl(pokemonData)}
                      alt={pokemonName}
                      className="w-full h-full object-contain drop-shadow-lg"
                    />
                  )}
                </div>
              </div>
              <div className="flex flex-col items-center justify-start mt-4 min-w-[120px]">
                <span className="capitalize text-gray-600 font-semibold text-xl text-center">
                  {pokemonName}
                </span>
                <div className="pokemon-card-types mt-1">
                  {pokemonData?.types?.map((type: PokemonType) => (
                    <TypeLogoBadge key={type.type.name} type={type.type.name} />
                  ))}
                </div>
                {(() => {
                  const prevDetail = getPrevEvolutionDetail(0);
                  return prevDetail ? (
                    <div className="mt-2 text-center bg-white/50 px-2 py-1 rounded-full text-xs">
                      <EvolutionDescription evolutionDetail={prevDetail} />
                    </div>
                  ) : null;
                })()}
              </div>
            </>
          );
        })()}
      </div>
      {/* Next evolutions */}
      {evolutionPath.next.length > 0 && (
        <div className="flex flex-row md:flex-col p-2 items-center min-h-[200px]">
          {evolutionPath.next.map((name) => {
            const pokemonData = pokemonCache[name];
            const isLoading = !pokemonData;
            const evolutionDetail = getNextEvolutionDetail(name);
            const gradientClass = getPokemonGradientClass(pokemonData);
            return (
              <div key={name} className="flex flex-row items-center">
                <EvolutionArrow />
                <div className="flex flex-col items-center min-h-[200px] ml-5">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-50 h-50 rounded-full shadow-lg shadow-black bg-gradient-to-r ${gradientClass}`}
                    >
                      {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        <img
                          src={getSpriteUrl(pokemonData)}
                          alt={name}
                          className="w-full h-full object-contain drop-shadow-md"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-center justify-start mt-4 min-w-[120px]">
                    <Link
                      to={`/pokemon/${name}`}
                      className="capitalize font-semibold text-xl text-gray-600 hover:text-blue-500 transition-colors"
                    >
                      {name}
                    </Link>
                    <div className="pokemon-card-types mt-1">
                      {pokemonData?.types?.map((type: PokemonType) => (
                        <TypeLogoBadge
                          key={type.type.name}
                          type={type.type.name}
                        />
                      ))}
                    </div>
                    {evolutionDetail && (
                      <div className="mt-2 text-center px-2 py-1 rounded-full text-xs">
                        <EvolutionDescription
                          evolutionDetail={evolutionDetail}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
