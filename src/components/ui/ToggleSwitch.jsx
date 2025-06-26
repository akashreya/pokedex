import { motion } from "framer-motion";

export default function ToggleSwitch({
  checked,
  onChange,
  leftLabel = "Grid",
  rightLabel = "List",
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`text-sm ${
          !checked ? "font-bold " : "text-gray-800 dark:!text-gray-200"
        }`}
      >
        {leftLabel}
      </span>
      <motion.button
        type="button"
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        className="w-14 h-8 rounded-full transition-colors duration-200 focus:outline-none 
        flex items-center px-1 cursor-pointer dark:!bg-gray-400"
        animate={{
          backgroundColor: "#e5e7eb",
          justifyContent: checked ? "flex-end" : "flex-start",
        }}
        style={{
          display: "flex",
          padding: 4,
        }}
        onClick={() => onChange(!checked)}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 700, damping: 30 }}
          className="w-6 h-6 rounded-full bg-white shadow"
        />
      </motion.button>
      <span
        className={`text-sm ${
          checked ? "font-extrabold" : " text-gray-800 dark:!text-gray-200"
        }`}
      >
        {rightLabel}
      </span>
    </div>
  );
}
