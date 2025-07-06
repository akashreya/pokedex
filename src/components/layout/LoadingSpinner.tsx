import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: "red" | "white";
  delay: number;
}

export default function LoadingSpinner() {
  const [trailParticles, setTrailParticles] = useState<TrailParticle[]>([]);

  // Define the elliptical path
  const pathVariants = {
    animate: {
      x: [-250, -220, -190, -160, -130, -100, -70, -45, -25, 0],
      y: [-150, -130, -110, -85, -65, -45, -30, -18, -8, 0],
      scale: [0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1.05, 1.2],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear" as const,
      },
    },
  };

  // Generate trail particles
  useEffect(() => {
    const particles: TrailParticle[] = [];
    const pathX = [-250, -220, -190, -160, -130, -100, -70, -45, -25, 0];
    const pathY = [-150, -130, -110, -85, -65, -45, -30, -18, -8, 0];
    const pathScale = [
      0.25, 0.35, 0.45, 0.55, 0.65, 0.75, 0.85, 0.95, 1.05, 1.2,
    ];

    // Create particles along the path with different delays
    for (let i = 0; i < 50; i++) {
      const pathProgress = i / 50;
      const pathIndex = Math.floor(pathProgress * (pathX.length - 1));
      const nextIndex = Math.min(pathIndex + 1, pathX.length - 1);
      const fraction = pathProgress * (pathX.length - 1) - pathIndex;

      const x =
        pathX[pathIndex] + (pathX[nextIndex] - pathX[pathIndex]) * fraction;
      const y =
        pathY[pathIndex] + (pathY[nextIndex] - pathY[pathIndex]) * fraction;
      const scale =
        pathScale[pathIndex] +
        (pathScale[nextIndex] - pathScale[pathIndex]) * fraction;

      particles.push({
        id: i,
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        size: scale * (20 + Math.random() * 25),
        color: Math.random() > 0.5 ? "red" : "white",
        delay: i * 0.04,
      });
    }

    setTrailParticles(particles);
  }, []);

  return (
    <div className="relative flex items-center overflow-visible justify-center z-0 min-h-[500px] min-w-[400px]">
      {/* Background gradient */}
      {/* Animation container */}
      {/* Fluid trail particles */}
      {trailParticles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background:
              particle.color === "red"
                ? "radial-gradient(circle, rgba(255,50,50,0.8) 0%, rgba(255,100,100,0.6) 30%, rgba(255,150,150,0.3) 60%, transparent 100%)"
                : "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.6) 30%, rgba(255,255,255,0.3) 60%, transparent 100%)",
            filter: `blur(${Math.random() * 3 + 1}px)`,
          }}
          animate={{
            x: particle.x,
            y: particle.y,
            scale: [0, 1, 0.8, 0],
            opacity: [0, 0.8, 0.6, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: particle.delay,
          }}
        />
      ))}

      {/* Additional flowing particles for more fluid effect */}
      {Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={`flow-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${15 + Math.random() * 20}px`,
            height: `${15 + Math.random() * 20}px`,
            background:
              i % 2 === 0
                ? "radial-gradient(circle, rgba(255,0,0,0.6) 0%, rgba(255,100,100,0.4) 50%, transparent 100%)"
                : "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
            filter: `blur(${2 + Math.random() * 2}px)`,
          }}
          animate={{
            x: [
              -250 + Math.random() * 50,
              -220 + Math.random() * 50,
              -190 + Math.random() * 50,
              -160 + Math.random() * 50,
              -130 + Math.random() * 50,
              -100 + Math.random() * 50,
              -70 + Math.random() * 50,
              -45 + Math.random() * 50,
              -25 + Math.random() * 50,
              0 + Math.random() * 50,
            ],
            y: [
              -150 + Math.random() * 40,
              -130 + Math.random() * 40,
              -110 + Math.random() * 40,
              -85 + Math.random() * 40,
              -65 + Math.random() * 40,
              -45 + Math.random() * 40,
              -30 + Math.random() * 40,
              -18 + Math.random() * 40,
              -8 + Math.random() * 40,
              0 + Math.random() * 40,
            ],
            scale: [0, 0.8, 1, 0.6, 0],
            opacity: [0, 0.6, 0.8, 0.4, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: i * 0.06,
          }}
        />
      ))}

      {/* Main Pokeball with elliptical motion and scaling */}
      <motion.div
        className="absolute w-20 h-20 z-20 bg-transparent"
        variants={pathVariants}
        animate="animate"
        style={{
          filter:
            "drop-shadow(0 0 25px rgba(255,255,255,0.8)) drop-shadow(0 0 15px rgba(255,0,0,0.6))",
        }}
      >
        <img
          src="/wingedPokeball.png"
          alt="Winged Pokeball"
          width={80}
          height={80}
          className="w-full h-full object-contain"
        />
      </motion.div>

      {/* Bright core glow around pokeball */}
      <motion.div
        className="absolute rounded-full z-10"
        variants={pathVariants}
        animate="animate"
        style={{
          width: "5rem",
          height: "5rem",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,0,0,0.4) 30%, rgba(255,255,255,0.2) 50%, transparent 80%)",
          filter: "blur(8px)",
        }}
      />

      {/* Enhanced sparkle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={`sparkle-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 2, 0],
            }}
            transition={{
              duration: 1.5 + Math.random(),
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
