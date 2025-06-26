import { useMemo } from "react";

const TOTAL_POKEMON = 649;
const CONTAINER_WIDTH = 1280; // px
const CONTAINER_HEIGHT = 600; // px

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

export default function PokemonCollage() {
  // Memoize positions so they don't change on every render
  const positions = useMemo(
    () =>
      Array.from({ length: TOTAL_POKEMON }, (_, i) => ({
        top: getRandom(0, CONTAINER_HEIGHT - 60), // 60px image height
        left: getRandom(0, CONTAINER_WIDTH - 60), // 60px image width
        rotate: getRandom(-30, 30),
        z: Math.floor(getRandom(1, 10)),
      })),
    []
  );

  return (
    <div
      className="absolute inset-0 -z-10 w-full"
      style={{
        width: CONTAINER_WIDTH,
        height: CONTAINER_HEIGHT,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {positions.map((pos, i) => (
        <img
          key={i}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${
            i + 1
          }.svg`}
          alt={`Pokemon ${i + 1}`}
          style={{
            position: "absolute",
            top: pos.top,
            left: pos.left,
            width: 60,
            height: 60,
            transform: `rotate(${pos.rotate}deg)`,
            opacity: 0.5,
            zIndex: pos.z,
            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
          }}
          draggable={false}
        />
      ))}
    </div>
  );
}
