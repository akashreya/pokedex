import { motion } from "framer-motion";

export default function EvolutionLoading() {
  return (
    <div className="flex items-center justify-center">
      <motion.div
        className="text-gray-600 flex items-center gap-2"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        Loading evolution data...
      </motion.div>
    </div>
  );
}
