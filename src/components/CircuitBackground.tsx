import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

export default function CircuitBackground() {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Soft, smooth transforms for blobs based on scroll
  const blob1Y = useTransform(scrollYProgress, [0, 1], ['0%', '150%']);
  const blob1X = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  
  const blob2Y = useTransform(scrollYProgress, [0, 1], ['0%', '-100%']);
  const blob2X = useTransform(scrollYProgress, [0, 1], ['0%', '-50%']);
  
  const blob3Y = useTransform(scrollYProgress, [0, 1], ['0%', '200%']);
  const blob3Scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden bg-brand-dark">
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Grid Pattern overlay for depth */}
      <div 
        className="absolute inset-0 z-10 opacity-[0.03]" 
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* GPU Accelerated Mesh Gradient Blobs */}
      <div className="absolute inset-0 w-full h-full blur-[100px] sm:blur-[140px] opacity-60">
        <motion.div
          style={{ x: blob1X, y: blob1Y }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-brand-purple/40 mix-blend-screen"
        />
        
        <motion.div
          style={{ x: blob2X, y: blob2Y }}
          className="absolute top-[40%] right-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-brand-blue/30 mix-blend-screen"
        />

        <motion.div
          style={{ y: blob3Y, scale: blob3Scale }}
          className="absolute bottom-[-20%] left-[20%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-brand-pink/30 mix-blend-screen"
        />
        
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] left-[30%] w-[30vw] h-[30vw] max-w-[400px] max-h-[400px] rounded-full bg-cyan-500/20 mix-blend-screen"
        />
      </div>
    </div>
  );
}
