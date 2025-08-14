import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  type: 'sparkle' | 'circle' | 'star';
}

interface AnimatedParticlesProps {
  particleCount?: number;
  colors?: string[];
  className?: string;
}

export default function AnimatedParticles({ 
  particleCount = 30, 
  colors = ['#FFD700', '#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
  className = ''
}: AnimatedParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
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

    // Initialize particles
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      alpha: Math.random() * 0.5 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)],
      type: ['sparkle', 'circle', 'star'][Math.floor(Math.random() * 3)] as 'sparkle' | 'circle' | 'star'
    }));

    const drawSparkle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const spikes = 4;
      const outerRadius = size;
      const innerRadius = size * 0.4;
      
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes;
        const xPos = x + Math.cos(angle) * radius;
        const yPos = y + Math.sin(angle) * radius;
        
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.closePath();
    };

    const drawStar = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number) => {
      const spikes = 5;
      const outerRadius = size;
      const innerRadius = size * 0.5;
      
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const xPos = x + Math.cos(angle) * radius;
        const yPos = y + Math.sin(angle) * radius;
        
        if (i === 0) ctx.moveTo(xPos, yPos);
        else ctx.lineTo(xPos, yPos);
      }
      ctx.closePath();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with better visibility in light mode
        ctx.save();
        
        // Adjust alpha and add shadow for better visibility in light mode
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const adjustedAlpha = isDarkMode ? particle.alpha : particle.alpha * 1.5;
        
        ctx.globalAlpha = adjustedAlpha;
        
        // Add shadow for better contrast in light mode
        if (!isDarkMode) {
          ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
          ctx.shadowBlur = 2;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
        }
        
        ctx.fillStyle = particle.color;
        
        if (particle.type === 'sparkle') {
          drawSparkle(ctx, particle.x, particle.y, particle.size);
          ctx.fill();
        } else if (particle.type === 'star') {
          drawStar(ctx, particle.x, particle.y, particle.size);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();

        // Twinkle effect
        particle.alpha += (Math.random() - 0.5) * 0.02;
        particle.alpha = Math.max(0.1, Math.min(0.6, particle.alpha));
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
  }, [particleCount, colors]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ background: 'transparent' }}
    />
  );
}