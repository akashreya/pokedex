import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  to?: string;
  state?: any;
  isCurrent?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: string;
}

export default function Breadcrumb({
  items,
  className = "mb-4 text-sm md:text-2xl text-gray-800 dark:text-rose-100 flex items-center gap-2",
  separator = "/",
}: BreadcrumbProps) {
  return (
    <nav className={className} aria-label="Breadcrumb">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {item.to ? (
            <Link
              to={item.to}
              state={item.state}
              className="hover:underline font-semibold"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={`${
                item.isCurrent
                  ? "font-bold italic text-gray-800 dark:text-rose-100"
                  : ""
              } capitalize`}
            >
              {item.label}
            </span>
          )}
          {index < items.length - 1 && (
            <span className="mx-1">{separator}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
