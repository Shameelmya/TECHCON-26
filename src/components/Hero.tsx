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
      className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-8 pt-24 md:pt-32 pb-0"
    >
      {/* Blurred Soft Light Blobs for Depth */}
      <div className="absolute w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-brand-purple/20 to-brand-pink/20 blur-[120px] -top-20 left-1/4 pointer-events-none animate-[pulse_8s_infinite]" />
      <div className="absolute w-[550px] h-[550px] rounded-full bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 blur-[130px] bottom-10 right-10 pointer-events-none" />



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
                Let's build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue font-bold">future</span> together!
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



          {/* Minimal Action banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="w-full max-w-2xl mb-6 relative"
          >
            <div className="w-full rounded-[32px] p-6 sm:p-8 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue bg-[length:200%_auto] animate-[gradient_6s_ease-in-out_infinite] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-[0_8px_32px_rgba(120,45,255,0.4)]">
              
              <div className="text-center sm:text-left text-white">
                <h4 className="font-jura font-bold text-xl mb-1 drop-shadow-sm uppercase">Join the Revolution</h4>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={onOpenSponsor}
                  className="px-6 py-3.5 bg-brand-dark/90 backdrop-blur-sm text-brand-pink font-sans font-bold text-sm rounded-full w-full sm:w-auto shrink-0 border border-brand-pink/50 hover:bg-brand-pink hover:text-white transition-colors duration-300"
                >
                  BE A SPONSOR
                </button>
                
                <button
                  onClick={onOpenRegister}
                  disabled={!isRegOpen}
                  className={`px-8 py-3.5 bg-brand-dark/90 backdrop-blur-sm text-slate-200 font-sans font-bold text-sm rounded-full w-full sm:w-auto shrink-0 border border-slate-700/50 ${
                    isRegOpen 
                      ? 'hover:bg-brand-purple hover:text-white hover:border-brand-purple transition-colors duration-300' 
                      : 'opacity-80 cursor-not-allowed bg-slate-800'
                  }`}
                >
                  {isRegOpen ? "REGISTER NOW" : "REGISTRATION CLOSED"}
                </button>
              </div>
            </div>
          </motion.div>


        </div>
      </div>

      {/* Interactive Video Showcase - Isolated so screen blend mode works against the background */}
      <div className="relative z-20 w-full max-w-[450px] sm:max-w-[600px] lg:max-w-[800px] aspect-video flex items-center justify-center mt-2 lg:mt-4 -mb-8 lg:-mb-16 mix-blend-screen pointer-events-none">
        <HeroVideos />
      </div>
    </section>
  );
}

const VIDEOS = ['/V1.mp4', '/V2.mp4', '/V3.mp4', '/V4.mp4'];

function HeroVideos() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [clipInset, setClipInset] = useState('inset(0 115px)');

  useEffect(() => {
    // Cross-fade videos every 6 seconds
    const videoInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % VIDEOS.length);
    }, 6000);
    return () => clearInterval(videoInterval);
  }, []);

  useEffect(() => {
    const updateClip = () => {
      setClipInset(window.innerWidth < 768 ? 'inset(0 30px)' : 'inset(0 115px)');
    };
    updateClip();
    window.addEventListener('resize', updateClip);
    return () => window.removeEventListener('resize', updateClip);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
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
          className="absolute inset-0 w-full h-full object-contain z-10 transition-opacity duration-1000 ease-in-out pointer-events-none"
          style={{
            opacity: currentIndex === index ? 1 : 0,
            filter: 'contrast(1.4) brightness(1.15) saturate(1.2)',
            clipPath: clipInset
          }}
        />
      ))}
    </div>
  );
}
