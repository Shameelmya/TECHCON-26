import { useEffect, useRef, useState } from 'react';
import { useScroll } from 'motion/react';

export default function CircuitBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useRef(0);
  const lastScrollY = useRef(0);
  const mouseRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // 1. Device Detection
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth < 768 || window.matchMedia('(hover: none) and (pointer: coarse)').matches;
      setIsMobile(mobile);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    setMounted(true);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  // Scroll Tracking
  useEffect(() => {
    if (isMobile) return;
    const unsubscribe = scrollY.on('change', (latest) => {
      const delta = latest - lastScrollY.current;
      scrollVelocity.current = delta;
      lastScrollY.current = latest;
    });
    return () => unsubscribe();
  }, [scrollY, isMobile]);

  // Mouse Tracking for Parallax
  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // 2. Desktop Experience (The Quantum Node Network)
  useEffect(() => {
    if (!mounted || isMobile || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparency buffer
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
      parallaxFactor: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.baseSize = Math.random() * 1.5 + 0.5;
        // Glow in Electric Magenta (#E01A8A) and Deep Cyber Blue (#2036F2)
        this.color = Math.random() > 0.5 ? '#E01A8A' : '#2036F2';
        this.parallaxFactor = Math.random() * 0.05 + 0.01;
      }

      update(scrollV: number, mouseX: number, mouseY: number) {
        // Accelerate on scroll
        const speedMultiplier = 1 + Math.abs(scrollV) * 0.1;
        
        // Mouse parallax shift
        const dx = (mouseX - width / 2) * this.parallaxFactor;
        const dy = (mouseY - height / 2) * this.parallaxFactor;

        this.x += this.vx * speedMultiplier + (dx * 0.02);
        this.y += this.vy * speedMultiplier + scrollV * 0.2 + (dy * 0.02);

        // Wrap around
        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
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
      const particleCount = Math.min(Math.floor((width * height) / 12000), 120);
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

          if (distance < 160) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = 1 - distance / 160;
            
            const gradient = ctx.createLinearGradient(particles[i].x, particles[i].y, particles[j].x, particles[j].y);
            // E01A8A = 224, 26, 138 | 2036F2 = 32, 54, 242
            const color1 = particles[i].color === '#E01A8A' ? `rgba(224, 26, 138, ${opacity * 0.5})` : `rgba(32, 54, 242, ${opacity * 0.5})`;
            const color2 = particles[j].color === '#E01A8A' ? `rgba(224, 26, 138, ${opacity * 0.5})` : `rgba(32, 54, 242, ${opacity * 0.5})`;
            
            gradient.addColorStop(0, color1);
            gradient.addColorStop(1, color2);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      // Use dark background fill instead of clearRect for performance and trailing effects
      ctx.fillStyle = '#0A0A0C';
      ctx.fillRect(0, 0, width, height);

      scrollVelocity.current *= 0.9;

      particles.forEach(p => {
        p.update(scrollVelocity.current, mouseRef.current.x, mouseRef.current.y);
        p.draw();
      });

      drawLines();
      animationFrameId = requestAnimationFrame(animate);
    };

    initCanvas();
    initParticles();
    animate();

    const handleResize = () => {
      initCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [mounted, isMobile]);

  if (!mounted) return null;

  // 3. Mobile Experience (The Glassmorphic Engine)
  // Disable Canvas WebGL completely to save battery, relying purely on CSS background
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-[-1] bg-[#0A0A0C]">
      {/* Soft overlay gradients */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0C] via-brand-purple/5 to-[#0A0A0C] z-0 opacity-80" />
      
      {!isMobile && (
        <canvas
          ref={canvasRef}
          className="block absolute inset-0 w-full h-full z-10 mix-blend-screen opacity-90"
        />
      )}
      
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
