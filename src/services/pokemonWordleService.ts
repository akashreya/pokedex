import { fetchFromApi } from "./api";
import { PokemonWordleData } from "../types/WordleTypes";
import { Pokemon, PokemonSpecies, EvolutionChain } from "./pokedexapi";

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

interface PokemonSpeciesResponse {
  evolution_chain: { url: string };
  generation: { name: string };
  color: { name: string };
  habitat: { name: string };
  is_legendary: boolean;
  is_mythical: boolean;
}

// Helper to extract evolution stage from chain
function getEvolutionStage(chain: EvolutionChain, pokemonName: string): number {
  let stage = 0;
  let current = chain.chain;
  while (current) {
    stage++;
    if (current.species.name === pokemonName) {
      return stage;
    }
    if (current.evolves_to.length > 0) {
      for (const evolution of current.evolves_to) {
        if (evolution.species.name === pokemonName) {
          return stage + 1;
        }
      }
      current = current.evolves_to[0];
    } else {
      current = null;
    }
  }
  return 1;
}

export async function getWordlePokemonData(idOrName: number | string): Promise<PokemonWordleData | null> {
  try {
    const pokemonResponse = await fetchFromApi<Pokemon>(`${POKEAPI_BASE_URL}/pokemon/${idOrName}`);
    const pokemonData = pokemonResponse.data;

    const speciesResponse = await fetchFromApi<PokemonSpeciesResponse>(pokemonData.species.url);
    const speciesData = speciesResponse.data;

    let evolutionStage = 1;
    if (speciesData.evolution_chain) {
      const evolutionChainResponse = await fetchFromApi<EvolutionChain>(speciesData.evolution_chain.url);
      evolutionStage = getEvolutionStage(evolutionChainResponse.data, pokemonData.name);
    }

    return {
      id: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.types.map(t => t.type.name),
      generation: speciesData.generation.name.split('-')[1].toUpperCase(),
      evolutionStage: evolutionStage,
      color: speciesData.color ? speciesData.color.name : 'unknown',
      habitat: speciesData.habitat ? speciesData.habitat.name : 'unknown',
      isLegendary: speciesData.is_legendary,
      isMythical: speciesData.is_mythical,
      height: pokemonData.height / 10,
      weight: pokemonData.weight / 10,
    };
  } catch (error) {
    console.error(`Failed to fetch Wordle Pokémon data for ${idOrName}:`, error);
    return null;
  }
}
