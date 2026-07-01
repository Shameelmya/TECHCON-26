import { motion } from 'motion/react';
import { 
  Brain, ShieldCheck, Network, Cpu, Compass, 
  Sparkles, Award, Star, Gamepad2, ArrowUpRight, Cloud, Atom, Blocks
} from 'lucide-react';

export default function WhyAttend() {
  const sessions = [
    {
      tag: "SESSION 1",
      title: "AI Summit",
      description: "Smart village assistant with AI minister. Dive deep into the future of governance and AI integration.",
      icon: <Brain size={24} className="text-white" />,
      gradient: "from-brand-pink to-rose-500",
      shadow: "shadow-brand-pink/20",
    },
    {
      tag: "SESSION 2",
      title: "Industry & Skill Workshop",
      description: "General discussion: World tech industry & growth + AI Camera workshop for students to build real-world vision models.",
      icon: <Sparkles size={24} className="text-white" />,
      gradient: "from-brand-purple to-indigo-600",
      shadow: "shadow-brand-purple/20",
    },
    {
      tag: "SESSION 3",
      title: "Career Accelerator",
      description: "LinkedIn Optimization & Professional placement drive preparation with top-tier HR industry veterans.",
      icon: <Compass size={24} className="text-white" />,
      gradient: "from-brand-blue to-cyan-500",
      shadow: "shadow-brand-blue/20",
    },
    {
      tag: "SESSION 4",
      title: "Innovation Hub",
      description: "Hackathon & specialized engineering workshop for college students. Build hardware and software prototypes in hours.",
      icon: <Cpu size={24} className="text-white" />,
      gradient: "from-emerald-500 to-teal-400",
      shadow: "shadow-emerald-500/20",
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
      className="py-20 sm:py-28 px-6 md:px-12 relative overflow-hidden"
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]" 
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
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
          
          <h2 className="text-3xl sm:text-4xl font-orbitron font-bold tracking-[0.06em] text-white mb-4 uppercase">
            Sessions & Events
          </h2>
          <p className="text-xs sm:text-sm font-sans text-slate-400 leading-relaxed max-w-lg mx-auto">
            Experience our highly interactive technical sessions. Four beautifully crafted knowledge tracks augmented by highlight events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {sessions.map((session, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <motion.div
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
                  <span className="font-mono text-[10px] font-bold text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full border border-slate-700">
                    {session.tag}
                  </span>
                </div>
                <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-wide mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all duration-300">
                  {session.title}
                </h3>
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
            className="p-6 bg-gradient-to-r from-brand-purple/20 to-brand-pink/10 rounded-3xl border border-brand-purple/30 flex items-center justify-between group hover:border-brand-pink/50 transition-all cursor-pointer shadow-[0_0_20px_rgba(120,45,255,0.1)] hover:shadow-[0_0_30px_rgba(120,45,255,0.2)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/30 flex items-center justify-center text-brand-pink shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles size={24} className="animate-pulse" />
              </div>
              <div>
                <span className="font-mono text-[9px] font-bold text-brand-pink tracking-widest block">// HIGHLIGHT EVENT</span>
                <h4 className="text-base font-orbitron font-bold text-white uppercase tracking-wide mt-0.5">PRO NIGHT</h4>
                <p className="text-xs font-sans text-slate-300">and closing ceremonies</p>
              </div>
            </div>
            <ArrowUpRight size={24} className="text-brand-pink group-hover:text-white transition-colors" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-6 bg-gradient-to-r from-brand-blue/20 to-brand-purple/10 rounded-3xl border border-brand-blue/30 flex items-center justify-between group hover:border-brand-purple/50 transition-all cursor-pointer shadow-[0_0_20px_rgba(32,156,255,0.1)] hover:shadow-[0_0_30px_rgba(32,156,255,0.2)]"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-brand-blue/30 flex items-center justify-center text-brand-blue shrink-0 group-hover:scale-110 transition-transform">
                <Gamepad2 size={24} />
              </div>
              <div>
                <span className="font-mono text-[9px] font-bold text-brand-blue tracking-widest block">// ADDITIONAL</span>
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
              className={`flex flex-col items-center justify-center text-center gap-4 p-6 rounded-[2rem] border bg-slate-900/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer group ${sector.bg}`}
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

      </div>
    </section>
  );
}
