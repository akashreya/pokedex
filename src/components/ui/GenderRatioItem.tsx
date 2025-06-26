interface GenderRatioItemProps {
  gender: "male" | "female";
  percentage: number;
  className?: string;
}

export default function GenderRatioItem({
  gender,
  percentage,
  className = "",
}: GenderRatioItemProps) {
  const symbol = gender === "male" ? "♂" : "♀";
  const colorClass = gender === "male" ? "text-blue-500" : "text-pink-600";

  return (
    <span className={`flex items-center gap-1 ${className}`}>
      <span className="text-lg">•</span>{" "}
      <span className={colorClass}>
        {symbol} {percentage.toFixed(1)}%
      </span>
    </span>
  );
}
