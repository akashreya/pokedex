// Simple test script for evolution service
// Run with: node src/test-evolution.js

import {
  getEvolutionChainForPokemon,
  getRelevantEvolutionPath,
} from "../evolutionService.js";

async function testEvolutionService() {
  console.log("Testing Evolution Service...\n");

  // Test 1: Bulbasaur (base form)
  console.log("Test 1: Bulbasaur (base form)");
  try {
    const bulbasaurChain = await getEvolutionChainForPokemon(1);
    console.log("Evolution chain:", bulbasaurChain ? "Found" : "Not found");

    const bulbasaurPath = await getRelevantEvolutionPath(1);
    console.log("Evolution path:", bulbasaurPath);
    console.log("Previous:", bulbasaurPath?.previous);
    console.log("Current:", bulbasaurPath?.current);
    console.log("Next:", bulbasaurPath?.next);
  } catch (error) {
    console.error("Error testing Bulbasaur:", error.message);
  }
  console.log("\n---\n");

  // Test 2: Venusaur (final evolution)
  console.log("Test 2: Venusaur (final evolution)");
  try {
    const venusaurPath = await getRelevantEvolutionPath(3);
    console.log("Evolution path:", venusaurPath);
    console.log("Previous:", venusaurPath?.previous);
    console.log("Current:", venusaurPath?.current);
    console.log("Next:", venusaurPath?.next);
  } catch (error) {
    console.error("Error testing Venusaur:", error.message);
  }
  console.log("\n---\n");

  // Test 3: Tauros (single-stage)
  console.log("Test 3: Tauros (single-stage)");
  try {
    const taurosPath = await getRelevantEvolutionPath(128);
    console.log("Evolution path:", taurosPath);
    console.log("Previous:", taurosPath?.previous);
    console.log("Current:", taurosPath?.current);
    console.log("Next:", taurosPath?.next);
  } catch (error) {
    console.error("Error testing Tauros:", error.message);
  }
  console.log("\n---\n");

  // Test 4: Eevee (branching evolution base)
  console.log("Test 4: Eevee (branching evolution base)");
  try {
    const eeveePath = await getRelevantEvolutionPath(133);
    console.log("Evolution path:", eeveePath);
    console.log("Previous:", eeveePath?.previous);
    console.log("Current:", eeveePath?.current);
    console.log("Next:", eeveePath?.next);
  } catch (error) {
    console.error("Error testing Eevee:", error.message);
  }
  console.log("\n---\n");

  // Test 5: Vaporeon (branching evolution result)
  console.log("Test 5: Vaporeon (branching evolution result)");
  try {
    const vaporeonPath = await getRelevantEvolutionPath(134);
    console.log("Evolution path:", vaporeonPath);
    console.log("Previous:", vaporeonPath?.previous);
    console.log("Current:", vaporeonPath?.current);
    console.log("Next:", vaporeonPath?.next);
  } catch (error) {
    console.error("Error testing Vaporeon:", error.message);
  }
  console.log("\n---\n");

  console.log("Evolution service tests completed!");
}

testEvolutionService().catch(console.error);
