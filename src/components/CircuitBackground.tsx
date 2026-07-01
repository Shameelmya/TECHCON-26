import { useEffect, useRef } from 'react';

export default function CircuitBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!blob1Ref.current || !blob2Ref.current || !blob3Ref.current) return;
      
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = scrollY / (maxScroll || 1);

      // Magenta blob slides down and right
      const blob1X = scrollPercent * 40; // up to 40vw
      const blob1Y = scrollPercent * 50; // up to 50vh
      
      // Blue blob slides up and left
      const blob2X = scrollPercent * -40; // up to -40vw
      const blob2Y = scrollPercent * -50; // up to -50vh
      
      // Purple blob scales up
      const blob3Scale = 1 + scrollPercent * 1.5; // Scale from 1 to 2.5

      blob1Ref.current.style.transform = `translate3d(${blob1X}vw, ${blob1Y}vh, 0)`;
      blob2Ref.current.style.transform = `translate3d(${blob2X}vw, ${blob2Y}vh, 0)`;
      blob3Ref.current.style.transform = `scale(${blob3Scale})`;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-[-1] overflow-hidden"
      style={{ backgroundColor: '#0A0A0C' }}
    >
      {/* Blob 1: Electric Magenta */}
      <div 
        ref={blob1Ref}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] min-w-[300px] min-h-[300px] rounded-full"
        style={{
          backgroundColor: '#E01A8A',
          filter: 'blur(140px)',
          opacity: 0.6,
          willChange: 'transform',
          transition: 'transform 1.8s cubic-bezier(0.1, 0.8, 0.2, 1)',
        }}
      />
      
      {/* Blob 2: Deep Cyber Blue */}
      <div 
        ref={blob2Ref}
        className="absolute bottom-[-10%] right-[-10%] w-[55vw] h-[55vw] min-w-[350px] min-h-[350px] rounded-full"
        style={{
          backgroundColor: '#2036F2',
          filter: 'blur(140px)',
          opacity: 0.6,
          willChange: 'transform',
          transition: 'transform 1.8s cubic-bezier(0.1, 0.8, 0.2, 1)',
        }}
      />
      
      {/* Blob 3: Deep Purple */}
      <div 
        ref={blob3Ref}
        className="absolute top-[25%] left-[25%] w-[40vw] h-[40vw] min-w-[250px] min-h-[250px] rounded-full"
        style={{
          backgroundColor: '#4A148C',
          filter: 'blur(140px)',
          opacity: 0.25,
          willChange: 'transform',
          transition: 'transform 1.8s cubic-bezier(0.1, 0.8, 0.2, 1)',
          transformOrigin: 'center center',
        }}
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
