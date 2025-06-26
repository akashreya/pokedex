import { useState, useEffect, useCallback } from "react";
import { EvolutionChain } from "../services/pokedexapi";
import { fetchWithCache } from "../services/cache";
import { throttleRequest } from "../services/throttle";

export interface UseEvolutionChainResult {
  data: EvolutionChain | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useEvolutionChain(chainId: number | null): UseEvolutionChainResult {
  const [data, setData] = useState<EvolutionChain | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!chainId) return;
    setLoading(true);
    setError(null);
    const url = `https://pokeapi.co/api/v2/evolution-chain/${chainId}`;
    try {
      const result = await throttleRequest(() => fetchWithCache<EvolutionChain>(url));
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch evolution chain");
    } finally {
      setLoading(false);
    }
  }, [chainId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
} 