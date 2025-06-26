import { Fragment } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { EvolutionDescription, EvolutionArrow } from "./index";
import { EvolutionDetail } from "../../../utils/evolutionUtils";
import { useMultiplePokemon } from "../../../hooks/useMultiplePokemon";
import { getPokemonGradientClass } from "@/utils/pokemonUtils";
// @ts-ignore
import TypeLogoBadge from "../../ui/TypeLogoBadge";

interface PokemonType {
  type: {
    name: string;
  };
}

interface EvolutionDefaultProps {
  evolutionPath: {
    previous: string[];
    next: string[];
    evolutionMethods?: string[];
  };
  pokemonName: string;
  getSpriteUrl: (pokemonData: any, fallbackId?: string | number) => string;
  evolutionDetails?: EvolutionDetail[];
}

export default function EvolutionDefault({
  evolutionPath,
  pokemonName,
  getSpriteUrl,
  evolutionDetails,
}: EvolutionDefaultProps) {
  // Animation variants
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
      },
    },
  };

  // Get all Pokémon names from the evolution path
  const allPokemonNames = [
    ...evolutionPath.previous,
    pokemonName,
    ...evolutionPath.next,
  ];

  // Fetch all Pokémon data using the hook
  const pokemonCache = useMultiplePokemon(allPokemonNames);

  return (
    <div className="flex items-center justify-center gap-6 flex-wrap">
      {/* Previous Evolutions */}
      <AnimatePresence>
        {evolutionPath.previous.map((prevName, index) => {
          const pokemonData = pokemonCache[prevName];
          const isLoading = !pokemonData;

          return (
            <Fragment key={prevName}>
              {index > 0 && (
                <motion.span
                  className="text-3xl text-gray-400 mx-2"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                >
                  <EvolutionArrow />
                </motion.span>
              )}
              <motion.div
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to={`/pokemon/${prevName}`}
                  className="flex flex-col items-center group"
                >
                  <div className="relative">
                    <div className="w-50 h-50 rounded-full border-2 shadow-lg shadow-black">
                      {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        <img
                          src={getSpriteUrl(pokemonData)}
                          alt={prevName}
                          className="w-full h-full object-contain drop-shadow-md"
                        />
                      )}
                    </div>
                  </div>
                  <span className="capitalize font-semibold mt-5 group-hover:text-gray-800 transition-colors duration-200">
                    {prevName}
                  </span>
                </Link>
              </motion.div>
            </Fragment>
          );
        })}
      </AnimatePresence>

      {/* Arrow to current if there are previous evolutions */}
      {evolutionPath.previous.length > 0 && (
        <motion.span
          className="text-3xl text-gray-400 mx-2"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <EvolutionArrow />
        </motion.span>
      )}

      {/* Current Pokémon */}
      <motion.div
        className="flex flex-col items-center"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative">
          <div className="w-50 h-50 rounded-full border-2 shadow-lg shadow-black">
            {/* <img
              src={}
              alt={pokemonName}
              className="w-full h-full object-contain drop-shadow-lg"
            /> */}
          </div>
          <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-xl"></div>
        </div>
        <span className="capitalize text-blue-700 font-semibold mt-2 text-lg">
          {pokemonName}
        </span>
      </motion.div>

      {/* Next Evolutions */}
      <AnimatePresence>
        {evolutionPath.next.map((name, index) => {
          const pokemonData = pokemonCache[name];
          const isLoading = !pokemonData;

          // Get evolution detail for enhanced description
          const evolutionDetail = evolutionDetails?.[index];
          const gradientClass = getPokemonGradientClass(pokemonData);

          return (
            <Fragment key={name}>
              <motion.span
                className="text-3xl text-gray-400 mx-2"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <EvolutionArrow />
              </motion.span>
              <motion.div
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to={`/pokemon/${name}`}
                  className="flex flex-col items-center group"
                >
                  <div className="relative">
                    <div
                      className={`w-50 h-50 rounded-full bg-gradient-to-r ${gradientClass} shadow-lg shadow-black`}
                    >
                      {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                        </div>
                      ) : (
                        <img
                          src={getSpriteUrl(pokemonData, name)}
                          alt={name}
                          className="w-full h-full object-contain drop-shadow-md"
                        />
                      )}
                    </div>
                  </div>
                  <span className="capitalize font-semibold mt-5 text-gray-600">
                    {name}
                  </span>
                  <div className="pokemon-card-types mt-1">
                    {pokemonData?.types?.map((type: PokemonType) => (
                      <TypeLogoBadge
                        key={type.type.name}
                        type={type.type.name}
                      />
                    ))}
                  </div>

                  {/* Enhanced evolution description */}
                  {evolutionDetail && (
                    <motion.div
                      className="mt-1 text-center backdrop-blur not-first:px-2 py-1 rounded-full"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <EvolutionDescription
                        evolutionDetail={evolutionDetail}
                        className="text-xs"
                      />
                    </motion.div>
                  )}
                </Link>
              </motion.div>
            </Fragment>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
