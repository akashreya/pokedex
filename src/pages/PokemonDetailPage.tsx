import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getPokemonByIdOrName } from "../services/pokedexapi";
import LoadingSpinner from "../components/layout/LoadingSpinner.tsx";
import { motion } from "framer-motion";
import { getGradientClass } from "../utils/pokemonUtils";
import PokemonStats from "../components/pokemon/PokemonStats";
import PokemonMoves from "../components/pokemon/PokemonMoves";
import PokemonEvolution from "../components/pokemon/PokemonEvolution";
import PokemonAbout from "../components/pokemon/PokemonAbout";
import TypeEffectiveness from "../components/pokemon/TypeEffectiveness";
import TypeResistance from "../components/pokemon/TypeResistance";
import TabList from "../components/ui/TabList";
import Breadcrumb from "../components/ui/Breadcrumb";
import PokemonHeader from "../components/pokemon/PokemonHeader";
import { usePokemonSpecies } from "../hooks/usePokemonSpecies";
import { useMultiplePokemon } from "../hooks/useMultiplePokemon";
import SearchBar from "../components/home/SearchBar.jsx";

export default function PokemonDetailPage() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSprite, setSelectedSprite] = useState<string>("default");
  const [selectedTab, setSelectedTab] = useState("about");
  const navigate = useNavigate();
  const [direction, setDirection] = useState(0);
  const isFirstRender = useRef(true);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  // Tab configuration
  const TAB_ITEMS = ["about", "stats", "moves", "evolution"];

  // Fetch Pokémon and species (to get evolution chain ID)
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    getPokemonByIdOrName(id)
      .then(async (res) => {
        setPokemon(res.data);
      })
      .catch(() => setError("Pokémon not found."))
      .finally(() => setLoading(false));
  }, [id]);

  // Get species data for the current Pokémon (only after pokemon is loaded)
  const speciesUrl = pokemon?.species?.url || null;
  const { forms } = usePokemonSpecies(speciesUrl);

  // Extract variety IDs for non-default forms
  const varietyIds = forms
    .filter((form) => !form.isDefault)
    .map((form) => {
      // Extract ID from URL like "https://pokeapi.co/api/v2/pokemon/6/"
      const match = form.url.match(/\/(\d+)\/?$/);
      return match ? parseInt(match[1]) : null;
    })
    .filter((id) => id !== null) as number[];

  // Fetch alternate forms data
  const alternateForms = useMultiplePokemon(varietyIds);

  // On first render, don't animate in from side
  useEffect(() => {
    if (isFirstRender.current) {
      setDirection(0);
      isFirstRender.current = false;
    }
  }, [pokemon?.id]);

  // Keyboard navigation: left/right arrows and Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        goToNext();
      } else if (e.key === "Escape") {
        navigate("/pokemon");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pokemon, navigate]);

  // Swipe handlers
  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }
  function handleTouchMove(e: React.TouchEvent) {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  }
  function handleTouchEnd() {
    if (
      touchStartX.current !== null &&
      touchEndX.current !== null &&
      touchStartY.current !== null &&
      touchEndY.current !== null
    ) {
      const dx = touchEndX.current - touchStartX.current;
      const dy = touchEndY.current - touchStartY.current;
      if (Math.abs(dx) > 60 && Math.abs(Math.abs(dx)) > Math.abs(dy) * 1.5) {
        if (dx < 0 && pokemon.id < 1010) {
          goToNext();
        } else if (dx > 0 && pokemon.id > 1) {
          goToPrevious();
        }
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
  }

  // Reset tab and sprite when new Pokémon is loaded
  useEffect(() => {
    setSelectedTab("about");
    setSelectedSprite("default");
  }, [pokemon?.id]);

  // After all hooks, handle early returns:
  if (loading)
    return (
      <div className="loading">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return <div className="py-8 text-center text-red-500">{error}</div>;
  if (!pokemon) return null;

  const type1 = pokemon.types[0].type.name;
  const type2 = pokemon.types[1]?.type.name || type1;

  // Build sprites object with default, shiny, and alternate forms
  const sprites: Record<string, string> = {
    default:
      pokemon.sprites.other.dream_world.front_default ||
      pokemon.sprites.other.home.front_default ||
      pokemon.sprites.front_default,
  };

  // Add alternate forms with their official artwork
  Object.values(alternateForms).forEach((form) => {
    if (
      form &&
      form.sprites &&
      form.sprites.other &&
      form.sprites.other["official-artwork"]
    ) {
      const formName = form.name;
      const officialArtwork =
        form.sprites.other["official-artwork"].front_default;
      if (officialArtwork && officialArtwork.trim() !== "") {
        sprites[formName] = officialArtwork;
      }
    }
  });

  // Filter out any entries with null/undefined values to ensure clean sprite gallery
  const filteredSprites: Record<string, string> = {};
  Object.entries(sprites).forEach(([key, url]) => {
    if (url && url.trim() !== "") {
      filteredSprites[key] = url;
    }
  });

  // Ensure sprites object has required properties for components
  const spritesWithDefaults = {
    ...filteredSprites,
    default: filteredSprites.default || pokemon.sprites.front_default,
  };

  // Direction-aware variants
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const goToPrevious = () => {
    setDirection(-1);
    if (pokemon.id > 1) {
      navigate(`/pokemon/${pokemon.id - 1}`);
    }
  };
  const goToNext = () => {
    setDirection(1);
    if (pokemon.id < 1010) {
      navigate(`/pokemon/${pokemon.id + 1}`);
    }
  };

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center">
          <div className="flex-shrink-0">
            <Breadcrumb
              items={[
                { label: "Home", to: "/" },
                {
                  label: "Pokémon",
                  to: "/pokemon",
                  state: {
                    fromDetail: true,
                    pokemonPage: localStorage.getItem("pokemonPage"),
                    pokemonSort: localStorage.getItem("pokemonSort"),
                    pokemonTypes: localStorage.getItem("pokemonTypes"),
                    pokemonRarity: localStorage.getItem("pokemonRarity"),
                    pokemonSearch: localStorage.getItem("pokemonSearch"),
                    pokemonHeightRange:
                      localStorage.getItem("pokemonHeightRange"),
                    pokemonWeightRange:
                      localStorage.getItem("pokemonWeightRange"),
                    pokemonViewMode: localStorage.getItem("pokemonViewMode"),
                  },
                },
                { label: pokemon.name, isCurrent: true },
              ]}
            />
          </div>
          <div className="w-60 mt-4">
            <SearchBar />
          </div>
        </div>

        {/* Floating Navigation Arrows */}
        <button
          onClick={goToPrevious}
          disabled={pokemon.id <= 1}
          aria-label="Previous Pokémon"
          className={`hidden md:flex items-center justify-center absolute 
          left-50 top-1/2 -translate-y-1/2 z-20 w-70 h-70 rounded-full
           bg-transparent font-bold transition-all duration-200
            ${
              pokemon.id <= 1
                ? "opacity-40 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          style={{ transform: "translateY(-50%) translateX(-50%)" }}
        >
          <img
            src="/left-arrow.svg"
            alt="Previous"
            className="w-40 h-40 transition-all duration-200 hover:scale-150"
          />
        </button>
        <button
          onClick={goToNext}
          disabled={pokemon.id >= 1025}
          aria-label="Next Pokémon"
          className={`hidden md:flex items-center justify-center absolute right-50 top-1/2 -translate-y-1/2 
          z-20 w-70 h-70 rounded-full font-bold transition-all duration-200
          ${
            pokemon.id >= 1025
              ? "opacity-40 cursor-not-allowed"
              : "cursor-pointer"
          }`}
          style={{ transform: "translateY(-50%) translateX(50%)" }}
        >
          <img
            src="/right-arrow.svg"
            alt="Next"
            className="w-40 h-40 transition-all duration-200 hover:scale-150"
          />
        </button>
        <motion.div
          key={pokemon.id}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: "tween", duration: 0.7, ease: "easeInOut" }}
          className={`rounded-4xl shadow-lg p-8 bg-gradient-to-r ${getGradientClass(
            type1,
            type2
          )}`}
        >
          <PokemonHeader
            pokemon={pokemon}
            selectedSprite={selectedSprite}
            sprites={spritesWithDefaults}
          />

          {/* Sprite Gallery */}
          {Object.keys(spritesWithDefaults).length > 1 && (
            <div className="flex justify-center gap-4 mb-8">
              {Object.entries(spritesWithDefaults)
                .filter(
                  ([_, url]) =>
                    url &&
                    url.trim() !== "" &&
                    url !== "null" &&
                    url !== "undefined"
                )
                .map(([key, url]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSprite(key)}
                    className={`p-2 rounded-2xl transition-all ${
                      selectedSprite === key
                        ? "bg-white/20 scale-110"
                        : "bg-white/10 hover:bg-white/15"
                    }`}
                    title={`${pokemon.name} ${
                      key === "default" ? "Default" : key
                    }`}
                  >
                    <img
                      src={url}
                      alt={`${pokemon.name} ${
                        key === "default" ? "Default" : key
                      }`}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        console.warn(`Failed to load sprite for ${key}:`, url);
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </button>
                ))}
            </div>
          )}

          {/* Tabbed Interface */}
          <div className="mb-8">
            <TabList
              tabs={TAB_ITEMS.map((id) => ({ id }))}
              selectedTab={selectedTab}
              onTabChange={setSelectedTab}
            />
            <div className="bg-white/10 rounded-2xl p-6">
              {(() => {
                const tabContent = {
                  about: (
                    <div>
                      <PokemonAbout pokemon={pokemon} />
                      <TypeEffectiveness pokemonTypes={pokemon.types} />
                      <TypeResistance pokemonTypes={pokemon.types} />
                    </div>
                  ),
                  stats: <PokemonStats stats={pokemon.stats} />,
                  moves: <PokemonMoves moves={pokemon.moves} />,
                  evolution: (
                    <PokemonEvolution
                      pokemon={pokemon}
                      sprites={spritesWithDefaults}
                    />
                  ),
                };
                return tabContent[selectedTab as keyof typeof tabContent];
              })()}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
