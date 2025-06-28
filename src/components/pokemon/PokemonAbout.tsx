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

function AboutStatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="poke-stat-block">
      <div className="text-sm">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
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
      <div className="poke-desc">{description}</div>
      <div className="poke-about-panel">
        <AboutStatBlock
          label="Height"
          value={`${(pokemon.height / 10).toFixed(1)}m`}
        />
        <AboutStatBlock
          label="Weight"
          value={`${(pokemon.weight / 10).toFixed(1)}kg`}
        />
        <AboutStatBlock label="Region" value={getRegion(pokemon.id)} />
        <AboutStatBlock label="Species" value={pokemon.species.name} />
      </div>
    </div>
  );
}
