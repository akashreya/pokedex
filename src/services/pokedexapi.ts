import { Pokedex } from "pokeapi-js-wrapper";

// Initialize PokeAPI wrapper with caching
const P = new Pokedex({
  cache: true,
  timeout: 5000,
  cacheImages: true,
});

// --- TypeScript interfaces for endpoint responses ---

export interface PokemonListResult {
  name: string;
  url: string;
}
export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListResult[];
}

export interface Pokemon {
  id: number;
  name: string;
  base_experience: number;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    back_default: string | null;
    front_shiny: string | null;
    back_shiny: string | null;
    other: {
      dream_world: {
        front_default: string | null;
        front_female: string | null;
      };
      home: {
        front_default: string | null;
        front_female: string | null;
        front_shiny: string | null;
        front_shiny_female: string | null;
      };
      'official-artwork': {
        front_default: string | null;
        front_shiny: string | null;
      };
    };
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  species: {
    name: string;
    url: string;
  };
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    ability: {
      name: string;
      url: string;
    };
    is_hidden: boolean;
    slot: number;
  }[];
  sprite?: string;
  rarity?: string;
  evolution_chain_id?: number | null;
  has_evolution?: boolean;
  evolutionStage?: 'basic' | 'stage1' | 'stage2' | null;
}

export interface PokemonTypeInfo {
  id: number;
  name: string;
  // ...add more fields as needed
}

export interface PokemonSpecies {
  evolution_chain: { url: string };
  generation: { name: string };
  color: { name: string };
  habitat: { name: string };
  is_legendary: boolean;
  is_mythical: boolean;
}

export interface EvolutionChain {
  id: number;
  chain: any;
  // ...add more fields as needed
}

export interface RegionInfo {
  id: number;
  name: string;
  // ...add more fields as needed
}

// --- Wrapper-based endpoint functions ---

export async function getPokemonList(limit = 30, offset = 0): Promise<{ data: PokemonListResponse }> {
  if (limit < 1 || limit > 1000) throw new Error("Limit must be between 1 and 1000");
  if (offset < 0) throw new Error("Offset must be >= 0");
  
  try {
    const response = await P.getPokemonsList({ limit, offset });
    return { data: response };
  } catch (error) {
    throw new Error(`Failed to fetch Pokemon list: ${error}`);
  }
}

export async function getPokemonByIdOrName(idOrName: number | string): Promise<{ data: Pokemon }> {
  if (!idOrName) throw new Error("idOrName is required");
  
  try {
    const pokemon = await P.getPokemonByName(idOrName.toString());
    return { data: pokemon };
  } catch (error) {
    throw new Error(`Failed to fetch Pokemon ${idOrName}: ${error}`);
  }
}

export async function getPokemonTypeInfo(type: string): Promise<{ data: PokemonTypeInfo }> {
  if (!type) throw new Error("type is required");
  
  try {
    const typeInfo = await P.getTypeByName(type);
    return { data: typeInfo };
  } catch (error) {
    throw new Error(`Failed to fetch type info for ${type}: ${error}`);
  }
}

export async function getEvolutionChain(id: number): Promise<{ data: EvolutionChain }> {
  if (!id || id < 1) throw new Error("Valid evolution chain id is required");
  
  try {
    const evolutionChain = await P.getEvolutionChainById(id);
    return { data: evolutionChain };
  } catch (error) {
    throw new Error(`Failed to fetch evolution chain ${id}: ${error}`);
  }
}

export async function getRegionInfo(region: string): Promise<{ data: RegionInfo }> {
  if (!region) throw new Error("region is required");
  
  try {
    const regionInfo = await P.getRegionByName(region);
    return { data: regionInfo };
  } catch (error) {
    throw new Error(`Failed to fetch region info for ${region}: ${error}`);
  }
} 