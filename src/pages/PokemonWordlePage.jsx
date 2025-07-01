import React, { useState, useEffect } from "react";
import { usePokemonWordle } from "@/hooks/usePokemonWordle";
import GameBoard from "@/components/wordle/GameBoard";
import SearchBar from "@/components/home/SearchBar";
import DifficultySelector from "@/components/wordle/DifficultySelector";
import StatisticsModal from "@/components/wordle/StatisticsModal";

const PokemonWordlePage = () => {
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const { gameState, handleGuess, newGame, invalidGuessError, setDifficulty } =
    usePokemonWordle();

  useEffect(() => {
    // Show difficulty selector only on first load if no difficulty is set or if it's a new day
    if (!localStorage.getItem("pokemonWordleState")) {
      setShowDifficultySelector(true);
    } else {
      const savedState = JSON.parse(localStorage.getItem("pokemonWordleState"));
      const today = new Date().toISOString().split("T")[0];
      if (savedState.currentDate !== today) {
        setShowDifficultySelector(true);
      }
    }
  }, []);

  const handleSelectDifficulty = (difficulty) => {
    setDifficulty(difficulty);
    setShowDifficultySelector(false);
    newGame(); // Start a new game with the selected difficulty
  };

  // Guard: If gameState is null or undefined, show a loading spinner
  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 items-center">
      <h1 className="text-4xl font-bold text-center my-8">Pokémon Wordle</h1>

      <div className="flex justify-center">
        <SearchBar
          onSelect={handleGuess}
          disabled={gameState.gameStatus !== "playing"}
        />
      </div>

      {invalidGuessError && (
        <p className="text-red-500 text-center my-2">{invalidGuessError}</p>
      )}

      <GameBoard gameState={gameState} />

      {gameState.gameStatus !== "playing" && (
        <div className="text-center my-4">
          <h2 className="text-2xl font-bold">
            {gameState.gameStatus === "won" ? "You won!" : "You lost!"}
          </h2>
          <p>The Pokémon was: {gameState.targetPokemon.name}</p>
          <button
            onClick={newGame}
            className="mt-4 px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Play Again
          </button>
          <button
            onClick={() => setShowStatisticsModal(true)}
            className="mt-4 ml-2 px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            View Statistics
          </button>
        </div>
      )}

      <DifficultySelector
        isOpen={showDifficultySelector}
        onClose={() => setShowDifficultySelector(false)}
        onSelectDifficulty={handleSelectDifficulty}
      />

      <StatisticsModal
        isOpen={showStatisticsModal}
        onClose={() => setShowStatisticsModal(false)}
        statistics={gameState.statistics}
      />
    </div>
  );
};

export default PokemonWordlePage;
