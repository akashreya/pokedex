import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface StatisticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  statistics: {
    gamesPlayed: number;
    gamesWon: number;
    currentStreak: number;
    maxStreak: number;
    winRate: number;
  };
}

const StatisticsModal: React.FC<StatisticsModalProps> = ({
  isOpen,
  onClose,
  statistics,
}) => {
  useEscapeKey(() => {
    if (isOpen) onClose();
  }, isOpen);

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-[#272727]/60 backdrop-blur z-50"
          aria-hidden="true"
        />
        <Dialog.Content
          className="bg-[#EFD09E] text-[#272727] dark:bg-[#272727] dark:text-[#EFD09E] border-4 border-[#D4AA7D] dark:border-[#D4AA7D] rounded-3xl p-8 font-montserrat shadow-2xl max-w-lg w-full mx-auto z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
          aria-modal="true"
          role="dialog"
          aria-description="stats-title"
          aria-labelledby="stats-title"
          aria-describedby="stats-desc"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-4 font-montserrat">
            <Dialog.Title
              id="stats-title"
              className="text-2xl font-extrabold text-[#272727] dark:text-[#EFD09E] font-montserrat uppercase"
            >
              Your PokéGuess Statistics
            </Dialog.Title>
            <button
              onClick={onClose}
              className="p-1 bg-[#D4AA7D] rounded-full transition-colors"
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5 5L15 15M15 5L5 15"
                  stroke="#272727"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
          <Dialog.Description
            id="stats-desc"
            className="mb-6 text-left text-lg font-medium  text-[#272727] dark:text-[#EFD09E] font-montserrat"
          >
            Track your progress and achievements.
          </Dialog.Description>
          <div className="grid gap-4 py-4 text-left font-montserrat text-lg">
            <p>
              Games Played:{" "}
              <span className="font-bold">{statistics.gamesPlayed}</span>
            </p>
            <p>
              Games Won:{" "}
              <span className="font-bold">{statistics.gamesWon}</span>
            </p>
            <p>
              Win Rate:{" "}
              <span className="font-bold">
                {statistics.winRate.toFixed(2)}%
              </span>
            </p>
            <p>
              Current Streak:{" "}
              <span className="font-bold">{statistics.currentStreak}</span>
            </p>
            <p>
              Max Streak:{" "}
              <span className="font-bold">{statistics.maxStreak}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="mt-6 w-full px-4 py-3 rounded-2xl bg-[#EFD09E] text-[#272727] border-2 border-[#272727] shadow-lg dark:bg-[#272727] dark:text-[#EFD09E] dark:border-[#D4AA7D] dark:shadow-[#D4AA7D]/30 font-extrabold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-montserrat"
            aria-label="Close statistics modal"
          >
            Close
          </button>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default StatisticsModal;
