import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import TypeLogoBadge from "../ui/TypeLogoBadge.jsx";
import InfoSection from "../ui/InfoSection";
import GenderRatioItem from "../ui/GenderRatioItem";
import { usePokemonSpecies } from "../../hooks/usePokemonSpecies";

interface PokemonHeaderProps {
  pokemon: any;
  selectedSprite: string;
  sprites: any;
}

export default function PokemonHeader({
  pokemon,
  selectedSprite,
  sprites,
}: PokemonHeaderProps) {
  const [cryUrl, setCryUrl] = useState<string | null>(null);

  const { genera, maleRate, femaleRate, eggGroups } = usePokemonSpecies(
    pokemon?.species?.url || null
  );

  // Extract abilities from pokemon data
  const abilities =
    pokemon.abilities?.map((a: any) => a.ability.name.replace(/-/g, " ")) || [];

  // Set cry URL
  useEffect(() => {
    if (pokemon.cries) {
      setCryUrl(pokemon.cries.latest || pokemon.cries.legacy || null);
    }
  }, [pokemon]);

  function playCry() {
    if (cryUrl) {
      const audio = new Audio(cryUrl);
      audio.play();
    }
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-8 text-gray-800">
      <div className="text-center md:text-left mb-4 md:mb-0 flex-1">
        <div className="text-xl font-mono mb-1">
          #{pokemon.id.toString().padStart(3, "0")}
        </div>
        <h1 className="text-4xl font-bold mb-2 capitalize">{pokemon.name}</h1>
        <div className="text-lg font-semibold mb-2">{genera}</div>
        <div className="flex gap-2 mt-2 mb-2 justify-center md:justify-start">
          {pokemon.types.map((type: any) => (
            <TypeLogoBadge key={type.type.name} type={type.type.name} />
          ))}
        </div>
        {/* Abilities Section */}
        <InfoSection title="Abilities" items={abilities} />
        {/* Gender Ratio Section */}
        {maleRate !== null && femaleRate !== null && (
          <div className="mb-2">
            <div className="font-bold mb-1">Gender Ratio</div>
            <div className="rounded-xl bg-transparent px-4 py-2 gap-6 items-center justify-center md:justify-start w-auto inline-flex">
              <GenderRatioItem
                gender="male"
                percentage={(maleRate / 8) * 100}
              />
              <GenderRatioItem
                gender="female"
                percentage={(femaleRate / 8) * 100}
              />
            </div>
          </div>
        )}
        {/* Egg Groups Section */}
        <InfoSection
          title="Egg Groups"
          items={eggGroups}
          showCondition={eggGroups.length > 0}
        />
        {/* Cry Button */}
        {cryUrl && (
          <button
            onClick={playCry}
            className="mt-2 px-4 py-1 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition-all shadow"
            title="Play Pokémon Cry"
          >
            🔊 Cry
          </button>
        )}
      </div>
      <div className="relative w-125 h-125">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          src={sprites[selectedSprite as keyof typeof sprites]}
          alt={pokemon.name}
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </div>
    </div>
  );
}
