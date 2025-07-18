import { FC } from "react";

interface EvolutionArrowProps {
  color?: "gray-400" | "gray-600";
}

const EvolutionArrow: FC<EvolutionArrowProps> = ({ color = "gray-600" }) => {
  return (
    <div className="flex items-center justify-center h-[200px]">
      <span
        className={`text-2xl text-${color} mx-1 hidden md:inline scale-300`}
      >
        →
      </span>
      <span className={`text-2xl text-${color} mx-1 md:hidden scale-600`}>
        ↓
      </span>
    </div>
  );
};

export default EvolutionArrow;
