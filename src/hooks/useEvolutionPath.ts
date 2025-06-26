import { useState, useEffect, useCallback } from "react";
import { getRelevantEvolutionPath, EvolutionPath } from "../services/evolutionService";
import { throttleRequest } from "../services/throttle";
import { useMultiplePokemon } from "./useMultiplePokemon";

export interface UseEvolutionPathResult {
  data: EvolutionPath | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Helper function to extract all Pokemon names from evolution tree
const getAllPokemonNames = (node: any): string[] => {
  const names = [node.name];
  if (node.evolvesTo && node.evolvesTo.length > 0) {
    node.evolvesTo.forEach((child: any) => {
      names.push(...getAllPokemonNames(child));
    });
  }
  return names;
};

export function useEvolutionPath(pokemonId: number | null): UseEvolutionPathResult {
  const [data, setData] = useState<EvolutionPath | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!pokemonId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await throttleRequest(() => getRelevantEvolutionPath(pokemonId));
      setData(result);
    } catch (err: any) {
      setError(err.message || "Failed to fetch evolution path");
    } finally {
      setLoading(false);
    }
  }, [pokemonId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Extract all Pokemon names from evolution tree for fetching full data
  const evolutionPokemonNames = data?.evolutionTree ? 
    getAllPokemonNames(data.evolutionTree) : [];
  
  // Fetch full Pokemon data for all evolution nodes
  const pokemonData = useMultiplePokemon(evolutionPokemonNames);

  // Enrich the evolution tree with Pokemon data
  const enrichedData = data ? {
    ...data,
    evolutionTree: data.evolutionTree ? enrichEvolutionTree(data.evolutionTree, pokemonData) : null
  } : null;

  return { 
    data: enrichedData, 
    loading: loading || (evolutionPokemonNames.length > 0 && Object.keys(pokemonData).length < evolutionPokemonNames.length), 
    error, 
    refetch: fetchData 
  };
}

// Helper function to enrich evolution tree with Pokemon data
const enrichEvolutionTree = (node: any, pokemonData: Record<string, any>): any => {
  return {
    ...node,
    pokemonData: pokemonData[node.name] || null,
    evolvesTo: node.evolvesTo ? node.evolvesTo.map((child: any) => 
      enrichEvolutionTree(child, pokemonData)
    ) : []
  };
}; 