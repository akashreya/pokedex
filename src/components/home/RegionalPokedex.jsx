import { REGIONS } from "../../constants/PokemonRegions";
import Carousel from "../ui/Carousel";
import { useNavigate } from "react-router-dom";
import { BorderBeam } from "../ui/border-beam";

export default function RegionalPokedex() {
  const navigate = useNavigate();
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
      <h2 className="font-pokemon-solid">Regional Pokédex</h2>
      <div className="regional-dex-content group">
        <Carousel
          items={REGIONS}
          renderItem={renderRegion}
          autoPlayInterval={7000}
          className="w-full max-w-3xl mx-auto min-h-[200px] hover:scale-110 transition-all duration-200"
          slideClassName="px-4"
          showNavButtons={false}
          showDotIndicators={false}
          autoPlay={true}
        />
        <div className="relative inline-block overflow-hidden rounded-full mb-4">
          <button
            type="button"
            onClick={() => navigate("/pokemon")}
            className="relative px-10 py-2 font-poppins font-semibold font-Montserrat 
              rounded-2xl text-xl
              bg-gradient-to-bl from-[#232526] to-[#414345]
              dark:bg-gradient-to-b dark:from-yellow-700 dark:to-yellow-400 
              text-yellow-400 dark:text-[#232526] shadow-md
              hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            Browse by Region
          </button>
          <BorderBeam
            size={40}
            duration={8}
            className="from-transparent via-yellow-200 to-transparent dark:via-[#232526]"
            borderWidth={3}
          />
        </div>
      </div>
    </section>
  );
}
