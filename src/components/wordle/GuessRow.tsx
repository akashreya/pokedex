import React from "react";
import { GuessResult } from "@/types/WordleTypes";
import AttributeCell from "./AttributeCell";
import TypeLogoBadge from "../ui/TypeLogoBadge.jsx";

interface GuessRowProps {
  guess: GuessResult;
}

const GuessRow: React.FC<GuessRowProps> = ({ guess }) => {
  const pokeId = guess.pokemon.id;
  const spriteUrl = pokeId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokeId}.png`
    : undefined;

  return (
    <div className="pokedle-table-rows">
      <div className="pokedle-table-header md:flex-col ">
        <img
          src={spriteUrl}
          alt={guess.pokemon.name}
          className="pokedle-image"
        />

        <span className="pokedle-pokename">{guess.pokemon.name}</span>
      </div>
      <AttributeCell
        value={<TypeLogoBadge type={guess.pokemon.types[0]} />}
        status={guess.feedback.type1}
        className="cellbase"
      />
      {guess.pokemon.types[1] ? (
        <AttributeCell
          value={<TypeLogoBadge type={guess.pokemon.types[1]} />}
          status={guess.feedback.type2}
          className="cellbase"
        />
      ) : (
        <div className="pokedle-table-filled-row text-sm  text-gray-400">
          N/A
        </div>
      )}
      <AttributeCell
        value={guess.pokemon.generation}
        status={guess.feedback.generation}
        className="cellbase"
      />
      <AttributeCell
        value={guess.pokemon.evolutionStage}
        status={guess.feedback.evolutionStage}
        className="cellbase"
      />
      <AttributeCell
        value={guess.pokemon.color}
        status={guess.feedback.color}
        className="cellbase"
      />
      <AttributeCell
        value={`${guess.pokemon.height}m`}
        status={guess.feedback.height}
        className="cellbase"
      />
      <AttributeCell
        value={`${guess.pokemon.weight}kg`}
        status={guess.feedback.weight}
        className="cellbase"
      />
      <AttributeCell
        value={guess.pokemon.isLegendary ? "Yes" : "No"}
        status={guess.feedback.isLegendary}
        className="cellbase"
      />
      <AttributeCell
        value={guess.pokemon.isMythical ? "Yes" : "No"}
        status={guess.feedback.isMythical}
        className="cellbase"
      />
    </div>
  );
};

export default React.memo(GuessRow);
