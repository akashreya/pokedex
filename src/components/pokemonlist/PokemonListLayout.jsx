import PokemonCardList from "./PokemonCardList";
import NoResults from "./NoResults";

export default function PokemonListLayout({ paginatedPokemon }) {
  return (
    <div className="pokemon-listlayout">
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
