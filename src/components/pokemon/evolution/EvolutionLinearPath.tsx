import { useMultiplePokemon } from "../../../hooks/useMultiplePokemon";
import { EvolutionDescription, EvolutionPokemon } from "./index";
// @ts-ignore
import TypeLogoBadge from "../../ui/TypeLogoBadge";

interface EvolutionLinearPathProps {
  evolutionPath: number[];
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
      {evolutionPath.map((id, idx) => {
        const pokemonData = pokemonCache[id];
        return (
          <EvolutionPokemon
            key={id}
            isFirst={idx === 0}
            name={pokemonData?.name || String(id)}
            pokemonData={pokemonData}
            isLoading={!pokemonData}
            getSpriteUrl={getSpriteUrl}
            delay={idx}
            isTarget={pokemonData?.name === pokemonName}
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
