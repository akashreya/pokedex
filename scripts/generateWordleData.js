
import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';

// Fetches data from a given PokéAPI URL
async function fetchApi(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${url}:`, error);
    return null;
  }
}

// Extracts the evolution stage of a Pokémon from its evolution chain
function getEvolutionStage(chain, pokemonName) {
  let stage = 0;
  let current = chain.chain;
  while (current) {
    stage++;
    if (current.species.name === pokemonName) {
      return stage;
    }
    // Check branched evolutions
    if (current.evolves_to.length > 0) {
      for (const evolution of current.evolves_to) {
        if (evolution.species.name === pokemonName) {
          return stage + 1;
        }
      }
      current = current.evolves_to[0]; // Continue down the first branch
    } else {
      current = null;
    }
  }
  return 1; // Default to 1 if not found (should not happen)
}

async function generateWordleData() {
  console.log('Starting Pokémon data generation...');

  // 1. Fetch all Pokémon species (up to Gen 6 for MVP)
  const pokemonListResponse = await fetchApi(`${POKEAPI_BASE_URL}/pokemon?limit=10000`);
  if (!pokemonListResponse) {
    console.error('Could not fetch Pokémon list. Aborting.');
    return;
  }

  const allPokemonEntries = pokemonListResponse.results;
  const wordleData = [];
  let count = 0;

  console.log(`Found ${allPokemonEntries.length} Pokémon to process.`);

  // 2. Process each Pokémon
  for (const entry of allPokemonEntries) {
    const pokemonName = entry.name;
    console.log(`Processing ${pokemonName} (${++count}/${allPokemonEntries.length})...`);

    const pokemonData = await fetchApi(`${POKEAPI_BASE_URL}/pokemon/${pokemonName}`);
    if (!pokemonData) continue;

    const speciesData = await fetchApi(pokemonData.species.url);
    if (!speciesData) continue;

    // 3. Fetch and process evolution chain
    let evolutionStage = 1;
    if (speciesData.evolution_chain) {
      const evolutionChainData = await fetchApi(speciesData.evolution_chain.url);
      if (evolutionChainData) {
        evolutionStage = getEvolutionStage(evolutionChainData, pokemonName);
      }
    }

    wordleData.push({
      id: pokemonData.id,
      name: pokemonName,
      types: pokemonData.types.map((t) => t.type.name),
      generation: speciesData.generation.name.split('-')[1].toUpperCase(),
      evolutionStage: evolutionStage,
      color: speciesData.color.name,
      habitat: speciesData.habitat ? speciesData.habitat.name : 'unknown',
      isLegendary: speciesData.is_legendary,
      isMythical: speciesData.is_mythical,
      height: pokemonData.height / 10, // m
      weight: pokemonData.weight / 10, // kg
    });
  }

  // 4. Write to file
  const outputPath = path.join(__dirname, '..', 'src', 'constants', 'wordlePokemonData.json');
  fs.writeFileSync(outputPath, JSON.stringify(wordleData, null, 2));

  console.log(`
Successfully generated wordlePokemonData.json with ${wordleData.length} Pokémon!`);
  console.log(`File saved to: ${outputPath}`);
}

generateWordleData();
