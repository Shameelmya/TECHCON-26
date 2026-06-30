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
      desc: 'To position Kerala on the international map of advanced engineering and digital thought leadership, setting standards for open-source research and youth tech-empowerment.',
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
      className="py-20 sm:py-28 bg-white px-6 md:px-12 relative overflow-hidden"
    >
      {/* Subtle background light blob */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-slate-50 blur-[100px] top-1/3 -left-48 pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Editorial Title Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mb-20">
          <div className="lg:col-span-5">
            <span className="text-[11px] font-mono font-bold tracking-[0.25em] text-brand-purple uppercase block mb-3.5">
              // ABOUT THE CONVENTION
            </span>
            <h2 className="text-4xl sm:text-5xl font-orbitron font-bold tracking-[0.05em] text-slate-950 uppercase leading-[1.05] mb-6">
              Empowering the Next Generation.
            </h2>
            <p className="text-sm font-sans text-slate-500 leading-relaxed max-w-md">
              Organized by <span className="font-bold text-slate-900 font-sans">msf TechFed</span>, TECHCON '26 is the flag-bearer of next-generation technical assemblies in Kerala. Held at the historic CUSAT campus in Kochi, this physical conclave is where vision morphs into robust skill.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6 lg:pt-2">
            <p className="text-xl sm:text-2xl font-display font-light text-slate-700 leading-relaxed">
              TECHCON '26 is the premier platform bridging student innovators and cutting-edge digital growth, fostering a vibrant technological ecosystem.
            </p>
            <div className="border-l-[3px] border-brand-pink pl-6 my-6 text-slate-500 text-sm font-sans font-medium">
              Proudly presented as a signature youth initiative of msf Kerala State Committee.
            </div>
          </div>
        </div>

        {/* Pillars Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {pillars.map((pillar, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 bg-slate-50/60 hover:bg-white rounded-3xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-100 mb-5 group-hover:scale-105 transition-transform">
                {pillar.icon}
              </div>
              <h3 className="text-base font-orbitron font-bold text-slate-950 uppercase tracking-wide mb-2">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-[13px] font-sans text-slate-500 leading-relaxed">
                {pillar.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Organizer Section: msf TechFed */}
        <div className="bg-slate-50/50 border border-slate-100 rounded-[32px] p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-[0.03] text-slate-950 pointer-events-none select-none">
            <svg viewBox="0 0 100 100" className="w-48 h-48">
              <path d="M 0,50 L 50,50 L 70,70 L 100,70" fill="none" stroke="currentColor" strokeWidth="4" />
              <circle cx="100" cy="70" r="10" fill="currentColor" />
            </svg>
          </div>

          <div className="max-w-4xl relative z-10">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase block mb-3">
              THE PARENT ORGANIZER
            </span>
            <h3 className="text-2xl sm:text-3xl font-orbitron font-bold text-slate-950 tracking-[0.06em] uppercase mb-6">
              About <span className="text-brand-purple">msf TechFed</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm font-sans text-slate-500 leading-relaxed">
              <div>
                <p className="mb-4">
                  <span className="font-bold text-slate-950 font-sans">msf TechFed</span> is an independent technological wing spearheading advanced digital learning, developer training, and student tech ecosystems.
                </p>
                <p>
                  As a vital division of msf Kerala State Committee, we create direct platforms where collegiate innovators, high school creators, and tech enthusiasts gain real-world industrial competencies.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-100/60 shadow-sm">
                  <CheckCircle2 className="text-brand-pink shrink-0 mt-0.5" size={16} />
                  <div>
                    <h5 className="text-xs font-orbitron font-bold text-slate-900 uppercase">Youth & Students Tech Ecosystem</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-normal">The specialised technology and student empowerment cell of msf Kerala State Committee.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-slate-100/60 shadow-sm">
                  <Award className="text-brand-blue shrink-0 mt-0.5" size={16} />
                  <div>
                    <h5 className="text-xs font-orbitron font-bold text-slate-900 uppercase">msf Kerala State Committee</h5>
                    <p className="text-xs text-slate-500 mt-1 leading-normal">Fostering standard excellence in student leadership, professional mentorship, and scientific drive.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
