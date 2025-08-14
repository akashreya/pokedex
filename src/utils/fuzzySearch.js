/**
 * Simple fuzzy search utility for Pokemon names
 * Supports typos and partial matches with scoring
 */

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Calculate fuzzy match score (0-1, higher is better)
 */
function calculateScore(searchTerm, pokemonName) {
  const search = searchTerm.toLowerCase().trim();
  const name = pokemonName.toLowerCase();
  
  // Exact match gets perfect score
  if (name === search) return 1.0;
  
  // Starts with search term gets high score
  if (name.startsWith(search)) return 0.9;
  
  // Contains search term gets good score
  if (name.includes(search)) return 0.8;
  
  // For typo tolerance, use Levenshtein distance
  const distance = levenshteinDistance(search, name);
  const maxLength = Math.max(search.length, name.length);
  
  // Allow up to 2 character differences for reasonable matches
  if (distance <= 2 && search.length >= 3) {
    return Math.max(0.6 - (distance * 0.2), 0.3);
  }
  
  // Partial character matching for very short searches
  if (search.length <= 2 && name.includes(search)) {
    return 0.7;
  }
  
  return 0; // No match
}

/**
 * Fuzzy search for Pokemon with typo tolerance
 * @param {Array} pokemonList - Array of Pokemon objects
 * @param {string} searchTerm - Search query
 * @param {number} threshold - Minimum score threshold (0-1)
 * @returns {Array} Filtered and scored Pokemon array
 */
export function fuzzySearchPokemon(pokemonList, searchTerm, threshold = 0.3) {
  if (!searchTerm || searchTerm.trim().length === 0) {
    return pokemonList;
  }
  
  const term = searchTerm.trim();
  
  // If search term is a number, prioritize ID matching
  if (/^\d+$/.test(term)) {
    const exactIdMatch = pokemonList.filter(p => p.id.toString() === term);
    if (exactIdMatch.length > 0) return exactIdMatch;
    
    // Also check for ID partial matches
    const partialIdMatch = pokemonList.filter(p => p.id.toString().includes(term));
    if (partialIdMatch.length > 0) return partialIdMatch;
  }
  
  // Score and filter Pokemon by name
  const scoredResults = pokemonList
    .map(pokemon => ({
      ...pokemon,
      _fuzzyScore: calculateScore(term, pokemon.name)
    }))
    .filter(pokemon => pokemon._fuzzyScore >= threshold)
    .sort((a, b) => b._fuzzyScore - a._fuzzyScore); // Sort by best match first
  
  // Remove the scoring property before returning
  return scoredResults.map(({ _fuzzyScore, ...pokemon }) => pokemon);
}

/**
 * Get fuzzy search suggestions for autocomplete
 * @param {Array} pokemonList - Array of Pokemon objects  
 * @param {string} searchTerm - Search query
 * @param {number} maxSuggestions - Maximum number of suggestions
 * @returns {Array} Array of Pokemon names
 */
export function getFuzzySearchSuggestions(pokemonList, searchTerm, maxSuggestions = 5) {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }
  
  const results = fuzzySearchPokemon(pokemonList, searchTerm, 0.4);
  return results.slice(0, maxSuggestions).map(p => p.name);
}