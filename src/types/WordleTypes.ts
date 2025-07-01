export interface PokemonWordleData {
  id: number;
  name: string;
  types: string[];
  generation: string;
  evolutionStage: number;
  color: string;
  habitat: string;
  isLegendary: boolean;
  isMythical: boolean;
  height: number; // in meters
  weight: number; // in kg
}

export interface GuessResult {
  pokemon: PokemonWordleData;
  feedback: {
    type1: 'correct' | 'partial' | 'incorrect';
    type2: 'correct' | 'partial' | 'incorrect';
    generation: 'correct' | 'incorrect' | 'higher' | 'lower';
    evolutionStage: 'correct' | 'incorrect' | 'higher' | 'lower';
    color: 'correct' | 'incorrect';
    habitat: 'correct' | 'incorrect';
    height: 'correct' | 'incorrect' | 'higher' | 'lower';
    weight: 'correct' | 'incorrect' | 'higher' | 'lower';
    isMythical: 'correct' | 'incorrect';
    isLegendary: 'correct' | 'incorrect';
  };
}

export interface GameState {
  currentDate: string;
  difficulty: 'easy' | 'medium' | 'hard';
  targetPokemon: PokemonWordleData;
  guesses: GuessResult[];
  gameStatus: 'playing' | 'won' | 'lost';
  statistics: {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    winRate: number;
  };
}
