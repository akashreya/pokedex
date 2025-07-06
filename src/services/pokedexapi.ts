import { fetchFromApi, ApiResponse } from "./api";

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

// --- Endpoint functions ---

export async function getPokemonList(limit = 30, offset = 0): Promise<ApiResponse<PokemonListResponse>> {
  if (limit < 1 || limit > 1000) throw new Error("Limit must be between 1 and 1000");
  if (offset < 0) throw new Error("Offset must be >= 0");
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  return fetchFromApi<PokemonListResponse>(url);
}

export async function getPokemonByIdOrName(idOrName: number | string): Promise<ApiResponse<Pokemon>> {
  if (!idOrName) throw new Error("idOrName is required");
  const url = `https://pokeapi.co/api/v2/pokemon/${idOrName}`;
  return fetchFromApi<Pokemon>(url);
}

export async function getPokemonTypeInfo(type: string): Promise<ApiResponse<PokemonTypeInfo>> {
  if (!type) throw new Error("type is required");
  const url = `https://pokeapi.co/api/v2/type/${type}`;
  return fetchFromApi<PokemonTypeInfo>(url);
}

export async function getEvolutionChain(id: number): Promise<ApiResponse<EvolutionChain>> {
  if (!id || id < 1) throw new Error("Valid evolution chain id is required");
  const url = `https://pokeapi.co/api/v2/evolution-chain/${id}`;
  return fetchFromApi<EvolutionChain>(url);
}

export async function getRegionInfo(region: string): Promise<ApiResponse<RegionInfo>> {
  if (!region) throw new Error("region is required");
  const url = `https://pokeapi.co/api/v2/region/${region}`;
  return fetchFromApi<RegionInfo>(url);
} 