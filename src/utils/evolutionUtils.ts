/**
 * Evolution utility functions for creating meaningful descriptions
 * and handling evolution-related data processing
 */

export interface EvolutionDetail {
  gender: number | null;
  held_item: { name: string; url: string } | null;
  item: { name: string; url: string } | null;
  known_move: { name: string; url: string } | null;
  known_move_type: { name: string; url: string } | null;
  location: { name: string; url: string } | null;
  min_affection: number | null;
  min_beauty: number | null;
  min_happiness: number | null;
  min_level: number | null;
  needs_overworld_rain: boolean;
  party_species: { name: string; url: string } | null;
  party_type: { name: string; url: string } | null;
  relative_physical_stats: number | null;
  time_of_day: string;
  trade_species: { name: string; url: string } | null;
  trigger: { name: string; url: string };
  turn_upside_down: boolean;
}

/**
 * Creates a meaningful, human-readable description from evolution details
 */
export function createEvolutionDescription(detail: EvolutionDetail): string {
  const parts: string[] = [];

  // Base trigger
  switch (detail.trigger.name) {
    case "use-item":
      parts.push("Evolves using");
      break;
    case "level-up":
      parts.push("Evolves by levelling");
      break;
    case "trade":
      parts.push("Evolves when traded");
      break;
    case "shed":
      parts.push("Evolves by shedding");
      break;
    case "other":
      parts.push("Evolves through");
      break;
    default:
      parts.push("Evolves");
      break;
  }

  // Add specific conditions
  if (detail.item) {
    parts.push(`a ${detail.item.name.replace('-', ' ').replace(/^./, c => c.toUpperCase())}`);
  }

  if (detail.min_level) {
    parts.push(`at ${detail.min_level} `);
  }

  if (detail.held_item) {
    parts.push(`while holding a ${detail.held_item.name.replace('-', ' ').replace(/^./, c => c.toUpperCase())}`);
  }

  if (detail.known_move) {
    parts.push(`knowing ${detail.known_move.name.replace('-', ' ').replace(/^./, c => c.toUpperCase())}`);
  }

  if (detail.known_move_type) {
    parts.push(`knowing ${detail.known_move_type.name.replace('-', ' ').replace(/^./, c => c.toUpperCase())} move`);
  }

  if (detail.min_happiness) {
    parts.push(`with minimum happiness (${detail.min_happiness}+)`);
  }

  if (detail.min_affection) {
    parts.push(`with minimum affection (${detail.min_affection}+)`);
  }

  if (detail.min_beauty) {
    parts.push(`with minimum beauty (${detail.min_beauty}+)`);
  }

  if (detail.time_of_day) {
    parts.push(`during the ${detail.time_of_day}`);
  }

  if (detail.location) {
    parts.push(`at ${detail.location.name.replace('-', ' ').replace(/^./, c => c.toUpperCase())}`);
  }

  if (detail.gender) {
    const genderText = detail.gender === 1 ? "female" : "male";
    parts.push(`(${genderText} only)`);
  }

  if (detail.needs_overworld_rain) {
    parts.push("while it's raining");
  }

  if (detail.turn_upside_down) {
    parts.push("with the device turned upside down");
  }

  if (detail.party_species) {
    parts.push(`with ${detail.party_species.name.replace('-', ' ').replace(/^./, c => c.toUpperCase())} in party`);
  }

  if (detail.party_type) {
    parts.push(`with ${detail.party_type.name.replace('-', ' ').replace(/^./, c => c.toUpperCase())} type in party`);
  }

  if (detail.trade_species) {
    parts.push(`for a ${detail.trade_species.name.replace('-', ' ').replace(/^./, c => c.toUpperCase())}`);
  }

  if (detail.relative_physical_stats !== null) {
    const statText = detail.relative_physical_stats === 1
      ? "Attack > Defense"
      : detail.relative_physical_stats === -1
        ? "Defense > Attack"
        : "Attack = Defense";
    parts.push(`(${statText})`);
  }

  return parts.join(" ");
}

/**
 * Formats evolution method with appropriate icons
 * @deprecated Use createEvolutionDescription instead for richer descriptions
 */
export function formatEvolutionMethodWithIcon(
  method: string
): { text: string; icon: string } {
  const methodLower = method.toLowerCase();

  if (methodLower.includes("level")) {
    return { text: method, icon: "📈" };
  }
  if (methodLower.includes("stone")) {
    return { text: method, icon: "💎" };
  }
  if (methodLower.includes("trade")) {
    return { text: method, icon: "🤝" };
  }
  if (methodLower.includes("item")) {
    return { text: method, icon: "🎒" };
  }
  if (methodLower.includes("happiness")) {
    return { text: method, icon: "❤️" };
  }
  if (methodLower.includes("move")) {
    return { text: method, icon: "⚡" };
  }
  if (methodLower.includes("time")) {
    return { text: method, icon: "🕐" };
  }
  if (methodLower.includes("location")) {
    return { text: method, icon: "📍" };
  }
  if (methodLower.includes("gender")) {
    return { text: method, icon: "⚧" };
  }
  if (methodLower.includes("weather")) {
    return { text: method, icon: "🌤️" };
  }
  if (methodLower.includes("stats")) {
    return { text: method, icon: "📊" };
  }

  return { text: method, icon: "❓" };
}

/**
 * Validates evolution data structure
 */
export function validateEvolutionData(evolutionPath: any): boolean {
  if (!evolutionPath) return false;
  if (typeof evolutionPath !== "object") return false;
  if (
    !Array.isArray(evolutionPath.previous) ||
    !Array.isArray(evolutionPath.next)
  )
    return false;
  return true;
}

/**
 * Gets sprite URL with consistent fallback logic
 */
export function getSpriteUrl(
  pokemonData: any,
): string {
  if (pokemonData?.sprites) {
    return (
      pokemonData.sprites.other?.dream_world?.front_default ||
      pokemonData.sprites.other?.home?.front_default ||
      pokemonData.sprites.front_default ||
      ""
    );
  }

  return ""
} 