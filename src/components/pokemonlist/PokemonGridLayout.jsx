import PokemonCard from "./PokemonCard";
import NoResults from "./NoResults";

export default function PokemonGridLayout({ paginatedPokemon }) {
  return (
    <div className="pokemon-gridlayout">
      {paginatedPokemon.length === 0 ? (
        <NoResults />
      ) : (
        paginatedPokemon.map((pokemon, index) => (
          <PokemonCard pokemon={pokemon} key={pokemon.id} index={index} />
        ))
      )}
    </div>
  );
}
