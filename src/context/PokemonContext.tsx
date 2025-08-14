import * as React from "react";
import { Pokedex } from "pokeapi-js-wrapper";
import { Pokemon } from "../services/pokedexapi";

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

// Initialize PokeAPI wrapper with caching enabled
const P = new Pokedex({
  cache: true,
  timeout: 5000,
  cacheImages: true,
});

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
  
  // All Regions progressive loading
  const [allRegionsHasMore, setAllRegionsHasMore] = React.useState(true);
  const loadedPokemonIds = React.useRef<Set<number>>(new Set());

  // Helper to transform wrapper data to our Pokemon interface
  const transformPokemonData = async (pokemonData: any): Promise<Pokemon> => {
    // Sprite logic: dream_world > home > front_default
    const sprite =
      pokemonData.sprites?.other?.dream_world?.front_default ||
      pokemonData.sprites?.other?.home?.front_default ||
      pokemonData.sprites?.front_default ||
      "";
    
    // Rarity from species data
    let rarity = "regular";
    try {
      const species = await P.getPokemonSpeciesByName(pokemonData.name);
      if (species.is_legendary) rarity = "legendary";
      if (species.is_mythical) rarity = "mythical";
    } catch (error) {
      console.warn(`Failed to fetch species for ${pokemonData.name}:`, error);
    }
    
    return {
      ...pokemonData,
      sprite,
      rarity,
    };
  };

  // Fetch for All Regions (progressive loading)
  const fetchAllRegionsPage = async (offset: number, isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError(null);
    try {
      const limit = 50; // Batch size for progressive loading
      const maxPokemonId = 1025;
      
      // Check if we've already loaded beyond this offset
      const startId = offset + 1;
      const endId = Math.min(startId + limit - 1, maxPokemonId);
      
      if (startId > maxPokemonId) {
        setAllRegionsHasMore(false);
        if (!isBackground) setLoading(false);
        return;
      }
      
      // Fetch Pokemon in this range
      const pokemonPromises = [];
      for (let id = startId; id <= endId; id++) {
        if (!loadedPokemonIds.current.has(id)) {
          pokemonPromises.push(
            P.getPokemonByName(id.toString()).then(async (data) => {
              const pokemon = await transformPokemonData(data);
              loadedPokemonIds.current.add(id);
              return pokemon;
            }).catch(error => {
              console.warn(`Failed to fetch Pokemon ${id}:`, error);
              return null;
            })
          );
        }
      }
      
      if (pokemonPromises.length > 0) {
        const newPokemon = (await Promise.all(pokemonPromises)).filter(Boolean) as Pokemon[];
        
        setPokemonList((prev) => {
          const combined = [...prev, ...newPokemon];
          // Sort by ID and deduplicate
          const unique = Array.from(
            new Map(combined.map((p) => [p.id, p])).values()
          ).sort((a, b) => a.id - b.id);
          
          console.debug(
            "[PokemonContext] All Regions batch loaded:",
            unique.length,
            "total Pokemon"
          );
          return unique;
        });
      }
      
      // Check if we've reached the end
      if (endId >= maxPokemonId) {
        setAllRegionsHasMore(false);
      }
    } catch (err: any) {
      console.error("Error fetching All Regions:", err);
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
    loadedPokemonIds.current.clear();
  };

  // Main fetch function
  const fetchPokemonList = React.useCallback(
    async (region: string = currentRegion) => {
      setLoading(true);
      setError(null);
      setPokemonList([]); // Always clear list on new fetch
      console.debug("[PokemonContext] Fetching region:", region);
      
      if (region === "All Regions") {
        // Reset state for new all-regions fetch
        resetAllRegionsState();
        // Fetch first batch
        await fetchAllRegionsPage(0, false);
        return;
      } else {
        // Leaving All Regions: reset its state
        resetAllRegionsState();
      }
      
      try {
        const { offset, limit } = regionRanges[region] || regionRanges["Kanto"];
        
        // Fetch Pokemon list for the region using wrapper
        const pokemonPromises = [];
        for (let id = offset + 1; id <= offset + limit; id++) {
          pokemonPromises.push(
            P.getPokemonByName(id.toString()).then(transformPokemonData).catch(error => {
              console.warn(`Failed to fetch Pokemon ${id}:`, error);
              return null;
            })
          );
        }
        
        const pokemonData = (await Promise.all(pokemonPromises)).filter(Boolean) as Pokemon[];
        
        // Sort by ID
        const sortedPokemon = pokemonData.sort((a, b) => a.id - b.id);
        
        setPokemonList(sortedPokemon);
        console.debug(
          `[PokemonContext] ${region} loaded:`,
          sortedPokemon.length,
          "Pokemon"
        );
      } catch (err: any) {
        console.error("Error fetching region:", err);
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
      const pokemonData = await P.getPokemonByName(idOrName.toString());
      const transformedPokemon = await transformPokemonData(pokemonData);
      setCurrentPokemon(transformedPokemon as PokemonDetail);
    } catch (err: any) {
      console.error("Error fetching Pokemon detail:", err);
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
      pokemonList.length > 0 &&
      pokemonList.length < 1025
    ) {
      const timeout = setTimeout(() => {
        fetchNextAllRegionsPage();
      }, 2000); // 2 seconds delay between batches
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
