import { GRADIENT_CLASSES } from "@/constants/PokemonTypes";
import { REGIONS_WITH_RANGE } from "@/constants/PokemonRegions";

export function getGradientClass(type1: string, type2?: string): string {
  if (type1 === type2) {
    return GRADIENT_CLASSES[type1 as keyof typeof GRADIENT_CLASSES];
  }
  return `from-type-gradient-${type1} to-type-gradient-${type2 || type1}`;
}

export function getRegion(id: number): string {
  for (const region of REGIONS_WITH_RANGE) {
    if (id >= region.range[0] && id <= region.range[1]) return region.name;
  }
  return "Unknown";
}

export function getPokemonGradientClass(pokemonData: any): string {
  const type1 = pokemonData?.types?.[0]?.type?.name;
  const type2 = pokemonData?.types?.[1]?.type?.name || type1;
  return type1 ? getGradientClass(type1, type2) : "bg-gray-100";
}