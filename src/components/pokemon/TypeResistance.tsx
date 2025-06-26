import TypeLogoBadge from "../ui/TypeLogoBadge.jsx";
import { calculateTypeEffectiveness } from "./TypeEffectivenessCalculator.jsx";

interface TypeResistanceProps {
  pokemonTypes: Array<{
    type: {
      name: string;
    };
  }>;
}

export default function TypeResistance({ pokemonTypes }: TypeResistanceProps) {
  const { weaknesses, resistances, immunities } =
    calculateTypeEffectiveness(pokemonTypes);

  return (
    <div className="bg-white/20 rounded-2xl p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 tracking-wide text-gray-800">
        Type Resistance
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weaknesses */}
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-3">
            Weaknesses
          </h3>
          <div className="space-y-2">
            {weaknesses.map(({ type, effectiveness }) => (
              <div
                key={type}
                className="flex items-center justify-between bg-red-900/30 rounded-lg p-2"
              >
                <div className="flex items-center gap-2">
                  <TypeLogoBadge type={type} />
                  <span className="capitalize text-red-800">{type}</span>
                </div>
                <span className="text-red-800 font-semibold">
                  {effectiveness}x
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Resistances */}
        <div>
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            Resistances
          </h3>
          <div className="space-y-2">
            {resistances.map(({ type, effectiveness }) => (
              <div
                key={type}
                className="flex items-center justify-between bg-green-900/30 rounded-lg p-2"
              >
                <div className="flex items-center gap-2">
                  <TypeLogoBadge type={type} />
                  <span className="capitalize text-green-800">{type}</span>
                </div>
                <span className="text-green-800 font-semibold">
                  {effectiveness}x
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Immunities */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Immunities
          </h3>
          <div className="space-y-2">
            {immunities.map(({ type }) => (
              <div
                key={type}
                className="flex items-center justify-between bg-gray-800/50 rounded-lg p-2"
              >
                <div className="flex items-center gap-2">
                  <TypeLogoBadge type={type} />
                  <span className="capitalize text-gray-800">{type}</span>
                </div>
                <span className="text-gray-800 font-semibold">0x</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
