import { TYPE_COLORS } from "@/constants/PokemonTypes";

// Add type effectiveness data
const typeEffectiveness: { [key: string]: { [key: string]: number } } = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2,
  },
  fairy: { fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

const allTypes = Object.keys(TYPE_COLORS);

interface PokemonType {
  type: {
    name: string;
  };
}

interface TypeEffectivenessResult {
  type: string;
  effectiveness: number;
}

export function calculateTypeEffectiveness(pokemonTypes: PokemonType[]): {
  weaknesses: TypeEffectivenessResult[];
  resistances: TypeEffectivenessResult[];
  immunities: TypeEffectivenessResult[];
} {
  const weaknesses: TypeEffectivenessResult[] = [];
  const resistances: TypeEffectivenessResult[] = [];
  const immunities: TypeEffectivenessResult[] = [];

  allTypes.forEach((type) => {
    let effectiveness = 1;
    pokemonTypes.forEach((pokemonType) => {
      const defendingType = pokemonType.type.name;
      if (typeEffectiveness[type]?.[defendingType] !== undefined) {
        effectiveness *= typeEffectiveness[type][defendingType];
      }
    });

    const result: TypeEffectivenessResult = {
      type,
      effectiveness,
    };

    if (effectiveness > 1) {
      weaknesses.push(result);
    } else if (effectiveness < 1 && effectiveness > 0) {
      resistances.push(result);
    } else if (effectiveness === 0) {
      immunities.push(result);
    }
  });

  return { weaknesses, resistances, immunities };
}

export { typeEffectiveness, allTypes };
export type { PokemonType, TypeEffectivenessResult };
