/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Calendar, BellRing } from 'lucide-react';

export default function CalendarCard() {
  const handleAddToCalendar = () => {
    const title = encodeURIComponent("TECHCON '26 - Defining the Future");
    const dates = "20260715T030000Z/20260715T123000Z"; // 08:30 AM to 06:00 PM IST (represented in UTC format)
    const details = encodeURIComponent("TECHCON '26 organized by msf TechFed. India's premium technology conference featuring deep-dive technical tracks, hands-on development sandbox labs, youth tech innovation pitch battles, and executive networking mixers.");
    const location = encodeURIComponent("Cochin University of Science and Technology (CUSAT), Kalamassery, Kochi, Kerala, India");
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}&sf=true&output=xml`;
    
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div id="add-to-calendar" className="max-w-4xl mx-auto px-6 mb-20 relative select-none">
      {/* Container glass box */}
      <div className="bg-slate-950 text-white rounded-[32px] p-8 sm:p-12 relative border border-purple-500/10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
        {/* Soft background reflections */}
        <div className="absolute w-56 h-56 rounded-full bg-purple-500/10 blur-[60px] -top-10 -left-10 pointer-events-none" />
        <div className="absolute w-64 h-64 rounded-full bg-pink-500/15 blur-[70px] -bottom-20 -right-20 pointer-events-none" />

        <div className="space-y-3.5 relative z-10 text-center md:text-left">
          <div className="flex items-center gap-2 text-brand-pink font-mono text-[10px] tracking-widest uppercase justify-center md:justify-start">
            <BellRing size={13} className="animate-pulse" />
            <span>SAVE THE DATE</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-orbitron font-bold text-white tracking-[0.05em] uppercase leading-tight">
            Lock the Assembly
          </h3>
          <p className="text-xs sm:text-[13px] font-sans text-slate-400 max-w-md leading-relaxed">
            Synchronize your schedule and reserve July 15, 2026. Avoid gate congestion by mapping the official timeline into your primary Google Calendar instantly.
          </p>
        </div>

        {/* Add Button */}
        <motion.button
          onClick={handleAddToCalendar}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="relative z-10 px-8 py-4 bg-gradient-to-r from-brand-purple via-brand-purple to-brand-pink hover:opacity-90 text-white font-sans font-bold text-xs tracking-wider rounded-full flex items-center gap-3 shadow-[0_4px_20px_rgba(120,45,255,0.25)] cursor-pointer"
        >
          <Calendar size={15} />
          <span>ADD TO CALENDAR</span>
        </motion.button>
      </div>
    </div>
  );
}
