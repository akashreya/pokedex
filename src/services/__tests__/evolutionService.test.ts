import { 
  getEvolutionChainForPokemon, 
  getRelevantEvolutionPath,
  findPokemonInChain,
  isFullyEvolved,
  getAllEvolutions,
  isBabyPokemon,
  getEvolutionMethods
} from '../evolutionService';

// Mock the cache service
jest.mock('../cache', () => ({
  fetchWithCache: jest.fn(),
}));

import { fetchWithCache } from '../cache';

const mockFetchWithCache = fetchWithCache as jest.MockedFunction<typeof fetchWithCache>;

describe('Evolution Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getEvolutionChainForPokemon', () => {
    it('should fetch evolution chain successfully', async () => {
      const mockSpeciesData = {
        id: 1,
        name: 'bulbasaur',
        evolution_chain: {
          url: 'https://pokeapi.co/api/v2/evolution-chain/1/'
        },
        is_baby: false,
        is_legendary: false,
        is_mythical: false
      };

      const mockEvolutionData = {
        id: 1,
        url: 'https://pokeapi.co/api/v2/evolution-chain/1/',
        chain: {
          species: {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon-species/1/'
          },
          evolution_details: [],
          evolves_to: [
            {
              species: {
                name: 'ivysaur',
                url: 'https://pokeapi.co/api/v2/pokemon-species/2/'
              },
              evolution_details: [
                {
                  min_level: 16,
                  trigger: { name: 'level-up' }
                }
              ],
              evolves_to: [
                {
                  species: {
                    name: 'venusaur',
                    url: 'https://pokeapi.co/api/v2/pokemon-species/3/'
                  },
                  evolution_details: [
                    {
                      min_level: 32,
                      trigger: { name: 'level-up' }
                    }
                  ],
                  evolves_to: []
                }
              ]
            }
          ]
        }
      };

      mockFetchWithCache
        .mockResolvedValueOnce(mockSpeciesData)
        .mockResolvedValueOnce(mockEvolutionData);

      const result = await getEvolutionChainForPokemon(1);

      expect(result).toBeDefined();
      expect(result?.id).toBe(1);
      expect(result?.chain.name).toBe('bulbasaur');
      expect(result?.chain.evolvesTo).toHaveLength(1);
      expect(result?.chain.evolvesTo[0].name).toBe('ivysaur');
      expect(result?.chain.evolvesTo[0].evolutionMethod).toBe('Level 16');
    });

    it('should handle missing evolution chain URL', async () => {
      const mockSpeciesData = {
        id: 1,
        name: 'bulbasaur',
        evolution_chain: null,
        is_baby: false,
        is_legendary: false,
        is_mythical: false
      };

      mockFetchWithCache.mockResolvedValueOnce(mockSpeciesData);

      const result = await getEvolutionChainForPokemon(1);

      expect(result).toBeNull();
    });

    it('should handle API errors gracefully', async () => {
      mockFetchWithCache.mockRejectedValueOnce(new Error('API Error'));

      const result = await getEvolutionChainForPokemon(1);

      expect(result).toBeNull();
    });
  });

  describe('getRelevantEvolutionPath', () => {
    it('should extract evolution path for base form', async () => {
      const mockSpeciesData = {
        id: 1,
        name: 'bulbasaur',
        evolution_chain: {
          url: 'https://pokeapi.co/api/v2/evolution-chain/1/'
        },
        is_baby: false,
        is_legendary: false,
        is_mythical: false
      };

      const mockEvolutionData = {
        id: 1,
        url: 'https://pokeapi.co/api/v2/evolution-chain/1/',
        chain: {
          species: {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon-species/1/'
          },
          evolution_details: [],
          evolves_to: [
            {
              species: {
                name: 'ivysaur',
                url: 'https://pokeapi.co/api/v2/pokemon-species/2/'
              },
              evolution_details: [
                {
                  min_level: 16,
                  trigger: { name: 'level-up' }
                }
              ],
              evolves_to: [
                {
                  species: {
                    name: 'venusaur',
                    url: 'https://pokeapi.co/api/v2/pokemon-species/3/'
                  },
                  evolution_details: [
                    {
                      min_level: 32,
                      trigger: { name: 'level-up' }
                    }
                  ],
                  evolves_to: []
                }
              ]
            }
          ]
        }
      };

      mockFetchWithCache
        .mockResolvedValueOnce(mockSpeciesData)
        .mockResolvedValueOnce(mockEvolutionData);

      const result = await getRelevantEvolutionPath(1);

      expect(result).toBeDefined();
      expect(result?.current).toBe('bulbasaur');
      expect(result?.previous).toEqual([]);
      expect(result?.next).toEqual(['ivysaur']);
      expect(result?.evolutionMethods).toEqual(['Level 16']);
    });

    it('should extract evolution path for evolved form', async () => {
      const mockSpeciesData = {
        id: 2,
        name: 'ivysaur',
        evolution_chain: {
          url: 'https://pokeapi.co/api/v2/evolution-chain/1/'
        },
        is_baby: false,
        is_legendary: false,
        is_mythical: false
      };

      const mockEvolutionData = {
        id: 1,
        url: 'https://pokeapi.co/api/v2/evolution-chain/1/',
        chain: {
          species: {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon-species/1/'
          },
          evolution_details: [],
          evolves_to: [
            {
              species: {
                name: 'ivysaur',
                url: 'https://pokeapi.co/api/v2/pokemon-species/2/'
              },
              evolution_details: [
                {
                  min_level: 16,
                  trigger: { name: 'level-up' }
                }
              ],
              evolves_to: [
                {
                  species: {
                    name: 'venusaur',
                    url: 'https://pokeapi.co/api/v2/pokemon-species/3/'
                  },
                  evolution_details: [
                    {
                      min_level: 32,
                      trigger: { name: 'level-up' }
                    }
                  ],
                  evolves_to: []
                }
              ]
            }
          ]
        }
      };

      mockFetchWithCache
        .mockResolvedValueOnce(mockSpeciesData)
        .mockResolvedValueOnce(mockEvolutionData);

      const result = await getRelevantEvolutionPath(2);

      expect(result).toBeDefined();
      expect(result?.current).toBe('ivysaur');
      expect(result?.previous).toEqual(['bulbasaur']);
      expect(result?.next).toEqual(['venusaur']);
      expect(result?.evolutionMethods).toEqual(['Level 32']);
    });

    it('should handle single-stage Pokémon', async () => {
      const mockSpeciesData = {
        id: 133,
        name: 'eevee',
        evolution_chain: {
          url: 'https://pokeapi.co/api/v2/evolution-chain/67/'
        },
        is_baby: false,
        is_legendary: false,
        is_mythical: false
      };

      const mockEvolutionData = {
        id: 67,
        url: 'https://pokeapi.co/api/v2/evolution-chain/67/',
        chain: {
          species: {
            name: 'eevee',
            url: 'https://pokeapi.co/api/v2/pokemon-species/133/'
          },
          evolution_details: [],
          evolves_to: [
            {
              species: {
                name: 'vaporeon',
                url: 'https://pokeapi.co/api/v2/pokemon-species/134/'
              },
              evolution_details: [
                {
                  item: { name: 'water-stone' },
                  trigger: { name: 'use-item' }
                }
              ],
              evolves_to: []
            },
            {
              species: {
                name: 'jolteon',
                url: 'https://pokeapi.co/api/v2/pokemon-species/135/'
              },
              evolution_details: [
                {
                  item: { name: 'thunder-stone' },
                  trigger: { name: 'use-item' }
                }
              ],
              evolves_to: []
            }
          ]
        }
      };

      mockFetchWithCache
        .mockResolvedValueOnce(mockSpeciesData)
        .mockResolvedValueOnce(mockEvolutionData);

      const result = await getRelevantEvolutionPath(133);

      expect(result).toBeDefined();
      expect(result?.current).toBe('eevee');
      expect(result?.previous).toEqual([]);
      expect(result?.next).toEqual(['vaporeon', 'jolteon']);
      expect(result?.allBranches).toBeDefined();
    });
  });

  describe('Helper Functions', () => {
    const mockChain = {
      id: 1,
      name: 'bulbasaur',
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      evolvesTo: [
        {
          id: 2,
          name: 'ivysaur',
          sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png',
          evolutionMethod: 'Level 16',
          evolvesTo: [
            {
              id: 3,
              name: 'venusaur',
              sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png',
              evolutionMethod: 'Level 32',
              evolvesTo: []
            }
          ]
        }
      ]
    };

    describe('findPokemonInChain', () => {
      it('should find Pokémon in chain', () => {
        const result = findPokemonInChain(mockChain, 'ivysaur');
        expect(result).toBeDefined();
        expect(result?.name).toBe('ivysaur');
      });

      it('should return null for non-existent Pokémon', () => {
        const result = findPokemonInChain(mockChain, 'pikachu');
        expect(result).toBeNull();
      });
    });

    describe('isFullyEvolved', () => {
      it('should return true for fully evolved Pokémon', () => {
        const result = isFullyEvolved(mockChain, 'venusaur');
        expect(result).toBe(true);
      });

      it('should return false for base form', () => {
        const result = isFullyEvolved(mockChain, 'bulbasaur');
        expect(result).toBe(false);
      });
    });

    describe('getAllEvolutions', () => {
      it('should return all evolutions for base form', () => {
        const result = getAllEvolutions(mockChain, 'bulbasaur');
        expect(result).toEqual(['ivysaur', 'venusaur']);
      });

      it('should return empty array for fully evolved Pokémon', () => {
        const result = getAllEvolutions(mockChain, 'venusaur');
        expect(result).toEqual([]);
      });
    });

    describe('isBabyPokemon', () => {
      it('should return false for regular Pokémon', () => {
        const result = isBabyPokemon(mockChain, 'bulbasaur');
        expect(result).toBe(false);
      });
    });

    describe('getEvolutionMethods', () => {
      it('should return evolution methods for base form', () => {
        const result = getEvolutionMethods(mockChain, 'bulbasaur');
        expect(result).toEqual(['Level 16']);
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle Pokémon with no evolutions', async () => {
      const mockSpeciesData = {
        id: 1,
        name: 'kangaskhan',
        evolution_chain: {
          url: 'https://pokeapi.co/api/v2/evolution-chain/1/'
        },
        is_baby: false,
        is_legendary: false,
        is_mythical: false
      };

      const mockEvolutionData = {
        id: 1,
        url: 'https://pokeapi.co/api/v2/evolution-chain/1/',
        chain: {
          species: {
            name: 'kangaskhan',
            url: 'https://pokeapi.co/api/v2/pokemon-species/115/'
          },
          evolution_details: [],
          evolves_to: []
        }
      };

      mockFetchWithCache
        .mockResolvedValueOnce(mockSpeciesData)
        .mockResolvedValueOnce(mockEvolutionData);

      const result = await getRelevantEvolutionPath(115);

      expect(result).toBeDefined();
      expect(result?.previous).toEqual([]);
      expect(result?.next).toEqual([]);
    });

    it('should handle baby Pokémon', async () => {
      const mockSpeciesData = {
        id: 172,
        name: 'pichu',
        evolution_chain: {
          url: 'https://pokeapi.co/api/v2/evolution-chain/10/'
        },
        is_baby: true,
        is_legendary: false,
        is_mythical: false
      };

      const mockEvolutionData = {
        id: 10,
        url: 'https://pokeapi.co/api/v2/evolution-chain/10/',
        chain: {
          species: {
            name: 'pichu',
            url: 'https://pokeapi.co/api/v2/pokemon-species/172/'
          },
          evolution_details: [],
          evolves_to: [
            {
              species: {
                name: 'pikachu',
                url: 'https://pokeapi.co/api/v2/pokemon-species/25/'
              },
              evolution_details: [
                {
                  min_happiness: 220,
                  trigger: { name: 'level-up' }
                }
              ],
              evolves_to: []
            }
          ]
        }
      };

      mockFetchWithCache
        .mockResolvedValueOnce(mockSpeciesData)
        .mockResolvedValueOnce(mockEvolutionData);

      const result = await getRelevantEvolutionPath(172);

      expect(result).toBeDefined();
      expect(result?.isBaby).toBe(true);
      expect(result?.next).toEqual(['pikachu']);
    });
  });
}); 