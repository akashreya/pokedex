import React, { useEffect, useState } from "react";
import { GuessResult } from "@/types/WordleTypes";
import AttributeCell from "./AttributeCell";
import TypeLogoBadge from "../ui/TypeLogoBadge.jsx";

interface GuessRowProps {
  guess: GuessResult;
  isNewGuess?: boolean;
}

const GuessRow: React.FC<GuessRowProps> = ({ guess, isNewGuess = false }) => {
  const [isAnimating, setIsAnimating] = useState(isNewGuess);
  const pokeId = guess.pokemon.id;
  const spriteUrl = pokeId
    ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/${pokeId}.png`
    : undefined;

  useEffect(() => {
    if (isNewGuess) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isNewGuess]);

  return (
    <div 
      className={`pokedle-table-rows ${
        isAnimating ? 'guess-row-enter' : ''
      }`}
    >
      <div className="pokedle-table-header md:flex-col hover:bg-gradient-to-br hover:from-[#CC95C0]/80 hover:via-[#DBD4B4]/80 hover:to-[#7AA1D2]/80 transition-all duration-300">
        <img
          src={spriteUrl}
          alt={guess.pokemon.name}
          className="pokedle-image"
          title={`${guess.pokemon.name}`}
        />

        <span 
          className="pokedle-pokename"
          title={`${guess.pokemon.name} - ID: ${guess.pokemon.id}`}
        >
          {guess.pokemon.name}
        </span>
      </div>
      <AttributeCell
        value={<TypeLogoBadge type={guess.pokemon.types[0]} />}
        status={guess.feedback.type1}
        className={`cellbase ${isAnimating ? 'guess-cell-stagger' : ''}`}
      />
      {guess.pokemon.types[1] ? (
        <AttributeCell
          value={<TypeLogoBadge type={guess.pokemon.types[1]} />}
          status={guess.feedback.type2}
          className={`cellbase ${isAnimating ? 'guess-cell-stagger' : ''}`}
        />
      ) : (
        <div className={`pokedle-table-filled-row text-sm text-gray-400 ${isAnimating ? 'guess-cell-stagger' : ''}`}>
          N/A
        </div>
      )}
      <AttributeCell
        value={guess.pokemon.generation}
        status={guess.feedback.generation}
        className={`cellbase ${isAnimating ? 'guess-cell-stagger' : ''}`}
      />
      <AttributeCell
        value={guess.pokemon.evolutionStage}
        status={guess.feedback.evolutionStage}
        className={`cellbase ${isAnimating ? 'guess-cell-stagger' : ''}`}
      />
      <AttributeCell
        value={guess.pokemon.color}
        status={guess.feedback.color}
        className={`cellbase ${isAnimating ? 'guess-cell-stagger' : ''}`}
      />
      <AttributeCell
        value={`${guess.pokemon.height}m`}
        status={guess.feedback.height}
        className={`cellbase ${isAnimating ? 'guess-cell-stagger' : ''}`}
      />
      <AttributeCell
        value={`${guess.pokemon.weight}kg`}
        status={guess.feedback.weight}
        className={`cellbase ${isAnimating ? 'guess-cell-stagger' : ''}`}
      />
      <AttributeCell
        value={guess.pokemon.isLegendary ? "Yes" : "No"}
        status={guess.feedback.isLegendary}
        className={`cellbase ${isAnimating ? 'guess-cell-stagger' : ''}`}
      />
      <AttributeCell
        value={guess.pokemon.isMythical ? "Yes" : "No"}
        status={guess.feedback.isMythical}
        className={`cellbase ${isAnimating ? 'guess-cell-stagger' : ''}`}
      />
    </div>
  );
};

export default React.memo(GuessRow);
