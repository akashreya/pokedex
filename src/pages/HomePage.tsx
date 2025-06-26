import Hero from "../components/home/Hero.jsx";
import RegionalPokedex from "../components/home/RegionalPokedex.jsx";

export default function HomePage() {
  return (
    <>
      <div className="home-page">
        <Hero />
      </div>
      <RegionalPokedex />
    </>
  );
}
