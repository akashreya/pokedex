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
    <div className="pokeheader-main-panel">
      <div className="pokeheader-details">
        <div className="pokenumber">
          #{pokemon.id.toString().padStart(3, "0")}
        </div>
        <h1 className="poke-name">{pokemon.name}</h1>
        <div className="poke-genera">{genera}</div>
        <div className="poke-types">
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
            <div className="poke-gender-ratio">
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
            className="poke-cry"
            title="Play Pokémon Cry"
          >
            🔊 Cry
          </button>
        )}
      </div>
      <div className="pokeheader-image-panel">
        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          src={sprites[selectedSprite as keyof typeof sprites]}
          alt={pokemon.name}
          className="pokeheader-image"
        />
      </div>
    </div>
  );
}
