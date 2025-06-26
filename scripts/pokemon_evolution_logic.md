**Prompt:** Design the evolution-fetching logic for a Pokémon React app. I want to show only the relevant evolution path for a given Pokémon (e.g., for Vaporeon, show only "Eevee → Vaporeon" and not the entire tree of all Eevee evolutions). Include edge cases and explain how to filter just the correct path from the full evolution chain.

---

**Detailed Steps to Fetch Evolution Data:**

1. **Input:** Start with a Pokémon name or ID (e.g., "vaporeon").

2. **Fetch **``

   - Extract the `species.url` from the response.

3. **Fetch **`` (using the URL from step 2)

   - Get the `evolution_chain.url`
   - Optionally note `evolves_from_species` for backward tracing (not essential here)

4. **Fetch **``

   - This provides a nested tree structure starting from the base form (e.g., Eevee)
   - Each node contains:
     - `species.name`
     - `evolution_details` (trigger, item, level, etc.)
     - `evolves_to` (array of next evolutions)

5. **Parse the Evolution Chain:**

   - Recursively walk the tree to extract all possible evolution paths
   - Represent each path as an array of species names

6. **Filter the Relevant Path:**

   - For **final-stage Pokémon** (e.g., Vaporeon, Bellossom):
     - From the list of paths, find the one that ends with the target Pokémon
   - For **mid-evolution Pokémon** (e.g., Gloom):
     - Traverse the tree and locate the node with `species.name === target`
     - Track the path up to that node for previous stages
     - Collect `evolves_to` entries as the next stage(s)

   Example return structure:

   ```js
   {
     current: "gloom",
     previous: ["oddish"],
     next: ["vileplume", "bellossom"]
   }
   ```

---

**Edge Cases to Handle:**

- **Single-stage Pokémon**: Show just the name (e.g., Tauros)
- **Two-stage line**: Show both (e.g., Pikachu → Raichu)
- **Three-stage line**: Show full path (e.g., Bulbasaur → Ivysaur → Venusaur)
- **Branching evolutions**: Only return the relevant branch (e.g., Eevee → Vaporeon)
- **Mid-evolution node**: Return both the previous path and possible next evolutions (e.g., Gloom)
- **Baby Pokémon**: Start from the baby form (e.g., Pichu → Pikachu → Raichu)
- **Regional variants**: PokéAPI may not include all variants distinctly in chains
- **Missing data**: Handle cases where evolution chain is missing or empty

---

**Example Use Cases:**

1. **Ivysaur**

   - Output: Bulbasaur → Ivysaur → Venusaur

2. **Oddish**

   - Output: Oddish → Gloom → Vileplume → Bellossom
   - Shows all branches since Oddish is the base form.

3. **Gloom**

   - Output:
     - Previous: Oddish
     - Current: Gloom
     - Next: Vileplume, Bellossom

4. **Vileplume**

   - Output: Oddish → Gloom → Vileplume
   - Shows only the relevant evolution path ending in Vileplume.

5. **Bellossom**

   - Output: Oddish → Gloom → Bellossom
   - Shows only the relevant evolution path ending in Bellossom.

6. **Jolteon**

   - Output: Eevee → Jolteon

7. **Eevee**

   - Output: Eevee → Vaporeon / Jolteon / Flareon / etc.

This approach ensures only the meaningful and contextually relevant evolution data is shown to the user.
