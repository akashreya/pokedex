import { useState, useEffect, useCallback } from "react";

export interface Move {
  name: string;
  [key: string]: any;
}

export function useMove(moveNameOrId: string | number | null) {
  const [data, setData] = useState<Move | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!moveNameOrId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/move/${moveNameOrId}`);
      if (!res.ok) throw new Error("Failed to fetch move");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to fetch move");
    } finally {
      setLoading(false);
    }
  }, [moveNameOrId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
} 