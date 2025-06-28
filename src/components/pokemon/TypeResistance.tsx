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
    <div className="type-resistance-effectiveness">
      <h2>Type Resistance</h2>
      <div className="type-resistance-inner-panel">
        {/* Weaknesses */}
        <div>
          <h3 className="weakness-heading">Weaknesses</h3>
          <div className="inner-panel">
            {weaknesses.map(({ type, effectiveness }) => (
              <div key={type} className="weakness-type-panel">
                <div className="badge-panel">
                  <TypeLogoBadge type={type} />
                  <span className="weakness-type">{type}</span>
                </div>
                <span className="weakness-x">{effectiveness}x</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resistances */}
        <div>
          <h3 className="resistances-heading">Resistances</h3>
          <div className="inner-panel">
            {resistances.map(({ type, effectiveness }) => (
              <div key={type} className="resistance-type-panel">
                <div className="badge-panel">
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
          <h3 className="immunities-heading">Immunities</h3>
          <div className="inner-panel">
            {immunities.map(({ type }) => (
              <div key={type} className="immunities-type-panel">
                <div className="badge-panel">
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
