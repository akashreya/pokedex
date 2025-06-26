import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useEvolutionPath } from "../../hooks/useEvolutionPath";
import {
  EvolutionLoading,
  EvolutionError,
  EvolutionSingleStage,
  EvolutionTree,
  EvolutionLinearPath,
  EvolutionMidBranch,
  EvolutionDefault,
} from "./evolution";
import {
  getSpriteUrl,
  validateEvolutionData,
} from "../../utils/evolutionUtils";

interface PokemonEvolutionProps {
  pokemon: {
    id: number;
    name: string;
    species: {
      url: string;
    };
    sprites: {
      other: {
        dream_world?: {
          front_default?: string;
        };
        home?: {
          front_default?: string;
        };
      };
      front_default: string;
    };
    forms?: Array<{
      name: string;
      url: string;
    }>;
  };
  sprites: {
    default: string;
  };
}

export default function PokemonEvolution({ pokemon }: PokemonEvolutionProps) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Use the evolution path hook
  const { data: evolutionPath, loading, error } = useEvolutionPath(pokemon.id);

  // Enhanced error handling and data validation
  useEffect(() => {
    if (error) {
      setHasError(true);
      setErrorMessage(
        "Failed to load evolution data. Please try refreshing the page."
      );
    } else if (evolutionPath && !validateEvolutionData(evolutionPath)) {
      setHasError(true);
      setErrorMessage("Evolution data is incomplete or corrupted.");
    } else {
      setHasError(false);
      setErrorMessage("");
    }
  }, [error, evolutionPath]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className="bg-white/20 rounded-2xl p-6 mb-8 shadow-inner overflow-visible"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-800 tracking-wide">
        Evolution
      </h2>

      {loading && <EvolutionLoading />}

      {!loading && (hasError || error) && (
        <EvolutionError errorMessage={errorMessage} />
      )}

      {/* If no evolution path or single-stage Pokémon */}
      {!loading &&
        (!evolutionPath ||
          (evolutionPath.previous.length === 0 &&
            evolutionPath.next.length === 0)) && (
          <EvolutionSingleStage evolutionPath={evolutionPath} />
        )}

      {/* Render: complete-tree (base form) */}
      {!loading &&
        evolutionPath?.resultType === "complete-tree" &&
        evolutionPath.evolutionTree && (
          <EvolutionTree
            evolutionTree={evolutionPath.evolutionTree}
            pokemonName={pokemon.name}
            getSpriteUrl={getSpriteUrl}
          />
        )}

      {/* Render: linear-path (final evolution) */}
      {!loading &&
        evolutionPath?.resultType === "linear-path" &&
        evolutionPath.evolutionPath &&
        evolutionPath.evolutionPath.length > 0 && (
          <EvolutionLinearPath
            evolutionPath={evolutionPath.evolutionPath}
            pokemonName={pokemon.name}
            getSpriteUrl={getSpriteUrl}
            evolutionDetails={evolutionPath.evolutionDetails ?? []}
          />
        )}

      {/* Render: mid-evolution (branching) */}
      {!loading && evolutionPath?.resultType === "mid-evolution" && (
        <EvolutionMidBranch
          evolutionPath={evolutionPath}
          pokemonName={pokemon.name}
          getSpriteUrl={getSpriteUrl}
        />
      )}

      {/* Default fallback rendering */}
      {!loading &&
        evolutionPath &&
        evolutionPath.previous.length > 0 &&
        evolutionPath.next.length > 0 &&
        !evolutionPath.resultType && (
          <EvolutionDefault
            evolutionPath={evolutionPath}
            pokemonName={pokemon.name}
            getSpriteUrl={getSpriteUrl}
            evolutionDetails={evolutionPath.evolutionDetails
              ?.map((evo) => evo.details[0])
              .filter(Boolean)}
          />
        )}
    </motion.div>
  );
}
