import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { getPokemonByIdOrName } from "../services/pokedexapi";
import LoadingSpinner from "../components/layout/LoadingSpinner.tsx";
import { motion, AnimatePresence } from "framer-motion";
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
import Carousel from "../components/ui/Carousel";

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
  const navigationByButtonRef = useRef(false);
  const [showSpinner, setShowSpinner] = useState(false);

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
        if (!navigationByButtonRef.current) {
          setDirection(0);
        }
        navigationByButtonRef.current = false;
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

  // Delayed spinner effect
  useEffect(() => {
    let spinnerTimeout: ReturnType<typeof setTimeout> | null = null;
    if (loading) {
      spinnerTimeout = setTimeout(() => setShowSpinner(true), 300); // 300ms delay
    } else {
      setShowSpinner(false);
    }
    return () => {
      if (spinnerTimeout) clearTimeout(spinnerTimeout);
    };
  }, [loading]);

  // After all hooks, handle early returns:
  if (loading && showSpinner)
    return (
      <div className="loading">
        <LoadingSpinner />
      </div>
    );
  if (error) return <div className="loading-error">{error}</div>;
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
      x: direction === 0 ? 0 : direction > 0 ? "100%" : "-100%",
      opacity: 0,
      scale: 0.5,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction === 0 ? 0 : direction > 0 ? "-100%" : "100%",
      opacity: 0,
      scale: 0.5,
    }),
  };

  const goToPrevious = () => {
    navigationByButtonRef.current = true;
    setDirection(-1);
    if (pokemon.id > 1) {
      navigate(`/pokemon/${pokemon.id - 1}`);
    }
  };
  const goToNext = () => {
    navigationByButtonRef.current = true;
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
      <div className="pokemon-detail-container">
        <div className="pokemon-detail-header-row">
          <div className="pokemon-detail-breadcrumb">
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
          <div className="pokemon-detail-searchbar">
            <SearchBar />
          </div>
        </div>

        {/* Floating Navigation Arrows */}
        <button
          onClick={goToPrevious}
          disabled={pokemon.id <= 1}
          aria-label="Previous Pokémon"
          className={`pokemon-detail-left-arrow-button
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
            className="pokemon-detail-arrow-img"
          />
        </button>
        <button
          onClick={goToNext}
          disabled={pokemon.id >= 1025}
          aria-label="Next Pokémon"
          className={`pokemon-detail-right-arrow-button
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
            className="pokemon-detail-arrow-img"
          />
        </button>
        <AnimatePresence mode="wait">
          <motion.div
            key={pokemon.id}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "spring",
              duration: 0.2,
              visualDuration: 0.9,
              ease: "easeInOut",
            }}
            className={`pokemon-detail-background ${getGradientClass(
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
              <Carousel
                items={Object.entries(spritesWithDefaults)}
                renderItem={([key, url]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSprite(key)}
                    className={`p-2 rounded-2xl transition-all ${
                      selectedSprite === key
                        ? "bg-white/20 scale-110"
                        : "bg-white/10 hover:bg-white/15"
                    }`}
                    title={key === "default" ? "Default" : key}
                  >
                    <img
                      src={url}
                      alt={key === "default" ? "Default" : key}
                      className="w-15 h-15 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  </button>
                )}
                className="pokemon-detail-sprite-gallery mb-6"
                showNavButtons={true}
                showDotIndicators={true}
                autoPlay={false}
              />
            )}

            {/* Tabbed Interface */}
            <div className="mb-3">
              <TabList
                tabs={TAB_ITEMS.map((id) => ({ id }))}
                selectedTab={selectedTab}
                onTabChange={setSelectedTab}
              />
              <div className="pokemon-detail-tab-content">
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
        </AnimatePresence>
      </div>
    </div>
  );
}
