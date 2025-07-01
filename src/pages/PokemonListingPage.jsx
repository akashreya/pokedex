import { useState, useMemo, useEffect, useRef } from "react";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import { usePokemons } from "@/hooks/usePokemons";
import { usePokemonContext } from "@/context/PokemonContext";
import SortControls from "../components/pokemonlist/SortControls";
import PaginationControls from "../components/pokemonlist/PaginationControls";
import FilterSidebar from "../components/pokemonlist/FilterSidebar";
import ToggleSwitch from "../components/ui/ToggleSwitch";
import PokemonGridLayout from "../components/pokemonlist/PokemonGridLayout";
import PokemonListLayout from "../components/pokemonlist/PokemonListLayout";

const ALL_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

export default function PokemonListing() {
  // Read persisted state from localStorage (with fallback)
  function getPersistedState() {
    let persisted = {};
    try {
      persisted = {
        currentPage: Number(localStorage.getItem("pokemonPage")) || 1,
        sortBy: localStorage.getItem("pokemonSort") || "id-asc",
        selectedTypes: JSON.parse(localStorage.getItem("pokemonTypes")) || [],
        filterRarity: localStorage.getItem("pokemonRarity") || "all",
        searchTerm: localStorage.getItem("pokemonSearch") || "",
        heightRange: JSON.parse(localStorage.getItem("pokemonHeightRange")) || [
          0, 300,
        ],
        weightRange: JSON.parse(localStorage.getItem("pokemonWeightRange")) || [
          0, 10000,
        ],
        viewMode: localStorage.getItem("pokemonViewMode") || "grid",
      };
    } catch (e) {
      // fallback to defaults if error
      persisted = {
        currentPage: 1,
        sortBy: "id-asc",
        selectedTypes: [],
        filterRarity: "all",
        searchTerm: "",
        heightRange: [0, 300],
        weightRange: [0, 10000],
        viewMode: "grid",
      };
    }
    return persisted;
  }

  const persisted = getPersistedState();

  // Filter/sort state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState(persisted.selectedTypes);
  const [filterRarity, setFilterRarity] = useState(persisted.filterRarity);
  const [sortBy, setSortBy] = useState(persisted.sortBy);
  const [viewMode, setViewMode] = useState(persisted.viewMode);
  const [searchTerm, setSearchTerm] = useState(persisted.searchTerm);
  const [debouncedSearch, setDebouncedSearch] = useState(persisted.searchTerm);
  const [heightRange, setHeightRange] = useState(persisted.heightRange);
  const [weightRange, setWeightRange] = useState(persisted.weightRange);
  const [currentPage, setCurrentPage] = useState(persisted.currentPage);
  const gridItemsPerPage = 10;
  const listItemsPerPage = 50;

  // Ref for header
  const mainRef = useRef(null);

  // Use context and hook
  const {
    pokemonList,
    loading: contextLoading,
    error: contextError,
    fetchPokemonList,
    currentRegion,
    setCurrentRegion,
  } = usePokemonContext();
  const {
    data: pagedData,
    loading: hookLoading,
    error: hookError,
  } = usePokemons();

  // Restore state from location.state if coming from detail page
  useEffect(() => {
    if (location.state && location.state.fromDetail) {
      if (location.state.pokemonPage)
        setCurrentPage(Number(location.state.pokemonPage));
      if (location.state.pokemonSort) setSortBy(location.state.pokemonSort);
      if (location.state.pokemonTypes)
        setSelectedTypes(JSON.parse(location.state.pokemonTypes));
      if (location.state.pokemonRarity)
        setFilterRarity(location.state.pokemonRarity);
      if (location.state.pokemonSearch) {
        setSearchTerm(location.state.pokemonSearch);
        setDebouncedSearch(location.state.pokemonSearch);
      }
      if (location.state.pokemonHeightRange)
        setHeightRange(JSON.parse(location.state.pokemonHeightRange));
      if (location.state.pokemonWeightRange)
        setWeightRange(JSON.parse(location.state.pokemonWeightRange));
      if (location.state.pokemonViewMode)
        setViewMode(location.state.pokemonViewMode);
      if (location.state.pokemonRegion)
        setCurrentRegion(location.state.pokemonRegion);
    }

    // eslint-disable-next-line
  }, []);

  // Reset page when filters or view mode change, but not on initial restoration
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedTypes,
    filterRarity,
    heightRange,
    weightRange,
    sortBy,
    viewMode,
    debouncedSearch,
    currentRegion,
  ]);

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Prefer context, fallback to pagedData
  const allPokemon = useMemo(() => {
    if (pokemonList && pokemonList.length > 0) return pokemonList;
    if (pagedData && pagedData.results) {
      return pagedData.results.map((p, idx) => ({
        id: idx + 1,
        name: p.name,
        types: [],
        sprite:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/" +
          (idx + 1) +
          ".svg",
        rarity: "regular",
        height: 0,
        weight: 0,
        abilities: [],
      }));
    }
    return [];
  }, [pokemonList, pagedData]);

  const loading = contextLoading || hookLoading;
  const error = contextError || hookError;

  // Filtering and sorting
  const filtered = useMemo(() => {
    let list = [...allPokemon];
    if (debouncedSearch) {
      const term = debouncedSearch.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(term) || p.id.toString() === term
      );
    }
    if (selectedTypes.length > 0)
      list = list.filter((p) =>
        p.types?.some((t) => selectedTypes.includes(t.type.name))
      );
    if (filterRarity !== "all")
      list = list.filter((p) => p.rarity === filterRarity);
    list = list.filter(
      (p) =>
        !p.height || (p.height >= heightRange[0] && p.height <= heightRange[1])
    );
    list = list.filter(
      (p) =>
        !p.weight || (p.weight >= weightRange[0] && p.weight <= weightRange[1])
    );
    if (sortBy === "id-asc") list.sort((a, b) => a.id - b.id);
    if (sortBy === "id-desc") list.sort((a, b) => b.id - a.id);
    if (sortBy === "name-asc")
      list.sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "name-desc")
      list.sort((a, b) => b.name.localeCompare(a.name));
    return list;
  }, [
    allPokemon,
    debouncedSearch,
    selectedTypes,
    filterRarity,
    heightRange,
    weightRange,
    sortBy,
  ]);

  // Calculate items per page based on view mode
  const itemsPerPage = useMemo(() => {
    return viewMode === "grid" ? gridItemsPerPage : listItemsPerPage;
  }, [viewMode]);

  // Pagination logic
  const paginatedPokemon = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filtered.length / itemsPerPage);
  }, [filtered.length, itemsPerPage]);

  // Clear filters
  function clearFilters() {
    setSelectedTypes([]);
    setFilterRarity("all");
    setSearchTerm("");
    setHeightRange([0, 300]);
    setWeightRange([0, 10000]);
  }

  // Persist state to localStorage on change
  useEffect(() => {
    localStorage.setItem("pokemonTypes", JSON.stringify(selectedTypes));
  }, [selectedTypes]);
  useEffect(() => {
    localStorage.setItem("pokemonRarity", filterRarity);
  }, [filterRarity]);
  useEffect(() => {
    localStorage.setItem("pokemonSort", sortBy);
  }, [sortBy]);
  useEffect(() => {
    localStorage.setItem("pokemonViewMode", viewMode);
  }, [viewMode]);
  useEffect(() => {
    localStorage.setItem("pokemonSearch", searchTerm);
  }, [searchTerm]);
  useEffect(() => {
    localStorage.setItem("pokemonHeightRange", JSON.stringify(heightRange));
  }, [heightRange]);
  useEffect(() => {
    localStorage.setItem("pokemonWeightRange", JSON.stringify(weightRange));
  }, [weightRange]);
  useEffect(() => {
    localStorage.setItem("pokemonPage", currentPage);
  }, [currentPage]);

  // Scroll to top when pagination changes
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [currentPage]);

  return (
    <section className="pokemonlisting-section">
      {/* Header */}
      <header className="listing-header" ref={mainRef}>
        <img src="/Pokémon_logo.svg" alt="Pokemon Logo" />
        <div className="list-toggler">
          <ToggleSwitch
            checked={viewMode === "list"}
            onChange={(checked) => setViewMode(checked ? "list" : "grid")}
            leftLabel="Grid"
            rightLabel="List"
          />
        </div>
      </header>

      {/* Main content area including sidebar and list */}
      <main className="list-main">
        {/* Sidebar: always visible on desktop, overlay on mobile */}
        <aside
          className={`md:block fixed md:relative top-15 left-0 h-3/4 w-72 z-50 md:z-auto ${
            sidebarOpen ? "block" : "hidden"
          }`}
        >
          <FilterSidebar
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            filterRarity={filterRarity}
            setFilterRarity={setFilterRarity}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            heightRange={heightRange}
            setHeightRange={setHeightRange}
            weightRange={weightRange}
            setWeightRange={setWeightRange}
            clearFilters={clearFilters}
            onClose={() => setSidebarOpen(false)}
          />
        </aside>

        {/* Mobile backdrop overlay */}
        {sidebarOpen && (
          <div
            className="list-sidebar-mobile"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* List Area */}
        <div className="list-area">
          <div className="list-hamburger-sort-panel">
            {/* Mobile Filter Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open filters"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16"
                />
              </svg>
            </button>
            <div className="list-sort-controls">
              <SortControls sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          </div>

          <div>
            {loading ? (
              <div className="list-loading">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="list-error">
                <p>Error loading Pokémon</p>
                <button onClick={() => fetchPokemonList()}>Retry</button>
              </div>
            ) : (
              <>
                {viewMode === "grid" ? (
                  <PokemonGridLayout paginatedPokemon={paginatedPokemon} />
                ) : (
                  <PokemonListLayout paginatedPokemon={paginatedPokemon} />
                )}
              </>
            )}
          </div>

          {totalPages >= 1 && !loading && !error && (
            <div className="list-pagination-panel">
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </main>
    </section>
  );
}
