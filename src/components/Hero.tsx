/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight, Calendar, MapPin, User, ArrowDown } from 'lucide-react';
import MagneticButton from './MagneticButton';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

interface HeroProps {
  isRegOpen?: boolean;
  onOpenRegister: () => void;
  onExploreEvent: () => void;
}

export default function Hero({ isRegOpen = true, onOpenRegister, onExploreEvent }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 15, hours: 0, minutes: 0, seconds: 0 });

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
      className="relative overflow-hidden min-h-screen flex items-center justify-center px-4 md:px-8 pt-24 md:pt-32 pb-10"
    >
      {/* Blurred Soft Light Blobs for Depth */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-brand-purple/20 to-brand-pink/20 blur-[120px] -top-20 left-1/4 pointer-events-none animate-[pulse_8s_infinite]" />
      <div className="absolute w-[550px] h-[550px] rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 blur-[130px] bottom-10 right-10 pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]" 
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />

      {/* Background Lottie Animation */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-[1920px] h-[1100px] z-0 pointer-events-none opacity-50 mix-blend-screen blur-md"
        style={{
          maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)'
        }}
      >
        <DotLottieReact
          src="https://lottie.host/7a65ea9e-fbef-49e4-85b2-a5205e7b2add/QcDlwBIBsk.lottie"
          loop
          autoplay
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto w-full flex flex-col items-center justify-center">
        
        {/* Headings and copy */}
        <div className="flex flex-col justify-center items-center text-center">
          {/* Tagline / Organizer */}
          {/* Premium High-Tech Brand Identity Typography */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex flex-col mb-4 sm:mb-6 items-center"
          >
            <motion.img 
              src="/hero-graphic.png" 
              alt="Techcon 26 Graphic" 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="w-24 sm:w-32 md:w-40 lg:w-48 object-contain mb-8 sm:mb-12 lg:mb-16"
            />
            <h1 className="text-[13vw] md:text-[7rem] lg:text-[9.5rem] whitespace-nowrap font-orbitron font-black tracking-tighter leading-none flex items-center justify-center drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
              <motion.div 
                className="flex" 
                style={{ WebkitTextStroke: '2px rgba(255,255,255,0.8)' }}
                animate={{ gap: ['0px', '8px', '0px'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {"TECHCON".split('').map((char, index) => (
                  <motion.div
                    key={`t-${index}`}
                    initial={{ opacity: 0, y: 50, rotateX: 90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, delay: 0.1 + index * 0.05, type: 'spring', bounce: 0.4 }}
                    className="text-white drop-shadow-lg"
                  >
                    {char}
                  </motion.div>
                ))}
              </motion.div>
              <motion.div 
                className="flex ml-4 md:ml-8" 
                style={{ WebkitTextStroke: '1px rgba(120,45,255,0.5)' }}
                animate={{ gap: ['0px', '8px', '0px'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                {"26".split('').map((char, index) => (
                  <motion.div
                    key={`n-${index}`}
                    initial={{ opacity: 0, y: 50, rotateX: 90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.05, type: 'spring', bounce: 0.4 }}
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-br from-brand-pink to-brand-purple drop-shadow-xl">{char}</span>
                  </motion.div>
                ))}
              </motion.div>
            </h1>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="mt-1 md:mt-2 w-full text-[2.8vw] md:text-xl lg:text-3xl font-jura font-bold text-brand-purple uppercase relative drop-shadow-[0_0_15px_rgba(120,45,255,0.6)]"
            >
              <div className="relative z-10 w-full flex justify-between font-extrabold tracking-widest drop-shadow-[0_0_15px_rgba(120,45,255,0.4)]">
                {"DEFINING THE FUTURE".split('').map((char, index) => (
                  <motion.div 
                    key={index}
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 3, repeat: Infinity, delay: index * 0.08, ease: 'easeInOut' }}
                  >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue">
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Brief introduction paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-[13px] sm:text-[14px] md:text-[15px] text-slate-400 font-sans font-light leading-relaxed mb-10 max-w-4xl mx-auto text-center px-4"
          >
            Kerala's premier technical conference. A dynamic physical conclave where student innovators, researchers, and developers converge to co-create the digital future.
          </motion.p>

          {/* Key Metadata Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 border-t border-slate-800/50 pt-8 mb-12 w-full max-w-3xl"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-brand-purple shrink-0 border border-purple-500/20 shadow-[0_0_15px_rgba(120,45,255,0.2)]">
                <Calendar size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">DATE</span>
                <span className="text-sm sm:text-base font-sans font-bold text-white">15 July 2026</span>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center text-brand-pink shrink-0 border border-pink-500/20 shadow-[0_0_15px_rgba(255,32,142,0.2)]">
                <MapPin size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">VENUE</span>
                <span className="text-sm sm:text-base font-sans font-bold text-white">Ernakulam</span>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-brand-blue shrink-0 border border-blue-500/20 shadow-[0_0_15px_rgba(32,156,255,0.2)]">
                <User size={20} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase">ORGANIZER</span>
                <span className="text-sm sm:text-base font-sans font-bold text-white">msf TechFed</span>
              </div>
            </div>
          </motion.div>

          {/* Minimal Action banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="w-full max-w-2xl mb-6 relative"
          >
            <div className="w-full rounded-[32px] p-6 sm:p-8 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue bg-[length:200%_auto] animate-[gradient_6s_ease-in-out_infinite] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_8px_32px_rgba(120,45,255,0.4)]">
              
              <div className="text-center sm:text-left text-white">
                <h4 className="font-sans font-bold text-xl mb-1 drop-shadow-sm">Secure Your Pass</h4>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <MagneticButton className="w-full sm:w-auto">
                  <motion.button
                    onClick={onOpenRegister}
                    disabled={!isRegOpen}
                    animate={isRegOpen ? { scale: [1, 1.05, 1] } : {}}
                    transition={isRegOpen ? { repeat: Infinity, duration: 3, ease: "easeInOut" } : {}}
                    className={`px-8 py-3.5 bg-brand-dark/90 backdrop-blur-sm text-slate-200 font-sans font-bold text-sm rounded-full w-full sm:w-auto shrink-0 shadow-lg border border-slate-700/50 ${
                      isRegOpen 
                        ? 'shadow-purple-500/20 hover:shadow-purple-500/40 hover:text-white hover:border-brand-purple/50 transition-all duration-300' 
                        : 'opacity-80 cursor-not-allowed shadow-slate-200'
                    }`}
                  >
                    <span>
                      {isRegOpen ? "REGISTER NOW" : "REGISTRATION CLOSED"}
                    </span>
                  </motion.button>
                </MagneticButton>
              </div>
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
              className="px-5 py-2.5 bg-brand-black border border-slate-800 text-slate-300 font-sans font-medium text-xs rounded-full hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
              <MapPin size={14} className="text-brand-pink" />
              <span>Location</span>
            </a>
            <a
              href="#calendar"
              className="px-5 py-2.5 bg-brand-black border border-slate-800 text-slate-300 font-sans font-medium text-xs rounded-full hover:bg-slate-100 transition-colors flex items-center gap-2"
            >
              <Calendar size={14} className="text-brand-purple" />
              <span>Add to Calendar</span>
            </a>
            <button
              onClick={onExploreEvent}
              className="group px-5 py-2.5 bg-transparent border border-slate-300 text-slate-300 font-sans font-medium text-xs rounded-full hover:bg-brand-black transition-colors flex items-center gap-1.5"
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
            className="flex items-center gap-3 sm:gap-6 w-fit bg-brand-black/50 p-3 sm:p-4 rounded-2xl border border-slate-800/80"
          >
            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[64px]">
              <span className="font-orbitron text-xl sm:text-2xl font-black text-slate-200 tabular-nums">
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
          <HeroLogos />
        </div>
      </div>
    </section>
  );
}

const GRAPHICS = ['/hero-graphic.png', '/hero-graphic1.png', '/hero-graphic2.png'];

function HeroLogos() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const graphicInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % GRAPHICS.length);
    }, 4000);
    return () => clearInterval(graphicInterval);
  }, []);

  return (
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
        <AnimatePresence mode="popLayout">
          <motion.img 
            key={currentIndex}
            src={GRAPHICS[currentIndex]} 
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
  );
}
