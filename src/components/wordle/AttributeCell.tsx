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
    correct: "bg-green-500 hover:bg-green-600",
    partial: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
    incorrect: "bg-red-500 hover:bg-red-600",
    higher: "bg-blue-500 hover:bg-blue-600",
    lower: "bg-purple-500 hover:bg-purple-600",
  };

  return (
    <div
      className={`pokedle-table-filled-row ${statusClasses[status]} ${className}`}
    >
      {status === "higher" && <span className="mr-1">↑</span>}
      {status === "lower" && <span className="mr-1">↓</span>}
      {value}
    </div>
  );
};

export default React.memo(AttributeCell);
