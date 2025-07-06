import React from "react";
import { useNavigate } from "react-router-dom";
import { generateShareableText } from "@/utils/wordleUtils";
import { BorderBeam } from "../ui/border-beam";
import type {
  GameState,
  GuessResult,
  PokemonWordleData,
} from "@/types/WordleTypes";

// Mock Pokémon data for the demo
const bulbasaur: PokemonWordleData = {
  id: 1,
  name: "bulbasaur",
  types: ["grass", "poison"],
  generation: "1",
  evolutionStage: 1,
  color: "green",
  habitat: "grassland",
  isLegendary: false,
  isMythical: false,
  height: 0.7,
  weight: 6.9,
};
const charmander: PokemonWordleData = {
  id: 4,
  name: "charmander",
  types: ["fire"],
  generation: "1",
  evolutionStage: 1,
  color: "red",
  habitat: "mountain",
  isLegendary: false,
  isMythical: false,
  height: 0.6,
  weight: 8.5,
};
const squirtle: PokemonWordleData = {
  id: 7,
  name: "squirtle",
  types: ["water"],
  generation: "1",
  evolutionStage: 1,
  color: "blue",
  habitat: "waters-edge",
  isLegendary: false,
  isMythical: false,
  height: 0.5,
  weight: 9.0,
};

const demoGuesses: GuessResult[] = [
  {
    pokemon: charmander,
    feedback: {
      type1: "incorrect",
      type2: "incorrect",
      generation: "correct",
      evolutionStage: "correct",
      color: "incorrect",
      habitat: "incorrect",
      height: "lower",
      weight: "higher",
      isLegendary: "incorrect",
      isMythical: "incorrect",
    },
  },
  {
    pokemon: squirtle,
    feedback: {
      type1: "incorrect",
      type2: "incorrect",
      generation: "correct",
      evolutionStage: "correct",
      color: "incorrect",
      habitat: "incorrect",
      height: "lower",
      weight: "higher",
      isLegendary: "incorrect",
      isMythical: "incorrect",
    },
  },
  {
    pokemon: bulbasaur,
    feedback: {
      type1: "correct",
      type2: "correct",
      generation: "correct",
      evolutionStage: "correct",
      color: "correct",
      habitat: "correct",
      height: "correct",
      weight: "correct",
      isLegendary: "incorrect",
      isMythical: "incorrect",
    },
  },
];

const demoGameState: GameState = {
  currentDate: "2024-05-01",
  difficulty: "easy",
  targetPokemon: bulbasaur,
  guesses: demoGuesses,
  gameStatus: "won",
  statistics: {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    winRate: 0,
  },
  version: 1,
};

// AnimatedShareText: reveals lines one by one with fade-in, then loops
const AnimatedShareText: React.FC<{
  text: string;
  delay?: number;
  loopDelay?: number;
}> = ({ text, delay = 300, loopDelay = 1200 }) => {
  const lines = text.split("\n");
  const [visibleCount, setVisibleCount] = React.useState(0);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    if (visibleCount < lines.length) {
      timeoutRef.current = setTimeout(
        () => setVisibleCount((c) => c + 1),
        delay
      );
    } else {
      timeoutRef.current = setTimeout(() => setVisibleCount(0), loopDelay);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [visibleCount, lines.length, delay, loopDelay]);

  return (
    <div style={{ minHeight: lines.length * 1.0 + "em" }}>
      {lines.map((line, i) => (
        <div
          key={i}
          style={{
            opacity: i < visibleCount ? 1 : 0,
            transition: "opacity 0.5s",
            minHeight: "1.0em",
          }}
        >
          {line}
        </div>
      ))}
    </div>
  );
};

const WordleShowcase: React.FC = () => {
  const navigate = useNavigate();
  const shareText = generateShareableText(
    demoGameState.guesses,
    demoGameState.gameStatus,
    demoGameState.difficulty!,
    true // minimalPreview: do not show legend or Pokémon name
  );
  return (
    <section className="regional-dex">
      <h2 className="font-pokemon-solid text-center">PokéGuess</h2>
      <div className="regional-dex-content mt-17">
        <div
          className="regional-card hover:scale-110 
        font-mono text-xl leading-tight whitespace-pre-wrap max-w-sm
         text-gray-800 dark:text-gray-100 overflow-x-auto mb-18"
        >
          <AnimatedShareText text={shareText} delay={600} loopDelay={3000} />
        </div>
        <div className="relative inline-block overflow-hidden rounded-full mb-4">
          <button
            type="button"
            onClick={() => navigate("/pokeguess")}
            className="relative px-10 py-2 font-poppins font-semibold font-Montserrat 
              rounded-2xl text-xl
              bg-gradient-to-bl from-[#232526] to-[#414345]
              dark:bg-gradient-to-b dark:from-yellow-700 dark:to-yellow-400 
              text-yellow-400 dark:text-[#232526] shadow-md
              hover:scale-105 hover:shadow-lg transition-all duration-200 cursor-pointer"
          >
            Play Full Game
          </button>
          <BorderBeam
            size={40}
            duration={8}
            className="from-transparent via-yellow-200 to-transparent dark:via-[#232526]"
            borderWidth={3}
          />
        </div>
      </div>
    </section>
  );
};

export default WordleShowcase;
