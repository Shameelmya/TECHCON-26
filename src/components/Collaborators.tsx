import { motion } from 'motion/react';

export default function Collaborators() {
  const dummyLogos = Array.from({ length: 8 }).map((_, i) => `LOGO ${i + 1}`);

  return (
    <section className="py-12 border-y border-slate-800/30 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 mb-8 text-center">
        <span className="text-[10px] font-mono tracking-[0.25em] text-slate-400 uppercase font-bold">
          // OUR COLLABORATORS & PARTNERS
        </span>
      </div>

      {/* Infinite scrolling marquee */}
      <div className="relative flex overflow-x-hidden w-full group">
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-[marquee_30s_linear_infinite] whitespace-nowrap group-hover:[animation-play-state:paused]">
          {[...dummyLogos, ...dummyLogos, ...dummyLogos].map((logo, idx) => (
            <div
              key={idx}
              className="w-48 h-20 mx-6 bg-brand-black border border-slate-800 rounded-2xl flex items-center justify-center grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 shadow-sm"
            >
              <span className="font-orbitron font-bold text-slate-400 text-sm tracking-widest">{logo}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
