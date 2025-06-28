// Enhanced test script for evolution service with result type classification
// Run with: node src/test-evolution-enhanced.js

import {
  getEvolutionChainForPokemon,
  getRelevantEvolutionPath,
} from "../evolutionService.js";

async function testEnhancedEvolutionService() {
  console.log(
    "🧪 Testing Enhanced Evolution Service with Result Type Classification...\n"
  );

  // Test cases based on the evolution logic document
  const testCases = [
    {
      name: "Oddish (Base Form)",
      id: 43,
      expectedType: "complete-tree",
      description: "Should show complete evolution family",
    },
    {
      name: "Vileplume (Final Form)",
      id: 45,
      expectedType: "linear-path",
      description: "Should show path ending with target",
    },
    {
      name: "Gloom (Mid-Evolution)",
      id: 44,
      expectedType: "mid-evolution",
      description: "Should show previous + next context",
    },
    {
      name: "Tauros (Single-Stage)",
      id: 128,
      expectedType: "single-stage",
      description: "Should show just the Pokémon",
    },
    {
      name: "Eevee (Base with Multiple Branches)",
      id: 133,
      expectedType: "complete-tree",
      description: "Should show all evolution branches",
    },
    {
      name: "Vaporeon (Final from Branch)",
      id: 134,
      expectedType: "linear-path",
      description: "Should show path from Eevee to Vaporeon",
    },
  ];

  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.name} (ID: ${testCase.id})`);
    console.log(`Expected Type: ${testCase.expectedType}`);
    console.log(`Description: ${testCase.description}`);
    console.log("─".repeat(60));

    try {
      const evolutionPath = await getRelevantEvolutionPath(testCase.id);

      if (!evolutionPath) {
        console.log("❌ No evolution path found");
        continue;
      }

      console.log(`✅ Result Type: ${evolutionPath.resultType}`);
      console.log(`✅ Current: ${evolutionPath.current}`);
      console.log(`✅ Previous: [${evolutionPath.previous.join(", ")}]`);
      console.log(`✅ Next: [${evolutionPath.next.join(", ")}]`);

      if (evolutionPath.allBranches) {
        console.log(
          `✅ All Branches: ${evolutionPath.allBranches.length} branches`
        );
        evolutionPath.allBranches.forEach((branch, idx) => {
          console.log(`   Branch ${idx + 1}: ${branch.join(" → ")}`);
        });
      }

      if (evolutionPath.evolutionPath) {
        console.log(
          `✅ Evolution Path: ${evolutionPath.evolutionPath.join(" → ")}`
        );
      }

      if (evolutionPath.evolutionMethods) {
        console.log(
          `✅ Evolution Methods: [${evolutionPath.evolutionMethods.join(", ")}]`
        );
      }

      // Verify the result type matches expectation
      if (evolutionPath.resultType === testCase.expectedType) {
        console.log(`✅ PASS: Result type matches expectation`);
      } else {
        console.log(
          `❌ FAIL: Expected ${testCase.expectedType}, got ${evolutionPath.resultType}`
        );
      }

      // Additional validation based on result type
      switch (evolutionPath.resultType) {
        case "complete-tree":
          if (
            evolutionPath.allBranches &&
            evolutionPath.allBranches.length > 0
          ) {
            console.log("✅ PASS: Complete tree has branches");
          } else {
            console.log("❌ FAIL: Complete tree missing branches");
          }
          break;

        case "linear-path":
          if (
            evolutionPath.previous.length > 0 ||
            evolutionPath.evolutionPath
          ) {
            console.log("✅ PASS: Linear path has evolution history");
          } else {
            console.log("❌ FAIL: Linear path missing evolution history");
          }
          break;

        case "mid-evolution":
          if (evolutionPath.next.length > 0) {
            console.log("✅ PASS: Mid-evolution has next evolutions");
          } else {
            console.log("❌ FAIL: Mid-evolution missing next evolutions");
          }
          break;

        case "single-stage":
          if (
            evolutionPath.previous.length === 0 &&
            evolutionPath.next.length === 0
          ) {
            console.log("✅ PASS: Single-stage has no evolutions");
          } else {
            console.log("❌ FAIL: Single-stage has unexpected evolutions");
          }
          break;
      }
    } catch (error) {
      console.error(`❌ Error testing ${testCase.name}:`, error.message);
    }
  }

  console.log("\n" + "=".repeat(60));
  console.log("🎯 Decision Tree Priority Test");
  console.log("=".repeat(60));

  // Test the decision tree priority with a specific case
  console.log("\n🔍 Testing Decision Tree Priority with Oddish family:");

  try {
    // Test Oddish (should be complete-tree)
    const oddishPath = await getRelevantEvolutionPath(43);
    console.log(
      `Oddish (43): ${oddishPath?.resultType} - ${
        oddishPath?.resultType === "complete-tree" ? "✅" : "❌"
      }`
    );

    // Test Gloom (should be mid-evolution)
    const gloomPath = await getRelevantEvolutionPath(44);
    console.log(
      `Gloom (44): ${gloomPath?.resultType} - ${
        gloomPath?.resultType === "mid-evolution" ? "✅" : "❌"
      }`
    );

    // Test Vileplume (should be linear-path)
    const vileplumePath = await getRelevantEvolutionPath(45);
    console.log(
      `Vileplume (45): ${vileplumePath?.resultType} - ${
        vileplumePath?.resultType === "linear-path" ? "✅" : "❌"
      }`
    );

    // Test Bellossom (should be linear-path)
    const bellossomPath = await getRelevantEvolutionPath(182);
    console.log(
      `Bellossom (182): ${bellossomPath?.resultType} - ${
        bellossomPath?.resultType === "linear-path" ? "✅" : "❌"
      }`
    );
  } catch (error) {
    console.error("❌ Error testing decision tree priority:", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("🌳 Complete Tree Rendering Test");
  console.log("=".repeat(60));

  // Test Eevee's complete tree
  console.log("\n🔍 Testing Eevee's complete evolution tree:");

  try {
    const eeveePath = await getRelevantEvolutionPath(133);

    if (eeveePath && eeveePath.resultType === "complete-tree") {
      console.log("✅ Eevee correctly identified as complete-tree");
      console.log(
        `✅ Number of branches: ${eeveePath.allBranches?.length || 0}`
      );

      if (eeveePath.allBranches) {
        eeveePath.allBranches.forEach((branch, idx) => {
          console.log(`   Branch ${idx + 1}: ${branch.join(" → ")}`);
        });
      }
    } else {
      console.log("❌ Eevee not correctly identified as complete-tree");
    }
  } catch (error) {
    console.error("❌ Error testing Eevee's complete tree:", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Enhanced Evolution Service Test Complete!");
  console.log("=".repeat(60));
}

// Run the test
testEnhancedEvolutionService().catch(console.error);
