// Add type effectiveness data
const typeEffectiveness: { [key: string]: { [key: string]: number } } = {
  normal: { rock: 0.5, ghost: 0, steel: 0.5 },
  fire: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 2,
    bug: 2,
    rock: 0.5,
    dragon: 0.5,
    steel: 2,
  },
  water: { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: {
    water: 2,
    electric: 0.5,
    grass: 0.5,
    ground: 0,
    flying: 2,
    dragon: 0.5,
  },
  grass: {
    fire: 0.5,
    water: 2,
    grass: 0.5,
    poison: 0.5,
    ground: 2,
    flying: 0.5,
    bug: 0.5,
    rock: 2,
    dragon: 0.5,
    steel: 0.5,
  },
  ice: {
    fire: 0.5,
    water: 0.5,
    grass: 2,
    ice: 0.5,
    ground: 2,
    flying: 2,
    dragon: 2,
    steel: 0.5,
  },
  fighting: {
    normal: 2,
    ice: 2,
    poison: 0.5,
    flying: 0.5,
    psychic: 0.5,
    bug: 0.5,
    rock: 2,
    ghost: 0,
    dark: 2,
    steel: 2,
    fairy: 0.5,
  },
  poison: {
    grass: 2,
    poison: 0.5,
    ground: 0.5,
    rock: 0.5,
    ghost: 0.5,
    steel: 0,
    fairy: 2,
  },
  ground: {
    fire: 2,
    electric: 2,
    grass: 0.5,
    poison: 2,
    flying: 0,
    bug: 0.5,
    rock: 2,
    steel: 2,
  },
  flying: {
    electric: 0.5,
    grass: 2,
    fighting: 2,
    bug: 2,
    rock: 0.5,
    steel: 0.5,
  },
  psychic: { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug: {
    fire: 0.5,
    grass: 2,
    fighting: 0.5,
    poison: 0.5,
    flying: 0.5,
    psychic: 2,
    ghost: 0.5,
    dark: 2,
    steel: 0.5,
    fairy: 0.5,
  },
  rock: {
    fire: 2,
    ice: 2,
    fighting: 0.5,
    ground: 0.5,
    flying: 2,
    bug: 2,
    steel: 0.5,
  },
  ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon: { dragon: 2, steel: 0.5, fairy: 0 },
  dark: { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel: {
    fire: 0.5,
    water: 0.5,
    electric: 0.5,
    ice: 2,
    rock: 2,
    steel: 0.5,
    fairy: 2,
  },
  fairy: { fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

const allTypes = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
];

interface TypeEffectivenessProps {
  pokemonTypes: Array<{
    type: {
      name: string;
    };
  }>;
}

export default function TypeEffectiveness({
  pokemonTypes,
}: TypeEffectivenessProps) {
  return (
    <div className="bg-white/20 rounded-2xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 tracking-wide text-gray-800">
        Type Effectiveness
      </h2>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-2 text-gray-800">
        {allTypes.map((type) => {
          // Calculate effectiveness against this type
          let effectiveness = 1;
          pokemonTypes.forEach((pokemonType) => {
            const typeName = pokemonType.type.name;
            if (typeEffectiveness[typeName]?.[type]) {
              effectiveness *= typeEffectiveness[typeName][type];
            }
          });

          // Determine color based on effectiveness
          let bgColor = "bg-white/10";

          if (effectiveness === 0) {
            bgColor = "bg-gray-800";
          } else if (effectiveness === 0.25) {
            bgColor = "bg-green-900/50";
          } else if (effectiveness === 0.5) {
            bgColor = "bg-green-800/50";
          } else if (effectiveness === 2) {
            bgColor = "bg-red-800/50";
          } else if (effectiveness === 4) {
            bgColor = "bg-red-900/50";
          }
          return (
            <div
              key={type}
              className={`${bgColor} rounded-lg p-2 text-center text-sm font-medium capitalize`}
              title={`${effectiveness}x effectiveness`}
            >
              {type}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 justify-center text-sm text-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-900/50"></div>
          <span>Super Effective (2x)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-800/50"></div>
          <span>Not Very Effective (0.5x)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gray-800"></div>
          <span>No Effect (0x)</span>
        </div>
      </div>
    </div>
  );
}
