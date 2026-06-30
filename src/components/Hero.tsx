/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, MapPin, User, ChevronRight } from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
  onExploreEvent: () => void;
}

export default function Hero({ onOpenRegister, onExploreEvent }: HeroProps) {
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

      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center z-10">
        
        {/* Left column: Headings and copy */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
          {/* Tagline / Organizer */}
          {/* Premium High-Tech Brand Identity Typography */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col mb-6 items-center lg:items-start"
          >
            <div className="flex justify-center lg:justify-start w-full max-w-[400px]">
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
            The premium technological assembly of India begins here. Join developers, researchers, and network architects at the historic CUSAT campus in Kochi to co-create tomorrow's digital infrastructure.
          </motion.p>

          {/* Key Metadata Row */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 border-t border-slate-100 pt-6 mb-10 max-w-lg w-full"
          >
            <div className="flex items-center text-left gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-brand-purple shrink-0 border border-purple-100/50">
                <Calendar size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">DATE</span>
                <span className="text-xs sm:text-sm font-sans font-bold text-slate-800">15 July 2026</span>
              </div>
            </div>

            <div className="flex items-center text-left gap-3">
              <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-brand-pink shrink-0 border border-pink-100/50">
                <MapPin size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">VENUE</span>
                <span className="text-xs sm:text-sm font-sans font-bold text-slate-800">CUSAT, Kochi</span>
              </div>
            </div>

            <div className="flex items-center text-left gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-brand-blue shrink-0 border border-blue-100/50">
                <User size={14} />
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
                <p className="font-sans text-sm text-white/90">Limited seats available.</p>
              </div>
              
              <button
                onClick={onOpenRegister}
                className="px-8 py-3.5 bg-white text-slate-900 font-sans font-bold text-sm rounded-full transition-transform duration-300 hover:scale-105 w-full sm:w-auto shrink-0"
              >
                REGISTER NOW
              </button>
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
              <span className="font-orbitron text-xl sm:text-2xl font-extrabold text-slate-800 tabular-nums">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase mt-1">DAYS</span>
            </div>
            <div className="text-slate-300 font-mono text-xl sm:text-2xl font-light animate-pulse">:</div>
            
            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[64px]">
              <span className="font-orbitron text-xl sm:text-2xl font-extrabold text-brand-purple tabular-nums">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase mt-1">HOURS</span>
            </div>
            <div className="text-slate-300 font-mono text-xl sm:text-2xl font-light animate-pulse">:</div>

            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[64px]">
              <span className="font-orbitron text-xl sm:text-2xl font-extrabold text-brand-blue tabular-nums">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase mt-1">MINUTES</span>
            </div>
            <div className="text-slate-300 font-mono text-xl sm:text-2xl font-light animate-pulse">:</div>

            <div className="flex flex-col items-center min-w-[50px] sm:min-w-[64px]">
              <span className="font-orbitron text-xl sm:text-2xl font-extrabold text-brand-pink tabular-nums">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
              <span className="text-[9px] font-mono tracking-wider text-slate-400 uppercase mt-1">SECONDS</span>
            </div>
          </motion.div>
        </div>

        {/* Right column: Interactive Premium Logo Float Visual */}
        <div className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2 h-72 sm:h-96 lg:h-[480px]">
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[400px] lg:h-[400px]">
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
              className="absolute inset-0 flex items-center justify-center hover-logo filter drop-shadow-[0_16px_32px_rgba(120,45,255,0.18)]"
              animate={{ 
                y: [-12, 12, -12],
                rotate: [-1, 1, -1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <svg viewBox="0 0 100 100" className="w-5/6 h-5/6">
                <defs>
                  <linearGradient id="hero-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF20BE" />
                    <stop offset="45%" stopColor="#782DFF" />
                    <stop offset="100%" stopColor="#209CFF" />
                  </linearGradient>
                  
                  <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>

                {/* Network connectivity lines branching from Logo */}
                {/* Circuit line 1 */}
                <motion.path
                  d="M 68,22 Q 85,22 88,10"
                  fill="none"
                  stroke="#FF20BE"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 0.5, ease: "easeInOut" }}
                />
                <circle cx="88" cy="10" r="2.5" fill="#FF20BE" className="animate-pulse" />

                {/* Circuit line 2 */}
                <motion.path
                  d="M 68,28 Q 90,32 94,48"
                  fill="none"
                  stroke="#209CFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2, ease: "easeInOut" }}
                />
                <circle cx="94" cy="48" r="2.5" fill="#209CFF" className="animate-pulse" />

                {/* Circuit line 3 */}
                <motion.path
                  d="M 38,72 Q 20,74 12,65"
                  fill="none"
                  stroke="#782DFF"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 1.2, ease: "easeInOut" }}
                />
                <circle cx="12" cy="65" r="2.5" fill="#782DFF" className="animate-pulse" />

                {/* Stylized premium letter T brand geometry */}
                <path
                  d="M 30,25 C 30,25 45,20 65,22 C 72,23 75,28 72,32 C 68,36 55,38 45,42 C 41,44 38,48 38,55 L 38,72 C 38,79 42,82 48,80 C 56,77 64,68 64,68"
                  fill="none"
                  stroke="url(#hero-logo-grad)"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="drop-shadow-lg"
                />

                {/* Complementary decorative transparent loop C shape for open book connectivity */}
                <path
                  d="M 68,48 C 68,58 58,68 45,68 C 34,68 25,58 25,48 C 25,38 34,28 45,28"
                  fill="none"
                  stroke="url(#hero-logo-grad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="opacity-45 mix-blend-overlay"
                />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
