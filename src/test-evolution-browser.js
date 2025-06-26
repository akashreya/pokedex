// Browser test for evolution service
// Run this in the browser console on the Pokémon detail page

async function testEvolutionService() {
  console.log("Testing Evolution Service...");

  // Test Eevee (ID: 133)
  console.log("\n=== Testing Eevee (ID: 133) ===");
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species/133/"
    );
    const speciesData = await response.json();
    console.log("Species data:", speciesData);

    const evolutionChainUrl = speciesData.evolution_chain.url;
    console.log("Evolution chain URL:", evolutionChainUrl);

    const evolutionResponse = await fetch(evolutionChainUrl);
    const evolutionData = await evolutionResponse.json();
    console.log("Evolution chain data:", evolutionData);

    // Check if Eevee has evolutions
    const eeveeNode = evolutionData.chain;
    console.log("Eevee node:", eeveeNode);
    console.log("Eevee evolves to:", eeveeNode.evolves_to);
    console.log("Number of evolutions:", eeveeNode.evolves_to.length);

    // Check evolution details
    eeveeNode.evolves_to.forEach((evo, index) => {
      console.log(`Evolution ${index + 1}:`, evo.species.name);
      console.log("Evolution details:", evo.evolution_details);
    });
  } catch (error) {
    console.error("Error testing Eevee:", error);
  }

  // Test Vaporeon (ID: 134)
  console.log("\n=== Testing Vaporeon (ID: 134) ===");
  try {
    const response = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species/134/"
    );
    const speciesData = await response.json();
    console.log("Species data:", speciesData);

    const evolutionChainUrl = speciesData.evolution_chain.url;
    console.log("Evolution chain URL:", evolutionChainUrl);

    const evolutionResponse = await fetch(evolutionChainUrl);
    const evolutionData = await evolutionResponse.json();
    console.log("Evolution chain data:", evolutionData);

    // Find Vaporeon in the chain
    function findPokemonInChain(chain, targetName) {
      if (chain.species.name === targetName) {
        return chain;
      }

      for (const evolution of chain.evolves_to) {
        const found = findPokemonInChain(evolution, targetName);
        if (found) return found;
      }

      return null;
    }

    const vaporeonNode = findPokemonInChain(evolutionData.chain, "vaporeon");
    console.log("Vaporeon node:", vaporeonNode);
    console.log("Vaporeon evolves to:", vaporeonNode?.evolves_to);
  } catch (error) {
    console.error("Error testing Vaporeon:", error);
  }
}

// Run the test
testEvolutionService();
