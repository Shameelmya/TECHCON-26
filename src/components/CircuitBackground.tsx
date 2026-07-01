import { useEffect, useRef, useState } from 'react';
import { useScroll } from 'motion/react';

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const unsubscribe = scrollY.on('change', (latest) => {
      const delta = latest - lastScrollY.current;
      scrollVelocity.current = delta;
      lastScrollY.current = latest;
    });

    return () => unsubscribe();
  }, [scrollY]);

  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const initCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      baseSize: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseSize = Math.random() * 1.5 + 0.5;
        this.color = Math.random() > 0.5 ? '#E01A8A' : '#2036F2';
      }

      update(scrollV: number) {
        // Accelerate on scroll
        const speedMultiplier = 1 + Math.abs(scrollV) * 0.1;
        this.x += this.vx * speedMultiplier;
        this.y += this.vy * speedMultiplier + scrollV * 0.2; // slight parallax

        // Wrap around
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.baseSize, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor((width * height) / 15000), 100);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const drawLines = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = 1 - distance / 150;
            
            // Gradient line between the two points
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            // We need to parse hex colors to add opacity. E01A8A = 224, 26, 138. 2036F2 = 32, 54, 242.
            const color1 = particles[i].color === '#E01A8A' ? `rgba(224, 26, 138, ${opacity * 0.4})` : `rgba(32, 54, 242, ${opacity * 0.4})`;
            const color2 = particles[j].color === '#E01A8A' ? `rgba(224, 26, 138, ${opacity * 0.4})` : `rgba(32, 54, 242, ${opacity * 0.4})`;
            
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Dampen scroll velocity smoothly
      scrollVelocity.current *= 0.9;

      particles.forEach(p => {
        p.update(scrollVelocity.current);
        p.draw();
      });

      drawLines();

      animationFrameId = requestAnimationFrame(animate);
    };

    initCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      initCanvas();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', initCanvas);
    };
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] bg-[#0A0A0C]">
      {/* Soft overlay gradients to blend the harsh background and give it depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C] via-transparent to-[#0A0A0C] z-0 opacity-80" />
      <canvas
        ref={canvasRef}
        className="block absolute inset-0 w-full h-full z-10 mix-blend-screen opacity-70"
      />
      {/* Noise Texture Overlay for modern grain */}
      <div 
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay z-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
