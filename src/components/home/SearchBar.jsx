import React, { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { POKEMON } from "@/constants/Pokemon";

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Flatten POKEMON list to include all forms as individual entries
const FLATTENED_POKEMON = POKEMON.flatMap((p) =>
  Array.isArray(p.value)
    ? p.value.map((name) => ({ id: p.id, name }))
    : [{ id: p.id, name: p.value }]
);

export default function SearchBar({ onSelect, placeholder = "Search Pokémon by name..." }) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [open, setOpen] = useState(false);
  const inputRef = useRef();
  const listRef = useRef();

  // Filter suggestions based on query
  const filtered = query
    ? FLATTENED_POKEMON.map((p) => p.name.toLowerCase())
        .filter((name) => name.includes(query.toLowerCase()))
        .slice(0, 8)
    : [];

  // Debounced input handler
  const handleInput = debounce((val) => {
    setQuery(val);
    setOpen(!!val);
    setActiveIndex(-1);
  }, 200);

  const handleChange = (e) => {
    handleInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      setActiveIndex((i) => (i + 1) % filtered.length);
    } else if (e.key === "ArrowUp") {
      setActiveIndex((i) => (i - 1 + filtered.length) % filtered.length);
    } else if (e.key === "Enter" && activeIndex >= 0) {
      if (onSelect) onSelect(filtered[activeIndex]);
      setOpen(false);
      setQuery("");
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleSuggestionClick = (name) => {
    if (onSelect) onSelect(name);
    setOpen(false);
    setQuery("");
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative w-full max-w-xl mb-8">
      <div className="relative" ref={inputRef}>
        <Input
          type="text"
          value={query}
          placeholder={placeholder}
          className="w-full pl-2 rounded-2xl"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setOpen(!!query)}
          autoComplete="off"
        />
      </div>
      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-lg max-h-60 overflow-auto"
        >
          {filtered.map((name, i) => (
            <li
              key={name}
              className={`px-4 py-2 cursor-pointer select-none text-left ${
                i === activeIndex ? "bg-lime-100 dark:bg-lime-800" : ""
              }`}
              onMouseDown={() => handleSuggestionClick(name)}
              onMouseEnter={() => setActiveIndex(i)}
            >
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </li>
          ))}
        </ul>
      )}
      {open && filtered.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg p-4 text-center text-gray-400">
          No results found.
        </div>
      )}
    </div>
  );
}
