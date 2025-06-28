import { useState, useMemo } from "react";
import { MOVES } from "@/constants/PokemonMovesData";
//@ts-ignore
import TypeLogoBadge from "../ui/TypeLogoBadge";

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

function getMoveData(moveName: string) {
  return MOVES.find(
    (m) => m.Name.toLowerCase() === moveName.toLowerCase().replace(/-/g, " ")
  );
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
      const moveData = getMoveData(m.move.name);
      return {
        name: m.move.name,
        level: best?.level_learned_at || null,
        method: best?.move_learn_method?.name || "",
        type: moveData?.Type || "-",
        power: moveData?.power || "-",
        accuracy: moveData?.Accuracy || "-",
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
      <div className="move-panel">
        <input
          type="text"
          placeholder="Filter moves..."
          value={moveFilter}
          onChange={(e) => setMoveFilter(e.target.value)}
          style={{ minWidth: 200 }}
        />
        <span className="">{moves.length} moves</span>
      </div>
      <div className="moveslist-panel">
        <table className="movelist-table">
          <thead className="bg-white/30">
            <tr>
              <th className="movelist-tableheader">Move</th>
              <th className="movelist-tableheader">Power</th>
              <th className="movelist-tableheader">Accuracy</th>
              <th className="movelist-tableheader">Level</th>
              <th className="movelist-tableheader">Method</th>
            </tr>
          </thead>
          <tbody>
            {moves.map((move: any, idx: any) => (
              <tr key={move.name + idx} className="movelist-rowpanel">
                <td className="movelist-tableheader capitalize">
                  <span
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    <TypeLogoBadge
                      key={move.type}
                      type={move.type.toLowerCase()}
                    />
                    {move.name.replace(/-/g, " ")}
                  </span>
                </td>

                <td className="movelist-tableheader ">{move.power}</td>
                <td className="movelist-tableheader ">{move.accuracy}</td>
                <td className="movelist-tableheader ">
                  {move.level !== null ? move.level : "-"}
                </td>
                <td className="movelist-tableheader capitalize">
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
