import React, { useEffect, useRef } from 'react';

interface PokemonSilhouette {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  rotation: number;
  rotationSpeed: number;
  shape: string;
}

interface FloatingPokemonSilhouettesProps {
  silhouetteCount?: number;
  className?: string;
}

export default function FloatingPokemonSilhouettes({ 
  silhouetteCount = 15,
  className = ''
}: FloatingPokemonSilhouettesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const silhouettesRef = useRef<PokemonSilhouette[]>([]);
  const animationRef = useRef<number | undefined>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Pokemon silhouette shapes using simple geometric forms
    const pokemonShapes = [
      'pikachu', 'pokeball', 'squirtle', 'bulbasaur', 'charmander', 
      'psyduck', 'jigglypuff', 'meowth', 'snorlax', 'eevee'
    ];

    // Initialize silhouettes
    silhouettesRef.current = Array.from({ length: silhouetteCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 40 + 20,
      alpha: Math.random() * 0.15 + 0.05,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      shape: pokemonShapes[Math.floor(Math.random() * pokemonShapes.length)]
    }));

    const drawPikachu = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      // Head
      ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
      // Ears
      ctx.moveTo(x - size * 0.2, y - size * 0.3);
      ctx.lineTo(x - size * 0.1, y - size * 0.6);
      ctx.lineTo(x, y - size * 0.4);
      ctx.moveTo(x + size * 0.2, y - size * 0.3);
      ctx.lineTo(x + size * 0.1, y - size * 0.6);
      ctx.lineTo(x, y - size * 0.4);
      // Body
      ctx.ellipse(x, y + size * 0.2, size * 0.3, size * 0.4, 0, 0, Math.PI * 2);
    };

    const drawPokeball = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      ctx.arc(x, y, size * 0.4, 0, Math.PI * 2);
      ctx.moveTo(x - size * 0.4, y);
      ctx.lineTo(x + size * 0.4, y);
      ctx.arc(x, y, size * 0.1, 0, Math.PI * 2);
    };

    const drawSquirtle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      // Head
      ctx.arc(x, y - size * 0.1, size * 0.35, 0, Math.PI * 2);
      // Shell
      ctx.arc(x, y + size * 0.1, size * 0.4, 0, Math.PI);
      // Tail
      ctx.arc(x + size * 0.3, y, size * 0.15, 0, Math.PI * 2);
    };

    const drawBulbasaur = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      // Body
      ctx.ellipse(x, y, size * 0.4, size * 0.3, 0, 0, Math.PI * 2);
      // Bulb
      ctx.arc(x, y - size * 0.2, size * 0.25, 0, Math.PI * 2);
      // Spots
      ctx.arc(x - size * 0.15, y - size * 0.05, size * 0.08, 0, Math.PI * 2);
      ctx.arc(x + size * 0.15, y + size * 0.05, size * 0.08, 0, Math.PI * 2);
    };

    const drawCharmander = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      ctx.beginPath();
      // Head
      ctx.arc(x, y - size * 0.1, size * 0.3, 0, Math.PI * 2);
      // Body
      ctx.ellipse(x, y + size * 0.1, size * 0.25, size * 0.35, 0, 0, Math.PI * 2);
      // Tail flame
      ctx.ellipse(x + size * 0.3, y - size * 0.1, size * 0.1, size * 0.2, 0, 0, Math.PI * 2);
    };

    const drawShape = (ctx: CanvasRenderingContext2D, silhouette: PokemonSilhouette) => {
      ctx.save();
      ctx.translate(silhouette.x, silhouette.y);
      ctx.rotate(silhouette.rotation);
      
      switch (silhouette.shape) {
        case 'pikachu':
          drawPikachu(ctx, 0, 0, silhouette.size);
          break;
        case 'pokeball':
          drawPokeball(ctx, 0, 0, silhouette.size);
          break;
        case 'squirtle':
          drawSquirtle(ctx, 0, 0, silhouette.size);
          break;
        case 'bulbasaur':
          drawBulbasaur(ctx, 0, 0, silhouette.size);
          break;
        case 'charmander':
          drawCharmander(ctx, 0, 0, silhouette.size);
          break;
        default:
          // Generic Pokemon shape
          ctx.beginPath();
          ctx.arc(0, 0, silhouette.size * 0.4, 0, Math.PI * 2);
          ctx.ellipse(0, silhouette.size * 0.2, silhouette.size * 0.3, silhouette.size * 0.4, 0, 0, Math.PI * 2);
          break;
      }
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      silhouettesRef.current.forEach(silhouette => {
        // Update position
        silhouette.x += silhouette.vx;
        silhouette.y += silhouette.vy;
        silhouette.rotation += silhouette.rotationSpeed;

        // Wrap around edges with buffer
        if (silhouette.x < -silhouette.size) silhouette.x = canvas.width + silhouette.size;
        if (silhouette.x > canvas.width + silhouette.size) silhouette.x = -silhouette.size;
        if (silhouette.y < -silhouette.size) silhouette.y = canvas.height + silhouette.size;
        if (silhouette.y > canvas.height + silhouette.size) silhouette.y = -silhouette.size;

        // Draw silhouette with better visibility in light mode
        ctx.save();
        
        // Detect color scheme and adjust colors accordingly
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const adjustedAlpha = isDarkMode ? silhouette.alpha : silhouette.alpha * 2;
        
        ctx.globalAlpha = adjustedAlpha;
        
        if (isDarkMode) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        } else {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
          // Add subtle shadow for better visibility in light mode
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 3;
        }
        
        ctx.lineWidth = 1;
        
        drawShape(ctx, silhouette);
        ctx.fill();
        ctx.stroke();
        
        ctx.restore();

        // Subtle alpha animation
        silhouette.alpha += (Math.random() - 0.5) * 0.01;
        silhouette.alpha = Math.max(0.02, Math.min(0.2, silhouette.alpha));
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [silhouetteCount]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}