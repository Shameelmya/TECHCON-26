import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Brain, ShieldCheck, Network, Cpu, Compass, 
  Sparkles, Award, Star, Gamepad2, ArrowUpRight, Cloud, Atom, Blocks, Terminal
} from 'lucide-react';
import TechLoadingModal from './TechLoadingModal';

export default function WhyAttend() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const handleOpenModal = (title: string) => {
    let hash = '';
    if (title === 'AI Summit') hash = 'aisummit';
    else if (title === 'Industry & Skill') hash = 'industry';
    else if (title === 'Career Accelerator') hash = 'careers';
    else if (title === 'Innovation Hub') hash = 'projectcomp';
    else if (title === 'Hackathon') hash = 'hackathon';
    else if (title === 'Campus Ambassador') hash = 'ambassador';
    else if (title === 'Cyber Shield') hash = 'cybershield';
    window.location.hash = hash;
  };

  const sessions = [
    {
      title: "Campus Ambassador",
      description: "Represent your college. Organize promotional events, execute marketing campaigns, and lead outreach efforts to gain hands-on experience and rewards.",
      icon: <Network size={24} className="text-white" />,
      gradient: "from-brand-purple to-indigo-600",
      shadow: "shadow-brand-purple/20",
    },
    {
      title: "Hackathon",
      description: "Competitive coding and problem-solving event. Build innovative solutions and prototypes under pressure.",
      icon: <Terminal size={24} className="text-white" />,
      gradient: "from-emerald-400 to-cyan-500",
      shadow: "shadow-emerald-400/20",
    },
    {
      title: "AI Summit",
      description: "Smart village assistant with AI minister. Dive deep into the future of governance and AI integration.",
      icon: <Brain size={24} className="text-white" />,
      gradient: "from-brand-pink to-rose-500",
      shadow: "shadow-brand-pink/20",
    },
    {
      title: "Industry & Skill",
      description: "General discussion: World tech industry & growth + AI Camera workshop for students to build real-world vision models.",
      icon: <Sparkles size={24} className="text-white" />,
      gradient: "from-brand-blue to-cyan-500",
      shadow: "shadow-brand-blue/20",
    },
    {
      title: "Career Accelerator",
      description: "LinkedIn Optimization & Professional placement drive preparation with top-tier HR industry veterans.",
      icon: <Compass size={24} className="text-white" />,
      gradient: "from-amber-500 to-orange-400",
      shadow: "shadow-amber-500/20",
    },
    {
      title: "Innovation Hub",
      description: "Specialized engineering workshop for college students. Build hardware and software prototypes in hours.",
      icon: <Cpu size={24} className="text-white" />,
      gradient: "from-emerald-500 to-teal-400",
      shadow: "shadow-emerald-500/20",
    },
    {
      title: "Cyber Shield",
      description: "Protect your business with Cyber Shield. Advanced cybersecurity solutions to safeguard your data, defend against threats, and build a secure digital future.",
      icon: <ShieldCheck size={24} className="text-white" />,
      gradient: "from-rose-500 to-pink-500",
      shadow: "shadow-rose-500/20",
    }
  ];

  const syllabusSectors = [
    { icon: <Brain className="text-brand-pink" size={24} />, label: "Artificial Intelligence", bg: "bg-brand-pink/10 border-brand-pink/20" },
    { icon: <Network className="text-brand-purple" size={24} />, label: "Decentralized Networks", bg: "bg-brand-purple/10 border-brand-purple/20" },
    { icon: <ShieldCheck className="text-brand-blue" size={24} />, label: "Cyber Security & Trust", bg: "bg-brand-blue/10 border-brand-blue/20" },
    { icon: <Cpu className="text-amber-500" size={24} />, label: "Embedded Systems & IoT", bg: "bg-amber-500/10 border-amber-500/20" },
    { icon: <Cloud className="text-cyan-500" size={24} />, label: "Cloud Architecture", bg: "bg-cyan-500/10 border-cyan-500/20" },
    { icon: <Atom className="text-rose-500" size={24} />, label: "Quantum Computing", bg: "bg-rose-500/10 border-rose-500/20" },
    { icon: <Blocks className="text-emerald-500" size={24} />, label: "Web 3.0 & Blockchain", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { icon: <Award className="text-indigo-400" size={24} />, label: "Robotics & Automation", bg: "bg-indigo-400/10 border-indigo-400/20" },
  ];

  return (
    <section 
      id="why-attend" 
      className="py-20 sm:py-28 px-6 md:px-12 relative"
    >

      <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-brand-purple/10 to-brand-pink/5 blur-[120px] -top-30 -left-20 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-br from-brand-blue/5 to-brand-purple/10 blur-[140px] -bottom-30 -right-20 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* Step 1: Sessions & Events (Moved to top) */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-purple/10 border border-brand-purple/20 rounded-full mb-4">
            <Star size={11} className="text-brand-purple animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-brand-purple uppercase font-bold">
              THE CONVENTION SYLLABUS
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl font-orbitron font-bold tracking-[0.06em] text-white mb-8 uppercase">
            Events
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sessions.map((session, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
            >
              <motion.div
                onClick={() => handleOpenModal(session.title)}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.2 }}
                className={`h-full relative p-8 rounded-3xl overflow-hidden group cursor-pointer border border-slate-800/50 shadow-2xl ${session.shadow}`}
              >
                <div className="absolute inset-0 bg-brand-navy/50 backdrop-blur-md z-0" />
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${session.gradient} z-10`} />
                <motion.div 
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className={`absolute -right-12 -top-12 w-40 h-40 rounded-full bg-gradient-to-br ${session.gradient} blur-[50px]`} 
                />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${session.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    {session.icon}
                  </div>
                </div>
                <div className="mb-4 inline-flex flex-col relative w-max">
                  <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-wide group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all duration-300">
                    {session.title}
                  </h3>
                  {/* Maximum animated underline */}
                  <div className="relative w-full h-[1px] mt-1 bg-white/10 overflow-hidden rounded-full">
                    <motion.div 
                      className={`absolute top-0 left-0 h-full w-[60%] bg-gradient-to-r from-transparent ${session.gradient} to-transparent`}
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
                    />
                  </div>
                </div>
                <p className="text-sm font-sans text-slate-400 leading-relaxed">
                  {session.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
          ))}
        </div>

        {/* Special Highlight Events & Extra */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={() => handleOpenModal("Pro Night")}
            className="p-6 bg-gradient-to-r from-brand-purple/20 to-brand-pink/10 rounded-3xl border border-brand-purple/30 flex items-center justify-between group hover:border-brand-pink/50 transition-all cursor-pointer shadow-[0_0_20px_rgba(120,45,255,0.1)] hover:shadow-[0_0_30px_rgba(120,45,255,0.2)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/30 flex items-center justify-center text-brand-pink shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles size={24} className="animate-pulse" />
              </div>
              <div>
                <span className="font-mono text-[9px] font-bold text-brand-pink tracking-widest block">// HIGHLIGHT EVENT</span>
                <h4 className="text-base font-orbitron font-bold text-white uppercase tracking-wide mt-0.5">PRO NIGHT</h4>
                <p className="text-xs font-sans text-slate-300">Musical night and cultural programes.</p>
              </div>
            </div>
            <ArrowUpRight size={24} className="text-brand-pink group-hover:text-white transition-colors" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            onClick={() => handleOpenModal("Exhibition & Games")}
            className="p-6 bg-gradient-to-r from-brand-blue/20 to-brand-purple/10 rounded-3xl border border-brand-blue/30 flex items-center justify-between group hover:border-brand-purple/50 transition-all cursor-pointer shadow-[0_0_20px_rgba(32,156,255,0.1)] hover:shadow-[0_0_30px_rgba(32,156,255,0.2)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-blue/30 flex items-center justify-center text-brand-blue shrink-0 group-hover:scale-110 transition-transform">
                <Gamepad2 size={24} />
              </div>
              <div>
                <span className="font-mono text-[9px] font-bold text-brand-blue tracking-widest block">// INTERACTIVE</span>
                <h4 className="text-base font-orbitron font-bold text-white uppercase tracking-wide mt-0.5">EXHIBITION & GAMES</h4>
                <p className="text-xs font-sans text-slate-300">interactive booths and challenges</p>
              </div>
            </div>
            <ArrowUpRight size={24} className="text-brand-blue group-hover:text-white transition-colors" />
          </motion.div>
        </div>

        {/* Divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-20" />

        {/* Step 2: Core Technical Sectors (Moved to bottom) */}
        <div className="text-center mb-12">
          <span className="text-[10px] font-mono tracking-[0.25em] text-brand-blue font-bold uppercase">
            // COGNITIVE BREADTH
          </span>
          <h3 className="text-2xl font-orbitron font-bold text-white mt-2 uppercase tracking-wider">
            Core Technical Sectors
          </h3>
          <p className="text-sm font-sans text-slate-400 mt-3 max-w-md mx-auto">
            Explore diverse technological domains curated to bridge the gap between academic theory and industry implementation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {syllabusSectors.map((sector, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className={`flex flex-col items-center justify-center text-center gap-4 p-6 rounded-[2rem] border bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group ${sector.bg}`}
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-navy border border-slate-700 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-inner">
                {sector.icon}
              </div>
              <span className="text-sm font-orbitron font-bold text-slate-200 tracking-wide group-hover:text-white transition-colors">
                {sector.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Collaborators Section */}
        <div className="mt-32 text-center mb-12">
          <span className="text-[10px] font-mono tracking-[0.25em] text-brand-purple font-bold uppercase">
            // IN PARTNERSHIP WITH
          </span>
          <h3 className="text-2xl sm:text-3xl font-orbitron font-bold text-white mt-2 uppercase tracking-wider">
            Our Collaborators
          </h3>
        </div>

        <div className="relative w-full max-w-[100vw] overflow-hidden pb-12 group">

          <div className="flex w-max animate-[marquee_30s_linear_infinite] group-hover:[animation-play-state:paused]">
            {[1, 2, 3].map((groupIdx) => (
              <div key={groupIdx} className="flex gap-6 md:gap-10 px-3 md:px-5 shrink-0">
                {["/S1.jpg", "/S2.jpg", null, null, null, null].map((src, idx) => (
                  <div
                    key={`${groupIdx}-${idx}`}
                    className={`relative p-[1px] rounded-3xl overflow-hidden group/card transition-shadow duration-500 flex items-center justify-center shrink-0 ${src ? 'shadow-[0_0_15px_rgba(217,70,239,0.1)] hover:shadow-[0_0_25px_rgba(217,70,239,0.25)]' : 'shadow-[0_0_15px_rgba(56,189,248,0.1)] hover:shadow-[0_0_25px_rgba(56,189,248,0.25)] cursor-pointer'}`}
                  >
                    {/* Rotating illuminated border (thinner now due to p-[1px] on parent) */}
                    <div className={`absolute inset-[-100%] animate-[spin_4s_linear_infinite] ${src ? 'bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#d946ef_100%)]' : 'bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#38bdf8_100%)]'}`} />
                    
                    {src ? (
                      <div className="relative bg-[#020617] rounded-[23px] overflow-hidden w-[200px] h-[100px] sm:w-[260px] sm:h-[130px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover/card:translate-x-[150%] transition-transform duration-1000 z-10 pointer-events-none" />
                        <img 
                          src={src} 
                          alt={`Collaborator ${idx + 1}`} 
                          className="w-full h-full object-cover rounded-[23px] group-hover/card:scale-105 transition-transform duration-500" 
                        />
                      </div>
                    ) : (
                      <div 
                        className="relative bg-slate-900 rounded-[23px] overflow-hidden w-[200px] h-[100px] sm:w-[260px] sm:h-[130px] flex flex-col items-center justify-center group-hover/card:bg-slate-800 transition-colors duration-500"
                        onClick={() => window.location.href = 'mailto:team@techcon26.org?subject=Sponsorship%20Inquiry'}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-blue/10 to-transparent -translate-x-[150%] group-hover/card:translate-x-[150%] transition-transform duration-1000 z-10 pointer-events-none" />
                        <span className="text-brand-blue font-orbitron font-bold text-sm sm:text-base tracking-wider group-hover/card:scale-110 transition-transform duration-500">
                          BE A SPONSOR
                        </span>
                        <span className="text-slate-400 font-mono text-[9px] sm:text-[10px] mt-2 uppercase tracking-[0.2em] group-hover/card:text-white transition-colors duration-500">
                          Place Your Brand Here
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
