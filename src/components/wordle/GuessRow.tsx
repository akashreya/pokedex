import React from "react";
import { GuessResult } from "@/types/WordleTypes";
import AttributeCell from "./AttributeCell";

interface GuessRowProps {
  guess: GuessResult;
}

const typeGradientLight =
  "bg-gradient-to-br from-[#C6FFDD] via-[#FBD786] to-[#f7797d]";
const typeGradientDark =
  "dark:bg-gradient-to-br dark:from-[#434343] dark:via-[#152331] dark:to-[#000000]";
const cellBase = "h-24 w-28 rounded-2xl flex items-center justify-center";
const emptyCell = `${cellBase} border-2 border-dashed border-gray-400 dark:border-gray-600`;

const GuessRow: React.FC<GuessRowProps> = ({ guess }) => {
  const pokeId = guess.pokemon.id;
  const spriteUrl = pokeId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokeId}.png`
    : undefined;

  return (
    <div className="grid grid-cols-10 gap-4 mb-2 w-full">
      <div
        className={`${cellBase} flex-col ${typeGradientLight} ${typeGradientDark}`}
      >
        {spriteUrl ? (
          <img
            src={spriteUrl}
            alt={guess.pokemon.name}
            className="h-12 w-12 object-contain mb-1"
          />
        ) : (
          <div className="h-12 w-12 mb-1" />
        )}
        <span className="text-xs font-bold text-gray-800 dark:text-gray-100 text-center capitalize">
          {guess.pokemon.name}
        </span>
      </div>
      <AttributeCell
        value={guess.pokemon.types[0]}
        status={guess.feedback.type1}
        className={cellBase}
      />
      {guess.pokemon.types[1] ? (
        <AttributeCell
          value={guess.pokemon.types[1]}
          status={guess.feedback.type2}
          className={cellBase}
        />
      ) : (
        <div
          className={`${emptyCell} text-sm bg-gray-100 dark:bg-gray-800 text-gray-400`}
        >
          N/A
        </div>
      )}
      <AttributeCell
        value={guess.pokemon.generation}
        status={guess.feedback.generation}
        className={cellBase}
      />
      <AttributeCell
        value={guess.pokemon.evolutionStage}
        status={guess.feedback.evolutionStage}
        className={cellBase}
      />
      <AttributeCell
        value={guess.pokemon.color}
        status={guess.feedback.color}
        className={cellBase}
      />
      <AttributeCell
        value={`${guess.pokemon.height}m`}
        status={guess.feedback.height}
        className={cellBase}
      />
      <AttributeCell
        value={`${guess.pokemon.weight}kg`}
        status={guess.feedback.weight}
        className={cellBase}
      />
      <AttributeCell
        value={guess.pokemon.isLegendary ? "Yes" : "No"}
        status={guess.feedback.isLegendary}
        className={cellBase}
      />
      <AttributeCell
        value={guess.pokemon.isMythical ? "Yes" : "No"}
        status={guess.feedback.isMythical}
        className={cellBase}
      />
    </div>
  );
};

export default GuessRow;
