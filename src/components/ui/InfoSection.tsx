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
      <div className="font-bold mb-1">{title}</div>
      <div className="rounded-xl bg-transparent px-4 py-2 gap-6 items-center justify-center md:justify-start w-auto inline-flex">
        {items.map((item) => (
          <span key={item} className="capitalize flex items-center gap-1">
            <span className="text-lg">•</span> {item}
          </span>
        ))}
      </div>
    </div>
  );
}
