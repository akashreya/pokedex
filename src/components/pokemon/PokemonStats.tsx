import StatBar from "./StatBar.jsx";

interface PokemonStatsProps {
  stats: Array<{
    stat: {
      name: string;
    };
    base_stat: number;
  }>;
}

export default function PokemonStats({ stats }: PokemonStatsProps) {
  const totalStats = stats.reduce(
    (sum: number, s: any) => sum + s.base_stat,
    0
  );

  return (
    <div className="bg-white/20 rounded-2xl p-6 mt-8 mb-8 shadow-inner overflow-visible">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 tracking-wide">
        Base Stats
      </h2>
      <div className="space-y-3">
        {stats.map((stat: any) => (
          <StatBar key={stat.stat.name} stat={stat} />
        ))}
      </div>
      <div className="mt-6 text-lg font-semibold text-gray-800 flex justify-end">
        Total: {totalStats}
      </div>
    </div>
  );
}
