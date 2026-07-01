/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, MapPin, User, ChevronRight } from 'lucide-react';

interface HeroProps {
  isRegOpen?: boolean;
  onOpenRegister: () => void;
  onExploreEvent: () => void;
}

export default function Hero({ isRegOpen = true, onOpenRegister, onExploreEvent }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 15, hours: 0, minutes: 0, seconds: 0 });
  const [currentGraphicIndex, setCurrentGraphicIndex] = useState(0);
  
  // Memoize array outside of effect dependency to avoid recreation or just declare outside
  const graphics = ['/hero-graphic.png', '/hero-graphic1.png', '/hero-graphic2.png'];

  useEffect(() => {
    // Graphic carousel timer
    const graphicInterval = setInterval(() => {
      setCurrentGraphicIndex((prev) => (prev + 1) % graphics.length);
    }, 4000);
    return () => clearInterval(graphicInterval);
  }, []);

  useEffect(() => {
    // Target date: 15 July 2026 UTC
    const targetDate = new Date('2026-07-15T09:00:00Z').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center pt-24 pb-16 overflow-hidden bg-white px-6 md:px-12"
    >
      {/* Blurred Soft Light Blobs for Depth */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-purple-200/50 to-pink-200/40 blur-[120px] -top-20 left-1/4 pointer-events-none animate-[pulse_8s_infinite]" />
      <div className="absolute w-[550px] h-[550px] rounded-full bg-gradient-to-br from-blue-100/40 to-purple-100/50 blur-[130px] bottom-10 right-10 pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]" 
        style={{
          backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-1 sm:gap-8 lg:gap-8 items-center z-10">
        
        {/* Left column: Headings and copy */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          {/* Tagline / Organizer */}
          {/* Premium High-Tech Brand Identity Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col mb-4 sm:mb-6 items-center lg:items-start w-full"
          >
            <div className="flex justify-center lg:justify-start w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[900px]">
              <img 
                src="/hero-typography.png" 
                alt="TECHCON 26" 
                className="w-full h-auto object-contain drop-shadow-md" 
              />
            </div>
          </motion.div>

          {/* Brief introduction paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-[14px] sm:text-[16px] text-slate-500 font-sans font-normal leading-relaxed mb-8 max-w-xl text-center lg:text-left"
          >
            Kerala's premier technical conference. A dynamic physical conclave where student innovators, researchers, and developers converge to co-create the digital future.
          </motion.p>

          {/* Key Metadata Row */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-6 border-t border-slate-100 pt-6 mb-10 max-w-lg w-full"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-brand-purple shrink-0 border border-purple-100/50">
                <Calendar size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">DATE</span>
                <span className="text-xs sm:text-sm font-sans font-bold text-slate-800">15 July 2026</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-brand-pink shrink-0 border border-pink-100/50">
                <MapPin size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">VENUE</span>
                <span className="text-xs sm:text-sm font-sans font-bold text-slate-800">CUSAT, Kochi</span>
              </div>
            </div>

            <div className="hidden sm:flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2 sm:gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-brand-blue shrink-0 border border-blue-100/50">
                <User size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">ORGANIZER</span>
                <span className="text-xs sm:text-sm font-sans font-bold text-slate-800">msf TechFed</span>
              </div>
            </div>
          </motion.div>

          {/* Minimal Action banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="w-full max-w-lg mb-6 relative"
          >
            <div className="w-full rounded-[32px] p-6 sm:p-8 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue bg-[length:200%_auto] animate-[gradient_6s_ease-in-out_infinite] flex flex-col sm:flex-row items-center justify-between gap-6">
              
              <div className="text-center sm:text-left text-white">
                <h4 className="font-sans font-bold text-xl mb-1 drop-shadow-sm">Secure Your Pass</h4>
              </div>
              
              <motion.button
                onClick={onOpenRegister}
                disabled={!isRegOpen}
                animate={isRegOpen ? { scale: [1, 1.05, 1] } : {}}
                transition={isRegOpen ? { repeat: Infinity, duration: 3, ease: "easeInOut" } : {}}
                className={`px-8 py-3.5 bg-white text-slate-800 font-sans font-bold text-sm rounded-full w-full sm:w-auto shrink-0 shadow-lg ${
                  isRegOpen 
                    ? 'shadow-purple-500/20 hover:shadow-purple-500/40' 
                    : 'opacity-80 cursor-not-allowed shadow-slate-200'
                }`}
              >
                <span>
                  {isRegOpen ? "REGISTER NOW" : "REGISTRATION CLOSED"}
                </span>
              </motion.button>
            </div>
          </motion.div>

          {/* Under banner buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10"
          >
            <a
              href="#venue"
              className="px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-sans font-medium text-xs rounded-full hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
              <MapPin size={14} className="text-brand-pink" />
              <span>Location</span>
            </a>
            <a
              href="#calendar"
              className="px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 font-sans font-medium text-xs rounded-full hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
              <Calendar size={14} className="text-brand-purple" />
              <span>Add to Calendar</span>
            </a>
            <button
              onClick={onExploreEvent}
              className="group px-5 py-2.5 bg-transparent border border-slate-300 text-slate-700 font-sans font-medium text-xs rounded-full hover:bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <span>Explore Event</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {/* Digital Countdown Timer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex items-center gap-3 sm:gap-6 w-fit bg-slate-50/50 p-3 sm:p-4 rounded-2xl border border-slate-100/80"
          >
            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[64px]">
              <span className="font-orbitron text-xl sm:text-2xl font-black text-slate-800 tabular-nums">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase mt-1">DAYS</span>
            </div>
            <div className="text-slate-300 font-mono text-xl sm:text-2xl font-light animate-pulse">:</div>
            
            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[64px]">
              <span className="font-orbitron text-xl sm:text-2xl font-black text-brand-purple tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase mt-1">HOURS</span>
            </div>
            <div className="text-slate-300 font-mono text-xl sm:text-2xl font-light animate-pulse">:</div>

            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[64px]">
              <span className="font-orbitron text-xl sm:text-2xl font-black text-brand-blue tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase mt-1">MINUTES</span>
            </div>
            <div className="text-slate-300 font-mono text-xl sm:text-2xl font-light animate-pulse">:</div>

            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[64px]">
              <span className="font-orbitron text-xl sm:text-2xl font-black text-brand-pink tabular-nums">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase mt-1">SECONDS</span>
            </div>
          </motion.div>
        </div>

        {/* Right column: Interactive Premium Logo Float Visual */}
        <div className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2 h-64 sm:h-96 lg:h-[550px]">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[500px] lg:h-[500px]">
            {/* Glowing Soft Background Circle blobs behind Logo */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/25 via-pink-500/10 to-blue-500/20 blur-3xl"
              animate={{ 
                scale: [0.85, 1.05, 0.85],
                opacity: [0.6, 0.9, 0.6]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Glowing Rings (Orbit Circles) */}
            <motion.div
              className="absolute inset-4 rounded-full border border-dashed border-purple-500/15"
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-12 rounded-full border border-dotted border-pink-500/15"
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            />

            {/* Floating Logo SVG */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center filter drop-shadow-[0_16px_32px_rgba(120,45,255,0.18)]"
              animate={{ y: [-12, 12, -12] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <AnimatePresence>
                <motion.img 
                  key={currentGraphicIndex}
                  src={graphics[currentGraphicIndex]} 
                  alt="TECHCON Graphic" 
                  className="w-full h-full object-contain absolute" 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
