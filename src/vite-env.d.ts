/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_PERFORMANCE_MONITORING: string
  readonly VITE_ENABLE_ERROR_LOGGING: string
  readonly VITE_GOOGLE_ANALYTICS_ID: string
  readonly VITE_SENTRY_DSN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Module declarations for JSX files
declare module "*.jsx" {
  const content: any;
  export default content;
}

declare module "*.js" {
  const content: any;
  export default content;
}

// Specific declaration for types constants
declare module "@/constants/types" {
  export const TYPE_COLORS: Record<string, string>;
  export const GRADIENT_CLASSES: Record<string, string>;
}

// Specific declarations for JSX components with file extensions
declare module "../components/layout/LoadingSpinner.jsx" {
  const LoadingSpinner: React.ComponentType;
  export default LoadingSpinner;
}

declare module "../utils/pokemon.js" {
  export function getGradientClass(type1: string, type2?: string): string;
  export function getRegion(id: number): string;
}

declare module "../components/home/TypeLogoBadge.jsx" {
  const TypeLogoBadge: React.ComponentType<{ type: string }>;
  export default TypeLogoBadge;
}

declare module "../components/home/StatBar.jsx" {
  const StatBar: React.ComponentType<{ stat: any }>;
  export default StatBar;
}

declare module "../components/pokemon/PokemonStats" {
  const PokemonStats: React.ComponentType<{ stats: Array<{ stat: { name: string }; base_stat: number }> }>;
  export default PokemonStats;
}

declare module "../components/pokemon/PokemonMoves" {
  const PokemonMoves: React.ComponentType<{ 
    moves: Array<{
      move: { name: string };
      version_group_details: Array<{
        level_learned_at: number;
        move_learn_method: { name: string };
      }>;
    }>;
  }>;
  export default PokemonMoves;
}

declare module "../components/pokemon/PokemonEvolution" {
  const PokemonEvolution: React.ComponentType<{ 
    pokemon: {
      id: number;
      name: string;
      species: { url: string };
      sprites: {
        other: {
          dream_world?: { front_default?: string };
          home?: { front_default?: string };
        };
        front_default: string;
      };
    };
    sprites: { default: string };
  }>;
  export default PokemonEvolution;
}

declare module "../components/pokemon/PokemonAbout" {
  const PokemonAbout: React.ComponentType<{ 
    pokemon: {
      id: number;
      height: number;
      weight: number;
      species: { name: string };
    };
    description: string;
  }>;
  export default PokemonAbout;
}

declare module "../components/pokemon/TypeEffectiveness" {
  const TypeEffectiveness: React.ComponentType<{ 
    pokemonTypes: Array<{
      type: { name: string };
    }>;
  }>;
  export default TypeEffectiveness;
}

declare module "../components/pokemon/TypeResistance" {
  const TypeResistance: React.ComponentType<{ 
    pokemonTypes: Array<{
      type: { name: string };
    }>;
  }>;
  export default TypeResistance;
}

declare module "../hooks/useEvolutionChain" {
  export function useEvolutionChain(chainId: number | null): {
    data: any;
    loading: boolean;
  };
} 