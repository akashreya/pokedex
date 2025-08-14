import Hero from "../components/home/Hero.jsx";
import RegionalPokedex from "../components/home/RegionalPokedex.jsx";
import WordleShowcase from "../components/wordle/WordleShowcase";
import AnimatedParticles from "../components/ui/AnimatedParticles";
import FloatingPokemonSilhouettes from "../components/ui/FloatingPokemonSilhouettes";
import PokemonTypeGradientOverlay from "../components/ui/PokemonTypeGradientOverlay";

export default function HomePage() {
  return (
    <>
      {/* Background layers */}
      <PokemonTypeGradientOverlay />
      <FloatingPokemonSilhouettes silhouetteCount={12} />
      <AnimatedParticles 
        particleCount={25} 
        colors={['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5', '#118AB2', '#073B4C', '#EF476F', '#7209B7']}
      />
      
      {/* Content */}
      <div className="home-page relative z-10">
        <Hero />
      </div>
      <div className="w-full max-w-[900px] mx-auto mt-4 flex flex-col md:flex-row gap-4 items-center justify-center relative z-10">
        <RegionalPokedex />
        <WordleShowcase />
      </div>
    </>
  );
}
