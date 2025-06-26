import { motion } from "framer-motion";
import { useItem } from "../../../hooks/useItem";
import {
  createEvolutionDescription,
  EvolutionDetail,
} from "../../../utils/evolutionUtils";

interface EvolutionDescriptionProps {
  evolutionDetail: EvolutionDetail;
  className?: string;
}

export default function EvolutionDescription({
  evolutionDetail,
  className = "",
}: EvolutionDescriptionProps) {
  // Use the useItem hook to fetch item data if an item is required
  const { data: itemData, loading: itemLoading } = useItem(
    evolutionDetail.item?.name || null
  );

  const { data: heldItemData, loading: heldItemLoading } = useItem(
    evolutionDetail.held_item?.name || null
  );

  // Create the enhanced description
  const description = createEvolutionDescription(evolutionDetail);

  return (
    <motion.div
      className={`flex items-center bg-white/50 gap-2  rounded-full  p-1 text-sm ${className}`}
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Item sprite for evolution item */}
      {evolutionDetail.item && (
        <div className="relative">
          {itemLoading ? (
            <div className="w-6 h-6 bg-transparent rounded animate-pulse" />
          ) : itemData && itemData.sprites && itemData.sprites.default ? (
            <img
              src={itemData.sprites.default}
              alt={itemData.name}
              className="w-6 h-6 object-contain"
              title={itemData.name.replace("-", " ")}
            />
          ) : (
            <div className="w-6 h-6 bg-transparent rounded flex items-center justify-center"></div>
          )}
        </div>
      )}

      {/* Item sprite for held item */}
      {evolutionDetail.held_item && (
        <div className="relative">
          {heldItemLoading ? (
            <div className="w-6 h-6 bg-transparent rounded animate-pulse" />
          ) : heldItemData &&
            heldItemData.sprites &&
            heldItemData.sprites.default ? (
            <img
              src={heldItemData.sprites.default}
              alt={heldItemData.name}
              className="w-6 h-6 object-contain"
              title={`Holding ${heldItemData.name.replace("-", " ")}`}
            />
          ) : (
            <div className="w-6 h-6 bg-transparent rounded flex items-center justify-center">
              <span className="text-xs text-gray-500">?</span>
            </div>
          )}
        </div>
      )}

      {/* Level indicator */}
      {evolutionDetail.min_level && (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Lv.{evolutionDetail.min_level}
        </span>
      )}

      {/* Time of day indicator */}
      {evolutionDetail.time_of_day && (
        <span className="text-lg">
          {evolutionDetail.time_of_day === "day" ? "☀️" : "🌙"}
        </span>
      )}

      {/* Gender indicator */}
      {evolutionDetail.gender && (
        <span className="text-lg">
          {evolutionDetail.gender === 1 ? "♀️" : "♂️"}
        </span>
      )}

      {/* Weather indicator */}
      {evolutionDetail.needs_overworld_rain && (
        <span className="text-lg">🌧️</span>
      )}

      {/* Upside down indicator */}
      {evolutionDetail.turn_upside_down && <span className="text-lg">🔄</span>}

      {/* Description text */}
      <span className="text-gray-700 leading-relaxed">{description}</span>
    </motion.div>
  );
}
