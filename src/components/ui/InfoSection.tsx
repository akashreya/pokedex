interface InfoSectionProps {
  title: string;
  items: string[];
  className?: string;
  showCondition?: boolean;
}

export default function InfoSection({
  title,
  items,
  className = "mb-2",
  showCondition = true,
}: InfoSectionProps) {
  if (!showCondition || items.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      <div className="info-section">{title}</div>
      <div className="info-section-inner-panel">
        {items.map((item) => (
          <span key={item}>
            <span className="text-lg">•</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}
