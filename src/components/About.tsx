/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  Target, Eye, Sparkles, Network, BookOpen, Cpu, Layers, Award, Terminal, CheckCircle2 
} from 'lucide-react';

export default function About() {
  const pillars = [
    {
      icon: <Target className="text-brand-purple" size={20} />,
      title: 'Our Mission',
      desc: 'To establish an ecosystem that cultivates futuristic technical expertise, nurtures pathbreaking innovations, and drives collaboration across academic and industrial borders.',
    },
    {
      icon: <Eye className="text-brand-pink" size={20} />,
      title: 'Our Vision',
      desc: 'To position Kerala on the national map of advanced engineering and digital thought leadership, setting standards for open-source research and youth tech-empowerment.',
    },
    {
      icon: <Sparkles className="text-brand-blue" size={20} />,
      title: 'Youth & Students Tech Ecosystem',
      desc: 'Serving as the specialized wing of msf Kerala State Committee, providing an interactive sandbox for machine intelligence, engineering workshops, and digital creation.',
    },
    {
      icon: <Network className="text-indigo-500" size={20} />,
      title: 'Collaboration Network',
      desc: 'Connecting thousands of passionate students, developers, academic scholars, and veteran industry mentors to facilitate horizontal peer-to-peer knowledge transfers.',
    },
  ];

  return (
    <section 
      id="about" 
      className="py-20 sm:py-28 px-6 md:px-12 relative"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Title Section */}
        <div className="flex flex-col mb-20 max-w-2xl mx-auto text-center items-center justify-center">
          <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-brand-purple uppercase block mb-3.5">
            // ABOUT THE CONVENTION
          </span>
          <h2 className="text-3xl sm:text-4xl font-orbitron font-extrabold tracking-[0.05em] text-white uppercase leading-[1.05] mb-6">
            DEFINING THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-blue">FUTURE</span>
          </h2>
          <p className="text-sm font-sans text-slate-500 leading-relaxed max-w-md mx-auto">
            Organized by <span className="font-bold text-white font-sans">msf TechFed</span>, TECHCON '26 is the flagship technical assembly driving innovation and technological excellence in Kerala. Located at the historic CUSAT campus in Kochi, this conclave is where breakthrough ideas transform into real-world technological solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: 'easeOut' }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                className="relative h-full rounded-3xl p-[1px] overflow-hidden group shadow-[0_0_20px_rgba(120,45,255,0.1)] hover:shadow-[0_0_30px_rgba(255,32,142,0.2)] transition-shadow duration-500"
              >
                {/* Rotating Conic Gradient Border */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0_320deg,#782dff_360deg)] opacity-70 group-hover:bg-[conic-gradient(from_0deg,transparent_0_320deg,#ff208e_360deg)] z-0"
                />
                
                {/* Inner Card */}
                <div className="relative z-10 h-full p-6 bg-brand-navy/90 backdrop-blur-xl rounded-[23px]">
                  <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center border border-slate-700 mb-5 group-hover:scale-110 group-hover:border-brand-purple transition-all duration-300">
                    {pillar.icon}
                  </div>
                  <h3 className="text-base font-orbitron font-bold text-white uppercase tracking-wide mb-2 group-hover:text-brand-purple transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] font-sans text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Organizer Section: msf TechFed */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="bg-brand-black/50 border border-slate-800 hover:border-brand-blue/30 rounded-[32px] p-8 sm:p-12 lg:p-16 relative overflow-hidden group transition-all duration-500"
        >
          <div className="absolute right-0 bottom-0 opacity-[0.03] text-brand-blue group-hover:opacity-[0.08] pointer-events-none select-none transition-opacity duration-700">
            <svg viewBox="0 0 100 100" className="w-48 h-48">
              <path d="M 0,50 L 50,50 L 70,70 L 100,70" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="100" cy="70" r="10" fill="currentColor" />
            </svg>
          </div>

          <div className="max-w-4xl relative z-10">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block mb-3">
              THE PARENT ORGANIZER
            </span>
            <h3 className="text-2xl sm:text-3xl font-orbitron font-bold text-white tracking-[0.06em] uppercase mb-6 drop-shadow-md">
              About <span className="text-brand-purple bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-brand-blue">msf TechFed</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-sans text-slate-400 leading-relaxed">
              <div>
                <p className="mb-4">
                  <span className="font-bold text-white font-sans">msf TechFed</span> is an independent technological wing spearheading advanced digital learning, developer training, and student tech ecosystems.
                </p>
                <p>
                  As a vital division of msf Kerala State Committee, we create direct platforms where collegiate innovators, high school creators, and tech enthusiasts gain real-world industrial competencies.
                </p>
              </div>
              <div className="space-y-4">
                <motion.div 
                  whileHover={{ x: 5 }}
                  className="flex items-start gap-3 bg-brand-dark p-4 rounded-2xl border border-slate-800/60 shadow-sm"
                >
                  <CheckCircle2 className="text-brand-pink shrink-0 mt-0.5" size={16} />
                  <div>
                    <h5 className="text-xs font-orbitron font-bold text-white uppercase">Youth & Students Tech Ecosystem</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-normal">The specialised technology and student empowerment cell of msf Kerala State Committee.</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
