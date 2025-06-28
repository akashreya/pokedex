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
    <div className="pokestat-panel">
      <h2>Base Stats</h2>
      <div className="inner-panel">
        {stats.map((stat: any) => (
          <StatBar key={stat.stat.name} stat={stat} />
        ))}
      </div>
      <div className="pokestat-total">Total: {totalStats}</div>
    </div>
  );
}
