import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { EvolutionNode } from "../../../services/evolutionService";
import { EvolutionDescription, EvolutionArrow } from "./index";
import { getPokemonGradientClass } from "@/utils/pokemonUtils";

// @ts-ignore
import TypeLogoBadge from "../../ui/TypeLogoBadge";

interface PokemonType {
  type: {
    name: string;
  };
}

interface EvolutionTreeProps {
  evolutionTree: EvolutionNode;
  pokemonName: string;
  getSpriteUrl: (pokemonData: any) => string;
}

export default function EvolutionTree({
  evolutionTree,
  pokemonName,
  getSpriteUrl,
}: EvolutionTreeProps) {
  const BASE_DELAY = 1; // seconds

  const renderEvolutionTree = (
    node: EvolutionNode,
    delay: number = 0
  ): React.ReactNode => {
    const isTarget = node.name === pokemonName;
    const gradientClass = getPokemonGradientClass(node.pokemonData);
    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <div className="evolution-sprite-outer-panel">
          <div className="evo-single-sprite-panel">
            <div
              className={`evo-image-panel ${gradientClass}
              ${isTarget ? "ring-3 ring-blue-400 p-2" : ""}`}
            >
              <motion.img
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay }}
                src={getSpriteUrl(node.pokemonData)}
                alt={node.name}
                className="evo-image"
              />
            </div>
          </div>
          <div className="evo-details">
            {isTarget ? (
              <span className="evo-name">{node.name}</span>
            ) : (
              <Link
                to={`/pokemon/${node.name}`}
                className="evo-name transition-colors duration-200 hover:text-blue-500 "
              >
                {node.name}
              </Link>
            )}
            <div className="pokemon-card-types mt-1">
              {node.pokemonData?.types?.map((type: PokemonType) => (
                <TypeLogoBadge key={type.type.name} type={type.type.name} />
              ))}
            </div>
            {/* Evolution description, if available */}
            {node.evolutionDetails && node.evolutionDetails[0] && (
              <div className="evo-trigger-details">
                <EvolutionDescription
                  evolutionDetail={node.evolutionDetails[0]}
                />
              </div>
            )}
          </div>
        </div>
        {node.evolvesTo.length > 0 && (
          <>
            <div className="evo-arrow">
              <EvolutionArrow />
            </div>
            {node.evolvesTo.length === 1 ? (
              renderEvolutionTree(node.evolvesTo[0], delay + BASE_DELAY)
            ) : (
              <div className="hero-content">
                {node.evolvesTo.map((evo: EvolutionNode, idx: number) => (
                  <div key={evo.name + idx}>
                    {renderEvolutionTree(evo, (delay + 1) * BASE_DELAY)}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center">
      {renderEvolutionTree(evolutionTree, 0)}
    </div>
  );
}
