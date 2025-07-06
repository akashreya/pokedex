import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Share2 } from "lucide-react";
import { generateShareableText } from "../../utils/wordleUtils";
import { GuessResult } from "../../types/WordleTypes";
import ReactGA from "react-ga4";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameResult: {
    won: boolean;
    attempts: number;
    pokemonName: string;
    difficulty: string;
    guesses: GuessResult[];
    gameStatus: "won" | "lost" | "playing";
  };
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  gameResult,
}) => {
  const [showToast, setShowToast] = React.useState(false);

  const generateShareText = () => {
    const capitalizedName = gameResult.pokemonName
      ? gameResult.pokemonName.charAt(0).toUpperCase() +
        gameResult.pokemonName.slice(1)
      : "";
    return generateShareableText(
      gameResult.guesses,
      gameResult.gameStatus,
      gameResult.difficulty as "easy" | "medium" | "hard",
      capitalizedName
    );
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      // Track share event
      ReactGA.event({
        category: "Game",
        action: "Share",
        label: "Share Button Clicked (Clipboard)",
      });
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const handleWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Pokémon Wordle Results",
          text: generateShareText(),
          url: window.location.href,
        });
        // Track share event
        ReactGA.event({
          category: "Game",
          action: "Share",
          label: "Share Button Clicked (Web Share)",
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      // Fallback to copy to clipboard
      handleCopyToClipboard();
    }
  };

  useEscapeKey(() => {
    if (isOpen) onClose();
  }, isOpen);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Snackbar */}
          <AnimatePresence>
            {showToast && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.3 }}
                className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#272727] text-[#EFD09E] px-6 py-3 rounded-2xl shadow-lg font-montserrat z-50"
              >
                Copied to clipboard!
              </motion.div>
            )}
          </AnimatePresence>
          <motion.div
            className="bg-[#EFD09E] text-[#272727] dark:bg-[#272727] dark:text-[#EFD09E] border-4 border-[#D4AA7D] dark:border-[#D4AA7D] 
            rounded-3xl 
            p-8 font-montserrat shadow-2xl max-w-lg w-full mx-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-4 font-montserrat">
              <h2 className="text-xl font-bold text-[#272727] dark:text-[#EFD09E] font-montserrat">
                Share Your Results
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-[#D4AA7D] rounded-full transition-colors"
              >
                <X size={20} className="text-[#272727] dark:text-[#EFD09E]" />
              </button>
            </div>

            {/* Game Summary */}
            <div className="mb-6 p-4 bg-[#EFD09E] dark:bg-[#272727] border-2 border-[#D4AA7D] rounded-2xl font-montserrat flex flex-col items-center">
              <div className="text-center w-full">
                <div
                  className={`text-2xl font-bold font-montserrat ${
                    gameResult.won ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {gameResult.won ? "🎉 Victory!" : "😞 Game Over"}
                </div>
                <div className="mt-2 text-[#272727] dark:text-[#EFD09E] font-montserrat">
                  <div>
                    Pokémon:{" "}
                    <span className="font-semibold">
                      {gameResult.pokemonName.charAt(0).toUpperCase() +
                        gameResult.pokemonName.slice(1)}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="font-semibold">Difficulty: </span>
                    {gameResult.difficulty
                      ? gameResult.difficulty.charAt(0).toUpperCase() +
                        gameResult.difficulty.slice(1)
                      : "Unknown"}
                  </div>
                  <div>
                    Attempts:{" "}
                    <span className="font-semibold">
                      {gameResult.attempts}/6
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-3 font-montserrat mb-6">
              <motion.button
                onClick={handleWebShare}
                className="w-full px-4 py-3 rounded-2xl bg-[#EFD09E] text-[#272727] 
                border-2 border-[#D4AA7D] shadow-lg dark:bg-[#272727] dark:text-[#EFD09E] dark:border-[#D4AA7D] dark:shadow-[#D4AA7D]/30 font-extrabold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-montserrat flex items-center justify-center gap-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Share2 size={20} />
                <span>Share Results</span>
              </motion.button>

              <motion.button
                onClick={handleCopyToClipboard}
                className="w-full px-4 py-3 rounded-2xl bg-[#EFD09E] text-[#272727] border-2 border-[#D4AA7D] shadow-lg dark:bg-[#272727] dark:text-[#EFD09E] dark:border-[#D4AA7D] dark:shadow-[#D4AA7D]/30 font-extrabold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-montserrat flex items-center justify-center gap-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Copy size={20} />
                <span>Copy to Clipboard</span>
              </motion.button>
            </div>

            {/* Preview Text */}
            <div className="mt-4 p-3 bg-[#D4AA7D] dark:bg-[#D4AA7D] rounded-2xl border-2 border-[#D4AA7D] text-sm text-[#272727] dark:text-[#272727] font-montserrat">
              <div className="font-semibold mb-1">Preview:</div>
              <div className="whitespace-pre-line">{generateShareText()}</div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;
