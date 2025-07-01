import { PokemonWordleData, GuessResult } from '../types/WordleTypes';
import { getPokemonList } from '../services/pokedexapi';
import { POKEMON } from '../constants/Pokemon';
import { getWordlePokemonData } from '../services/pokemonWordleService';

/**
 * Fetches the Pokémon of the day based on the current date and difficulty.
 * Uses the POKEMON array for deterministic selection, then fetches data from API.
 * Returns a Pokémon data object for the day.
 */
export async function getDailyPokemon(difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
  // Filter by difficulty (easy = Gen 1-3, medium = Gen 1-6, hard = all)
  let filteredPokemon = POKEMON;
  if (difficulty === 'easy') {
    filteredPokemon = POKEMON.filter((p) => p.id <= 386); // Gen 1-3
  } else if (difficulty === 'medium') {
    filteredPokemon = POKEMON.filter((p) => p.id <= 721); // Gen 1-6
  } else if (difficulty === 'hard') {
    filteredPokemon = POKEMON.filter((p) => p.id <= 1025); // Gen 1-9
  }
  if (filteredPokemon.length === 0) {
    filteredPokemon = POKEMON;
  }
  // Deterministic daily index
  const today = new Date().toISOString().split('T')[0];
  let hash = 0;
  for (let i = 0; i < today.length; i++) {
    hash = today.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % filteredPokemon.length;
  const dailyPokemon = filteredPokemon[index];
  // If value is an array (for forms), pick the first form for now
  const name = Array.isArray(dailyPokemon.value) ? dailyPokemon.value[0] : dailyPokemon.value;
  // Fetch data from API
  const data = await getWordlePokemonData(name.toLowerCase());
  return data;
}

/**
 * Compares the guessed Pokémon with the target Pokémon and returns feedback.
 */
export function comparePokemon(guess: PokemonWordleData, target: PokemonWordleData): GuessResult {
  const feedback: GuessResult['feedback'] = {
    type1: 'incorrect',
    type2: 'incorrect',
    generation: 'incorrect',
    evolutionStage: 'incorrect',
    color: 'incorrect',
    habitat: 'incorrect',
    height: 'incorrect',
    weight: 'incorrect',
    isLegendary: 'incorrect',
    isMythical: 'incorrect',
  };

  // Type Comparison
  const guessTypes = Array.isArray(guess.types) ? guess.types : [];
  const targetTypes = Array.isArray(target.types) ? target.types : [];

  const targetType1 = targetTypes[0];
  const targetType2 = targetTypes[1] || null;
  const guessType1 = guessTypes[0];
  const guessType2 = guessTypes[1] || null;

  // Type 1 feedback
  if (guessType1 === targetType1) {
    feedback.type1 = 'correct';
  } else if (guessType1 === targetType2) {
    feedback.type1 = 'partial';
  }

  // Type 2 feedback
  if (guessType2 === targetType2) { // This handles null === null for single-type pokemons
    feedback.type2 = 'correct';
  } else if (guessType2 && guessType2 === targetType1) { // check guessType2 exists before comparing
    feedback.type2 = 'partial';
  }

  // Generation Comparison
  if (guess.generation === target.generation) {
    feedback.generation = 'correct';
  } else {
    feedback.generation = guess.generation > target.generation ? 'lower' : 'higher';
  }

  // Evolution Stage Comparison
  if (guess.evolutionStage === target.evolutionStage) {
    feedback.evolutionStage = 'correct';
  } else {
    feedback.evolutionStage = guess.evolutionStage > target.evolutionStage ? 'lower' : 'higher';
  }

  // Color Comparison
  if (guess.color === target.color) {
    feedback.color = 'correct';
  }

  // Habitat Comparison
  if (guess.habitat === target.habitat) {
    feedback.habitat = 'correct';
  }

  // Height Comparison
  if (guess.height === target.height) {
    feedback.height = 'correct';
  } else {
    feedback.height = guess.height > target.height ? 'lower' : 'higher';
  }

  // Weight Comparison
  if (guess.weight === target.weight) {
    feedback.weight = 'correct';
  } else {
    feedback.weight = guess.weight > target.weight ? 'lower' : 'higher';
  }

  // Legendary Comparison
  if (guess.isLegendary === target.isLegendary) {
    feedback.isLegendary = 'correct';
  }

  // Mythical Comparison
  if (guess.isMythical === target.isMythical) {
    feedback.isMythical = 'correct';
  }

  return { pokemon: guess, feedback };
}

let allPokemonNamesAndIds: { name: string; id: number }[] | null = null;

export async function getPokemonIdByName(name: string): Promise<number | undefined> {
  if (!allPokemonNamesAndIds) {
    const response = await getPokemonList(10000); // Fetch all Pokémon
    allPokemonNamesAndIds = response.data.results.map((p, index) => ({
      name: p.name,
      id: index + 1, // Assuming IDs are sequential from 1
    }));
  }
  const entry = allPokemonNamesAndIds.find(
    (p) => p.name.toLowerCase() === name.toLowerCase()
  );
  return entry?.id;
}


// Example usage (async context):
// const allPokemon = await fetchAllPokemonPaginated();