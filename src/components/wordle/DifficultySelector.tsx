import React from "react";
import * as Dialog from "@radix-ui/react-dialog";

interface DifficultySelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDifficulty: (difficulty: "easy" | "medium" | "hard") => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({
  isOpen,
  onClose,
  onSelectDifficulty,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className="sm:max-w-[425px]">
        <Dialog.Title>Select Difficulty</Dialog.Title>
        <Dialog.Description>
          Choose your challenge level for today's Pokémon Wordle.
        </Dialog.Description>
        <div className="grid gap-4 py-4">
          <button onClick={() => onSelectDifficulty("easy")}>
            Easy (Gen 1-3)
          </button>
          <button onClick={() => onSelectDifficulty("medium")}>
            Medium (Gen 1-6)
          </button>
          <button onClick={() => onSelectDifficulty("hard")}>
            Hard (All Gens)
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default DifficultySelector;
