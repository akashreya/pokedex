import { Fragment } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMultiplePokemon } from "../../../hooks/useMultiplePokemon";
import { EvolutionDescription, EvolutionArrow } from "./index";
import { getPokemonGradientClass } from "@/utils/pokemonUtils";
// @ts-ignore
import TypeLogoBadge from "../../ui/TypeLogoBadge";

interface PokemonType {
  type: {
    name: string;
  };
}
interface EvolutionLinearPathProps {
  evolutionPath: string[];
  pokemonName: string;
  getSpriteUrl: (pokemonData: any, fallbackId?: string | number) => string;
  evolutionDetails: (any | null)[];
}

export default function EvolutionLinearPath({
  evolutionPath,
  pokemonName,
  getSpriteUrl,
  evolutionDetails,
}: EvolutionLinearPathProps) {
  // Fetch all Pokémon data for the evolution path using the hook
  const pokemonCache = useMultiplePokemon(evolutionPath);

  // Build grid columns: [sprite, arrow, sprite, arrow, ... sprite]
  const columns: string[] = [];
  for (let i = 0; i < evolutionPath.length; i++) {
    columns.push("auto");
    if (i < evolutionPath.length - 1) columns.push("48px");
  }
  const gridTemplateColumns = columns.join(" ");

  // Row 1: Sprites and Arrows
  const spriteAndArrowRow: React.ReactNode[] = [];
  // Row 2: Details and Spacers
  const detailsAndSpacersRow: React.ReactNode[] = [];

  evolutionPath.forEach((name, idx) => {
    // Sprite cell
    spriteAndArrowRow.push(
      <div
        key={`sprite-${name}`}
        className="flex items-center justify-center"
        style={{ height: 200 }}
      >
        <div className="evo-single-sprite-panel">
          <div
            className={`evo-image-panel ${getPokemonGradientClass(
              pokemonCache[name]
            )} ${name === pokemonName ? "ring-3 ring-blue-400" : ""}`}
          >
            {!pokemonCache[name] ? (
              <div className="evo-loading-panel">
                <div className="evo-spinner"></div>
              </div>
            ) : (
              <motion.img
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: idx }}
                src={getSpriteUrl(pokemonCache[name])}
                alt={name}
                className="evo-image"
              />
            )}
          </div>
        </div>
      </div>
    );
    // Details cell
    detailsAndSpacersRow.push(
      <div key={`details-${name}`} className="evo-details text-center">
        {name === pokemonName ? (
          <span className="evo-name">{name}</span>
        ) : (
          <Link
            to={`/pokemon/${name}`}
            className="evo-name hover:text-blue-500 transition-colors duration-200"
          >
            {name}
          </Link>
        )}
        <div className="pokemon-card-types mt-1">
          {pokemonCache[name]?.types?.map((type: PokemonType) => (
            <TypeLogoBadge key={type.type.name} type={type.type.name} />
          ))}
        </div>
        {evolutionDetails && idx > 0 && evolutionDetails[idx] && (
          <div className="evo-trigger-details">
            <EvolutionDescription evolutionDetail={evolutionDetails[idx]} />
          </div>
        )}
      </div>
    );
    // Arrow cell (except after last Pokémon)
    if (idx < evolutionPath.length - 1) {
      spriteAndArrowRow.push(
        <div
          key={`arrow-${idx}`}
          className="flex items-center justify-center"
          style={{ height: 200 }}
        >
          <EvolutionArrow />
        </div>
      );
      detailsAndSpacersRow.push(<div key={`spacer-${idx}`}></div>);
    }
  });

  return (
    <>
      {/* Desktop: grid layout */}
      <div className="w-full hidden md:grid" style={{ gridTemplateColumns }}>
        {/* Row 1: Sprites and Arrows */}
        {spriteAndArrowRow}
        {/* Row 2: Details and Spacers */}
        {detailsAndSpacersRow}
      </div>
      {/* Mobile: vertical stack */}
      <div className="flex flex-col md:hidden w-full items-center">
        {evolutionPath.map((name, idx) => (
          <Fragment key={name}>
            <div className="flex flex-col items-center">
              {/* Sprite */}
              <div className="evo-single-sprite-panel" style={{ height: 200 }}>
                <div
                  className={`evo-image-panel ${getPokemonGradientClass(
                    pokemonCache[name]
                  )} ${name === pokemonName ? "ring-3 ring-blue-400" : ""}`}
                >
                  {!pokemonCache[name] ? (
                    <div className="evo-loading-panel">
                      <div className="evo-spinner"></div>
                    </div>
                  ) : (
                    <motion.img
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: idx }}
                      src={getSpriteUrl(pokemonCache[name])}
                      alt={name}
                      className="evo-image"
                    />
                  )}
                </div>
              </div>
              {/* Details */}
              <div className="evo-details text-center mt-2">
                {name === pokemonName ? (
                  <span className="evo-name">{name}</span>
                ) : (
                  <Link
                    to={`/pokemon/${name}`}
                    className="evo-name hover:text-blue-500 transition-colors duration-200"
                  >
                    {name}
                  </Link>
                )}
                <div className="pokemon-card-types mt-1">
                  {pokemonCache[name]?.types?.map((type: PokemonType) => (
                    <TypeLogoBadge key={type.type.name} type={type.type.name} />
                  ))}
                </div>
                {evolutionDetails && idx > 0 && evolutionDetails[idx] && (
                  <div className="evo-trigger-details">
                    <EvolutionDescription
                      evolutionDetail={evolutionDetails[idx]}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* Arrow (if not last) */}
            {idx < evolutionPath.length - 1 && (
              <div className="flex items-center justify-center my-2">
                <EvolutionArrow color="gray-600" />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </>
  );
}
