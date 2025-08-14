import React from "react";

interface AttributeCellProps {
  value: React.ReactNode;
  status: "correct" | "partial" | "incorrect" | "higher" | "lower";
  className?: string;
}

const AttributeCell: React.FC<AttributeCellProps> = ({
  value,
  status,
  className = "",
}) => {
  const statusClasses = {
    correct: "bg-green-500 hover:bg-green-600 cell-correct",
    partial: "bg-yellow-400 hover:bg-yellow-500 text-gray-900 cell-partial",
    incorrect: "bg-red-500 hover:bg-red-600 cell-incorrect",
    higher: "bg-blue-500 hover:bg-blue-600 cell-higher",
    lower: "bg-purple-500 hover:bg-purple-600 cell-lower",
  };

  const getTooltipText = () => {
    switch (status) {
      case "correct":
        return "✓ Correct match!";
      case "partial":
        return "~ Partially correct (one type matches)";
      case "incorrect":
        return "✗ Incorrect";
      case "higher":
        return "↑ Target value is HIGHER than this";
      case "lower":
        return "↓ Target value is LOWER than this";
      default:
        return "";
    }
  };

  return (
    <div
      className={`pokedle-table-filled-row ${statusClasses[status]} ${className}`}
      role="cell"
      aria-label={`${status === "higher" ? "Higher than target" : status === "lower" ? "Lower than target" : status} match`}
      title={getTooltipText()}
    >
      {status === "higher" && <span className="mr-1 arrow-up">↑</span>}
      {status === "lower" && <span className="mr-1 arrow-down">↓</span>}
      <span className="cell-value">{value}</span>
    </div>
  );
};

export default React.memo(AttributeCell);
