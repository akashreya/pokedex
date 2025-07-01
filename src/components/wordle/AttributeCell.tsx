import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility

interface AttributeCellProps {
  value: string | number;
  status: "correct" | "partial" | "incorrect" | "higher" | "lower";
  className?: string;
}

const AttributeCell: React.FC<AttributeCellProps> = ({
  value,
  status,
  className = "",
}) => {
  const baseClasses =
    "flex items-center justify-center h-24 w-28 rounded-2xl text-white font-bold text-center p-2";

  const statusClasses = {
    correct: "bg-green-500 hover:bg-green-600",
    partial: "bg-yellow-400 hover:bg-yellow-500 text-gray-900",
    incorrect: "bg-red-500 hover:bg-red-600",
    higher: "bg-blue-500 hover:bg-blue-600",
    lower: "bg-purple-500 hover:bg-purple-600",
  };

  return (
    <div className={cn(baseClasses, statusClasses[status], className)}>
      {status === "higher" && <span className="mr-1">↑</span>}
      {status === "lower" && <span className="mr-1">↓</span>}
      {value}
    </div>
  );
};

export default AttributeCell;
