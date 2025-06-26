import { useState, useEffect, useCallback } from "react";

export interface Berry {
  name: string;
  [key: string]: any;
}

export function useBerry(berryNameOrId: string | number | null) {
  const [data, setData] = useState<Berry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!berryNameOrId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/berry/${berryNameOrId}`);
      if (!res.ok) throw new Error("Failed to fetch berry");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to fetch berry");
    } finally {
      setLoading(false);
    }
  }, [berryNameOrId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
} 