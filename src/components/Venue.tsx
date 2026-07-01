/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  MapPin, Navigation, Train, Plane, Compass, 
  Map, Info, Users, Cpu, Code
} from 'lucide-react';

export default function Venue() {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=Cochin+University+of+Science+and+Technology,+Kochi,+Kerala,+India`;

  return (
    <section 
      id="venue" 
      className="py-20 sm:py-28 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background grids & radial glow blobs */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.02]" 
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '30px 30px'
        }}
      />
      
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-brand-pink/10 to-brand-purple/10 blur-[130px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Title with futuristic layout */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-pink/10 border border-brand-pink/20 rounded-full mb-4">
            <Map size={12} className="text-brand-pink animate-pulse" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-brand-pink uppercase font-bold">
              TRANSIT & DESTINATION
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-orbitron font-bold tracking-[0.06em] text-white mb-5 uppercase">
            The Venue: CUSAT, <span className="text-brand-pink font-extrabold font-orbitron">Kochi</span>
          </h2>
          
          <p className="text-xs sm:text-sm font-sans text-slate-400 leading-relaxed max-w-xl mx-auto">
            The assembly is hosted at Cochin University of Science and Technology, Kalamassery. CUSAT stands as Kerala's premier technological and academic campus.
          </p>
        </div>

        {/* Column layout: Transit Info Guide */}
        <div className="max-w-4xl mx-auto items-stretch">
          
          {/* Dark Transit Info Details Card */}
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="flex flex-col justify-between bg-brand-navy/50 backdrop-blur-md border border-slate-800/80 p-6 sm:p-8 rounded-[32px] shadow-[0_0_30px_rgba(255,32,142,0.15)] relative overflow-hidden"
          >

            <div className="relative z-10 space-y-6">
              <div>
                <span className="text-[10px] font-mono tracking-[0.2em] text-brand-pink uppercase font-bold block mb-2">// QUICK TRANSIT COMMANDS</span>
                <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-white uppercase tracking-wide">Transit & Location Nodes</h3>
                <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed mt-2">
                  CUSAT campus is centrally linked with excellent transit lines, allowing hassle-free arrivals from all major districts of Kerala.
                </p>
              </div>

              {/* Transit Details Bars */}
              <div className="space-y-4">
                {/* Metro Node */}
                <div className="flex items-start gap-4 p-4 bg-slate-950/45 rounded-2xl border border-slate-800/60 hover:border-slate-700/60 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-brand-purple/20 border border-brand-purple/30 flex items-center justify-center shrink-0 text-brand-purple">
                    <Train size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-mono font-bold text-brand-purple uppercase tracking-wider">Nearest Metro Station</h4>
                    <p className="text-sm font-orbitron font-bold text-slate-100 uppercase tracking-wide">CUSAT Metro Station <span className="text-slate-500 font-sans text-xs">(250m)</span></p>
                    <p className="text-xs text-slate-400 font-sans leading-normal">Direct access to campus entrance via shuttles.</p>
                  </div>
                </div>

                {/* Railway Node */}
                <div className="flex items-start gap-4 p-4 bg-slate-950/45 rounded-2xl border border-slate-800/60 hover:border-slate-700/60 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-brand-pink/20 border border-brand-pink/30 flex items-center justify-center shrink-0 text-brand-pink">
                    <Compass size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-mono font-bold text-brand-pink uppercase tracking-wider">Nearest Railway Station</h4>
                    <p className="text-sm font-orbitron font-bold text-slate-100 uppercase tracking-wide">Ernakulam Town ERN / Aluva AWY <span className="text-slate-500 font-sans text-xs">(9km - 11km)</span></p>
                    <p className="text-xs text-slate-400 font-sans leading-normal">Linked to Kochi Metro for direct transit.</p>
                  </div>
                </div>

                {/* Airport Node */}
                <div className="flex items-start gap-4 p-4 bg-slate-950/45 rounded-2xl border border-slate-800/60 hover:border-slate-700/60 transition-colors">
                  <div className="w-9 h-9 rounded-xl bg-brand-blue/20 border border-brand-blue/30 flex items-center justify-center shrink-0 text-brand-blue">
                    <Plane size={16} />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-mono font-bold text-brand-blue uppercase tracking-wider">Nearest Airport</h4>
                    <p className="text-sm font-orbitron font-bold text-slate-100 uppercase tracking-wide">Cochin International Airport COK <span className="text-slate-500 font-sans text-xs">(22km)</span></p>
                    <p className="text-xs text-slate-400 font-sans leading-normal">Direct shuttle and cab services available.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="border-t border-slate-900 pt-6 mt-8 flex flex-wrap items-center justify-between gap-4 relative z-10">
              <span className="text-[10px] font-mono text-slate-500 uppercase">Kochi, Kerala, India</span>
              <a
                href={directionsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-purple to-brand-pink text-white font-sans font-bold text-xs rounded-full transition-all duration-300 hover:shadow-[0_4px_16px_rgba(120,45,255,0.3)] hover:-translate-y-0.5"
              >
                <Navigation size={13} className="animate-pulse" />
                <span>GET DIRECTIONS</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
