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
        const step = Math.max(1, Math.floor(Math.random() * remaining * 0.25) + 1);
        return Math.min(100, prev + step);
      });
    }, 20);

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
        <div className="relative w-48 h-32 mb-6 flex flex-col items-center justify-center select-none">
          {/* Pulsing Backlight */}
          <motion.div 
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-purple-500/20 via-pink-500/10 to-blue-500/20 blur-2xl"
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <img src="/loading-logo.png" alt="Loading..." className="w-full h-full object-contain filter drop-shadow-md relative z-10" />
        </div>

        {/* Text Details */}
        <div className="text-center select-none">
          <div className="mt-8 flex flex-col items-center">
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
            transition={{ delay: 0.4 }}
          >
            <p className="text-[10px] text-slate-400 font-sans tracking-wide uppercase">
              organized by <span className="text-slate-700 font-bold font-['Jura'] text-[11px] lowercase">msf techfed</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
