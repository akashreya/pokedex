import { getPokemonList } from '../services/pokedexapi';

/**
 * Fetch all Pokémon from the API, paginating until all are retrieved.
 * Returns an array of { name, url } objects.
 */
export async function fetchAllPokemonPaginated() {
    let allResults: any[] = [];
    let offset = 0;
    const limit = 1000; // PokeAPI max per request
    let hasNext = true;

    while (hasNext) {
        const response = await getPokemonList(limit, offset);
        allResults = allResults.concat(response.data.results);
        if (response.data.next) {
            // Extract next offset from the URL
            const url = new URL(response.data.next);
            offset = parseInt(url.searchParams.get('offset') || '0', 10);
        } else {
            hasNext = false;
        }
    }
    return allResults;
} 