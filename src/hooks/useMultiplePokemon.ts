import { useState, useEffect } from "react";
import { Pokemon } from "../services/pokedexapi";
import { fetchWithCache } from "../services/cache";
import { throttleRequest } from "../services/throttle";

export function useMultiplePokemon(idsOrNames: (string | number)[]): Record<string | number, Pokemon> {
  const [cache, setCache] = useState<Record<string | number, Pokemon>>({});

  useEffect(() => {
    // Clear cache immediately when input changes
    setCache({});

    if (!idsOrNames || idsOrNames.length === 0) return;
    let isMounted = true;
    Promise.all(
      idsOrNames.map(async (id) => {
        try {
          const result = await throttleRequest(() => fetchWithCache<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`));
          return [id, result];
        } catch {
          return [id, null];
        }
      })
    ).then((results) => {
      if (!isMounted) return;
      const newCache: Record<string | number, Pokemon> = {};
      results.forEach((entry) => {
        const id = entry[0] as string | number;
        const data = entry[1] as Pokemon | null;
        if (data) newCache[id] = data;
      });
      setCache(newCache);
    });
    return () => {
      isMounted = false;
    };
  }, [JSON.stringify(idsOrNames)]);

  return cache;
} 