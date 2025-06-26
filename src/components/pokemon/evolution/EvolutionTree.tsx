import React from "react";
import { Link } from "react-router-dom";
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
  const renderEvolutionTree = (node: EvolutionNode): React.ReactNode => {
    const isTarget = node.name === pokemonName;
    const gradientClass = getPokemonGradientClass(node.pokemonData);
    return (
      <div
        className={`flex flex-col md:flex-row items-center 
          ${
            node.evolvesTo.length > 1 ? "" : "md:items-start"
          }  justify-center gap-4`}
      >
        <div className="flex flex-col items-center min-h-[200px]">
          <div className="flex-shrink-0">
            <div
              className={`w-50 h-50 rounded-full shadow-lg shadow-black
                bg-gradient-to-r ${gradientClass}
              ${isTarget ? "ring-3 ring-blue-400 p-2" : ""}`}
            >
              <img
                src={getSpriteUrl(node.pokemonData)}
                alt={node.name}
                className="w-full h-full object-contain drop-shadow-md"
              />
            </div>
          </div>
          <div className="flex flex-col items-center mt-4">
            {isTarget ? (
              <span className="capitalize font-semibold text-xl text-gray-600">
                {node.name}
              </span>
            ) : (
              <Link
                to={`/pokemon/${node.name}`}
                className="capitalize font-semibold text-xl text-gray-600 hover:text-blue-500 transition-colors"
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
              <div className="mt-2 text-center backdrop-blur px-2 py-1 rounded-full text-xs">
                <EvolutionDescription
                  evolutionDetail={node.evolutionDetails[0]}
                />
              </div>
            )}
          </div>
        </div>
        {node.evolvesTo.length > 0 && (
          <>
            <div className="flex items-center h-[200px]">
              <EvolutionArrow />
            </div>
            {node.evolvesTo.length === 1 ? (
              renderEvolutionTree(node.evolvesTo[0])
            ) : (
              <div className="flex flex-col items-center">
                {node.evolvesTo.map((evo: EvolutionNode, idx: number) => (
                  <div key={evo.name + idx}>{renderEvolutionTree(evo)}</div>
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
      {renderEvolutionTree(evolutionTree)}
    </div>
  );
}
