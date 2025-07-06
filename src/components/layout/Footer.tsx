import React, { useState } from "react";
import FeedbackModal from "../ui/FeedbackModal";

export default function Footer() {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      <footer
        className="w-full py-4 bg-gradient-to-tr from-emerald-200 to-[#0085CA]
       dark:from-gray-800  dark:via-slate-900 dark:to-indigo-800 text-center 
      text-sm text-gray-800 dark:text-gray-200 relative pr-24"
      >
        <span className="whitespace-normal break-words block max-w-full mx-auto px-4">
          Built by Akash using PokéAPI • Pokémon © Nintendo/Game Freak
        </span>
        <button
          className="absolute right-6 bottom-1/2 translate-y-1/2 px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 z-10"
          onClick={() => setShowFeedback(true)}
          aria-label="Send Feedback"
        >
          Feedback
        </button>
      </footer>
      <FeedbackModal
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
      />
    </>
  );
}
