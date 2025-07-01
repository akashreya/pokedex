import { useMultiplePokemon } from "../../../hooks/useMultiplePokemon";
import { EvolutionDescription, EvolutionPokemon } from "./index";
// @ts-ignore
import TypeLogoBadge from "../../ui/TypeLogoBadge";

interface EvolutionMidBranchProps {
  evolutionPath: {
    previous: string[] | number[];
    next: string[] | number[];
    evolutionMethods?: any;
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
  const getNextEvolutionDetail = (name: number | string) => {
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
            const data = pokemonCache[name];
            return (
              <EvolutionPokemon
                key={name}
                isFirst={idx === 0}
                name={name}
                pokemonData={data}
                isLoading={!data}
                getSpriteUrl={getSpriteUrl}
                delay={idx}
              />
            );
          })}
        </div>
      )}

      {/* Target Pokémon */}
      <EvolutionPokemon
        isFirst={false}
        name={pokemonName}
        pokemonData={pokemonCache[pokemonName]}
        isLoading={!pokemonCache[pokemonName]}
        getSpriteUrl={getSpriteUrl}
        delay={prevCount}
        isTarget={true}
      >
        {(() => {
          const prevDetail = getPrevEvolutionDetail(0);
          return prevDetail ? (
            <div className="evo-trigger-details">
              <EvolutionDescription evolutionDetail={prevDetail} />
            </div>
          ) : null;
        })()}
      </EvolutionPokemon>
      {/* Next evolutions */}
      {evolutionPath.next.length > 0 && (
        <div className="flex flex-row md:flex-col items-center min-h-[200px]">
          {evolutionPath.next.map((name) => {
            const pokemonData = pokemonCache[name];
            const isLoading = !pokemonData;
            const evolutionDetail = getNextEvolutionDetail(name);
            return (
              <EvolutionPokemon
                key={name}
                isFirst={false}
                name={name}
                pokemonData={pokemonData}
                isLoading={isLoading}
                getSpriteUrl={getSpriteUrl}
                delay={prevCount + 1}
                className={`${
                  evolutionPath.next.length > 1 ? "max-h-1/2 min-w-1/2" : ""
                }`}
              >
                {evolutionDetail && (
                  <div className="evo-trigger-details">
                    <EvolutionDescription evolutionDetail={evolutionDetail} />
                  </div>
                )}
              </EvolutionPokemon>
            );
          })}
        </div>
      )}
    </div>
  );
}
