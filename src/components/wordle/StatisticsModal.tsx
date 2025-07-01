import React from "react";
import * as Dialog from "@radix-ui/react-dialog";

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
  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className="sm:max-w-[425px]">
        <Dialog.Title>Your Wordle Statistics</Dialog.Title>
        <Dialog.Description>
          Track your progress and achievements.
        </Dialog.Description>
        <div className="grid gap-4 py-4 text-center">
          <p className="text-lg">
            Games Played:{" "}
            <span className="font-bold">{statistics.gamesPlayed}</span>
          </p>
          <p className="text-lg">
            Games Won: <span className="font-bold">{statistics.gamesWon}</span>
          </p>
          <p className="text-lg">
            Win Rate:{" "}
            <span className="font-bold">{statistics.winRate.toFixed(2)}%</span>
          </p>
          <p className="text-lg">
            Current Streak:{" "}
            <span className="font-bold">{statistics.currentStreak}</span>
          </p>
          <p className="text-lg">
            Max Streak:{" "}
            <span className="font-bold">{statistics.maxStreak}</span>
          </p>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default StatisticsModal;
