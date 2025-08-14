import React, { useEffect, useState } from 'react';

interface PokemonTypeGradientOverlayProps {
  className?: string;
  animationDuration?: number;
}

export default function PokemonTypeGradientOverlay({ 
  className = '',
  animationDuration = 8000
}: PokemonTypeGradientOverlayProps) {
  const [currentGradientIndex, setCurrentGradientIndex] = useState(0);

  // Pokemon types in order for gradient cycling
  const pokemonTypes = [
    'fire', 'water', 'electric', 'grass', 'ice', 'fighting',
    'poison', 'ground', 'flying', 'psychic', 'bug', 'rock',
    'ghost', 'dragon', 'dark', 'steel', 'fairy', 'normal'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGradientIndex((prev) => (prev + 1) % pokemonTypes.length);
    }, animationDuration);

    return () => clearInterval(interval);
  }, [animationDuration, pokemonTypes.length]);

  const getCurrentGradient = () => {
    const currentType = pokemonTypes[currentGradientIndex];
    const nextType = pokemonTypes[(currentGradientIndex + 1) % pokemonTypes.length];
    
    return `from-type-gradient-${currentType} via-type-gradient-${nextType} to-type-gradient-${currentType}`;
  };

  const getSecondaryGradient = () => {
    const currentType = pokemonTypes[currentGradientIndex];
    const nextType = pokemonTypes[(currentGradientIndex + 1) % pokemonTypes.length];
    const thirdType = pokemonTypes[(currentGradientIndex + 2) % pokemonTypes.length];
    
    return `from-type-gradient-${nextType} via-type-gradient-${thirdType} to-type-gradient-${currentType}`;
  };

  return (
    <div className={`fixed inset-0 pointer-events-none z-0 ${className}`}>
      {/* Primary gradient overlay - more visible in light mode */}
      <div 
        className={`absolute inset-0 opacity-30 dark:opacity-20 bg-gradient-to-br ${getCurrentGradient()} 
        transition-all duration-[4000ms] ease-in-out`}
        style={{
          background: `
            radial-gradient(
              ellipse at top left, 
              var(--color-type-solid-${pokemonTypes[currentGradientIndex]}) 0%, 
              transparent 50%
            ),
            radial-gradient(
              ellipse at bottom right, 
              var(--color-type-solid-${pokemonTypes[(currentGradientIndex + 1) % pokemonTypes.length]}) 0%, 
              transparent 50%
            ),
            linear-gradient(
              135deg, 
              var(--color-type-solid-${pokemonTypes[currentGradientIndex]}) 0%, 
              var(--color-type-solid-${pokemonTypes[(currentGradientIndex + 1) % pokemonTypes.length]}) 100%
            )
          `
        }}
      />
      
      {/* Secondary overlay for depth - more visible in light mode */}
      <div 
        className={`absolute inset-0 opacity-15 dark:opacity-10 bg-gradient-to-tl ${getSecondaryGradient()} 
        transition-all duration-[6000ms] ease-in-out`}
        style={{
          background: `
            conic-gradient(
              from 0deg,
              var(--color-type-solid-${pokemonTypes[currentGradientIndex]}) 0deg,
              var(--color-type-solid-${pokemonTypes[(currentGradientIndex + 1) % pokemonTypes.length]}) 120deg,
              var(--color-type-solid-${pokemonTypes[(currentGradientIndex + 2) % pokemonTypes.length]}) 240deg,
              var(--color-type-solid-${pokemonTypes[currentGradientIndex]}) 360deg
            )
          `
        }}
      />

      {/* Animated mesh gradient for extra depth - more visible in light mode */}
      <div 
        className="absolute inset-0 opacity-10 dark:opacity-5"
        style={{
          background: `
            radial-gradient(
              circle at 20% 80%, 
              var(--color-type-solid-${pokemonTypes[(currentGradientIndex + 3) % pokemonTypes.length]}) 0%, 
              transparent 50%
            ),
            radial-gradient(
              circle at 80% 20%, 
              var(--color-type-solid-${pokemonTypes[(currentGradientIndex + 4) % pokemonTypes.length]}) 0%, 
              transparent 50%
            ),
            radial-gradient(
              circle at 40% 40%, 
              var(--color-type-solid-${pokemonTypes[(currentGradientIndex + 5) % pokemonTypes.length]}) 0%, 
              transparent 50%
            )
          `,
          animation: 'gradientShift 12s ease-in-out infinite'
        }}
      />

      {/* CSS for gradient animation */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1) rotate(0deg);
          }
          50% {
            opacity: 0.15;
            transform: scale(1.1) rotate(180deg);
          }
        }
        
        @media (prefers-color-scheme: dark) {
          @keyframes gradientShift {
            0%, 100% {
              opacity: 0.05;
              transform: scale(1) rotate(0deg);
            }
            50% {
              opacity: 0.1;
              transform: scale(1.1) rotate(180deg);
            }
          }
        }
      `}</style>
    </div>
  );
}