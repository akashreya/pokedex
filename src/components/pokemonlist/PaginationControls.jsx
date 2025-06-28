import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const [inputValue, setInputValue] = useState(currentPage.toString());
  const [inputError, setInputError] = useState(false);

  // Sync input value with currentPage prop only when currentPage changes
  useEffect(() => {
    setInputValue(currentPage.toString());
    setInputError(false);
  }, [currentPage]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value.replace(/[^0-9]/g, ""));
    setInputError(false);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      const page = parseInt(inputValue, 10);
      if (!isNaN(page) && page >= 1 && page <= totalPages) {
        setInputError(false);
        onPageChange(page);
      } else {
        setInputError(true);
      }
    }
  };

  const handleInputBlur = () => {
    setInputValue(currentPage.toString());
    setInputError(false);
  };

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        onBlur={handleInputBlur}
        className={`${
          inputError
            ? "border-red-500 bg-red-50"
            : "border-hidden  text-primary"
        }`}
        aria-label="Page number"
      />
      <span className="pagination-slash">/</span>
      <span className="pagination-total">{totalPages}</span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
