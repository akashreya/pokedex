import { usePokemonContext } from "@/context/PokemonContext";
import { Slider } from "antd";
import { TYPE_COLORS } from "@/constants/PokemonTypes";
import { Search, ChevronDown, ChevronUp, Heart } from "lucide-react";
import { useState } from "react";

const ALL_TYPES = Object.keys(TYPE_COLORS);

export default function FilterSidebar({
  selectedTypes,
  setSelectedTypes,
  filterRarity,
  setFilterRarity,
  filterEvolution,
  setFilterEvolution,
  searchTerm,
  setSearchTerm,
  heightRange,
  setHeightRange,
  weightRange,
  setWeightRange,
  clearFilters,
  showFavoritesOnly,
  setShowFavoritesOnly,
}) {
  const { regions, currentRegion, setCurrentRegion } = usePokemonContext();
  
  // Collapsible sections state
  const [collapsedSections, setCollapsedSections] = useState({
    types: false,
    region: false,
    rarity: false,
    evolution: false,
    height: false,
    weight: false,
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  return (
    <aside className="filter-bar">
      <div className="filter-content">
        <div className="search">
          <label className="block font-semibold mb-1">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-700 dark:text-gray-300" />
            <input
              type="text"
              className="search-input"
              placeholder="Search Pokemon... (typos OK!)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="filter-section">
          <button 
            className="filter-section-header"
            onClick={() => toggleSection('types')}
          >
            <span className="font-semibold">Type</span>
            {collapsedSections.types ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.types && (
            <div className="filter-bar-types">
              {ALL_TYPES.map((type) => (
                <label key={type} className="filter-bar-type">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(type)}
                    onChange={() =>
                      setSelectedTypes((prev) =>
                        prev.includes(type)
                          ? prev.filter((t) => t !== type)
                          : [...prev, type]
                      )
                    }
                  />
                  <span className="capitalize">{type}</span>
                </label>
              ))}
            </div>
          )}
        </div>
        <div className="filter-section">
          <button 
            className="filter-section-header"
            onClick={() => toggleSection('region')}
          >
            <span className="font-semibold">Region</span>
            {collapsedSections.region ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.region && (
            <select
              className="filter-bar-regions mt-3"
              value={currentRegion}
              onChange={(e) => setCurrentRegion(e.target.value)}
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="filter-section">
          <button 
            className="filter-section-header"
            onClick={() => toggleSection('rarity')}
          >
            <span className="font-semibold">Rarity</span>
            {collapsedSections.rarity ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.rarity && (
            <select
              className="filter-bar-regions mt-3"
              value={filterRarity}
              onChange={(e) => setFilterRarity(e.target.value)}
            >
              <option value="all">All Rarities</option>
              <option value="regular">Regular</option>
              <option value="legendary">Legendary</option>
              <option value="mythical">Mythical</option>
            </select>
          )}
        </div>
        <div className="filter-section">
          <button 
            className="filter-section-header"
            onClick={() => toggleSection('evolution')}
          >
            <span className="font-semibold">Evolution Stage</span>
            {collapsedSections.evolution ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.evolution && (
            <select
              className="filter-bar-regions mt-3"
              value={filterEvolution}
              onChange={(e) => setFilterEvolution(e.target.value)}
            >
              <option value="all">All Stages</option>
              <option value="basic">Basic</option>
              <option value="stage1">Stage 1</option>
              <option value="stage2">Stage 2</option>
            </select>
          )}
        </div>
        <div className="filter-section">
          <button 
            className="filter-section-header"
            onClick={() => toggleSection('height')}
          >
            <span className="font-semibold">Height</span>
            {collapsedSections.height ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.height && (
            <div className="mt-2">
              <Slider
                range
                min={0}
                step={50}
                dots={true}
                max={300}
                value={heightRange}
                onChange={setHeightRange}
                trackStyle={[{ backgroundColor: "#047481" }]}
                handleStyle={[
                  { borderColor: "#047481", backgroundColor: "#fff" },
                  { borderColor: "#047481", backgroundColor: "#fff" },
                ]}
              />
              <div className="flex justify-between text-xs">
                <span>{heightRange[0]}</span>
                <span>{heightRange[1]}</span>
              </div>
            </div>
          )}
        </div>
        <div className="filter-section">
          <button 
            className="filter-section-header"
            onClick={() => toggleSection('weight')}
          >
            <span className="font-semibold">Weight</span>
            {collapsedSections.weight ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          {!collapsedSections.weight && (
            <div className="mt-2">
              <Slider
                range
                min={0}
                step={2000}
                dots={true}
                max={10000}
                value={weightRange}
                onChange={setWeightRange}
                trackStyle={[{ backgroundColor: "#047481" }]}
                handleStyle={[
                  { borderColor: "#047481", backgroundColor: "#fff" },
                  { borderColor: "#047481", backgroundColor: "#fff" },
                ]}
              />
              <div className="flex justify-between text-xs">
                <span>{weightRange[0]}</span>
                <span>{weightRange[1]}</span>
              </div>
            </div>
          )}
        </div>
        <div className="filter-section">
          <label className="flex items-center space-x-2 font-semibold cursor-pointer">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(e) => setShowFavoritesOnly(e.target.checked)}
              className="rounded"
            />
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
            <span>Show Favorites Only</span>
          </label>
        </div>
      </div>
      <div className="filter-footer">
        <button className="clear-filter" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>
    </aside>
  );
}
