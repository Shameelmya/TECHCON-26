import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Clock } from 'lucide-react';

export default function Timeline() {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

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
              <h4 className="text-xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-blue uppercase tracking-widest mb-2">
                PREPARING SCHEDULE
              </h4>
              <p className="text-sm font-sans text-slate-400 leading-relaxed max-w-md">
                We are finalizing the detailed timeline for all exciting events and sessions. Check back soon for the complete itinerary!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </section>
  );
}
