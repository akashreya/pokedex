import React from "react";
import type { EvolutionNode } from "../../../services/evolutionService";
import { EvolutionDescription, EvolutionPokemon } from "./index";

// @ts-ignore
import TypeLogoBadge from "../../ui/TypeLogoBadge";

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
    return (
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
        <EvolutionPokemon
          isFirst={node.name === pokemonName}
          name={node.name}
          pokemonData={node.pokemonData}
          isLoading={false}
          getSpriteUrl={getSpriteUrl}
          delay={delay}
          isTarget={isTarget}
        >
          {node.evolutionDetails && node.evolutionDetails[0] && (
            <div className="evo-trigger-details">
              <EvolutionDescription
                evolutionDetail={node.evolutionDetails[0]}
              />
            </div>
          )}
        </EvolutionPokemon>
        {node.evolvesTo.length > 0 && (
          <>
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
