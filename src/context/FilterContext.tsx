import * as React from "react";

export type SortOrder = "id-asc" | "id-desc" | "name-asc" | "name-desc";

export interface FilterOptions {
  type: string;
  name: string;
  region: string;
  rarity: string;
  sortOrder: SortOrder;
}

interface FilterContextType extends FilterOptions {
  setType: (type: string) => void;
  setName: (name: string) => void;
  setRegion: (region: string) => void;
  setRarity: (rarity: string) => void;
  setSortOrder: (order: SortOrder) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterOptions = {
  type: "",
  name: "",
  region: "",
  rarity: "",
  sortOrder: "id-asc",
};

const FilterContext = React.createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [type, setType] = React.useState<string>(defaultFilters.type);
  const [name, setName] = React.useState<string>(defaultFilters.name);
  const [region, setRegion] = React.useState<string>(defaultFilters.region);
  const [rarity, setRarity] = React.useState<string>(defaultFilters.rarity);
  const [sortOrder, setSortOrder] = React.useState<SortOrder>(defaultFilters.sortOrder);

  const resetFilters = () => {
    setType("");
    setName("");
    setRegion("");
    setRarity("");
    setSortOrder("id-asc");
  };

  return (
    <FilterContext.Provider
      value={{
        type,
        name,
        region,
        rarity,
        sortOrder,
        setType,
        setName,
        setRegion,
        setRarity,
        setSortOrder,
        resetFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export function useFilters() {
  const ctx = React.useContext(FilterContext);
  if (!ctx) throw new Error("useFilters must be used within a FilterProvider");
  return ctx;
} 