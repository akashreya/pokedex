import PokemonCard from "./PokemonCard";
import NoResults from "./NoResults";

export default function PokemonGridLayout({ 
  paginatedPokemon, 
  focusedIndex = -1, 
  onKeyboardNavigate 
}) {
  return (
    <div className="pokemon-gridlayout">
      {paginatedPokemon.length === 0 ? (
        <NoResults />
      ) : (
        paginatedPokemon.map((pokemon, index) => (
          <PokemonCard 
            pokemon={pokemon} 
            key={pokemon.id} 
            index={index}
            isFocused={focusedIndex === index}
            onKeyboardNavigate={onKeyboardNavigate}
          />
        ))
      )}
    </div>
  );
}
