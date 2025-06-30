import { useMultiplePokemon } from "../../../hooks/useMultiplePokemon";
import { EvolutionDescription, EvolutionPokemon } from "./index";
// @ts-ignore
import TypeLogoBadge from "../../ui/TypeLogoBadge";

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
        const pokemonData = pokemonCache[name];
        return (
          <EvolutionPokemon
            key={name}
            isFirst={idx === 0}
            name={name}
            pokemonData={pokemonData}
            isLoading={!pokemonData}
            getSpriteUrl={getSpriteUrl}
            delay={idx}
            isTarget={name === pokemonName}
          >
            {/* Render evolution description if available */}
            {evolutionDetails && evolutionDetails[idx] && (
              <div className="evo-trigger-details">
                <EvolutionDescription evolutionDetail={evolutionDetails[idx]} />
              </div>
            )}
          </EvolutionPokemon>
        );
      })}
    </div>
  );
}
