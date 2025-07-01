import { useState, useEffect } from 'react';
import { GameState, PokemonWordleData, GuessResult } from '../types/WordleTypes';
import { getDailyPokemon, comparePokemon, getPokemonIdByName } from '../utils/wordleUtils';
import { getWordlePokemonData } from '../services/pokemonWordleService';

const getInitialState = async (): Promise<GameState> => {
  const savedState = localStorage.getItem('pokemonWordleState');
  const today = new Date().toISOString().split('T')[0];

  if (savedState) {
    const parsedState: GameState = JSON.parse(savedState);
    if (parsedState.currentDate === today) {
      // Re-fetch targetPokemon to ensure it's up-to-date with API data
      const targetPokemon = await getDailyPokemon(parsedState.difficulty);
      if (!targetPokemon) throw new Error("Failed to fetch daily Pokémon data.");
      return { ...parsedState, targetPokemon };
    }
  }

  // Default initial state if no saved state or date mismatch
  const targetPokemon = await getDailyPokemon();
  if (!targetPokemon) throw new Error("Failed to fetch daily Pokémon data.");
  return {
    currentDate: today,
    difficulty: 'medium',
    targetPokemon: targetPokemon,
    guesses: [],
    gameStatus: 'playing',
    statistics: {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      winRate: 0,
    },
  };
};

export function usePokemonWordle() {
  const [gameState, setGameState] = useState<GameState | null>(null); // Initialize as null to indicate loading
  const [invalidGuessError, setInvalidGuessError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeGame = async () => {
      setIsLoading(true);
      const initialState = await getInitialState();
      setGameState(initialState);
      setIsLoading(false);
    };
    initializeGame();
  }, []); // Run only once on component mount

  useEffect(() => {
    if (gameState) {
      localStorage.setItem('pokemonWordleState', JSON.stringify(gameState));
    }
  }, [gameState]);

  const setDifficulty = async (difficulty: 'easy' | 'medium' | 'hard') => {
    setIsLoading(true);
    const newTargetPokemon = await getDailyPokemon(difficulty);
    if (!newTargetPokemon) throw new Error("Failed to fetch daily Pokémon data.");
    setGameState(prevState => {
      if (!prevState) return null; // Should not happen if isLoading is handled correctly
      return {
        ...prevState,
        difficulty,
        targetPokemon: newTargetPokemon,
        guesses: [],
        gameStatus: 'playing',
      };
    });
    setIsLoading(false);
  };

  const handleGuess = async (guess: string) => {
    if (!gameState || gameState.gameStatus !== 'playing') return;

    const guessedPokemonData = await getWordlePokemonData(guess.toLowerCase());

    if (!guessedPokemonData) {
      setInvalidGuessError('Invalid Pokémon name. Please try again.');
      return;
    }

    setInvalidGuessError(null); // Clear previous error

    const result = comparePokemon(guessedPokemonData, gameState.targetPokemon);
    const newGuesses = [...gameState.guesses, result];

    let newGameStatus: GameState['gameStatus'] = 'playing';
    let newStatistics = { ...gameState.statistics };

    if (guessedPokemonData.id === gameState.targetPokemon.id) {
      newGameStatus = 'won';
      newStatistics.gamesPlayed++;
      newStatistics.gamesWon++;
      newStatistics.currentStreak++;
      if (newStatistics.currentStreak > newStatistics.maxStreak) {
        newStatistics.maxStreak = newStatistics.currentStreak;
      }
    } else if (newGuesses.length >= 6) {
      newGameStatus = 'lost';
      newStatistics.gamesPlayed++;
      newStatistics.currentStreak = 0; // Reset streak on loss
    }

    // Recalculate win rate
    if (newStatistics.gamesPlayed > 0) {
      newStatistics.winRate = (newStatistics.gamesWon / newStatistics.gamesPlayed) * 100;
    }

    setGameState(prevState => {
      if (!prevState) return null;
      return {
        ...prevState,
        guesses: newGuesses,
        gameStatus: newGameStatus,
        statistics: newStatistics,
      };
    });
  };

  const newGame = async () => {
    setIsLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const newTargetPokemon = await getDailyPokemon(gameState?.difficulty || 'medium');
    if (!newTargetPokemon) throw new Error("Failed to fetch daily Pokémon data.");
    setGameState(prevState => {
      if (!prevState) return null;
      return {
        ...prevState,
        currentDate: today,
        targetPokemon: newTargetPokemon,
        guesses: [],
        gameStatus: 'playing',
        // Statistics are carried over, only game-specific state is reset
      };
    });
    setIsLoading(false);
    setInvalidGuessError(null);
  };

  return { gameState, handleGuess, newGame, invalidGuessError, setDifficulty, isLoading };
}
