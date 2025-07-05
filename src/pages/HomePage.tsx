import Hero from "../components/home/Hero.jsx";
import RegionalPokedex from "../components/home/RegionalPokedex.jsx";
import WordleShowcase from "../components/wordle/WordleShowcase";

export default function HomePage() {
  return (
    <>
      <div className="home-page">
        <Hero />
      </div>
      <div className="w-full max-w-[900px] mx-auto mt-4 flex flex-col md:flex-row gap-4 items-center justify-center">
        <RegionalPokedex />
        <WordleShowcase />
      </div>
    </>
  );
}
