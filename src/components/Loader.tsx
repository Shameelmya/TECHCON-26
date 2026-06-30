/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            onComplete();
          }, 800); // short pause at 100% for transition
          return 100;
        }
        // Accelerate/decelerate realistically
        const remaining = 100 - prev;
        const step = Math.max(1, Math.floor(Math.random() * remaining * 0.15) + 1);
        return Math.min(100, prev + step);
      });
    }, 120);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div id="techcon-loader" className="fixed inset-0 bg-white z-[9999] flex flex-col items-center justify-center overflow-hidden">
      {/* Light Blobs behind the loader */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-purple-200/40 to-pink-200/40 blur-[100px] -top-20 -left-20 animate-pulse pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-blue-200/30 to-purple-200/40 blur-[120px] -bottom-40 -right-20 pointer-events-none" />

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]" 
        style={{
          backgroundImage: `radial-gradient(#1e293b 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative flex flex-col items-center max-w-md w-full px-6">
        {/* Animated Connecting Nodes */}
        <div className="absolute inset-0 pointer-events-none -translate-y-12">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-purple-500/40"
              initial={{ 
                x: (Math.random() - 0.5) * 300, 
                y: (Math.random() - 0.5) * 300,
                opacity: 0 
              }}
              animate={{ 
                x: 0, 
                y: 0,
                opacity: [0, 0.6, 0],
                scale: [1, 1.5, 0.2]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          ))}
        </div>

        {/* The TECHCON '26 Logo Assembly */}
        <div className="relative w-36 h-36 mb-8 flex items-center justify-center">
          {/* Pulsing Backlight */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-blue-500/20 blur-2xl"
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Styled Techcon Ribbon T Logo SVG */}
          <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-[0_8px_16px_rgba(120,45,255,0.15)]">
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FF20BE" />
                <stop offset="50%" stopColor="#782DFF" />
                <stop offset="100%" stopColor="#209CFF" />
              </linearGradient>
            </defs>

            {/* Circuit Traces around logo (slow draw) */}
            <motion.path
              d="M 20,40 L 10,40 L 10,60 M 30,20 L 30,5"
              fill="none"
              stroke="#782DFF"
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              className="opacity-40"
            />
            <motion.path
              d="M 75,30 L 90,30 L 90,15 M 70,18 L 85,18"
              fill="none"
              stroke="#FF208E"
              strokeWidth="1.2"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: progress / 100 }}
              className="opacity-40"
            />

            {/* Glowing end nodes for circuit lines */}
            {progress > 40 && (
              <>
                <motion.circle cx="10" cy="60" r="2" fill="#782DFF" initial={{ scale: 0 }} animate={{ scale: 1 }} />
                <motion.circle cx="90" cy="15" r="2" fill="#FF208E" initial={{ scale: 0 }} animate={{ scale: 1 }} />
              </>
            )}

            {/* Logo main ribbon - Letter 'T' futuristic structure */}
            {/* The vertical and horizontal sweeps */}
            <motion.path
              d="M 30,25 C 30,25 45,20 65,22 C 72,23 75,28 72,32 C 68,36 55,38 45,42 C 41,44 38,48 38,55 L 38,72 C 38,79 42,82 48,80 C 56,77 64,68 64,68"
              fill="none"
              stroke="url(#logo-grad)"
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 0.1 + (progress / 110), opacity: 1 }}
              transition={{ duration: 0.1 }}
            />
            
            {/* Elegant overlay ribbon representing the C shape (Open Book / Connectivity concept) */}
            <motion.path
              d="M 68,48 C 68,58 58,68 45,68 C 34,68 25,58 25,48 C 25,38 34,28 45,28"
              fill="none"
              stroke="url(#logo-grad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="4, 4"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: progress / 100, opacity: 0.6 }}
              className="mix-blend-overlay"
            />
          </svg>
        </div>

        {/* Text Details */}
        <div className="text-center select-none">
          <motion.h1 
            className="text-2xl font-orbitron tracking-[0.28em] font-bold text-slate-950 uppercase"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            TECHCON<span className="text-brand-pink font-bold font-orbitron">'26</span>
          </motion.h1>
          <motion.p 
            className="text-[10px] font-mono tracking-[0.4em] text-slate-400 uppercase mt-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            DEFINING THE FUTURE
          </motion.p>

          {/* Progress Percent Counter */}
          <div className="mt-8 flex flex-col items-center">
            <span className="font-mono text-xl font-medium text-slate-800 tabular-nums">
              {progress}%
            </span>
            
            {/* Custom high tech progress track */}
            <div className="w-48 h-[2px] bg-slate-100 rounded-full mt-3 overflow-hidden relative">
              <motion.div 
                className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-pink-500 via-purple-600 to-blue-500 rounded-full"
                style={{ width: `${progress}%` }}
                layoutId="loader-bar"
              />
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[length:12px_12px] animate-[shimmer_1s_linear_infinite]" />
            </div>
          </div>

          <motion.div 
            className="mt-14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-[11px] text-slate-400 font-sans tracking-wide">
              organized by <span className="text-slate-700 font-medium font-mono">msf TechFed</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
