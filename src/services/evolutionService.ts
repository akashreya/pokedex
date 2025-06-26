import { fetchWithCache } from "./cache";

// --- TypeScript interfaces for evolution data ---

export interface EvolutionNode {
  id: number;
  name: string;
  sprite: string;
  min_level?: number;
  trigger?: string;
  item?: string;
  condition?: string;
  evolvesTo: EvolutionNode[];
  isBaby?: boolean;
  isRegional?: boolean;
  evolutionMethod?: string;
  evolutionDetails?: any[]; // Raw evolution details from API
  pokemonData?: any; // Full Pokemon data from API (added for enriched evolution tree)
}

export interface EvolutionChain {
  id: number;
  chain: EvolutionNode;
}

// New explicit result types based on the evolution logic document
export type EvolutionResultType = 
  | "complete-tree"    // For base forms showing full evolution family
  | "linear-path"      // For final evolutions showing path ending with target
  | "mid-evolution"    // For middle stages showing previous + next context
  | "single-stage";    // For Pokémon with no evolutions

export interface EvolutionPath {
  current: string;
  previous: string[];
  next: string[];
  conditions?: string[];
  isBaby?: boolean;
  isRegional?: boolean;
  evolutionMethods?: any; // Accepts full evolvesTo array or string[]
  allBranches?: string[][]; // For base forms with multiple evolutions
  // New result type classification
  resultType: EvolutionResultType;
  evolutionTree?: EvolutionNode; // For complete-tree type
  evolutionPath?: string[]; // For linear-path type
  // Enhanced evolution details for better descriptions
  evolutionDetails?: Array<{
    pokemonName: string;
    details: any[]; // Raw evolution details from API
  }>;
}

export interface DetailedEvolutionPath {
  nodes: EvolutionNode[];
  conditions: string[];
  methods: string[];
}

export interface SpeciesData {
  id: number;
  name: string;
  evolution_chain: {
    url: string;
  };
  evolves_from_species?: {
    name: string;
    url: string;
  };
  is_baby?: boolean;
  is_legendary?: boolean;
  is_mythical?: boolean;
}

export interface RawEvolutionChain {
  id: number;
  url?: string;
  chain: {
    species: {
      name: string;
      url: string;
    };
    evolution_details: any[];
    evolves_to: any[];
  };
}

// --- Main evolution service functions ---

/**
 * Get the evolution chain for a specific Pokémon by ID
 * This follows the multi-step process: species data → evolution chain URL → evolution chain data
 */
export const getEvolutionChainForPokemon = async (pokemonId: number): Promise<EvolutionChain | null> => {
  try {
    // Step 1: Fetch the Pokémon species data to get the evolution chain URL
    const speciesData = await fetchWithCache<SpeciesData>(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
    
    if (!speciesData.evolution_chain?.url) {
      return null;
    }
    
    // Step 2: Fetch the evolution chain data using the URL from species data
    const evolutionChainUrl = speciesData.evolution_chain.url;
    const evolutionData = await fetchWithCache<RawEvolutionChain>(evolutionChainUrl);
    
    // Step 3: Parse the evolution chain data into our structured format
    return  parseEvolutionChain(evolutionData, speciesData);
  } catch (error) {
    console.error('Error fetching evolution chain:', error);
    return null;
  }
};

/**
 * Extract only the relevant evolution path for a given Pokémon
 * This implements the enhanced logic described in task 12 with explicit result type classification
 */
export const getRelevantEvolutionPath = async (pokemonId: number): Promise<EvolutionPath | null> => {
  try {
    console.debug(`[DEBUG] Getting evolution path for Pokémon ID: ${pokemonId}`);
    
    const evolutionChain = await getEvolutionChainForPokemon(pokemonId);
    if (!evolutionChain) {
      console.debug(`[DEBUG] No evolution chain found for Pokémon ID: ${pokemonId}`);
      return null;
    }

    // Get the target Pokémon name from the species data
    const speciesData = await fetchWithCache<SpeciesData>(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`);
    const targetPokemonName = speciesData.name;
    
    console.debug(`[DEBUG] Target Pokémon name: ${targetPokemonName}`);

    // Extract all possible evolution paths with detailed information
    const allPaths = extractAllDetailedEvolutionPaths(evolutionChain.chain);
    console.debug(`[DEBUG] All paths found:`, allPaths.length);
    allPaths.forEach((path, index) => {
      console.debug(`[DEBUG] Path ${index}:`, path.nodes.map(n => n.name));
    });
    
    // Find the relevant path(s) for the target Pokémon using the decision tree logic
    const result = findRelevantPathWithDecisionTree(allPaths, targetPokemonName, evolutionChain.chain, speciesData);
    console.debug(`[DEBUG] Final result:`, result);
    
    return result;
  } catch (error) {
    console.error('Error extracting evolution path:', error);
    return null;
  }
};

// --- Enhanced Helper functions with Decision Tree Logic ---

/**
 * Parse the raw evolution chain data into our structured format
 */
const parseEvolutionChain = (data: RawEvolutionChain, speciesData: SpeciesData): EvolutionChain => {
  const chainId = data.url ? extractIdFromUrl(data.url) : data.id;
  
  return {
    id: chainId,
    chain: parseEvolutionNode(data.chain, speciesData)
  };
};

/**
 * Parse a single evolution node recursively with enhanced metadata
 */
const parseEvolutionNode = (node: any, speciesData?: SpeciesData): EvolutionNode => {
  const id = extractIdFromUrl(node.species.url);
  
  // Create the evolution node with enhanced information
  const evolutionNode: EvolutionNode = {
    id,
    name: node.species.name,
    sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
    evolvesTo: [],
    isBaby: speciesData?.is_baby || false,
    isRegional: false, // Will be enhanced later if needed
    evolutionDetails: node.evolution_details || [] // Store raw evolution details
  };
  
  // Parse evolution details for each evolution
  if (node.evolves_to && node.evolves_to.length > 0) {
    evolutionNode.evolvesTo = node.evolves_to.map((evo: any) => {
      // Create the evolved node first
      const evolvedNode = parseEvolutionNode(evo);
      
      // Extract evolution details from the first evolution_details entry
      if (evo.evolution_details && evo.evolution_details.length > 0) {
        const details = evo.evolution_details[0];
        
        // Set evolution method on the evolved node (not the current node)
        evolvedNode.evolutionMethod = formatEvolutionMethod(details);
        
        // Handle other conditions (time_of_day, location, etc.)
        const conditions = [];
        if (details.time_of_day) conditions.push(`Time: ${details.time_of_day}`);
        if (details.location) conditions.push(`Location: ${details.location.name}`);
        if (details.held_item) conditions.push(`Holding: ${details.held_item.name}`);
        if (details.known_move) conditions.push(`Knows move: ${details.known_move.name}`);
        if (details.min_happiness) conditions.push(`Happiness: ${details.min_happiness}+`);
        
        if (conditions.length > 0) {
          evolvedNode.condition = conditions.join(', ');
        }
      }
      
      return evolvedNode;
    });
  }
  
  return evolutionNode;
};

/**
 * Format evolution method into a user-friendly string
 */
const formatEvolutionMethod = (details: any): string => {
  if (details.min_level) {
    return `Level ${details.min_level}`;
  }
  if (details.item) {
    const itemName = typeof details.item === 'string' ? details.item : details.item.name;
    return `Use ${itemName.replace(/-/g, ' ')}`;
  }
  if (details.trigger) {
    const triggerName = typeof details.trigger === 'string' ? details.trigger : details.trigger.name;
    return triggerName.replace(/-/g, ' ');
  }
  if (details.trade_species) {
    const tradeName = typeof details.trade_species === 'string' ? details.trade_species : details.trade_species.name;
    return `Trade with ${tradeName}`;
  }
  return 'Special';
};

/**
 * Extract all possible evolution paths with detailed information
 */
const extractAllDetailedEvolutionPaths = (chain: EvolutionNode): DetailedEvolutionPath[] => {
  const paths: DetailedEvolutionPath[] = [];
  
  const traverse = (node: EvolutionNode, currentPath: EvolutionNode[], currentConditions: string[], currentMethods: string[]) => {
    const newPath = [...currentPath, node];
    const newConditions = [...currentConditions];
    const newMethods = [...currentMethods];
    
    // Add current node's evolution method if it exists
    if (node.evolutionMethod) {
      newMethods.push(node.evolutionMethod);
    }
    if (node.condition) {
      newConditions.push(node.condition);
    }
    
    if (node.evolvesTo.length === 0) {
      // This is a final evolution, add the path
      paths.push({
        nodes: newPath,
        conditions: newConditions,
        methods: newMethods
      });
    } else {
      // Continue traversing for each evolution (this handles branching)
      node.evolvesTo.forEach(evo => traverse(evo, newPath, newConditions, newMethods));
    }
  };
  
  traverse(chain, [], [], []);
  return paths;
};

/**
 * Enhanced function to find the relevant evolution path using the decision tree logic from the document
 * Implements the exact priority order: Base Form Check → Final Form Check → Mid-Evolution Check
 */
const findRelevantPathWithDecisionTree = (
  allPaths: DetailedEvolutionPath[], 
  targetPokemon: string, 
  chain: EvolutionNode,
  speciesData: SpeciesData
): EvolutionPath => {
  const targetName = targetPokemon.toLowerCase();
  
  // 🔍 DECISION 1: Is target the BASE form? (highest priority)
  if (chain.name.toLowerCase() === targetName) {
    console.debug(`[DEBUG] Decision 1: ${targetPokemon} is the BASE form`);
    
    // For base forms, show all possible full evolution branches
    const allBranches = allPaths
      .filter(path => path.nodes[0].name.toLowerCase() === targetName)
      .map(path => path.nodes.map(node => node.name));
    
    // Collect evolution details for next evolutions
    const evolutionDetails = chain.evolvesTo.map(evo => ({
      pokemonName: evo.name,
      details: evo.evolutionDetails || []
    }));
    
    return {
      current: targetPokemon,
      previous: [],
      next: chain.evolvesTo.map(evo => evo.name),
      allBranches,
      isBaby: speciesData.is_baby,
      isRegional: false,
      // Send the entire evolvesTo array for full data access
      evolutionMethods: chain.evolvesTo,
      resultType: "complete-tree",
      evolutionTree: chain,
      evolutionDetails
    };
  }
  
  // 🔍 DECISION 2: Is target a FINAL evolution? (medium priority)
  const finalPath = allPaths.find(path => 
    path.nodes[path.nodes.length - 1].name.toLowerCase() === targetName
  );
  
  if (finalPath) {
    console.debug(`[DEBUG] Decision 2: ${targetPokemon} is a FINAL evolution`);
    
    if (finalPath.nodes.length === 1) {
      // Single-stage Pokémon with no evolutions
      return {
        current: targetPokemon,
        previous: [],
        next: [],
        isBaby: speciesData.is_baby,
        isRegional: false,
        resultType: "single-stage",
        evolutionPath: [targetPokemon]
      };
    }
    
    // Final evolution with a path leading to it
    const evolutionPath = finalPath.nodes.map(node => node.name);
    // Use the new utility to get aligned evolution details
    const evolutionDetails = getEvolutionDetailsForPath(evolutionPath, chain);
    console.debug("[DEBUG] evolutionDetails" , evolutionDetails)
    return {
      current: targetPokemon,
      previous: evolutionPath.slice(0, -1), // All except the last (target)
      next: [], // No next evolutions for final forms
      conditions: finalPath.conditions,
      isBaby: speciesData.is_baby,
      isRegional: false,
      evolutionMethods: finalPath.methods,
      resultType: "linear-path",
      evolutionPath: evolutionPath,
      evolutionDetails
    };
  }
  
  // 🔍 DECISION 3: Is target a MID-evolution? (lowest priority)
  const nodeResult = findNodeAndPath(chain, targetName);
  if (nodeResult) {
    console.debug(`[DEBUG] Decision 3: ${targetPokemon} is a MID-evolution`, nodeResult);
    
    // Collect evolution details for next evolutions
    const evolutionDetails = nodeResult.node.evolvesTo.map(evo => ({
      pokemonName: evo.name,
      details: evo.evolutionDetails || []
    }));
    
    return {
      current: targetPokemon,
      previous: nodeResult.previousPath,
      next: nodeResult.node.evolvesTo.map(evo => evo.name),
      isBaby: speciesData.is_baby,
      isRegional: false,
      // Send the entire evolvesTo array for full data access
      evolutionMethods: chain,
      resultType: "mid-evolution",
      evolutionDetails
    };
  }
  
  // Fallback: Single-stage Pokémon
  console.debug(`[DEBUG] Fallback: ${targetPokemon} appears to be single-stage`);
  return {
    current: targetPokemon,
    previous: [],
    next: [],
    isBaby: speciesData.is_baby,
    isRegional: false,
    resultType: "single-stage",
    evolutionPath: [targetPokemon]
  };
};

/**
 * Find a specific Pokémon within the evolution tree and return its context
 * This implements the findNodeAndPath helper from the document
 */
const findNodeAndPath = (node: EvolutionNode, target: string, currentPath: string[] = []): { node: EvolutionNode; previousPath: string[] } | null => {
  if (node.name.toLowerCase() === target.toLowerCase()) {
    return {
      node: node,                    // The actual node data
      previousPath: currentPath      // Path to reach this node
    };
  }
  
  const newPath = [...currentPath, node.name];
  
  // Search in children recursively
  for (const evolution of node.evolvesTo) {
    const result = findNodeAndPath(evolution, target, newPath);
    if (result) return result;
  }
  
  return null;
};

/**
 * Extract ID from a PokéAPI URL
 */
const extractIdFromUrl = (url: string): number => {
  const matches = url.match(/\/(\d+)\/?$/);
  return matches ? parseInt(matches[1], 10) : 0;
};

/**
 * Helper function to find a specific Pokémon in an evolution chain
 */
export const findPokemonInChain = (chain: EvolutionNode, pokemonName: string): EvolutionNode | null => {
  if (chain.name === pokemonName) {
    return chain;
  }
  
  for (const evolution of chain.evolvesTo) {
    const found = findPokemonInChain(evolution, pokemonName);
    if (found) return found;
  }
  
  return null;
};

/**
 * Check if a Pokémon is fully evolved
 */
export const isFullyEvolved = (chain: EvolutionNode, pokemonName: string): boolean => {
  const pokemon = findPokemonInChain(chain, pokemonName);
  return pokemon ? pokemon.evolvesTo.length === 0 : false;
};

/**
 * Get all possible evolutions for a Pokémon
 */
export const getAllEvolutions = (chain: EvolutionNode, pokemonName: string): string[] => {
  const pokemon = findPokemonInChain(chain, pokemonName);
  if (!pokemon) return [];
  
  const evolutions: string[] = [];
  
  const collectEvolutions = (node: EvolutionNode) => {
    node.evolvesTo.forEach(evo => {
      evolutions.push(evo.name);
      collectEvolutions(evo);
    });
  };
  
  collectEvolutions(pokemon);
  return evolutions;
};

/**
 * Check if a Pokémon is a baby Pokémon
 */
export const isBabyPokemon = (chain: EvolutionNode, pokemonName: string): boolean => {
  const pokemon = findPokemonInChain(chain, pokemonName);
  return pokemon ? pokemon.isBaby || false : false;
};

/**
 * Get evolution methods for a specific Pokémon
 */
export const getEvolutionMethods = (chain: EvolutionNode, pokemonName: string): string[] => {
  const pokemon = findPokemonInChain(chain, pokemonName);
  if (!pokemon) return [];
  
  return pokemon.evolvesTo.map(evo => evo.evolutionMethod || 'Unknown');
};

// Utility: For a given path of names and the root evolution chain, return aligned evolution details
export function getEvolutionDetailsForPath(pathNames: string[], evolutionChain: EvolutionNode): (any | null)[] {
  if (!Array.isArray(pathNames) || pathNames.length === 0) return [];
  const detailsArr: (any | null)[] = [null]; // First is always null (base form)
  let currentNode = evolutionChain;
  for (let i = 1; i < pathNames.length; i++) {
   
    const currName = pathNames[i];
    // Find the previous node in the chain (should be currentNode at first, then descend)
    // Find the child in evolvesTo with the current name
    const nextNode = currentNode.evolvesTo.find((child) => child.name === currName);
    if (nextNode && Array.isArray(nextNode.evolutionDetails) && nextNode.evolutionDetails.length > 0) {
      detailsArr.push(nextNode.evolutionDetails[0]);
      currentNode = nextNode;
    } else {
      detailsArr.push(null);
      // Try to descend anyway if possible
      if (nextNode) currentNode = nextNode;
    }
  }
  return detailsArr;
} 