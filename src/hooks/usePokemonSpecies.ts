import { useState, useEffect } from "react";

interface PokemonSpecies {
  id: number;
  name: string;
  genera: Array<{
    genus: string;
    language: {
      name: string;
    };
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: {
      name: string;
    };
    version: {
      name: string;
    };
  }>;
  gender_rate: number;
  egg_groups: Array<{
    name: string;
  }>;
  evolution_chain: {
    url: string;
  };
  evolves_from_species: {
    name: string;
    url: string;
  } | null;
  varieties: Array<{
    is_default: boolean;
    pokemon: {
      name: string;
      url: string;
    };
  }>;
}

interface UsePokemonSpeciesReturn {
  species: PokemonSpecies | null;
  loading: boolean;
  error: string | null;
  genera: string;
  description: string;
  maleRate: number | null;
  femaleRate: number | null;
  eggGroups: string[];
  evolutionChainUrl: string | null;
  forms: Array<{
    name: string;
    url: string;
    isDefault: boolean;
  }>;
}

export function usePokemonSpecies(speciesUrl: string | null): UsePokemonSpeciesReturn {
  const [species, setSpecies] = useState<PokemonSpecies | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!speciesUrl) {
      setSpecies(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    fetch(speciesUrl)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch species data: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSpecies(data);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch species data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [speciesUrl]);

  // Derived values
  const genera = species?.genera?.find((g) => g.language.name === "en")?.genus || "";
  
  const description = species?.flavor_text_entries
    ?.find((f) => f.language.name === "en" && f.version.name === "red")
    ?.flavor_text?.replace(/\f|\n/g, " ") || 
    species?.flavor_text_entries
      ?.find((f) => f.language.name === "en")
      ?.flavor_text?.replace(/\f|\n/g, " ") || "";

  const maleRate = species && species.gender_rate !== -1 ? 8 - species.gender_rate : null;
  const femaleRate = species && species.gender_rate !== -1 ? species.gender_rate : null;
  
  const eggGroups = species?.egg_groups?.map((g) => g.name.replace(/-/g, " ")) || [];
  
  const evolutionChainUrl = species?.evolution_chain?.url || null;
  
  const forms = species?.varieties?.map((v) => ({
    name: v.pokemon.name,
    url: v.pokemon.url,
    isDefault: v.is_default,
  })) || [];

  return {
    species,
    loading,
    error,
    genera,
    description,
    maleRate,
    femaleRate,
    eggGroups,
    evolutionChainUrl,
    forms,
  };
} 