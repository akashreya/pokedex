import { useState, useEffect } from 'react';
import ReactGA from 'react-ga4';
import { GameState, } from '../types/WordleTypes';
import { getDailyPokemon, comparePokemon } from '../utils/wordleUtils';
import { getWordlePokemonData } from '../services/pokemonWordleService';

const GAME_STATE_VERSION = 1;

function migrateGameState(oldState: any, oldVersion: number): GameState | null {
  // Example migration logic. Add cases as you increment GAME_STATE_VERSION.
  switch (oldVersion) {
    // case 1: // Migration from version 1 to 2
    //   return { ...oldState, newField: defaultValue, version: 2 };
    default:
      // No migration path, return null to force reset
      return null;
  }
}

const getInitialState = async (): Promise<GameState> => {
  const savedState = localStorage.getItem('pokemonWordleState');
  const today = new Date().toISOString().split('T')[0];

  if (savedState) {
    const parsedState: GameState = JSON.parse(savedState);
    // Version check
    if (!parsedState.version || parsedState.version !== GAME_STATE_VERSION) {
      // Try to migrate if possible
      if (parsedState.version && parsedState.version < GAME_STATE_VERSION) {
        const migrated = migrateGameState(parsedState, parsedState.version);
        if (migrated && migrated.difficulty) {
          // Re-fetch targetPokemon to ensure up-to-date
          const targetPokemon = await getDailyPokemon(migrated.difficulty);
          if (!targetPokemon) throw new Error("Failed to fetch daily Pokémon data.");
          return { ...migrated, targetPokemon };
        } else if (migrated) {
          // No difficulty set, don't fetch
          return { ...migrated, targetPokemon: null, difficulty: null };
        }
      }
      // No migration path or version missing, reset state
      localStorage.removeItem('pokemonWordleState');
    } else if (parsedState.currentDate === today) {
      if (parsedState.difficulty) {
        // Re-fetch targetPokemon to ensure it's up-to-date with API data
        const targetPokemon = await getDailyPokemon(parsedState.difficulty);
        if (!targetPokemon) throw new Error("Failed to fetch daily Pokémon data.");
        return { ...parsedState, targetPokemon };
      } else {
        // No difficulty set, don't fetch
        return { ...parsedState, targetPokemon: null, difficulty: null };
      }
    }
  }

  // Default initial state if no saved state or date mismatch
  // Do NOT fetch a Pokémon if no difficulty is set
  return {
    currentDate: today,
    difficulty: null,
    targetPokemon: null,
    guesses: [],
    gameStatus: 'playing',
    statistics: {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      winRate: 0,
    },
    version: GAME_STATE_VERSION,
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
      localStorage.setItem('pokemonWordleState', JSON.stringify({ ...gameState, version: GAME_STATE_VERSION }));
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
    if (!gameState || gameState.gameStatus !== 'playing' || !gameState.targetPokemon) return;

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
      // Track win event
      ReactGA.event({
        category: 'Game',
        action: 'Win',
        label: 'Game Result',
        value: newGuesses.length
      });
    } else if (newGuesses.length >= 6) {
      newGameStatus = 'lost';
      newStatistics.gamesPlayed++;
      newStatistics.currentStreak = 0; // Reset streak on loss
      // Track loss event
      ReactGA.event({
        category: 'Game',
        action: 'Loss',
        label: 'Game Result',
        value: newGuesses.length
      });
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
    // Track game start event
    ReactGA.event({
      category: 'Game',
      action: 'Start',
      label: 'PokéGuess Game Started'
    });
  };

  return {
    gameState, handleGuess, newGame, invalidGuessError, setDifficulty, isLoading,
    remainingAttempts: gameState ? 6 - gameState.guesses.length : 6
  };
}
