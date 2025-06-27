import { REGIONS } from "../../constants/PokemonRegions";
import Carousel from "../ui/Carousel";
import { Link } from "react-router-dom";

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
          className="w-full max-w-3xl mx-auto min-h-[200px] hover:scale-110"
          slideClassName="px-4"
          showNavButtons={false}
          showDotIndicators={false}
          autoPlay={true}
        />
        <Link
          to="/pokemon"
          className="px-6 py-2 rounded-full 
          bg-gradient-to-bl from-[#CC95C0] via-[#DBD4B4] to-[#7AA1D2]
          dark:bg-gradient-to-br dark:from-[#434343] dark:via-[#152331] dark:to-[#000000]
          font-poppins
          shadow-sm shadow-blue-900 dark:shadow-amber-400 font-poppins
          hover:scale-110 transition-colors duration-200"
        >
          Browse by Region
        </Link>
      </div>
    </section>
  );
}
