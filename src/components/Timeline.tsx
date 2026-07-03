import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';

const loadingTexts = ["loading...", "writing...", "thinking..."];

export default function Timeline() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isScheduleOpen) {
      const textInterval = setInterval(() => {
        setTextIndex(prev => (prev + 1) % loadingTexts.length);
      }, 2000);
      
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 80) { // user said 8 percentage or 80, capping at 80% as is standard for our "loading soon"
            clearInterval(progressInterval);
            return 80;
          }
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 100);

      return () => {
        clearInterval(textInterval);
        clearInterval(progressInterval);
      };
    } else {
      setProgress(0);
      setTextIndex(0);
    }
  }, [isScheduleOpen]);

  return (
    <section 
      id="timeline" 
      className="py-24 sm:py-32 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background Soft Blobs */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-100/30 to-purple-100/20 blur-[110px] top-40 -right-48 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center flex flex-col items-center">
        <span className="text-xs font-mono font-bold tracking-[0.25em] text-brand-purple uppercase block mb-3">
          // EXPERIENCE TIMELINE
        </span>
        
        <button 
          onClick={() => setIsScheduleOpen(!isScheduleOpen)}
          className="flex items-center gap-4 group cursor-pointer"
        >
          <h2 className="text-3xl sm:text-4xl font-orbitron font-bold tracking-[0.06em] text-white uppercase group-hover:text-brand-pink transition-colors">
            The Schedule
          </h2>
          <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-slate-800 group-hover:text-brand-pink transition-all shadow-md">
            {isScheduleOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>
      </div>

      <AnimatePresence>
        {isScheduleOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="max-w-3xl mx-auto relative z-10 overflow-hidden mt-12"
          >
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-8 sm:p-12 w-full shadow-lg relative overflow-hidden flex flex-col items-center text-center">
              <Clock size={40} className="text-slate-600 mb-6 animate-pulse" />
              
              <div className="h-10 relative overflow-hidden flex items-center justify-center mb-2 w-full">
                <AnimatePresence mode="wait">
                  <motion.h4
                    key={textIndex}
                    className="text-2xl sm:text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-blue uppercase tracking-widest absolute flex"
                  >
                    {loadingTexts[textIndex].split('').map((char, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1, delay: i * 0.1 }}
                      >
                        {char === ' ' ? '\u00A0' : char}
                      </motion.span>
                    ))}
                  </motion.h4>
                </AnimatePresence>
              </div>

              <p className="text-xs font-mono font-bold tracking-[0.25em] text-brand-purple uppercase mb-4">
                PREPARING SCHEDULE
              </p>
              
              <p className="text-sm text-slate-400 font-sans max-w-sm mx-auto mb-8">
                Check back soon for the complete itinerary!
              </p>

              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-brand-purple font-bold">
                  <span>SYSTEM PROGRESS</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-brand-purple via-brand-pink to-brand-blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "easeOut", duration: 0.2 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </section>
  );
}
