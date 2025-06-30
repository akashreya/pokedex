import { EvolutionDescription, EvolutionPokemon } from "./index";
import { EvolutionDetail } from "../../../utils/evolutionUtils";
import { useMultiplePokemon } from "../../../hooks/useMultiplePokemon";
// @ts-ignore
import TypeLogoBadge from "../../ui/TypeLogoBadge";

interface EvolutionDefaultProps {
  evolutionPath: {
    previous: string[];
    next: string[];
    evolutionMethods?: any;
  };
  pokemonName: string;
  getSpriteUrl: (pokemonData: any, fallbackId?: string | number) => string;
  evolutionDetails?: EvolutionDetail[];
}

export default function EvolutionDefault({
  evolutionPath,
  pokemonName,
  getSpriteUrl,
  evolutionDetails,
}: EvolutionDefaultProps) {
  console.log(evolutionPath);
  // Get all Pokémon names from the evolution path
  const allPokemonNames = [
    ...evolutionPath.previous,
    pokemonName,
    ...evolutionPath.next,
  ];

  // Fetch all Pokémon data using the hook
  const pokemonCache = useMultiplePokemon(allPokemonNames);

  return (
    <div className="flex items-center justify-center gap-6 flex-wrap">
      {/* Previous Evolutions */}
      {evolutionPath.previous.map((prevName, index) => (
        <EvolutionPokemon
          key={prevName}
          isFirst={index === 0}
          name={prevName}
          pokemonData={pokemonCache[prevName]}
          isLoading={!pokemonCache[prevName]}
          getSpriteUrl={getSpriteUrl}
        />
      ))}

      {/* Current Pokémon */}
      <EvolutionPokemon
        isFirst={false}
        name={pokemonName}
        pokemonData={pokemonCache[pokemonName]}
        isLoading={!pokemonCache[pokemonName]}
        getSpriteUrl={getSpriteUrl}
        isTarget={true}
      >
        {evolutionPath.evolutionMethods &&
          evolutionPath.evolutionMethods.evolvesTo &&
          evolutionPath.evolutionMethods.evolvesTo[0] &&
          evolutionPath.evolutionMethods.evolvesTo[0].evolutionDetails &&
          evolutionPath.evolutionMethods.evolvesTo[0].name === pokemonName &&
          evolutionPath.evolutionMethods.evolvesTo[0].evolutionDetails[0] && (
            <div className="evo-trigger-details">
              <EvolutionDescription
                evolutionDetail={
                  evolutionPath.evolutionMethods.evolvesTo[0]
                    .evolutionDetails[0]
                }
              />
            </div>
          )}
      </EvolutionPokemon>

      {/* Next Evolutions */}
      {evolutionPath.next.map((name, index) => {
        const evolutionDetail = evolutionDetails?.[index];
        return (
          <EvolutionPokemon
            key={name}
            isFirst={false}
            name={name}
            pokemonData={pokemonCache[name]}
            isLoading={!pokemonCache[name]}
            getSpriteUrl={getSpriteUrl}
          >
            {evolutionDetail && (
              <div className="evo-trigger-details">
                <EvolutionDescription
                  evolutionDetail={evolutionDetail}
                  className="text-xs"
                />
              </div>
            )}
          </EvolutionPokemon>
        );
      })}
    </div>
  );
}
