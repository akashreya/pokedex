import { motion, useReducedMotion } from "framer-motion";
import React, { useState } from "react";

const STAT_COLORS = {
  hp: "#e63946",
  attack: "#f77f00",
  defense: "#43aa8b",
  "special-attack": "#4361ee",
  "special-defense": "#4cc9f0",
  speed: "#f72585",
};

const STAT_DESCRIPTIONS = {
  hp: "Hit Points. Determines how much damage a Pokémon can take.",
  attack: "Physical Attack. Influences the power of physical moves.",
  defense: "Physical Defense. Reduces damage from physical moves.",
  "special-attack": "Special Attack. Influences the power of special moves.",
  "special-defense": "Special Defense. Reduces damage from special moves.",
  speed: "Speed. Determines which Pokémon acts first in battle.",
};

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
      className="flex items-center gap-4 group relative "
      tabIndex={0}
      style={{ outline: "none" }}
    >
      <div
        className="w-36 text-right font-mono text-base font-bold uppercase"
        style={{ color }}
      >
        {getStatLabel(statName)}
      </div>
      <div className="flex-1 relative h-6 bg-white/10 rounded-lg overflow-hidden">
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
        <div className="absolute inset-0 flex items-center justify-center text-gray-800 font-semibold text-sm">
          {value}
        </div>
      </div>
    </div>
  );
}
