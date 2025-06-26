import { useState, useEffect, useCallback } from "react";

export interface Machine {
  id: number;
  [key: string]: any;
}

export function useMachine(machineId: string | number | null) {
  const [data, setData] = useState<Machine | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!machineId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/machine/${machineId}`);
      if (!res.ok) throw new Error("Failed to fetch machine");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "Failed to fetch machine");
    } finally {
      setLoading(false);
    }
  }, [machineId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
} 