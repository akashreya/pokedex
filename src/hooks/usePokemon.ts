import { useState, useEffect, useCallback } from "react";
import { getPokemonByIdOrName, Pokemon } from "../services/pokedexapi";
import { fetchWithCache } from "../services/cache";
import { throttleRequest } from "../services/throttle";

export interface UsePokemonResult {
  data: Pokemon | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePokemon(idOrName: number | string | null): UsePokemonResult {
  const [data, setData] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!idOrName) return;
    setLoading(true);
    setError(null);
    const url = `https://pokeapi.co/api/v2/pokemon/${idOrName}`;
    try {
      const result = await throttleRequest(() => fetchWithCache<Pokemon>(url));
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch Pokémon");
    } finally {
      setLoading(false);
    }
  }, [idOrName]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
} 