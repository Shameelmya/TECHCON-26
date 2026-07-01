import { motion } from 'motion/react';
import { Calendar, Clock, Sparkles } from 'lucide-react';

export default function Timeline() {
  return (
    <section 
      id="timeline" 
      className="py-24 sm:py-32 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background Soft Blobs */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-100/30 to-purple-100/20 blur-[110px] top-40 -right-48 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center">
        {/* Header Text */}
        <div className="mb-12">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-brand-purple uppercase block mb-3">
            // EXPERIENCE TIMELINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-orbitron font-bold tracking-[0.06em] text-white mb-5 uppercase">
            The Schedule
          </h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative inline-block"
        >
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative bg-brand-navy/50 backdrop-blur-md border border-slate-800/50 shadow-[0_0_30px_rgba(120,45,255,0.15)] rounded-3xl p-10 sm:p-16 flex flex-col items-center justify-center max-w-2xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl pointer-events-none" />
            <div className="w-16 h-16 rounded-full bg-brand-dark/80 flex items-center justify-center mb-6 border border-brand-purple/30 shadow-[0_0_15px_rgba(120,45,255,0.2)] relative z-10">
              <Clock className="text-brand-purple animate-pulse" size={32} />
            </div>
            <h3 className="text-2xl font-orbitron font-bold text-white mb-3 relative z-10">
              Schedule Will Be Uploaded Soon
            </h3>
            <p className="text-sm font-sans text-slate-400 relative z-10">
              We are finalizing the events and speakers for TECHCON '26. The full program schedule will be available here shortly.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
