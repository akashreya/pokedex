import { TYPE_COLORS, GRADIENT_CLASSES } from "@/constants/PokemonTypes"

export type PokemonType = keyof typeof TYPE_COLORS

export function getTypeColor(type: PokemonType): string {
  return TYPE_COLORS[type]
}

export function getTypeGradient(type: PokemonType): string {
  return GRADIENT_CLASSES[type]
}

export function formatTypeName(type: PokemonType): string {
  const typeName = type.toString()
  return typeName.charAt(0).toUpperCase() + typeName.slice(1)
}

export function isValidType(type: unknown): type is PokemonType {
  return typeof type === "string" && type in TYPE_COLORS
} 