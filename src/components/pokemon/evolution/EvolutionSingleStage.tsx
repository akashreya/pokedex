import { motion } from "framer-motion";

interface EvolutionSingleStageProps {
  evolutionPath?: {
    isBaby?: boolean;
  } | null;
}

export default function EvolutionSingleStage({
  evolutionPath,
}: EvolutionSingleStageProps) {
  return (
    <>
      <div className="evolution-inner-panel mb-4">
        <motion.div
          className="text-gray-600 flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          {evolutionPath?.isBaby
            ? "This is a baby Pokémon"
            : "This Pokémon does not evolve"}
        </motion.div>
      </div>
    </>
  );
}
