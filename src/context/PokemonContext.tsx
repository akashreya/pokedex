import * as React from "react";
import {
  getPokemonList,
  getPokemonByIdOrName,
  Pokemon,
} from "../services/pokedexapi";
import { fetchWithCache } from "../services/cache";

interface PokemonDetail extends Pokemon {
  // Extend with more detail fields as needed
}

interface PokemonContextType {
  pokemonList: Pokemon[];
  currentPokemon: PokemonDetail | null;
  loading: boolean;
  error: string | null;
  currentRegion: string;
  setCurrentRegion: (region: string) => void;
  regions: string[];
  setCurrentPokemon: (pokemon: PokemonDetail | null) => void;
  fetchPokemonList: (region?: string) => Promise<void>;
  fetchPokemonDetail: (idOrName: number | string) => Promise<void>;
  fetchNextAllRegionsPage?: () => Promise<void>;
  allRegionsHasMore?: boolean;
}

const regionRanges: Record<string, { offset: number; limit: number }> = {
  Kanto: { offset: 0, limit: 151 },
  Johto: { offset: 151, limit: 100 },
  Hoenn: { offset: 251, limit: 135 },
  Sinnoh: { offset: 386, limit: 107 },
  Unova: { offset: 493, limit: 156 },
  Kalos: { offset: 649, limit: 72 },
  Alola: { offset: 721, limit: 88 },
  Galar: { offset: 809, limit: 96 },
  Paldea: { offset: 905, limit: 120 },
};
const regions = ["All Regions", ...Object.keys(regionRanges)];
const ALL_REGIONS_LIMIT = 200;
const ALL_REGIONS_BATCH_SIZE = 20;

const PokemonContext = React.createContext<PokemonContextType | undefined>(
  undefined
);

export const PokemonProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [pokemonList, setPokemonList] = React.useState<Pokemon[]>([]);
  const [currentPokemon, setCurrentPokemon] =
    React.useState<PokemonDetail | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentRegion, setCurrentRegion] = React.useState<string>("Kanto");
  // Cache for region lists
  const regionCache = React.useRef<Record<string, Pokemon[]>>({});

  // All Regions state
  const [allRegionsHasMore, setAllRegionsHasMore] = React.useState(true);
  const allRegionsCache = React.useRef<{
    summaryOffsets: Set<number>;
    details: Record<string, Pokemon>;
  }>({ summaryOffsets: new Set(), details: {} });

  // Helper to fetch details in batches
  async function fetchDetailsBatch(names: string[]): Promise<Pokemon[]> {
    const results: Pokemon[] = [];
    for (let i = 0; i < names.length; i += ALL_REGIONS_BATCH_SIZE) {
      const batch = names.slice(i, i + ALL_REGIONS_BATCH_SIZE);
      const batchResults = await Promise.all(
        batch.map(async (name) => {
          if (allRegionsCache.current.details[name]) {
            return allRegionsCache.current.details[name];
          }
          try {
            const url = `https://pokeapi.co/api/v2/pokemon/${name}`;
            const pokemonData = await fetchWithCache(url);
            // Sprite logic: dream_world > home > front_default
            const sprite =
              pokemonData.sprites?.other?.dream_world?.front_default ||
              pokemonData.sprites?.other?.home?.front_default ||
              pokemonData.sprites?.front_default ||
              "";
            // Rarity
            let rarity = "regular";
            try {
              const speciesRes = await fetchWithCache(pokemonData.species.url);
              if (speciesRes.is_legendary) rarity = "legendary";
              if (speciesRes.is_mythical) rarity = "mythical";
            } catch {}
            const pokemon = {
              ...pokemonData,
              sprite,
              rarity,
            };
            allRegionsCache.current.details[name] = pokemon;
            return pokemon;
          } catch {
            return null;
          }
        })
      );
      results.push(...(batchResults.filter(Boolean) as Pokemon[]));
    }
    return results;
  }

  // Fetch for All Regions (paginated)
  const fetchAllRegionsPage = async (offset: number, isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError(null);
    try {
      if (allRegionsCache.current.summaryOffsets.has(offset)) {
        if (!isBackground) setLoading(false);
        return;
      }
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${ALL_REGIONS_LIMIT}&offset=${offset}`;
      const summary = await fetchWithCache(url);
      const names = summary.results.map((p: any) => p.name);
      const details = await fetchDetailsBatch(names);
      // Filter out Pokémon with id > 1025
      const filteredDetails = details.filter((p) => p && p.id && p.id <= 1025);
      // If any Pokémon in this batch has id === 1025, stop further fetching
      if (filteredDetails.some((p) => p.id === 1025)) {
        setAllRegionsHasMore(false);
      }
      allRegionsCache.current.summaryOffsets.add(offset);
      setPokemonList((prev) => {
        const all = [...prev, ...filteredDetails];
        // Deduplicate by id
        const unique = Array.from(new Map(all.map((p) => [p.id, p])).values());
        // Log the correct count after setting
        console.debug(
          "[PokemonContext] All Regions batch loaded:",
          unique.length,
          unique.slice(0, 5).map((p) => p?.name)
        );
        return unique;
      });
      // If no more summary.next, also stop
      if (!summary.next) {
        setAllRegionsHasMore(false);
      }
    } catch (err: any) {
      console.error(err.message);
      setError(err.message || "Failed to fetch all Pokémon");
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  // Expose for pagination/infinite scroll
  const fetchNextAllRegionsPage = async () => {
    const nextOffset = pokemonList.length;
    await fetchAllRegionsPage(nextOffset, true); // true = background
  };

  // Helper to clear all AllRegions state
  const resetAllRegionsState = () => {
    setAllRegionsHasMore(true);
    allRegionsCache.current.summaryOffsets.clear();
    allRegionsCache.current.details = {};
  };

  // Main fetch function
  const fetchPokemonList = React.useCallback(
    async (region: string = currentRegion) => {
      setLoading(true);
      setError(null);
      setPokemonList([]); // Always clear list on new fetch
      // Debug: log region switch
      console.debug("[PokemonContext] Fetching region:", region);
      if (region === "All Regions") {
        // Reset state for new all-regions fetch
        resetAllRegionsState();
        // Fetch first page
        await fetchAllRegionsPage(0, false); // false = not background
        setLoading(false);
        return;
      } else {
        // Leaving All Regions: reset its state
        resetAllRegionsState();
      }
      try {
        // Use cache if available
        if (regionCache.current[region]) {
          // Deduplicate just in case
          const unique = Array.from(
            new Map(regionCache.current[region].map((p) => [p.id, p])).values()
          );
          setPokemonList(unique);
          setLoading(false);
          // Debug: log after fetch
          console.debug(
            `[PokemonContext] ${region} (from cache):`,
            unique.length,
            unique.slice(0, 5).map((p) => p?.name)
          );
          return;
        }
        const { offset, limit } = regionRanges[region] || regionRanges["Kanto"];
        const res = await getPokemonList(limit, offset);
        const results = res.data.results;
        const details = await Promise.all(
          results.map(async (p) => {
            try {
              const detailRes = await getPokemonByIdOrName(p.name);
              const pokemonData = detailRes.data;
              // Sprite logic: dream_world > home > front_default
              const sprite =
                pokemonData.sprites.other.dream_world.front_default ||
                pokemonData.sprites.other.home.front_default ||
                pokemonData.sprites.front_default ||
                "";
              // Rarity
              let rarity = "regular";
              try {
                const speciesRes = await fetch(pokemonData.species.url);
                const species = await speciesRes.json();
                if (species.is_legendary) rarity = "legendary";
                if (species.is_mythical) rarity = "mythical";
              } catch (err) {
                console.error("Error fetching species:", err);
              }
              const pokemon = {
                ...pokemonData,
                sprite,
                rarity,
              };
              return pokemon;
            } catch (err) {
              console.error("Failed to fetch details for:", p.name, err);
              return null;
            }
          })
        );
        // Deduplicate by id
        const filtered = details.filter(Boolean) as Pokemon[];
        const unique = Array.from(
          new Map(filtered.map((p) => [p.id, p])).values()
        );
        regionCache.current[region] = unique;
        setPokemonList(unique);
        // Debug: log after fetch
        console.debug(
          `[PokemonContext] ${region} loaded:`,
          unique.length,
          unique.slice(0, 5).map((p) => p?.name)
        );
      } catch (err: any) {
        setError(err.message || "Failed to fetch Pokémon list");
      } finally {
        setLoading(false);
      }
    },
    [currentRegion]
  );

  const fetchPokemonDetail = async (idOrName: number | string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getPokemonByIdOrName(idOrName);
      setCurrentPokemon(res.data as PokemonDetail);
    } catch (err: any) {
      setError(err.message || "Failed to fetch Pokémon details");
    } finally {
      setLoading(false);
    }
  };

  // Refetch when region changes
  React.useEffect(() => {
    fetchPokemonList(currentRegion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentRegion]);

  // Background prefetching for All Regions
  React.useEffect(() => {
    if (
      currentRegion === "All Regions" &&
      allRegionsHasMore &&
      pokemonList.length > 0
    ) {
      const timeout = setTimeout(() => {
        fetchNextAllRegionsPage();
      }, 3000); // 3 seconds delay between batches
      return () => clearTimeout(timeout);
    }
  }, [pokemonList.length, currentRegion, allRegionsHasMore]);

  return (
    <PokemonContext.Provider
      value={{
        pokemonList,
        currentPokemon,
        loading,
        error,
        currentRegion,
        setCurrentRegion,
        regions,
        setCurrentPokemon,
        fetchPokemonList,
        fetchPokemonDetail,
        fetchNextAllRegionsPage,
        allRegionsHasMore,
      }}
    >
      {children}
    </PokemonContext.Provider>
  );
};

const usePokemonContext = () => {
  const ctx = React.useContext(PokemonContext);
  if (!ctx)
    throw new Error("usePokemonContext must be used within a PokemonProvider");
  return ctx;
};

export { usePokemonContext };
