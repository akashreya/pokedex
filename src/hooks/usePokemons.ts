import { useState, useEffect, useCallback } from "react";
import { PokemonListResponse, getPokemonList } from "../services/pokedexapi";

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
    try {
      // Use wrapper with automatic caching
      const result = await getPokemonList(PAGE_SIZE, offset);
      setData(result.data);
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