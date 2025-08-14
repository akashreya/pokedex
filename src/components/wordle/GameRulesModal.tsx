import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, HelpCircle } from "lucide-react";
import { useEscapeKey } from "@/hooks/useEscapeKey";

interface GameRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameRulesModal: React.FC<GameRulesModalProps> = ({ isOpen, onClose }) => {
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
          <motion.div
            className="bg-[#EFD09E] text-[#272727] dark:bg-[#272727] dark:text-[#EFD09E] border-4 border-[#D4AA7D] dark:border-[#D4AA7D] rounded-2xl shadow-2xl p-8 font-montserrat w-full max-w-7xl mx-auto max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6 font-montserrat">
              <div className="flex items-center gap-3">
                <HelpCircle
                  size={24}
                  className="text-[#272727] dark:text-[#EFD09E]"
                />
                <h2 className="text-2xl md:text-3xl font-bold text-[#272727] dark:text-[#EFD09E] font-montserrat">
                  How to Play PokéGuess
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 hover:bg-[#D4AA7D] rounded-full transition-colors"
              >
                <X size={20} className="text-[#272727] dark:text-[#EFD09E]" />
              </button>
            </div>

            {/* Game Objective */}
            <section className="mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-[#272727] dark:text-[#EFD09E] mb-3 font-montserrat">
                🎯 Objective
              </h3>
              <p className="text-base md:text-lg text-[#272727] dark:text-[#EFD09E] leading-relaxed font-montserrat">
                Guess the mystery Pokémon in 6 attempts or fewer by analyzing
                the attributes of your guesses and using the feedback provided
                after each attempt.
              </p>
            </section>

            {/* How to Play */}
            <section className="mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-[#272727] dark:text-[#EFD09E] mb-3 font-montserrat">
                🎮 How to Play
              </h3>
              <ol className="text-base md:text-lg text-[#272727] dark:text-[#EFD09E] space-y-2 leading-relaxed font-montserrat">
                <li>
                  <strong>1.</strong> Type or select a Pokémon name in the
                  search bar
                </li>
                <li>
                  <strong>2.</strong> Submit your guess to see attribute
                  feedback
                </li>
                <li>
                  <strong>3.</strong> Use the feedback colors and hints to
                  narrow down the answer
                </li>
                <li>
                  <strong>4.</strong> Make up to 6 guesses to find the correct
                  Pokémon
                </li>
                <li>
                  <strong>5.</strong> Share your results with friends!
                </li>
              </ol>
            </section>

            {/* Feedback System */}
            <section className="mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-[#272727] dark:text-[#EFD09E] mb-3 font-montserrat">
                🌈 Feedback System
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-montserrat text-base md:text-lg mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500 rounded-2xl border-2 border-[#D4AA7D] flex items-center justify-center text-white font-bold relative">
                    <span>✓</span>
                    <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <span className="text-sm text-[#272727] dark:text-[#EFD09E]">
                    Correct
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-yellow-400 rounded-2xl border-2 border-[#D4AA7D] flex items-center justify-center text-gray-900 font-bold relative">
                    <span>~</span>
                    <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-white" style={{clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)'}}></div>
                  </div>
                  <span className="text-sm text-[#272727] dark:text-[#EFD09E]">
                    Partial (Types only)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-red-500 rounded-2xl border-2 border-[#D4AA7D] flex items-center justify-center text-white font-bold relative">
                    <span>✗</span>
                    <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-white transform rotate-45"></div>
                  </div>
                  <span className="text-sm text-[#272727] dark:text-[#EFD09E]">
                    Incorrect
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-2xl border-2 border-[#D4AA7D] flex items-center justify-center text-white font-bold relative">
                    <span>↑</span>
                    <div className="absolute top-0 right-1 w-0 h-0 border-l-2 border-r-2 border-b-3 border-l-transparent border-r-transparent border-b-white"></div>
                  </div>
                  <span className="text-sm text-[#272727] dark:text-[#EFD09E]">
                    Target is higher
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-500 rounded-2xl border-2 border-[#D4AA7D] flex items-center justify-center text-white font-bold relative">
                    <span>↓</span>
                    <div className="absolute bottom-0 right-1 w-0 h-0 border-l-2 border-r-2 border-t-3 border-l-transparent border-r-transparent border-t-white"></div>
                  </div>
                  <span className="text-sm text-[#272727] dark:text-[#EFD09E]">
                    Target is lower
                  </span>
                </div>
              </div>
              
              {/* Colorblind Accessibility Note */}
              <div className="p-4 bg-blue-50 dark:bg-gray-800 border-2 border-blue-200 dark:border-gray-600 rounded-2xl">
                <h4 className="font-semibold text-[#272727] dark:text-[#EFD09E] mb-2 flex items-center gap-2">
                  ♿ Accessibility Features
                </h4>
                <p className="text-sm text-[#272727] dark:text-[#EFD09E] leading-relaxed">
                  Each cell includes <strong>clear symbols</strong> (✓ ~ ✗ ↑ ↓) and <strong>subtle corner indicators</strong> 
                  (circle, triangle, diamond, up/down arrows) to help distinguish between different states, making the game fully accessible for colorblind users.
                  Hover over any cell for detailed explanations!
                </p>
              </div>
            </section>

            {/* Attributes */}
            <section className="mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-[#272727] dark:text-[#EFD09E] mb-3 font-montserrat">
                📊 Pokémon Attributes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base font-montserrat">
                <div>
                  <strong className="text-[#272727] dark:text-[#EFD09E]">
                    Type 1 & 2:
                  </strong>
                  <p className="text-[#272727] dark:text-[#EFD09E]">
                    Primary and secondary Pokémon types (Fire, Water, etc.)
                  </p>
                </div>
                <div>
                  <strong className="text-[#272727] dark:text-[#EFD09E]">
                    Generation:
                  </strong>
                  <p className="text-[#272727] dark:text-[#EFD09E]">
                    Which generation the Pokémon debuted in (1-9)
                  </p>
                </div>
                <div>
                  <strong className="text-[#272727] dark:text-[#EFD09E]">
                    Evolution Stage:
                  </strong>
                  <p className="text-[#272727] dark:text-[#EFD09E]">
                    Stage in evolution line (1, 2, or 3)
                  </p>
                </div>
                <div>
                  <strong className="text-[#272727] dark:text-[#EFD09E]">
                    Color:
                  </strong>
                  <p className="text-[#272727] dark:text-[#EFD09E]">
                    Official Pokédex color classification
                  </p>
                </div>
                <div>
                  <strong className="text-[#272727] dark:text-[#EFD09E]">
                    Habitat:
                  </strong>
                  <p className="text-[#272727] dark:text-[#EFD09E]">
                    Natural environment where Pokémon is found
                  </p>
                </div>
                <div>
                  <strong className="text-[#272727] dark:text-[#EFD09E]">
                    Height & Weight:
                  </strong>
                  <p className="text-[#272727] dark:text-[#EFD09E]">
                    Physical measurements in metric units
                  </p>
                </div>
                <div>
                  <strong className="text-[#272727] dark:text-[#EFD09E]">
                    Legendary:
                  </strong>
                  <p className="text-[#272727] dark:text-[#EFD09E]">
                    Whether the Pokémon is classified as legendary
                  </p>
                </div>
                <div>
                  <strong className="text-[#272727] dark:text-[#EFD09E]">
                    Mythical:
                  </strong>
                  <p className="text-[#272727] dark:text-[#EFD09E]">
                    Whether the Pokémon is classified as mythical
                  </p>
                </div>
              </div>
            </section>

            {/* Difficulty Levels */}
            <section className="mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-[#272727] dark:text-[#EFD09E] mb-3 font-montserrat">
                ⚡ Difficulty Levels
              </h3>
              <div className="space-y-3 font-montserrat text-base md:text-lg">
                <div className="p-3 bg-[#D4AA7D] border-2 border-[#D4AA7D] rounded-2xl">
                  <strong className="text-[#272727]">Easy:</strong>
                  <span className="text-[#272727] ml-2">
                    Generation 1-3 Pokémon (Kanto, Johto, Hoenn)
                  </span>
                </div>
                <div className="p-3 bg-[#D4AA7D] border-2 border-[#D4AA7D] rounded-2xl">
                  <strong className="text-[#272727]">Medium:</strong>
                  <span className="text-[#272727] ml-2">
                    Generation 1-6 Pokémon (up to Kalos)
                  </span>
                </div>
                <div className="p-3 bg-[#D4AA7D] border-2 border-[#D4AA7D] rounded-2xl">
                  <strong className="text-[#272727]">Hard:</strong>
                  <span className="text-[#272727] ml-2">
                    All Generations 1-9 Pokémon
                  </span>
                </div>
              </div>
            </section>

            {/* Tips */}
            <section className="mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-[#272727] dark:text-[#EFD09E] mb-3 font-montserrat">
                💡 Tips
              </h3>
              <ul className="text-base md:text-lg text-[#272727] dark:text-[#EFD09E] space-y-1 leading-relaxed font-montserrat">
                <li>• Start with popular Pokémon to get initial feedback</li>
                <li>
                  • Pay attention to type combinations for partial matches
                </li>
                <li>• Use generation hints to narrow down the era</li>
                <li>• Evolution stage can help identify family lines</li>
                <li>
                  • Remember that legendary/mythical status is binary (yes/no)
                </li>
              </ul>
            </section>

            {/* Keyboard Shortcuts */}
            <section className="mb-6">
              <h3 className="text-xl md:text-2xl font-semibold text-[#272727] dark:text-[#EFD09E] mb-3 font-montserrat">
                ⌨️ Keyboard Shortcuts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-montserrat text-base">
                <div className="p-3 bg-[#D4AA7D] border-2 border-[#D4AA7D] rounded-2xl">
                  <strong className="text-[#272727]">? or H:</strong>
                  <span className="text-[#272727] ml-2">Show this help</span>
                </div>
                <div className="p-3 bg-[#D4AA7D] border-2 border-[#D4AA7D] rounded-2xl">
                  <strong className="text-[#272727]">/ or F:</strong>
                  <span className="text-[#272727] ml-2">Focus search bar</span>
                </div>
                <div className="p-3 bg-[#D4AA7D] border-2 border-[#D4AA7D] rounded-2xl">
                  <strong className="text-[#272727]">N:</strong>
                  <span className="text-[#272727] ml-2">New game (when finished)</span>
                </div>
                <div className="p-3 bg-[#D4AA7D] border-2 border-[#D4AA7D] rounded-2xl">
                  <strong className="text-[#272727]">S:</strong>
                  <span className="text-[#272727] ml-2">Share results (when finished)</span>
                </div>
                <div className="p-3 bg-[#D4AA7D] border-2 border-[#D4AA7D] rounded-2xl">
                  <strong className="text-[#272727]">T:</strong>
                  <span className="text-[#272727] ml-2">View statistics (when finished)</span>
                </div>
                <div className="p-3 bg-[#D4AA7D] border-2 border-[#D4AA7D] rounded-2xl">
                  <strong className="text-[#272727]">Escape:</strong>
                  <span className="text-[#272727] ml-2">Close modals</span>
                </div>
              </div>
            </section>

            {/* Close Button */}
            <div className="flex justify-center pt-4 border-t-2 border-[#D4AA7D]">
              <motion.button
                onClick={onClose}
                className="w-full px-4 py-3 rounded-2xl bg-[#EFD09E] text-[#272727] border-2 border-[#D4AA7D] shadow-lg dark:bg-[#272727] dark:text-[#EFD09E] dark:border-[#D4AA7D] dark:shadow-[#D4AA7D]/30 font-extrabold text-lg md:text-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-montserrat"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Got it, let's play!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameRulesModal;
