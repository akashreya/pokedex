import { ChevronUp, ChevronDown } from "lucide-react";

export default function SortControls({ sortBy, onSortChange }) {
  const options = [
    { value: "id-asc", label: "ID (Low to High)" },
    { value: "id-desc", label: "ID (High to Low)" },
    { value: "name-asc", label: "Name (A-Z)" },
    { value: "name-desc", label: "Name (Z-A)" },
    { value: "height-asc", label: "Height (Shortest)" },
    { value: "height-desc", label: "Height (Tallest)" },
    { value: "weight-asc", label: "Weight (Lightest)" },
    { value: "weight-desc", label: "Weight (Heaviest)" },
  ];

  const getSortIcon = (option) => {
    if (sortBy === option) {
      return sortBy.endsWith("asc") ? (
        <ChevronUp className="w-4 h-4" />
      ) : (
        <ChevronDown className="w-4 h-4" />
      );
    }
    return null;
  };

  return (
    <div className="sort-control">
      <label htmlFor="sort-select" className="font-semibold">
        Sort by:
      </label>
      <select
        id="sort-select"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {getSortIcon(sortBy)}
    </div>
  );
}
