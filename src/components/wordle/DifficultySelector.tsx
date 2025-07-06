import React, { useEffect, useRef, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Button } from "../ui/button";

interface DifficultySelectorProps {
  isOpen: boolean;
  onSelectDifficulty: (difficulty: "easy" | "medium" | "hard") => void;
  initialDifficulty?: null | "easy" | "medium" | "hard";
}

const difficulties = [
  { key: "easy", label: "Easy (Gen 1-3)" },
  { key: "medium", label: "Medium (Gen 1-6)" },
  { key: "hard", label: "Hard (All Gens)" },
] as const;

type Difficulty = (typeof difficulties)[number]["key"];

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  isOpen,
  onSelectDifficulty,
  initialDifficulty = null,
}) => {
  const firstRadioRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<typeof initialDifficulty>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const liveRegionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setSelected(initialDifficulty);
      setIsSubmitting(false);
      if (firstRadioRef.current) {
        firstRadioRef.current.focus();
      }
    }
  }, [isOpen, initialDifficulty]);

  const handleSelect = (difficulty: Difficulty) => {
    if (isSubmitting) return;
    setSelected(difficulty);
    // Announce to screen readers
    if (liveRegionRef.current) {
      liveRegionRef.current.textContent = `${
        difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
      } selected`;
    }
  };

  const handleSave = () => {
    if (!selected || isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onSelectDifficulty(selected);
    }, 200);
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-[#272727]/60 backdrop-blur z-50"
          aria-hidden="true"
        />
        <Dialog.Content
          className="sm:max-w-[425px] bg-[#EFD09E] text-[#272727] dark:bg-[#272727] dark:text-[#EFD09E] font-[Montserrat,sans-serif] rounded-3xl p-8 z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none shadow-2xl border-4 border-[#D4AA7D] dark:border-[#D4AA7D]"
          aria-modal="true"
          role="dialog"
          aria-description="difficulty-title"
          aria-labelledby="difficulty-title"
          aria-describedby="difficulty-desc"
          onInteractOutside={(e) => e.preventDefault()} // Prevent closing by clicking outside
          onEscapeKeyDown={(e) => e.preventDefault()} // Prevent closing with Escape
        >
          <Dialog.Title
            id="difficulty-title"
            className="text-2xl font-extrabold mb-2 tracking-wide uppercase text-[#272727] dark:text-[#EFD09E] text-center font-[Montserrat,sans-serif]"
          >
            Select Difficulty
          </Dialog.Title>
          <Dialog.Description
            id="difficulty-desc"
            className="mb-6 text-center text-lg font-medium text-[#272727] dark:text-[#EFD09E] font-[Montserrat,sans-serif]"
          >
            Choose your challenge level for today's Pokémon Wordle. You must
            select a difficulty to play.
          </Dialog.Description>
          <div
            className="grid gap-5 py-4"
            role="radiogroup"
            aria-labelledby="difficulty-title"
          >
            {difficulties.map((diff, idx) => (
              <label
                key={diff.key}
                className={`flex items-center px-6 py-4 rounded-2xl cursor-pointer transition-all font-[Montserrat,sans-serif] text-xl
                  ${
                    selected === diff.key
                      ? "bg-[#EFD09E] font-extrabold ring-4 ring-[#272727] text-[#272727] dark:bg-[#EFD09E] dark:text-[#272727]"
                      : "bg-[#D4AA7D] text-[#272727] dark:bg-[#D4AA7D] dark:text-[#272727] font-medium"
                  }
                  ${isSubmitting ? "opacity-60 pointer-events-none" : ""}
                `}
                tabIndex={0}
                aria-checked={selected === diff.key}
                role="radio"
                onKeyDown={(e) => {
                  if ((e.key === " " || e.key === "Enter") && !isSubmitting) {
                    e.preventDefault();
                    handleSelect(diff.key);
                  }
                }}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={diff.key}
                  checked={selected === diff.key}
                  onChange={() => handleSelect(diff.key)}
                  ref={idx === 0 ? firstRadioRef : undefined}
                  className="sr-only"
                  disabled={isSubmitting}
                  aria-label={`Select ${diff.label}`}
                />
                <span
                  className={`w-6 h-6 mr-4 flex items-center justify-center border-2 border-[#272727] rounded-full
                  ${
                    selected === diff.key
                      ? "bg-[#272727] dark:bg-[#EFD09E]"
                      : "bg-[#EFD09E] dark:bg-[#272727]"
                  }
                  transition-colors`}
                  aria-hidden="true"
                >
                  {selected === diff.key && (
                    <span className="block w-3 h-3 rounded-full bg-[#EFD09E] dark:bg-[#272727]" />
                  )}
                </span>
                <span>{diff.label}</span>
              </label>
            ))}
          </div>
          <Button
            onClick={handleSave}
            disabled={!selected || isSubmitting}
            className="mt-6 w-full font-extrabold text-lg rounded-2xl px-4 py-3 bg-[#272727] text-[#D4AA7D] border-2 border-[#EFD09E] shadow-lg font-montserrat transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#D4AA7D] hover:text-[#272727] dark:bg-[#EFD09E] dark:text-[#272727] dark:hover:bg-[#D4AA7D] dark:hover:text-[#272727]"
            aria-disabled={!selected || isSubmitting}
            aria-label="Save selected difficulty"
          >
            {isSubmitting ? "Starting..." : "Start Game"}
          </Button>
          <div
            ref={liveRegionRef}
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DifficultySelector;
