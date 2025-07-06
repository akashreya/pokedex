import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Share2, HelpCircle } from "lucide-react";
import { usePokemonWordle } from "@/hooks/usePokemonWordle";
import GameBoard from "@/components/wordle/GameBoard";
import SearchBar from "@/components/home/SearchBar";
import DifficultySelector from "@/components/wordle/DifficultySelector";
import StatisticsModal from "@/components/wordle/StatisticsModal";
import ShareModal from "@/components/wordle/ShareModal";
import GameRulesModal from "@/components/wordle/GameRulesModal";
import LoadingSpinner from "@/components/layout/LoadingSpinner";
import { Confetti } from "@/components/ui/confetti";
import confetti from "canvas-confetti";
import { useUserPreferences } from "@/context/UserPreferencesContext";
import { BorderBeam } from "../components/ui/border-beam";

// Helper to capitalize the first letter of a string
function capitalizeFirstLetter(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const PokemonWordlePage = () => {
  const [showDifficultySelector, setShowDifficultySelector] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showRulesModal, setShowRulesModal] = useState(false);
  const {
    gameState,
    handleGuess,
    newGame,
    invalidGuessError,
    setDifficulty,
    remainingAttempts,
  } = usePokemonWordle();
  const searchBarRef = useRef(null);
  const confettiRef = useRef(null);
  const resultSectionRef = useRef(null);
  const { theme } = useUserPreferences();

  const handleShowRulesModal = useCallback(() => setShowRulesModal(true), []);
  const handleShowShareModal = useCallback(() => setShowShareModal(true), []);
  const handleShowStatisticsModal = useCallback(
    () => setShowStatisticsModal(true),
    []
  );

  useEffect(() => {
    // Show difficulty selector only on first load if no difficulty is set or if it's a new day
    const stateStr = localStorage.getItem("pokemonWordleState");
    const today = new Date().toISOString().split("T")[0];
    let needsDifficulty = false;

    if (!stateStr) {
      needsDifficulty = true;
    } else {
      const savedState = JSON.parse(stateStr);
      if (savedState.currentDate !== today) {
        needsDifficulty = true;
      }
    }

    // Show rules modal on first visit
    const hasSeenRules = localStorage.getItem("hasSeenWordleRules");
    if (!hasSeenRules) {
      setShowRulesModal(true);
      // Don't show difficulty selector until rules are seen
      setShowDifficultySelector(false);
    } else if (needsDifficulty) {
      setShowDifficultySelector(true);
    }
  }, []);

  useEffect(() => {
    if (gameState && gameState.difficulty == null) {
      // Only show difficulty selector if rules modal is not open
      if (!showRulesModal) setShowDifficultySelector(true);
    }
  }, [gameState, showRulesModal]);

  useEffect(() => {
    if (
      gameState &&
      (gameState.gameStatus === "won" || gameState.gameStatus === "lost")
    ) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          if (resultSectionRef.current) {
            resultSectionRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }
        });
      }, 250);
    }
    if (gameState && gameState.gameStatus === "won") {
      // Side cannons effect from Magic UI docs
      const duration = 5000; // 5 seconds
      const end = Date.now() + duration;
      const darkColors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
      const lightColors = [
        "#ff0000", // red
        "#00bfff", // deep sky blue
        "#ffd700", // gold
        "#32cd32", // lime green
        "#ff8c00", // dark orange
        "#8a2be2", // blue violet
      ]; // solid, bold colors for light theme
      const colors = theme === "dark" ? darkColors : lightColors;

      (function frame() {
        if (Date.now() > end) return;
        confetti({
          particleCount: 10,
          angle: 60,
          spread: 80,
          startVelocity: 60,
          origin: { x: 0, y: 0.5 },
          colors,
        });
        confetti({
          particleCount: 10,
          angle: 120,
          spread: 80,
          startVelocity: 60,
          origin: { x: 1, y: 0.5 },
          colors,
        });
        requestAnimationFrame(frame);
      })();
    }
  }, [gameState, theme]);

  const handleSelectDifficulty = useCallback(
    (difficulty) => {
      setDifficulty(difficulty);
      setShowDifficultySelector(false);
    },
    [setDifficulty, newGame]
  );

  const handleCloseRulesModal = useCallback(() => {
    setShowRulesModal(false);
    localStorage.setItem("hasSeenWordleRules", "true");
    // If difficulty is not set, show the selector after closing rules
    if (gameState && gameState.difficulty == null) {
      setShowDifficultySelector(true);
    }
  }, [gameState]);

  // Guard: If gameState is null or undefined, show a loading spinner
  if (!gameState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // If targetPokemon is null, show prompt or loading (waiting for difficulty selection)
  if (gameState.targetPokemon == null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Confetti
          ref={confettiRef}
          className="absolute left-0 top-0 z-50 w-full h-full pointer-events-none"
          manualstart
        />
        <div className="w-full max-w-2xl p-8 bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-lg flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4">Pokédle</h1>
          <p className="text-lg text-center mb-6">
            Select a difficulty to start your daily Pokémon Wordle!
          </p>
          <DifficultySelector
            isOpen={showDifficultySelector}
            onSelectDifficulty={handleSelectDifficulty}
          />
          <GameRulesModal
            isOpen={showRulesModal}
            onClose={handleCloseRulesModal}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Confetti
        ref={confettiRef}
        className="absolute left-0 top-0 z-50 w-full h-full pointer-events-none"
        manualstart
      />
      <div
        className="flex flex-1 flex-col mx-auto w-full max-w-7xl p-4 items-center
       bg-gradient-to-br to-[#ff1e56] via-[#f9c942] from-[#1e90ff]
       dark:from-[#16222A] dark:via-[#3A6073] dark:to-[#16222A] rounded-4xl m-4"
      >
        <div className="w-full flex justify-between mx-auto my-8">
          <h1 className="text-4xl font-bold text-center flex-1">Pokédle</h1>
          <motion.button
            onClick={handleShowRulesModal}
            className="p-2 bg-blue-100 dark:bg-gray-300 hover:bg-blue-200 rounded-full transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="How to Play"
          >
            <HelpCircle size={24} className="text-emerald-600" />
          </motion.button>
        </div>

        <div className="flex justify-center w-[250px]" ref={searchBarRef}>
          <SearchBar
            onSelect={handleGuess}
            disabled={
              gameState.difficulty == null || gameState.gameStatus !== "playing"
            }
          />
        </div>

        {invalidGuessError && (
          <p className="text-red-500 text-center my-2">{invalidGuessError}</p>
        )}

        <div className="text-center my-2 py-2">
          <span
            className="rounded-2xl text-gray-900 dark:text-gray-200 
            font-Quicksand md:text-2xl text-bold"
          >
            Remaining Attempts: {remainingAttempts}
          </span>
        </div>
        {gameState.difficulty && (
          <div className="mb-4 text-center relative overflow-hidden">
            <span className="inline-block px-3 py-3 rounded-full font-semibold text-gray-700 dark:text-gray-200 text-sm">
              Difficulty:{" "}
              {gameState.difficulty.charAt(0).toUpperCase() +
                gameState.difficulty.slice(1)}
              <BorderBeam
                size={40}
                duration={8}
                className={`from-transparent via-${
                  gameState.difficulty === "easy"
                    ? "green-500"
                    : gameState.difficulty === "medium"
                    ? "yellow-500"
                    : "red-500"
                } to-transparent `}
                borderWidth={3}
              />
            </span>
          </div>
        )}
        {gameState.difficulty && <GameBoard gameState={gameState} />}

        {gameState.gameStatus !== "playing" && (
          <AnimatePresence>
            <motion.div
              ref={resultSectionRef}
              className="flex flex-col items-center justify-center gap-4 my-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={
                gameState.gameStatus === "won"
                  ? {
                      opacity: 1,
                      scale: 1,
                      y: [0, -10, 0],
                      transition: {
                        duration: 0.6,
                        y: { repeat: 2, duration: 0.3 },
                        type: "spring",
                        stiffness: 300,
                      },
                    }
                  : {
                      opacity: 1,
                      scale: 1,
                      x: [0, -10, 10, -5, 5, 0],
                      transition: {
                        duration: 0.5,
                        x: { duration: 0.5 },
                      },
                    }
              }
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <motion.h2
                className={`text-2xl md:text-3xl font-bold font-montserrat ${
                  gameState.gameStatus === "won" ? "" : ""
                }`}
                animate={
                  gameState.gameStatus === "won"
                    ? {
                        scale: [1, 1.1, 1],
                        transition: { duration: 0.4, delay: 0.2 },
                      }
                    : {}
                }
              >
                {gameState.gameStatus === "won"
                  ? "🎉 You won! 🎉"
                  : "😞 You lost! 😞"}
              </motion.h2>
              <p className="text-base md:text-lg font-montserrat mb-2">
                The Pokémon was:{" "}
                {capitalizeFirstLetter(gameState.targetPokemon.name)}
              </p>
              <div className="flex flex-col md:flex-row gap-4 w-full max-w-xs md:max-w-2xl items-center justify-center">
                <motion.button
                  onClick={newGame}
                  className="w-full md:flex-1 md:min-w-[140px] px-4 py-3 rounded-2xl bg-[#EFD09E] text-[#272727] border-2 border-[#D4AA7D] shadow-lg dark:bg-[#272727] dark:text-[#EFD09E] dark:border-[#D4AA7D] font-montserrat font-bold text-lg md:text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Play Again
                </motion.button>
                <motion.button
                  onClick={handleShowShareModal}
                  className="w-full md:flex-1 md:min-w-[140px] px-4 py-3 rounded-2xl bg-[#EFD09E] text-[#272727] border-2 border-[#D4AA7D] shadow-lg dark:bg-[#272727] dark:text-[#EFD09E] dark:border-[#D4AA7D] font-montserrat font-bold text-lg md:text-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Share2 size={20} className="inline-block align-middle" />
                  <span>Share</span>
                </motion.button>
                <motion.button
                  onClick={handleShowStatisticsModal}
                  className="w-full md:flex-1 md:min-w-[140px] px-4 py-3 rounded-2xl bg-[#EFD09E] text-[#272727] border-2 border-[#D4AA7D] shadow-lg dark:bg-[#272727] dark:text-[#EFD09E] dark:border-[#D4AA7D] font-montserrat font-bold text-lg md:text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  View Statistics
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <DifficultySelector
          isOpen={showDifficultySelector}
          onSelectDifficulty={handleSelectDifficulty}
        />

        <StatisticsModal
          isOpen={showStatisticsModal}
          onClose={() => setShowStatisticsModal(false)}
          statistics={gameState.statistics}
        />

        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          gameResult={{
            won: gameState.gameStatus === "won",
            attempts: gameState.guesses.length,
            pokemonName: gameState.targetPokemon.name,
            difficulty: gameState.difficulty,
            guesses: gameState.guesses,
            gameStatus: gameState.gameStatus,
          }}
        />

        <GameRulesModal
          isOpen={showRulesModal}
          onClose={handleCloseRulesModal}
        />
      </div>
    </div>
  );
};

export default PokemonWordlePage;
