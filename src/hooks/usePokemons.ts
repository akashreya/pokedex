import { useState, useEffect, useCallback } from "react";
import { PokemonListResponse } from "../services/pokedexapi";
import { fetchWithCache } from "../services/cache";
import { throttleRequest } from "../services/throttle";

export interface UsePokemonsResult {
  data: PokemonListResponse | null;
  loading: boolean;
  error: string | null;
  page: number;
  setPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

const PAGE_SIZE = 30;

export function usePokemons(): UsePokemonsResult {
  const [data, setData] = useState<PokemonListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const offset = (page - 1) * PAGE_SIZE;
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${PAGE_SIZE}&offset=${offset}`;
    try {
      // Use cache and throttle for performance
      const result = await throttleRequest(() => fetchWithCache<PokemonListResponse>(url));
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch Pokémon list");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const nextPage = useCallback(() => setPage((p) => p + 1), []);
  const prevPage = useCallback(() => setPage((p) => Math.max(1, p - 1)), []);

  return { data, loading, error, page, setPage, nextPage, prevPage };
} 