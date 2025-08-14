import PokemonCardList from "./PokemonCardList";
import NoResults from "./NoResults";

export default function PokemonListLayout({ 
  paginatedPokemon, 
  focusedIndex = -1, 
  onKeyboardNavigate 
}) {
  return (
    <div className="pokemon-listlayout">
      {paginatedPokemon.length === 0 ? (
        <NoResults />
      ) : (
        paginatedPokemon.map((pokemon, index) => (
          <PokemonCardList 
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
