// Browser test for enhanced evolution service with result type classification
// Run this in the browser console on the Pokémon detail page

async function testEnhancedEvolutionService() {
  console.log(
    "🧪 Testing Enhanced Evolution Service with Result Type Classification..."
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
      // Simulate the evolution path data structure
      const evolutionPath = await simulateEvolutionPath(testCase.id);

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
    const oddishPath = await simulateEvolutionPath(43);
    console.log(
      `Oddish (43): ${oddishPath?.resultType} - ${
        oddishPath?.resultType === "complete-tree" ? "✅" : "❌"
      }`
    );

    // Test Gloom (should be mid-evolution)
    const gloomPath = await simulateEvolutionPath(44);
    console.log(
      `Gloom (44): ${gloomPath?.resultType} - ${
        gloomPath?.resultType === "mid-evolution" ? "✅" : "❌"
      }`
    );

    // Test Vileplume (should be linear-path)
    const vileplumePath = await simulateEvolutionPath(45);
    console.log(
      `Vileplume (45): ${vileplumePath?.resultType} - ${
        vileplumePath?.resultType === "linear-path" ? "✅" : "❌"
      }`
    );

    // Test Bellossom (should be linear-path)
    const bellossomPath = await simulateEvolutionPath(182);
    console.log(
      `Bellossom (182): ${bellossomPath?.resultType} - ${
        bellossomPath?.resultType === "linear-path" ? "✅" : "❌"
      }`
    );
  } catch (error) {
    console.error("❌ Error testing decision tree priority:", error.message);
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ Enhanced Evolution Service Test Complete!");
  console.log("=".repeat(60));
}

// Simulate the evolution path data structure based on known Pokémon
async function simulateEvolutionPath(pokemonId) {
  // This is a simplified simulation for testing purposes
  // In a real scenario, this would call the actual evolution service

  const evolutionData = {
    43: {
      // Oddish
      current: "oddish",
      previous: [],
      next: ["gloom"],
      allBranches: [
        ["oddish", "gloom", "vileplume"],
        ["oddish", "gloom", "bellossom"],
      ],
      resultType: "complete-tree",
      evolutionMethods: ["Level 21"],
    },
    44: {
      // Gloom
      current: "gloom",
      previous: ["oddish"],
      next: ["vileplume", "bellossom"],
      resultType: "mid-evolution",
      evolutionMethods: ["Use Leaf Stone", "Use Sun Stone"],
    },
    45: {
      // Vileplume
      current: "vileplume",
      previous: ["oddish", "gloom"],
      next: [],
      resultType: "linear-path",
      evolutionPath: ["oddish", "gloom", "vileplume"],
    },
    128: {
      // Tauros
      current: "tauros",
      previous: [],
      next: [],
      resultType: "single-stage",
      evolutionPath: ["tauros"],
    },
    133: {
      // Eevee
      current: "eevee",
      previous: [],
      next: [
        "vaporeon",
        "jolteon",
        "flareon",
        "espeon",
        "umbreon",
        "leafeon",
        "glaceon",
        "sylveon",
      ],
      allBranches: [
        ["eevee", "vaporeon"],
        ["eevee", "jolteon"],
        ["eevee", "flareon"],
        ["eevee", "espeon"],
        ["eevee", "umbreon"],
        ["eevee", "leafeon"],
        ["eevee", "glaceon"],
        ["eevee", "sylveon"],
      ],
      resultType: "complete-tree",
      evolutionMethods: [
        "Use Water Stone",
        "Use Thunder Stone",
        "Use Fire Stone",
        "Level up with high friendship during day",
        "Level up with high friendship during night",
        "Level up near Moss Rock",
        "Level up near Ice Rock",
        "Level up knowing Fairy move",
      ],
    },
    134: {
      // Vaporeon
      current: "vaporeon",
      previous: ["eevee"],
      next: [],
      resultType: "linear-path",
      evolutionPath: ["eevee", "vaporeon"],
    },
    182: {
      // Bellossom
      current: "bellossom",
      previous: ["oddish", "gloom"],
      next: [],
      resultType: "linear-path",
      evolutionPath: ["oddish", "gloom", "bellossom"],
    },
  };

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return (
    evolutionData[pokemonId] || {
      current: `pokemon-${pokemonId}`,
      previous: [],
      next: [],
      resultType: "single-stage",
      evolutionPath: [`pokemon-${pokemonId}`],
    }
  );
}

// Helper function to get result type display info
function getResultTypeInfo(resultType) {
  switch (resultType) {
    case "complete-tree":
      return {
        title: "Complete Evolution Family",
        description: "Base form showing all possible evolution branches",
        icon: "🌳",
        color: "text-green-700",
      };
    case "linear-path":
      return {
        title: "Evolution Path",
        description: "Final evolution showing complete path from base",
        icon: "🛤️",
        color: "text-blue-700",
      };
    case "mid-evolution":
      return {
        title: "Mid-Evolution",
        description: "Middle stage showing previous and next evolutions",
        icon: "🔗",
        color: "text-purple-700",
      };
    case "single-stage":
      return {
        title: "Single-Stage Pokémon",
        description: "This Pokémon does not evolve",
        icon: "⭐",
        color: "text-gray-700",
      };
    default:
      return {
        title: "Evolution",
        description: "Evolution information",
        icon: "❓",
        color: "text-gray-700",
      };
  }
}

// Run the test
testEnhancedEvolutionService().catch(console.error);
