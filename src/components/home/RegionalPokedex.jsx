import { REGIONS } from "../../constants/PokemonRegions";
import Carousel from "../ui/Carousel";

export default function RegionalPokedex() {
  const renderRegion = (region) => (
    <div className="regional-card">
      <div className="regional-card-images">
        {region.mascots.map((m) => (
          <img key={m.name} src={m.img} alt={m.name} title={m.name} />
        ))}
      </div>
      <span className="regional-card-name">{region.name}</span>
    </div>
  );

  return (
    <section className="regional-dex">
      <h2 className="font-pokemon-solid text-center">Regional Pokédex</h2>
      <div className="regional-dex-content group">
        <Carousel
          items={REGIONS}
          renderItem={renderRegion}
          autoPlayInterval={7000}
          className="w-full max-w-3xl mx-auto min-h-[200px]"
          slideClassName="px-4"
          showNavButtons={false}
          showDotIndicators={true}
          autoPlay={true}
        />
      </div>
    </section>
  );
}
