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
  onOpenRegister?: () => void;
  onExploreEvent?: () => void;
  onOpenSponsor?: () => void;
}

export default function Hero({ isRegOpen = true, onOpenRegister, onExploreEvent, onOpenSponsor }: HeroProps) {
  const [timeLeft, setTimeLeft] = useState({ days: 15, hours: 0, minutes: 0, seconds: 0 });
  const [gapAnim, setGapAnim] = useState(['0px', '8px', '0px']);

  useEffect(() => {
    const updateGap = () => {
      setGapAnim(window.innerWidth < 768 ? ['0px', '1px', '0px'] : ['0px', '8px', '0px']);
    };
    updateGap();
    window.addEventListener('resize', updateGap);
    return () => window.removeEventListener('resize', updateGap);
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
      className="relative min-h-screen flex items-center justify-center px-4 md:px-8 pt-24 md:pt-32 pb-10"
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

      {/* Background GIF */}
      <div 
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-full max-w-[1920px] h-[1100px] z-0 pointer-events-none opacity-50 mix-blend-screen blur-[4px]"
        style={{
          maskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 70%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 50%, transparent 70%)'
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
              initial={{ opacity: 0, y: -20, rotateY: 0 }}
              animate={{ opacity: 1, y: 0, rotateY: [-35, 35, -35] }}
              transition={{ 
                opacity: { duration: 1, delay: 0.2 },
                y: { duration: 1, delay: 0.2 },
                rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" }
              }}
              className="w-24 sm:w-32 md:w-40 lg:w-48 object-contain mb-8 sm:mb-12 lg:mb-16"
              style={{ transformPerspective: 1000 }}
            />
            <h1 className="text-[13vw] md:text-[7rem] lg:text-[9.5rem] whitespace-nowrap font-orbitron font-black tracking-tighter leading-none flex items-center justify-center drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">
              <motion.div 
                className="flex" 
                style={{ WebkitTextStroke: '2px rgba(255,255,255,0.8)' }}
                animate={{ gap: gapAnim }}
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
                animate={{ gap: gapAnim }}
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-10 flex justify-center"
          >
            <div className="relative inline-block text-center px-4">
              <p className="text-[14px] sm:text-[16px] md:text-[18px] text-slate-200 font-sans font-medium tracking-wide">
                Let's build the future together!
              </p>
              {/* Animated Line */}
              <motion.div 
                className="absolute -bottom-3 h-[2px] bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue rounded-full shadow-[0_0_12px_rgba(120,45,255,0.8)]"
                animate={{ 
                  width: ["0%", "100%", "0%"],
                  left: ["0%", "0%", "100%"]
                }}
                transition={{
                  duration: 2.5,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            </div>
          </motion.div>

          {/* Key Metadata Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 border-t border-slate-800/50 pt-8 mb-12 w-full max-w-3xl"
          >
            {/* Date block removed as requested */}

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

            {/* Coming Soon Pixel Animation in Metadata Row */}
            <div className="flex items-center gap-3 sm:gap-4 w-fit bg-brand-black/50 p-3 sm:p-4 rounded-2xl border border-slate-800/80 shadow-[0_0_30px_rgba(120,45,255,0.15)] relative overflow-hidden h-[88px]">
              {/* Animated pixel glitch background */}
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDUpIi8+CjxyZWN0IHg9IjQiIHk9IjQiIHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz4KPC9zdmc+')] opacity-50 animate-[pulse_2s_infinite]" />
              
              <div className="flex items-center gap-2 relative z-10">
                <motion.div 
                  className="w-2 h-2 sm:w-3 sm:h-3 bg-brand-pink"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "steps(2)" }}
                />
                <motion.div 
                  className="w-2 h-2 sm:w-3 sm:h-3 bg-brand-purple"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.3, ease: "steps(2)" }}
                />
                <motion.div 
                  className="w-2 h-2 sm:w-3 sm:h-3 bg-brand-blue"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.6, ease: "steps(2)" }}
                />
              </div>

              <div className="flex flex-col relative z-10 ml-1 text-left justify-center">
                <span className="font-orbitron text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue tracking-widest uppercase drop-shadow-sm leading-tight">
                  Coming Soon
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-slate-400 uppercase mt-0.5 whitespace-nowrap">
                  Next Tech Revolution
                </span>
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
                <h4 className="font-sans font-bold text-xl mb-1 drop-shadow-sm">Join the Revolution</h4>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <MagneticButton className="w-full sm:w-auto">
                  <motion.button
                    onClick={onOpenSponsor}
                    className="px-6 py-3.5 bg-brand-dark/90 backdrop-blur-sm text-brand-pink font-sans font-bold text-sm rounded-full w-full sm:w-auto shrink-0 shadow-lg border border-brand-pink/50 hover:shadow-pink-500/40 hover:text-white hover:border-brand-pink transition-all duration-300"
                  >
                    <span>BE A SPONSOR</span>
                  </motion.button>
                </MagneticButton>
                
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
        </div>

        {/* Interactive Video Showcase */}
        <div className="w-full max-w-[1200px] aspect-video sm:h-[400px] lg:h-[600px] flex items-center justify-center mt-8 lg:mt-16 relative">
          <HeroVideos />
        </div>
      </div>
    </section>
  );
}

const VIDEOS = ['/V1.mp4', '/V2.mp4', '/V3.mp4', '/V4.mp4'];

function HeroVideos() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Cross-fade videos every 6 seconds
    const videoInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % VIDEOS.length);
    }, 6000);
    return () => clearInterval(videoInterval);
  }, []);

  return (
    <div className="relative w-full h-full rounded-[32px] overflow-hidden bg-[#02040A] border border-slate-800/60 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex items-center justify-center">
      
      {/* Very Dark Radial Gradient Background inside the container to make Screen Blend Pop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0f172a] via-[#020617] to-black opacity-90 z-0" />
      
      {/* 
        We render all 4 videos simultaneously so they buffer and play silently.
        We just fade their opacity to swap them with zero loading delay!
      */}
      {VIDEOS.map((src, index) => (
        <video
          key={src}
          src={src}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-1000 ease-in-out pointer-events-none"
          style={{
            opacity: currentIndex === index ? 1 : 0,
            mixBlendMode: 'screen', // This instantly removes the black background!
          }}
        />
      ))}
      
      {/* Optional: subtle scanline overlay to make it look highly technical */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-[0.05]" 
        style={{
          backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.8) 50%)',
          backgroundSize: '100% 4px'
        }}
      />
    </div>
  );
}
