import React from "react";
import { GameState } from "@/types/WordleTypes";
import GuessRow from "./GuessRow";

const typeGradientLight =
  "bg-gradient-to-br from-[#C6FFDD] via-[#FBD786] to-[#f7797d]";
const typeGradientDark =
  "dark:bg-gradient-to-br dark:from-[#434343] dark:via-[#152331] dark:to-[#000000]";

interface GameBoardProps {
  gameState: GameState;
}

const GameBoard: React.FC<GameBoardProps> = ({ gameState }) => {
  return (
    <div className="w-full max-w-7xl bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-lg p-4 md:p-8 flex flex-col items-center">
      <div className="items-center grid grid-cols-10 gap-4 w-full mb-4 font-bold text-center text-gray-700 dark:text-gray-200 rounded-2xl py-2 sticky top-0 z-10">
        <div
          className={`h-24 w-28 flex items-center justify-center rounded-2xl shadow-sm ${typeGradientLight} ${typeGradientDark} border border-gray-200 dark:border-gray-700 text-base`}
        >
          Pokémon
        </div>
        <div className="h-24 w-28 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
          Type 1
        </div>
        <div className="h-24 w-28 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
          Type 2
        </div>
        <div className="h-24 w-28 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
          Generation
        </div>
        <div className="h-24 w-28 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
          Evolution
        </div>
        <div className="h-24 w-28 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
          Color
        </div>
        <div className="h-24 w-28 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
          Height
        </div>
        <div className="h-24 w-28 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
          Weight
        </div>
        <div className="h-24 w-28 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
          Legendary
        </div>
        <div className="h-24 w-28 flex items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-700">
          Mythical
        </div>
      </div>
      <div className="flex flex-col w-full">
        {gameState.guesses.map((guess, index) => (
          <GuessRow key={index} guess={guess} />
        ))}
        {Array.from({ length: 6 - gameState.guesses.length }).map(
          (_, index) => (
            <div key={index} className="grid grid-cols-10 gap-4 mb-2 w-full">
              <div
                className={`h-24 w-28 flex items-center justify-center rounded-2xl shadow-sm ${typeGradientLight} ${typeGradientDark} border border-gray-200 dark:border-gray-700`}
              />
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 w-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
                />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default GameBoard;
