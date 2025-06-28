import { typeEffectiveness, allTypes } from "./TypeEffectivenessCalculator";

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
    <div className="type-resistance-effectiveness">
      <h2>Type Effectiveness</h2>
      <div className="type-effectivness-inner-panel">
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
      <div className="type-effectivness-legends">
        <div className="legend-outer-panel">
          <div className="legend-inner-panel bg-red-900/50"></div>
          <span>Super Effective (2x)</span>
        </div>
        <div className="legend-outer-panel">
          <div className="legend-inner-panel bg-green-800/50"></div>
          <span>Not Very Effective (0.5x)</span>
        </div>
        <div className="legend-outer-panel">
          <div className="legend-inner-panel bg-gray-800"></div>
          <span>No Effect (0x)</span>
        </div>
      </div>
    </div>
  );
}
