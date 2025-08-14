import React from "react";
import { GameState } from "@/types/WordleTypes";
import GuessRow from "./GuessRow";

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const tableHeaders = [
    { short: "Poké", full: "Pokémon", tooltip: "The Pokémon you guessed" },
    { short: "T1", full: "Type 1", tooltip: "Primary type (Green = correct, Yellow = one type matches, Red = wrong)" },
    { short: "T2", full: "Type 2", tooltip: "Secondary type (Green = correct, Yellow = one type matches, Red = wrong)" },
    { short: "Gen", full: "Generation", tooltip: "Generation number (Arrows show if target is higher ↑ or lower ↓)" },
    { short: "Evo", full: "Evolution", tooltip: "Evolution stage (Arrows show if target is higher ↑ or lower ↓)" },
    { short: "Clr", full: "Color", tooltip: "Pokémon's primary color (Green = correct, Red = wrong)" },
    { short: "Ht", full: "Height", tooltip: "Height in meters (Arrows show if target is higher ↑ or lower ↓)" },
    { short: "Wt", full: "Weight", tooltip: "Weight in kg (Arrows show if target is higher ↑ or lower ↓)" },
    { short: "Leg", full: "Legendary", tooltip: "Is it legendary? (Green = correct, Red = wrong)" },
    { short: "Myth", full: "Mythical", tooltip: "Is it mythical? (Green = correct, Red = wrong)" },
  ];

  return (
    <div className="pokedle-board">
      <div className="pokedle-board-header-panel">
        {tableHeaders.map((header) => (
          <div 
            key={header.full} 
            className="pokedle-table-header"
            title={header.tooltip}
          >
            <span className="block md:hidden">{header.short}</span>
            <span className="hidden md:block">{header.full}</span>
          </div>
        ))}
      </div>
      <div className="pokedle-board-rows-panel">
        {gameState.guesses.map((guess, index) => (
          <GuessRow 
            key={index} 
            guess={guess} 
            isNewGuess={index === gameState.guesses.length - 1}
          />
        ))}
        {Array.from({ length: 6 - gameState.guesses.length }).map(
          (_, index) => (
            <div key={index} className="pokedle-table-rows">
              <div className="pokedle-table-header" />
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="pokedle-table-row" />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default React.memo(GameBoard);
