/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  Brain, ShieldCheck, Network, Cpu, Calendar, Clock, Sparkles, Compass, 
  MapPin, Award, User, Star, Gamepad2, ArrowUpRight
} from 'lucide-react';

export default function WhyAttend() {
  // Simple syllabus sectors (no detailed texts)
  const syllabusSectors = [
    {
      icon: <Brain className="text-brand-pink" size={20} />,
      label: "Artificial Intelligence",
      bg: "bg-brand-pink/5 border-brand-pink/10"
    },
    {
      icon: <Network className="text-brand-purple" size={20} />,
      label: "Decentralized Networks",
      bg: "bg-brand-purple/5 border-brand-purple/10"
    },
    {
      icon: <ShieldCheck className="text-brand-blue" size={20} />,
      label: "Cyber Security & Trust",
      bg: "bg-brand-blue/5 border-brand-blue/10"
    },
    {
      icon: <Cpu className="text-amber-500" size={20} />,
      label: "Embedded Systems & IoT",
      bg: "bg-amber-500/5 border-amber-500/10"
    }
  ];

  // Sessions details as requested
  const sessions = [
    {
      tag: "SESSION 1",
      title: "AI Summit",
      description: "Smart village assistant with AI minister",
      icon: <Brain size={18} className="text-brand-pink" />,
      color: "border-brand-pink/20 hover:border-brand-pink/40"
    },
    {
      tag: "SESSION 2",
      title: "Industry & Skill Workshop",
      description: "General discussion: World tech industry & growth + AI Camera workshop for students",
      icon: <Sparkles size={18} className="text-brand-purple" />,
      color: "border-brand-purple/20 hover:border-brand-purple/40"
    },
    {
      tag: "SESSION 3",
      title: "Career Accelerator",
      description: "LinkedIn Optimization & Professional placement drive preparation",
      icon: <Compass size={18} className="text-brand-blue" />,
      color: "border-brand-blue/20 hover:border-brand-blue/40"
    },
    {
      tag: "SESSION 4",
      title: "Innovation Hub",
      description: "Hackathon & specialized engineering workshop for college students",
      icon: <Cpu size={18} className="text-emerald-500" />,
      color: "border-emerald-500/20 hover:border-emerald-500/40"
    }
  ];

  return (
    <section 
      id="why-attend" 
      className="py-20 sm:py-28 bg-brand-dark border-t border-slate-900 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]" 
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Decorative gradient background glows */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-brand-purple/10 to-brand-pink/5 blur-[120px] -top-30 -left-20 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-brand-blue/5 to-brand-purple/10 blur-[140px] -bottom-30 -right-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Step 1: Simple Syllabus Sectors Section (Icons + Simple Captions) */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <span className="text-[10px] font-mono tracking-[0.25em] text-brand-purple font-bold uppercase">
              // COGNITIVE BREADTH
            </span>
            <h3 className="text-lg font-orbitron font-bold text-slate-400 mt-1 uppercase tracking-wider">
              Core Technical Sectors
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {syllabusSectors.map((sector, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className={`flex items-center gap-3.5 p-4 rounded-2xl border bg-slate-950/40 border-slate-800/80 hover:border-slate-700/80 transition-colors ${sector.bg}`}
              >
                <div className="w-10 h-10 rounded-xl bg-brand-navy border border-slate-800 flex items-center justify-center shrink-0">
                  {sector.icon}
                </div>
                <span className="text-sm font-orbitron font-bold text-slate-200 tracking-wide">
                  {sector.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-slate-900 my-16" />

        {/* Step 2: The Main Sessions Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded-full mb-4">
            <Star size={11} className="text-brand-purple animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-brand-purple uppercase font-bold">
              THE CONVENTION SYLLABUS
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-orbitron font-bold tracking-[0.06em] text-white mb-4 uppercase">
            Sessions & Events
          </h2>
          
          <p className="text-xs sm:text-sm font-sans text-slate-400 leading-relaxed max-w-lg mx-auto">
            Review the official interactive syllabus structure. Four structured technical sessions augmented by highlight events.
          </p>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {sessions.map((session, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className={`p-6 bg-brand-navy/30 backdrop-blur-sm rounded-3xl border border-slate-800/80 hover:bg-brand-navy/60 transition-all duration-300 flex gap-4 ${session.color}`}
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-navy border border-slate-800 flex items-center justify-center shrink-0">
                {session.icon}
              </div>
              <div className="space-y-1.5">
                <span className="font-mono text-[10px] font-bold text-brand-purple tracking-widest block">
                  {session.tag}
                </span>
                <h3 className="text-base font-orbitron font-bold text-slate-100 uppercase tracking-wide">
                  {session.title}
                </h3>
                <p className="text-xs sm:text-[13px] font-sans text-slate-400 leading-relaxed">
                  {session.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Special Highlight Events & Extra */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Pro Night */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-6 bg-gradient-to-r from-brand-purple/10 to-brand-pink/5 rounded-3xl border border-brand-purple/20 flex items-center justify-between group hover:border-brand-pink/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 flex items-center justify-center text-brand-pink shrink-0">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div>
                <span className="font-mono text-[9px] font-bold text-brand-pink tracking-widest block">// HIGHLIGHT EVENT</span>
                <h4 className="text-sm font-orbitron font-bold text-white uppercase tracking-wide mt-0.5">PRO NIGHT</h4>
                <p className="text-[11px] font-sans text-slate-400">and closing ceremonies</p>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-slate-500 group-hover:text-white transition-colors" />
          </motion.div>

          {/* Exhibition & Fun Games */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-6 bg-gradient-to-r from-brand-blue/10 to-brand-purple/5 rounded-3xl border border-brand-blue/20 flex items-center justify-between group hover:border-brand-purple/30 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue shrink-0">
                <Gamepad2 size={20} />
              </div>
              <div>
                <span className="font-mono text-[9px] font-bold text-brand-blue tracking-widest block">// ADDITIONAL</span>
                <h4 className="text-sm font-orbitron font-bold text-white uppercase tracking-wide mt-0.5">EXHIBITION & FUN GAMES</h4>
                <p className="text-[11px] font-sans text-slate-400">interactive booths and tech challenges</p>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-slate-500 group-hover:text-white transition-colors" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
