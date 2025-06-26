import { motion } from "framer-motion";

interface EvolutionErrorProps {
  errorMessage: string;
}

export default function EvolutionError({ errorMessage }: EvolutionErrorProps) {
  return (
    <>
      <div className="flex items-center justify-center">
        <motion.div
          className="text-red-600 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {errorMessage || "Failed to load evolution data"}
        </motion.div>
      </div>
      <motion.div
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <button
          onClick={() => window.location.reload()}
          className="text-blue-600 hover:text-blue-800 underline text-sm"
        >
          Try again
        </button>
      </motion.div>
    </>
  );
}
