import { getRegion } from "../../utils/pokemonUtils";
import { usePokemonSpecies } from "../../hooks/usePokemonSpecies";

interface PokemonAboutProps {
  pokemon: {
    id: number;
    height: number;
    weight: number;
    species: {
      name: string;
      url: string;
    };
  };
}

export default function PokemonAbout({ pokemon }: PokemonAboutProps) {
  const { species } = usePokemonSpecies(pokemon?.species?.url || null);

  // Extract description from species data
  const description =
    species?.flavor_text_entries
      ?.find((f: any) => f.language.name === "en")
      ?.flavor_text?.replace(/\f|\n/g, " ") || "";

  return (
    <div>
      {/* About content: physical characteristics, etc. */}
      <div className="mb-6 text-center max-w-xl mx-auto text-gray-800">
        {description}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-8 text-gray-800">
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="text-sm">Height</div>
          <div className="text-lg font-semibold">
            {(pokemon.height / 10).toFixed(1)}m
          </div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="text-sm">Weight</div>
          <div className="text-lg font-semibold">
            {(pokemon.weight / 10).toFixed(1)}kg
          </div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="text-sm">Region</div>
          <div className="text-lg font-semibold">{getRegion(pokemon.id)}</div>
        </div>
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="text-sm">Species</div>
          <div className="text-lg font-semibold capitalize">
            {pokemon.species.name}
          </div>
        </div>
      </div>
    </div>
  );
}
