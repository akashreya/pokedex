# Evolution Display Requirements (Clarified)

## 1. Display Style

- **Linear (single row)** if there is no branching (e.g., Bulbasaur → Ivysaur → Venusaur).
- **Tree structure** if there is branching (e.g., Oddish → Gloom → [Vileplume, Bellossom] or Eevee → [all Eeveelutions]), matching the Bulbapedia style.
- **Branching:** All possible next evolutions are shown in a single row under the current Pokémon.

## 2. Navigation

- **Both the image and the name** of each evolution are clickable and navigate to the detail page for that Pokémon.

## 3. Evolution Conditions

- Show the evolution condition (e.g., "Water Stone") next to each possible next evolution.
- If possible, display the item image (e.g., Water Stone icon) next to the condition.
- If the item image is not available from PokéAPI, use a placeholder for now.

## 4. Edge Cases

- **No previous evolution:** If the Pokémon is a basic Pokémon (e.g., Bulbasaur, Tyrogue), do not show an "Evolves from" section.
- **No next evolution:** If the Pokémon is a final evolution, do not show an "Evolves to" section or "None".
- **Multiple next evolutions:** If a Pokémon can evolve into multiple forms (e.g., Tyrogue → Hitmonlee/Hitmonchan/Hitmontop), show all possible next evolutions in a row.

## 5. Sprites

- Always use the sprite selection rule: dream_world > home > front_default.

---

**This document reflects the latest user-confirmed requirements for evolution display in the Pokédex project.**
