import PokemonCardList from "./PokemonCardList";
import NoResults from "./NoResults";

export default function PokemonListLayout({ paginatedPokemon }) {
  return (
    <div
      className="w-full sm:w-1/2 md:w-3/4 min-h-[500px] grid grid-cols-1 sm:grid-cols-3 
    md:grid-cols-5  gap-4 mx-auto"
    >
      {paginatedPokemon.length === 0 ? (
        <NoResults />
      ) : (
        paginatedPokemon.map((pokemon, index) => (
          <PokemonCardList pokemon={pokemon} key={pokemon.id} index={index} />
        ))
      )}
    </div>
  );
}
