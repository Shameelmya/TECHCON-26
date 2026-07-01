/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, Compass, Shield } from 'lucide-react';
import { AttendeeRegistration } from './types';

// Component Imports
import CircuitBackground from './components/CircuitBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Collaborators from './components/Collaborators';
import WhyAttend from './components/WhyAttend';
import Timeline from './components/Timeline';
import Venue from './components/Venue';
import RegistrationForm from './components/RegistrationForm';
import TicketPass from './components/TicketPass';
import AdminDashboard from './components/AdminDashboard';
import RetrievePassForm from './components/RetrievePassForm';
import { getRegistrations, fetchAllRegistrations } from './utils/db';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.hash === '#register' || window.location.search.includes('register');
    }
    return false;
  });
  const [isRetrieveOpen, setIsRetrieveOpen] = useState(false);
  const [activeRegistration, setActiveRegistration] = useState<AttendeeRegistration | null>(null);

  const handleRegisterSuccess = (reg: AttendeeRegistration) => {
    setActiveRegistration(reg);
    setIsRegisterOpen(false);
  };

  const handleBackToHomeFromPass = () => {
    setActiveRegistration(null);
  };

  const handleGetPass = () => {
    setIsRegisterOpen(false);
    setIsRetrieveOpen(true);
  };
  
  const handleOpenRegister = () => {
    setIsRetrieveOpen(false);
    setIsRegisterOpen(true);
  };

  return (
    <>
        <div className="relative min-h-screen bg-brand-dark text-white overflow-x-hidden selection:bg-brand-purple selection:text-white">
          
          {/* Subtle canvas circuit backgrounds */}
          <CircuitBackground />

          {/* 2. Glassmorphic Sticky Navigation */}
          <Navbar 
            onNavigate={(id) => {
              const element = document.getElementById(id);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            activeSection="hero"
            onOpenRegister={() => setIsRegisterOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          {/* 3. Render Pass Card if passenger successfully registered */}
          {activeRegistration ? (
            <div className="pt-24 min-h-[90vh] flex items-center justify-center">
              <TicketPass 
                registration={activeRegistration} 
                onBackToHome={handleBackToHomeFromPass} 
              />
            </div>
          ) : (
            /* Main Interactive Website Landings */
            <main className="relative">
              
              {/* Hero fold */}
              <Hero 
                onOpenRegister={() => setIsRegisterOpen(true)} 
                onExploreEvent={() => {
                  const element = document.getElementById('about');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />

              {/* About text fold */}
              <About />

              {/* Collaborators logo marquee */}
              <Collaborators />

              {/* Grid cards fold */}
              <WhyAttend />

              {/* Dynamic Timeline Schedule fold */}
              <Timeline />

              {/* Geographic Venue Transit fold */}
              <Venue />

            </main>
          )}

          {/* 4. Registration Flow Sliding Modal Panel Overlay */}
          <AnimatePresence>
            {(isRegisterOpen || isRetrieveOpen) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 overflow-y-auto"
              >
                <motion.div 
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  className="w-full max-w-2xl my-auto py-8 sm:py-0"
                >
                  {isRegisterOpen ? (
                    <RegistrationForm 
                      onSuccess={handleRegisterSuccess}
                      onCancel={() => setIsRegisterOpen(false)}
                      onGetPass={handleGetPass}
                    />
                  ) : (
                    <RetrievePassForm
                      onSuccess={(reg) => {
                        setActiveRegistration(reg);
                        setIsRetrieveOpen(false);
                      }}
                      onCancel={() => setIsRetrieveOpen(false)}
                      onOpenRegister={handleOpenRegister}
                    />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. Secure Admin Dashboard Overlay */}
          <AnimatePresence>
            {isAdminOpen && (
              <motion.div 
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                className="fixed inset-0 z-50 overflow-y-auto bg-slate-900"
              >
                <AdminDashboard onClose={() => setIsAdminOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* 6. Professional Conference Footer Section */}
          <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-16 px-6 md:px-12 relative overflow-hidden select-none">
            {/* Ambient visual gradient footer node */}
            <div className="absolute w-96 h-96 rounded-full bg-purple-500/5 blur-[90px] -bottom-36 -left-36 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-12 gap-10">
              
              {/* Branding and Organizer notes */}
              <div className="md:col-span-5 space-y-4">
                <span className="font-sans font-bold text-white tracking-[0.2em] text-sm uppercase">
                  TECHCON '26
                </span>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  The flagship technological assembly defining tomorrow's computational infrastructure, neural networks, and interactive platforms. Organized independently by msf TechFed.
                </p>
                <div className="flex items-center gap-2 text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full w-fit">
                  <Award size={12} />
                  <span>CUSAT CAMPUS KOCHI, KERALA</span>
                </div>
              </div>

              {/* Nav Quicklinks */}
              <div className="md:col-span-3 space-y-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">NAVIGATION</h4>
                <div className="flex flex-col gap-2 text-xs">
                  <a href="#about" className="hover:text-white transition-colors">About Conference</a>
                  <a href="#whyattend" className="hover:text-white transition-colors">Core Experience</a>
                  <a href="#timeline" className="hover:text-white transition-colors">Program Schedule</a>
                  <a href="#venue" className="hover:text-white transition-colors">Location Transit</a>
                </div>
              </div>

              {/* Resource Links */}
              <div className="md:col-span-4 space-y-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">LEGAL & RESOURCES</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  For inquiries, press relations, and registration inquiries, contact the msf TechFed central organizing wing.
                </p>
                <div className="text-[10px] font-mono text-slate-500 mt-2 space-y-1">
                  <div>EMAIL: contact@msftechfed.org</div>
                  <div>OFFICIAL WEBSITE: www.techcon.org</div>
                </div>
              </div>

            </div>

            {/* Bottom Credits line */}
            <div className="max-w-7xl mx-auto relative z-10 border-t border-slate-900 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-slate-500">
              <div className="flex items-center gap-1">
                <span>© 2026 msf TechFed. All rights reserved.</span>
              </div>
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setIsAdminOpen(true)}
                  className="text-slate-700 hover:text-slate-500 opacity-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Shield size={10} />
                  <span>Admin Console</span>
                </button>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span>Created & Designed by</span>
                  <a href="https://instagram.com/dotprojectsofficial" target="_blank" rel="noopener noreferrer" className="text-brand-purple hover:text-brand-pink font-bold transition-colors">
                    Dot Projects
                  </a>
                </span>
              </div>
            </div>
          </footer>

        </div>
    </>
  );
}
