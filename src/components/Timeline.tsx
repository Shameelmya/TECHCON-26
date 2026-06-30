/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { TimelineEvent } from '../types';
import { Play, Coffee, FileCode, Users, Trophy, Milestone } from 'lucide-react';

const SCHEDULE_EVENTS: TimelineEvent[] = [
  {
    time: '08:30 AM - 09:30 AM',
    title: 'Registration & Smart Badging',
    subtitle: 'Morning Mixer & Coffee Lounge',
    description: 'Arrive at the registration desk at CUSAT, Kochi. Secure your custom holographic badge, run a scan at the digital gate, and enjoy fresh Kerala-blend coffee with early attendees.',
    type: 'break',
  },
  {
    time: '09:30 AM - 10:15 AM',
    title: 'Grand Keynote: Defining the Future',
    subtitle: 'Main Auditorium, CUSAT',
    description: 'An immersive digital presentation discussing the next decade of hyper-scale software systems, human-centered AI regulation, and Kerala’s booming youth tech ecosystem.',
    speaker: {
      name: 'msf TechFed Committee',
      role: 'Flagship Organizers',
    },
    type: 'keynote',
  },
  {
    time: '10:15 AM - 11:30 AM',
    title: 'Interactive Forum: The Neural Paradigm Shift',
    subtitle: 'Panel discussion on Ethical AI & edge deployment',
    description: 'We host lead researchers and software architects to argue the viability of small language models, edge-hardware accelerators, and code synthesis security rules.',
    speaker: {
      name: 'Aravind K. Nair & Industry Panellists',
      role: 'TCS & Vesta Robotics Lab',
    },
    type: 'panel',
  },
  {
    time: '11:30 AM - 12:45 PM',
    title: 'Concurrent Specialized Workshops',
    subtitle: 'Lab 1 & Lab 2 Workshops',
    description: 'Select your track: Track A (Hands-on Systems Programming in Rust and WASM compilers) or Track B (Autonomous drone flight path engineering using sensory arrays).',
    type: 'workshop',
  },
  {
    time: '12:45 PM - 02:00 PM',
    title: 'Networking Lunch & Innovations Expo',
    subtitle: 'Central Greens, CUSAT Kochi',
    description: 'Indulge in an exquisite vegetarian/non-vegetarian traditional Kerala feast. Explore physical tech booths, hardware robotics exhibitions, and research posters.',
    type: 'expo',
  },
  {
    time: '02:00 PM - 03:30 PM',
    title: 'Academic Research Paper & Pitch Battles',
    subtitle: 'Evaluating youth technological innovations',
    description: 'Select final-year thesis papers and young research scholars present their findings to peer judges. Followed by a high-stakes 3-minute startup pitch competition.',
    type: 'panel',
  },
  {
    time: '03:30 PM - 04:30 PM',
    title: 'Closing Address & Award Ceremonies',
    subtitle: 'Main Auditorium',
    description: 'Presentation of the Research Excellence Awards and Pitch Battle prize money. Complete check-in validation drawings, event checkout logs, and feedback surveys.',
    type: 'keynote',
  },
  {
    time: '04:30 PM - 05:30 PM',
    title: 'Evening Tech Mixer & Cultural Fest',
    subtitle: 'Amphitheater Grounds',
    description: 'Wind down the intense day of technology with live musical performances, networking snacks, and closing team photographs to cement TECHCON ’26 memories.',
    type: 'break',
  },
];

export default function Timeline() {
  const getIcon = (type: string) => {
    switch (type) {
      case 'keynote':
        return <Play className="text-purple-500 fill-purple-500/10" size={14} />;
      case 'panel':
        return <Users className="text-blue-500" size={14} />;
      case 'workshop':
        return <FileCode className="text-pink-500" size={14} />;
      case 'break':
        return <Coffee className="text-slate-500" size={14} />;
      case 'expo':
        return <Trophy className="text-amber-500" size={14} />;
      default:
        return <Milestone className="text-indigo-500" size={14} />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'keynote':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'panel':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'workshop':
        return 'bg-pink-50 text-pink-600 border-pink-100';
      case 'break':
        return 'bg-slate-50 text-slate-600 border-slate-100';
      case 'expo':
        return 'bg-amber-50 text-amber-600 border-amber-100';
      default:
        return 'bg-indigo-50 text-indigo-600 border-indigo-100';
    }
  };

  return (
    <section 
      id="timeline" 
      className="py-24 sm:py-32 bg-white px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background Soft Blobs */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-100/30 to-purple-100/20 blur-[110px] top-40 -right-48 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Header Text */}
        <div className="text-left max-w-xl mb-20">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-brand-purple uppercase block mb-3">
            // EXPERIENCE TIMELINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-orbitron font-bold tracking-[0.06em] text-slate-900 mb-5 uppercase">
            The Schedule
          </h2>
          <p className="text-sm font-sans text-slate-500 leading-relaxed">
            Mark your calendar. TECHCON '26 offers a packed single-day format containing state-of-the-art keynotes, hands-on development labs, and extensive peer-to-peer networking opportunities.
          </p>
        </div>

        {/* Vertical Timeline container */}
        <div className="relative pl-6 sm:pl-10">
          {/* Glowing Vertical line */}
          <div className="absolute left-1.5 sm:left-2.5 top-2 bottom-2 w-[1.5px] bg-gradient-to-b from-purple-500 via-pink-500 to-blue-500 opacity-20" />

          {/* Individual timeline events */}
          <div className="space-y-12 sm:space-y-16">
            {SCHEDULE_EVENTS.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="relative group"
              >
                {/* Timeline node circle */}
                <div className="absolute -left-[30px] sm:-left-[44px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-purple-500 flex items-center justify-center shadow-sm group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(120,45,255,0.4)] transition-all duration-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                </div>

                {/* Main Card */}
                <div className="bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md p-6 sm:p-8 rounded-[24px] transition-all duration-300 hover-card-glow relative overflow-hidden">
                  
                  {/* Subtle top indicator border for current track */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-purple-500/0 via-purple-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Top line metadata */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <span className="font-mono text-xs font-semibold tracking-wider text-slate-400 group-hover:text-purple-600 transition-colors">
                      {event.time}
                    </span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded-full text-[10px] font-mono uppercase font-semibold ${getBadgeColor(event.type)}`}>
                      {getIcon(event.type)}
                      <span>{event.type}</span>
                    </span>
                  </div>

                  {/* Main Title & Subtitle */}
                  <h3 className="text-base sm:text-lg font-orbitron font-bold text-slate-900 group-hover:text-slate-950 uppercase tracking-wide transition-colors mb-1.5">
                    {event.title}
                  </h3>
                  <h4 className="text-xs sm:text-[13px] font-sans font-medium text-slate-400 mb-4">
                    {event.subtitle}
                  </h4>

                  {/* Description Paragraph */}
                  <p className="text-xs sm:text-[13px] font-sans text-slate-500 leading-relaxed mb-5 max-w-2xl">
                    {event.description}
                  </p>

                  {/* Optional Speaker card */}
                  {event.speaker && (
                    <div className="flex items-center gap-3 border-t border-slate-100 pt-4 mt-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center font-bold text-[10px] text-white select-none shadow-sm">
                        {event.speaker.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-sans font-semibold text-slate-800 leading-none">
                          {event.speaker.name}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 uppercase mt-0.5">
                          {event.speaker.role}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
