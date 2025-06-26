import { useState, useEffect } from "react";
import { Pokemon } from "../services/pokedexapi";
import { fetchWithCache } from "../services/cache";
import { throttleRequest } from "../services/throttle";

export function useMultiplePokemon(idsOrNames: (string | number)[]): Record<string, Pokemon> {
  const [cache, setCache] = useState<Record<string, Pokemon>>({});

  useEffect(() => {
    // Clear cache immediately when input changes
    setCache({});
    
    if (!idsOrNames || idsOrNames.length === 0) return;
    let isMounted = true;
    Promise.all(
      idsOrNames.map(async (id) => {
        try {
          const result = await throttleRequest(() => fetchWithCache<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`));
          return [String(id), result];
        } catch {
          return [String(id), null];
        }
      })
    ).then((results) => {
      if (!isMounted) return;
      const newCache: Record<string, Pokemon> = {};
      results.forEach((entry) => {
        const id = entry[0] as string;
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