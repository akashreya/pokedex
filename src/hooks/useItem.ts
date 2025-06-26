import { useState, useEffect, useCallback } from "react";

export interface Item {
  name: string;
  sprites: {
    default: string;
    [key: string]: string;
  };
  [key: string]: any;
}

export function useItem(itemNameOrId: string | number | null) {
  const [data, setData] = useState<Item | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!itemNameOrId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/item/${itemNameOrId}`);
      if (!res.ok) throw new Error("Failed to fetch item");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to fetch item");
    } finally {
      setLoading(false);
    }
  }, [itemNameOrId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
} 