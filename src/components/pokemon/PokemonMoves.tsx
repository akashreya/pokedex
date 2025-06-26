import { useState, useMemo } from "react";

interface PokemonMovesProps {
  moves: Array<{
    move: {
      name: string;
    };
    version_group_details: Array<{
      level_learned_at: number;
      move_learn_method: {
        name: string;
      };
    }>;
  }>;
}

export default function PokemonMoves({ moves: rawMoves }: PokemonMovesProps) {
  const [moveFilter, setMoveFilter] = useState("");

  // Process moves data
  const moves = useMemo(() => {
    let processedMoves = rawMoves.map((m: any) => {
      // Find the best version_group_details (prefer level-up, then lowest level)
      const best = m.version_group_details.reduce((acc: any, cur: any) => {
        if (!acc) return cur;
        // Prefer level-up
        if (
          cur.move_learn_method.name === "level-up" &&
          acc.move_learn_method.name !== "level-up"
        )
          return cur;
        // Lower level
        if (cur.level_learned_at < acc.level_learned_at) return cur;
        return acc;
      }, null);
      return {
        name: m.move.name,
        level: best?.level_learned_at || null,
        method: best?.move_learn_method?.name || "",
      };
    });

    // Filter
    if (moveFilter) {
      processedMoves = processedMoves.filter((m: any) =>
        m.name.toLowerCase().includes(moveFilter.toLowerCase())
      );
    }

    // Sort: by level (if available), then name
    processedMoves.sort((a: any, b: any) => {
      if (a.level !== b.level) {
        if (a.level === null) return 1;
        if (b.level === null) return -1;
        return a.level - b.level;
      }
      return a.name.localeCompare(b.name);
    });

    return processedMoves;
  }, [rawMoves, moveFilter]);

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Filter moves..."
          value={moveFilter}
          onChange={(e) => setMoveFilter(e.target.value)}
          className="px-3 py-2 rounded bg-white/20 text-gray-800 placeholder:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400"
          style={{ minWidth: 200 }}
        />
        <span className="text-gray-800 text-sm">{moves.length} moves</span>
      </div>
      <div className="overflow-x-auto max-h-96">
        <table className="min-w-full text-gray-800 text-left">
          <thead>
            <tr>
              <th className="py-2 px-3">Move</th>
              <th className="py-2 px-3">Level</th>
              <th className="py-2 px-3">Method</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((move: any, idx: any) => (
              <tr
                key={move.name + idx}
                className="border-b border-white/10 hover:bg-white/10"
              >
                <td className="py-2 px-3 capitalize">
                  {move.name.replace(/-/g, " ")}
                </td>
                <td className="py-2 px-3">
                  {move.level !== null ? move.level : "-"}
                </td>
                <td className="py-2 px-3 capitalize">
                  {move.method.replace(/-/g, " ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
