import { motion } from "framer-motion";

export default function ToggleSwitch({
  checked,
  onChange,
  leftLabel = "Grid",
  rightLabel = "List",
}) {
  return (
    <div className="toggle-switch">
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
        className="toggle-switch-button"
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
          className="toggle-switch-span"
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
