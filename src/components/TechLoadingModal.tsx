import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Cpu, Hexagon, Terminal } from 'lucide-react';

interface TechLoadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function TechLoadingModal({ isOpen, onClose, title = "System Initializing" }: TechLoadingModalProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) {
      setProgress(0);
      return;
    }
    
    // Simulate complex tech loading
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 80) {
          clearInterval(interval);
          return 80;
        }
        return prev + Math.floor(Math.random() * 15);
      });
    }, 300);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8 bg-brand-dark/90 backdrop-blur-md font-sans"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors border border-slate-700 hover:border-brand-pink z-50"
        >
          <X size={24} />
        </button>

        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="w-full max-w-2xl bg-brand-black/90 border border-slate-800/80 rounded-3xl p-8 relative overflow-hidden shadow-[0_0_80px_rgba(120,45,255,0.15)]"
        >
          {/* Animated Background Grids */}
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-8 py-10">
            
            {/* Hexagon Spinner */}
            <div className="relative w-32 h-32 flex items-center justify-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border border-dashed border-brand-purple/50"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-brand-pink/30"
              />
              <div className="relative z-10 text-brand-blue animate-pulse">
                <Hexagon size={48} strokeWidth={1.5} />
                <Cpu size={20} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-blue uppercase tracking-widest">
                LOADING...
              </h2>
              <p className="text-slate-400 text-sm font-mono tracking-widest">
                ESTABLISHING SECURE CONNECTION...
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-md space-y-2">
              <div className="flex justify-between text-[10px] font-mono text-brand-purple font-bold">
                <span>SYSTEM CORE</span>
                <span>{Math.min(progress, 80)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <motion.div 
                  className="h-full bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 80)}%` }}
                  transition={{ ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Terminal Lines */}
            <div className="w-full bg-slate-950/80 rounded-xl p-4 border border-slate-800 text-left space-y-2 h-32 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-slate-950/90 pointer-events-none" />
              <div className="flex items-center gap-2 text-brand-blue/70 text-xs font-mono">
                <Terminal size={14} /> <span>Running diagnostic protocol...</span>
              </div>
              {progress > 20 && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-brand-purple/70 text-xs font-mono pl-6">
                  &gt; Decrypting payload... SUCCESS
                </motion.div>
              )}
              {progress > 50 && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-brand-pink/70 text-xs font-mono pl-6">
                  &gt; Fetching neural net assets... SUCCESS
                </motion.div>
              )}
              {progress >= 80 && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: [0, 1, 0], x: 0 }} 
                  transition={{ opacity: { repeat: Infinity, duration: 1, ease: "easeInOut" } }}
                  className="text-emerald-400 text-xs font-mono pl-6 font-bold mt-4"
                >
                  &gt; MODULE DEPLOYMENT PENDING. CHECK BACK SOON.
                </motion.div>
              )}
            </div>

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
