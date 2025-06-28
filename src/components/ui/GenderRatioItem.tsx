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
    <span className={`gender-ratio-panel ${className}`}>
      <span className="text-lg">•</span>{" "}
      <span className={colorClass}>
        {symbol} {percentage.toFixed(1)}%
      </span>
    </span>
  );
}
