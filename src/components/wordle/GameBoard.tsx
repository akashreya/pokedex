import React from "react";
import { GameState } from "@/types/WordleTypes";
import GuessRow from "./GuessRow";

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  const tableHeaders = [
    { short: "Poké", full: "Pokémon" },
    { short: "T1", full: "Type 1" },
    { short: "T2", full: "Type 2" },
    { short: "Gen", full: "Generation" },
    { short: "Evo", full: "Evolution" },
    { short: "Clr", full: "Color" },
    { short: "Ht", full: "Height" },
    { short: "Wt", full: "Weight" },
    { short: "Leg", full: "Legendary" },
    { short: "Myth", full: "Mythical" },
  ];

  return (
    <div className="pokedle-board">
      <div className="pokedle-board-header-panel">
        {tableHeaders.map((header) => (
          <div key={header.full} className="pokedle-table-header">
            <span className="block md:hidden">{header.short}</span>
            <span className="hidden md:block">{header.full}</span>
          </div>
        ))}
      </div>
      <div className="pokedle-board-rows-panel">
        {gameState.guesses.map((guess, index) => (
          <GuessRow key={index} guess={guess} />
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
