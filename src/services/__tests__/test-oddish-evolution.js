// Test script to check Oddish evolution chain
// Run this in browser console

async function testOddishEvolution() {
  console.log("Testing Oddish evolution chain...");

  try {
    // Get Oddish species data
    const speciesResponse = await fetch(
      "https://pokeapi.co/api/v2/pokemon-species/43/"
    );
    const speciesData = await speciesResponse.json();
    console.log("Oddish species data:", speciesData);

    // Get evolution chain
    const evolutionResponse = await fetch(speciesData.evolution_chain.url);
    const evolutionData = await evolutionResponse.json();
    console.log("Oddish evolution chain:", evolutionData);

    // Analyze the structure
    console.log("Base form:", evolutionData.chain.species.name);
    console.log(
      "First evolution:",
      evolutionData.chain.evolves_to[0].species.name
    );
    console.log("Second evolution options:");
    evolutionData.chain.evolves_to[0].evolves_to.forEach((evo, index) => {
      console.log(`  ${index + 1}. ${evo.species.name}`);
      console.log("    Evolution details:", evo.evolution_details);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

testOddishEvolution();

console.log("Testing getRelevantEvolutionPath for Oddish...");
try {
  const { getRelevantEvolutionPath } = require("../evolutionService");

  // Test with Oddish ID (43)
  const evolutionPath = await getRelevantEvolutionPath(43);
  console.log("Evolution path result:", JSON.stringify(evolutionPath, null, 2));

  // Test with Gloom ID (44)
  console.log("\nTesting getRelevantEvolutionPath for Gloom...");
  const gloomEvolutionPath = await getRelevantEvolutionPath(44);
  console.log(
    "Gloom evolution path result:",
    JSON.stringify(gloomEvolutionPath, null, 2)
  );
} catch (error) {
  console.error("Error testing getRelevantEvolutionPath:", error);
}
