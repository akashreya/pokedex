import { Fragment } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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

  const prevCount = evolutionPath.previous.length;

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
      className={`evolution-inner-panel ${
        evolutionPath.next.length > 1 ? "" : "md:items-start "
      } `}
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
                <div className="evolution-sprite-outer-panel">
                  <div className="evo-single-sprite-panel">
                    <div className={`evo-image-panel ${gradientClass}`}>
                      {isLoading ? (
                        <div className="evo-loading-panel">
                          <div className="evo-spinner"></div>
                        </div>
                      ) : (
                        <motion.img
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 1, delay: idx }}
                          src={getSpriteUrl(pokemonData)}
                          alt={name}
                          className="evo-image"
                        />
                      )}
                    </div>
                  </div>
                  <div className="evo-details justify-start  min-w-[120px] mt-4">
                    <Link
                      to={`/pokemon/${name}`}
                      className="evo-name text-center hover:text-blue-500 transition-colors"
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
      <div className="evolution-sprite-outer-panel p-2">
        {(() => {
          const pokemonData = pokemonCache[pokemonName];
          const isLoading = !pokemonData;
          const gradientClass = getPokemonGradientClass(pokemonData);

          return (
            <>
              <div className="evo-single-sprite-panel">
                <div
                  className={`evo-image-panel ${gradientClass} shadow-black ring-3 ring-blue-400 p-2`}
                >
                  {isLoading ? (
                    <div className="evo-loading-panel">
                      <div className="evo-spinner"></div>
                    </div>
                  ) : (
                    <motion.img
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: prevCount * 1 }}
                      src={getSpriteUrl(pokemonData)}
                      alt={pokemonName}
                      className="evo-image"
                    />
                  )}
                </div>
              </div>
              <div className="evo-details justify-start min-w-[120px]">
                <span className="evo-name">{pokemonName}</span>
                <div className="pokemon-card-types mt-1">
                  {pokemonData?.types?.map((type: PokemonType) => (
                    <TypeLogoBadge key={type.type.name} type={type.type.name} />
                  ))}
                </div>
                {(() => {
                  const prevDetail = getPrevEvolutionDetail(0);
                  return prevDetail ? (
                    <div className="evo-trigger-details">
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
                <div className="evolution-sprite-outer-panel ml-5">
                  <div className="evo-single-sprite-panel">
                    <div className={`evo-image-panel ${gradientClass}`}>
                      {isLoading ? (
                        <div className="evo-loading-panel">
                          <div className="evo-spinner"></div>
                        </div>
                      ) : (
                        <motion.img
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 1, delay: prevCount + 1 }}
                          src={getSpriteUrl(pokemonData)}
                          alt={name}
                          className="evo-image"
                        />
                      )}
                    </div>
                  </div>
                  <div className="evo-details justify-start min-w-[120px]">
                    <Link
                      to={`/pokemon/${name}`}
                      className="evo-name hover:text-blue-500 transition-colors"
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
                      <div className="evo-trigger-details">
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
