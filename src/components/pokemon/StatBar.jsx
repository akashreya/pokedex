import { motion, useReducedMotion } from "framer-motion";
import React, { useState } from "react";
import { STAT_COLORS } from "@/constants/StatBar";

function getStatColor(statName, value) {
  // Custom color for each stat, fallback to green/yellow/red for value
  if (STAT_COLORS[statName]) return STAT_COLORS[statName];
  if (value >= 100) return "#43aa8b"; // green
  if (value >= 60) return "#fcbf49"; // yellow
  return "#e63946"; // red
}

function getStatLabel(statName) {
  switch (statName) {
    case "hp":
      return "HP";
    case "attack":
      return "ATTACK";
    case "defense":
      return "DEFENSE";
    case "special-attack":
      return "SPECIAL-ATTACK";
    case "special-defense":
      return "SPECIAL-DEFENSE";
    case "speed":
      return "SPEED";
    default:
      return statName.toUpperCase();
  }
}

const MAX_STAT = 255;

export default function StatBar({ stat }) {
  const prefersReducedMotion = useReducedMotion();
  const statName = stat.stat.name;
  const value = stat.base_stat;
  const color = getStatColor(statName, value);
  const percentage = Math.min((value / MAX_STAT) * 100, 100);

  return (
    <div
      className="statbar-panel group"
      tabIndex={0}
      style={{ outline: "none" }}
    >
      <div className="stat-label" style={{ color }}>
        {getStatLabel(statName)}
      </div>
      <div className="stat-bar">
        <motion.div
          className="h-full rounded-lg"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{
            width: prefersReducedMotion ? `${percentage}%` : `${percentage}%`,
          }}
          transition={{
            duration: prefersReducedMotion ? 0 : 1,
            ease: "easeOut",
          }}
        />
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}
