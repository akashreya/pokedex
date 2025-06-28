import { usePokemonContext } from "@/context/PokemonContext";
import { Slider } from "antd";
import "antd/dist/reset.css";
import { TYPE_COLORS } from "@/constants/PokemonTypes";

const ALL_TYPES = Object.keys(TYPE_COLORS);

export default function FilterSidebar({
  selectedTypes,
  setSelectedTypes,
  filterRarity,
  setFilterRarity,
  searchTerm,
  setSearchTerm,
  heightRange,
  setHeightRange,
  weightRange,
  setWeightRange,
  clearFilters,
}) {
  const { regions, currentRegion, setCurrentRegion } = usePokemonContext();
  return (
    <aside className="filter-bar">
      <div className="title">
        <label>Search</label>
        <input
          type="text"
          className="w-full border rounded-2xl px-2 py-1 border-black"
          placeholder="Name or ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Type</label>
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
      </div>
      <div>
        <label className="block font-semibold mb-1">Region</label>
        <select
          className="filter-bar-regions"
          value={currentRegion}
          onChange={(e) => setCurrentRegion(e.target.value)}
        >
          {regions.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Rarity</label>
        <select
          className="filter-bar-regions"
          value={filterRarity}
          onChange={(e) => setFilterRarity(e.target.value)}
        >
          <option value="all">All Rarities</option>
          <option value="regular">Regular</option>
          <option value="legendary">Legendary</option>
          <option value="mythical">Mythical</option>
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1">Height</label>
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
      <div>
        <label className="block font-semibold mb-1">Weight</label>
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
      <button className="clear-filter" onClick={clearFilters}>
        Clear Filters
      </button>
    </aside>
  );
}
