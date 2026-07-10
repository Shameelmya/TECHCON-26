/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Award, Compass, Shield, X, Instagram, Facebook, Linkedin, User, UserPlus } from 'lucide-react';
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
import Sponsorship from './components/Sponsorship';
import ContactUs from './components/ContactUs';
import FAQ from './components/FAQ';

import VolunteerRegistrationForm from './components/VolunteerRegistrationForm';
import VolunteerIDCard from './components/VolunteerIDCard';
import RegistrationHubModal from './components/RegistrationHubModal';
import AddOnRegistrationModal from './components/AddOnRegistrationModal';
import { getSettings, getVolunteerSettings } from './utils/db';
import { VolunteerRegistration } from './types';

export default function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isRetrieveOpen, setIsRetrieveOpen] = useState(false);
  const [isSponsorOpen, setIsSponsorOpen] = useState(false);
  const [activeRegistration, setActiveRegistration] = useState<AttendeeRegistration | null>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [isRegistrationClosedPopupOpen, setIsRegistrationClosedPopupOpen] = useState(false);
  const [registrationIsOpen, setRegistrationIsOpen] = useState(true);
  
  // Volunteer states
  const [isVolunteerOpen, setIsVolunteerOpen] = useState(false);
  const [activeVolunteer, setActiveVolunteer] = useState<VolunteerRegistration | null>(null);
  const [isVolunteerRegOpen, setIsVolunteerRegOpen] = useState(false);
  const [isVolunteerClosedPopupOpen, setIsVolunteerClosedPopupOpen] = useState(false);
  const [isHubOpen, setIsHubOpen] = useState(false);

  // AddOn Event states
  const [addOnEventName, setAddOnEventName] = useState<string | null>(null);
  const [isAddOnSpecial, setIsAddOnSpecial] = useState(false);

  useEffect(() => {
    // Fetch settings on mount to check if registration is open
    getSettings().then(isOpen => setRegistrationIsOpen(isOpen));
    getVolunteerSettings().then(isOpen => setIsVolunteerRegOpen(isOpen));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = document.querySelectorAll('section, header');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleOpenRegister = async () => {
    setIsRetrieveOpen(false);
    
    // Always fetch latest status globally on click to prevent stale cache
    const isOpen = await getSettings();
    setRegistrationIsOpen(isOpen);
    
    if (!isOpen) {
      setIsRegistrationClosedPopupOpen(true);
    } else {
      setIsRegisterOpen(true);
    }
  };

  const handleOpenVolunteerRegistration = async () => {
    // Always fetch latest status globally on click to prevent stale cache
    const isOpen = await getVolunteerSettings();
    setIsVolunteerRegOpen(isOpen);
    
    if (!isOpen) {
      setIsVolunteerClosedPopupOpen(true);
    } else {
      setIsVolunteerOpen(true);
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#admin') setIsAdminOpen(true);
      else if (hash === '#sponsorship') setIsSponsorOpen(true);
      else if (hash === '#hub') setIsHubOpen(true);
      else if (hash === '#volunteer') {
        handleOpenVolunteerRegistration();
      }
      else if (hash === '#register') { setAddOnEventName(null); handleOpenRegister(); }
      else if (hash === '#retrieve') setIsRetrieveOpen(true);
      else if (hash === '#aisummit') { setAddOnEventName("Presentation and discussion on AI smart village"); setIsAddOnSpecial(false); }
      else if (hash === '#industry') { setAddOnEventName("Workshop on The imapct of technology on global industrials"); setIsAddOnSpecial(false); }
      else if (hash === '#careers') { setAddOnEventName("Workshop on Building tomorrow’s careers thriving the age of AI"); setIsAddOnSpecial(false); }
      else if (hash === '#cybershield') { setAddOnEventName("Workshop on Cybersecurity Shield a secure digital future"); setIsAddOnSpecial(false); }
      else if (hash === '#hackathon') { setAddOnEventName("Hackathon"); setIsAddOnSpecial(true); }
      else if (hash === '#projectcomp') { setAddOnEventName("Project Competition"); setIsAddOnSpecial(true); }
      else if (hash === '#ambassador') { setAddOnEventName("Campus Ambassadors."); setIsAddOnSpecial(true); }
      else if (hash === '#pronight') { setAddOnEventName("Pro Night"); setIsAddOnSpecial(true); }
      else if (hash === '#pass') {
        // If there's no active registration but we hit #pass, go home
        if (!activeRegistration) {
          window.location.hash = '';
        }
      }
      else if (hash === '' || hash === '#') {
        setIsAdminOpen(false);
        setIsSponsorOpen(false);
        setIsVolunteerOpen(false);
        setIsRegisterOpen(false);
        setIsRetrieveOpen(false);
        setIsRegistrationClosedPopupOpen(false);
        setIsVolunteerClosedPopupOpen(false);
        setIsHubOpen(false);
        setAddOnEventName(null);
        setActiveRegistration(null);
        setActiveVolunteer(null);
      }
    };

    const initialHash = window.location.hash.toLowerCase();
    if (initialHash === '#admin') setIsAdminOpen(true);
    else if (initialHash === '#sponsorship') setIsSponsorOpen(true);
    else if (initialHash === '#hub') setIsHubOpen(true);
    else if (initialHash === '#volunteer') {
      handleOpenVolunteerRegistration();
    }
    else if (initialHash === '#register') { setAddOnEventName(null); handleOpenRegister(); }
    else if (initialHash === '#retrieve') setIsRetrieveOpen(true);
    else if (initialHash === '#aisummit') { setAddOnEventName("Presentation and discussion on AI smart village."); setIsAddOnSpecial(false); }
    else if (initialHash === '#industry') { setAddOnEventName("Workshop on The imapct of technology on global industrials"); setIsAddOnSpecial(false); }
    else if (initialHash === '#careers') { setAddOnEventName("Workshop on Building tomorrow’s careers thriving the age of AI"); setIsAddOnSpecial(false); }
    else if (initialHash === '#cybershield') { setAddOnEventName("Workshop on Cybersecurity Shield a secure digital future"); setIsAddOnSpecial(false); }
    else if (initialHash === '#hackathon') { setAddOnEventName("Hackathon"); setIsAddOnSpecial(true); }
    else if (initialHash === '#projectcomp') { setAddOnEventName("Project Competition"); setIsAddOnSpecial(true); }
    else if (initialHash === '#ambassador') { setAddOnEventName("Campus Ambassadors."); setIsAddOnSpecial(true); }
    else if (initialHash === '#pronight') { setAddOnEventName("Pro Night"); setIsAddOnSpecial(true); }
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleRegisterSuccess = (reg: AttendeeRegistration) => {
    setActiveRegistration(reg);
    window.location.hash = 'pass';
  };

  const handleBackToHomeFromPass = () => {
    setActiveRegistration(null);
  };

  const handleGetPass = () => {
    window.location.hash = 'retrieve';
  };

  return (
    <>
        <div className="relative min-h-screen bg-brand-dark text-white overflow-x-hidden selection:bg-brand-purple selection:text-white">
          
          {/* Subtle canvas circuit backgrounds */}
          <CircuitBackground />
          


          {/* 2. Glassmorphic Sticky Navigation */}
          <Navbar 
            onNavigate={(id) => {
              setActiveRegistration(null);
              setIsRegisterOpen(false);
              setIsRetrieveOpen(false);
              setTimeout(() => {
                if (activeRegistration) {
                  window.location.hash = ''; // Clear #pass hash first to go home
                  // Wait a tiny bit for React to unmount the pass, then scroll
                  setTimeout(() => {
                    const element = document.getElementById(id);
                    if (element) element.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                } else {
                  const element = document.getElementById(id);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }, 50);
            }}
            activeSection={activeSection}
            onOpenHub={() => window.location.hash = 'hub'}
            onOpenAdmin={() => window.location.hash = 'admin'}
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
                onOpenRegister={() => window.location.hash = 'register'} 
                onOpenSponsor={() => window.location.hash = 'sponsorship'}
                onOpenVolunteer={() => window.location.hash = 'volunteer'}
                onGetPass={() => window.location.hash = 'retrieve'}
                onExploreEvent={() => {
                  const element = document.getElementById('why-attend');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              />

              {/* Events & Schedule */}
              <WhyAttend />
              <Timeline />

              {/* Contact Us & FAQ */}
              <ContactUs />
              <FAQ />

              {/* About fold */}
              <About />

              {/* Hidden/Future components */}
              {/* <Collaborators /> */}
              {/* <Venue /> */}

              {/* Footer */}
              <footer className="py-12 mt-10 border-t border-slate-800/50 text-center text-slate-500 text-sm font-sans relative z-10">
                <div className="flex justify-center gap-8 mb-6">
                  <a 
                    href="#privacy" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      alert("PRIVACY POLICY\n\nAt TECHCON 26, we take your privacy seriously. Your registration data (name, email, phone number, etc.) is securely stored and used exclusively for event management, ticketing, and check-in purposes.\n\nWe do not sell, rent, or share your personal information with any third-party advertisers or external organizations without your explicit consent.\n\nFor any privacy-related queries, please contact our support team."); 
                    }}
                    className="hover:text-brand-pink transition-colors font-medium tracking-wide uppercase text-xs"
                  >
                    Privacy Policy
                  </a>
                  <a 
                    href="#terms" 
                    onClick={(e) => { 
                      e.preventDefault(); 
                      alert("TERMS & CONDITIONS\n\nBy registering for TECHCON 26, you agree to abide by the event rules and guidelines. Entry is subject to verification of your ticket pass. The organizers reserve the right to admission."); 
                    }}
                    className="hover:text-brand-purple transition-colors font-medium tracking-wide uppercase text-xs"
                  >
                    Terms & Conditions
                  </a>
                </div>
                <p className="font-mono text-xs opacity-60">&copy; {new Date().getFullYear()} TECHCON 26 | msf TechFed. All rights reserved.</p>
              </footer>

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
                <button 
                  onClick={() => window.location.hash = ''}
                  className="fixed top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-[9999] shadow-lg border border-slate-700 backdrop-blur-md"
                >
                  <X size={20} />
                </button>
                <motion.div 
                  initial={{ scale: 0.95, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 15 }}
                  className="w-full max-w-2xl my-auto py-8 sm:py-0"
                >
                  {isRegisterOpen && (
                    <RegistrationForm 
                      onCancel={() => window.location.hash = ''}
                      onSuccess={handleRegisterSuccess}
                      onGetPass={handleGetPass}
                    />
                  )}
                  {isRetrieveOpen && (
                    <RetrievePassForm 
                      onCancel={() => window.location.hash = ''}
                      onSuccess={(reg) => {
                        setActiveRegistration(reg);
                        window.location.hash = 'pass';
                      }}
                      onOpenRegister={() => window.location.hash = 'register'}
                    />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Registration Closed Popup */}
          <AnimatePresence>
            {isRegistrationClosedPopupOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
              >
                <motion.div 
                  initial={{ scale: 0.8, y: 50, rotateX: 10 }}
                  animate={{ scale: 1, y: 0, rotateX: 0 }}
                  exit={{ scale: 0.8, y: 50, rotateX: -10 }}
                  transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                  className="w-full max-w-md bg-slate-900/90 border border-slate-700 p-8 sm:p-10 rounded-[32px] shadow-[0_0_50px_rgba(120,45,255,0.15)] relative text-center overflow-hidden"
                >
                  {/* Decorative background glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-purple/20 rounded-full blur-[60px] pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-pink/20 rounded-full blur-[50px] pointer-events-none" />
                  
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-brand-purple/20 rounded-full animate-ping opacity-75" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-purple to-brand-blue rounded-full opacity-20 blur-md" />
                    <Compass size={36} className="text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl sm:text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4 tracking-wide"
                  >
                    Hold On!
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-400 font-sans text-sm sm:text-base leading-relaxed mb-8"
                  >
                    We love your energy! Our registration gates are briefly paused as we prepare for the next wave of innovators. 
                    <br/><br/>
                    <span className="text-white font-medium">Please check back very soon!</span>
                    <br/><br/>
                    <span className="text-brand-pink font-bold tracking-wide">Registration will be opened soon..</span>
                  </motion.p>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => window.location.hash = ''}
                    className="w-full py-4 relative group overflow-hidden rounded-xl font-orbitron font-bold uppercase tracking-widest text-xs transition-all"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-purple to-brand-blue opacity-90 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] bg-[position:-100%_0,0_0] bg-no-repeat group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span className="relative z-10 text-white drop-shadow-md">Okay, Got It</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}

            {/* VOLUNTEER REGISTRATION CLOSED POPUP */}
            {isVolunteerClosedPopupOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
              >
                <motion.div 
                  initial={{ scale: 0.8, y: 50, rotateX: 10 }}
                  animate={{ scale: 1, y: 0, rotateX: 0 }}
                  exit={{ scale: 0.8, y: 50, rotateX: -10 }}
                  transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                  className="w-full max-w-md bg-slate-900/90 border border-slate-700 p-8 sm:p-10 rounded-[32px] shadow-[0_0_50px_rgba(255,100,200,0.15)] relative text-center overflow-hidden"
                >
                  {/* Decorative background glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-pink/20 rounded-full blur-[60px] pointer-events-none" />
                  <div className="absolute bottom-0 right-0 w-48 h-48 bg-brand-purple/20 rounded-full blur-[50px] pointer-events-none" />
                  
                  <motion.div 
                    animate={{ 
                      y: [0, -10, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-brand-pink/20 rounded-full animate-ping opacity-75" style={{ animationDuration: '3s' }} />
                    <div className="absolute inset-0 bg-gradient-to-tr from-brand-pink to-brand-purple rounded-full opacity-20 blur-md" />
                    <UserPlus size={36} className="text-white relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  </motion.div>
                  
                  <motion.h3 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl sm:text-3xl font-orbitron font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4 tracking-wide"
                  >
                    Volunteers Full
                  </motion.h3>
                  
                  <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-400 text-sm leading-relaxed mb-8 font-sans"
                  >
                    Thank you for your interest! We have reached our capacity for volunteers right now. Stay tuned for future opportunities to join the team!
                  </motion.p>
                  
                  <button 
                    onClick={() => {
                      setIsVolunteerClosedPopupOpen(false);
                      window.location.hash = '';
                    }}
                    className="w-full relative group overflow-hidden rounded-2xl p-[1px]"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-brand-pink to-brand-purple opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative bg-slate-900 px-6 py-3 rounded-2xl flex items-center justify-center gap-2 group-hover:bg-slate-800/80 transition-colors">
                      <span className="font-bold text-slate-200 text-sm tracking-wide">Back to Home</span>
                    </div>
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 5. Sponsorship Modal Overlay */}
          <AnimatePresence>
            {isSponsorOpen && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-md flex items-start justify-center p-4 sm:p-6 overflow-y-auto"
              >
                <button 
                  onClick={() => setIsSponsorOpen(false)}
                  className="fixed top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-slate-900/90 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors z-[9999] shadow-lg border border-slate-700 backdrop-blur-md"
                >
                  <X size={20} />
                </button>
                <motion.div 
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="w-full max-w-[95vw] xl:max-w-7xl my-auto py-8 sm:py-0"
                >
                  <Sponsorship onClose={() => window.location.hash = ''} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Volunteer Registration & ID Card */}
          <VolunteerRegistrationForm 
            isOpen={isVolunteerOpen && !activeVolunteer} 
            onClose={() => window.location.hash = ''} 
            onSuccess={(vol) => setActiveVolunteer(vol)} 
          />
          {activeVolunteer && (
            <VolunteerIDCard 
              volunteer={activeVolunteer} 
              onClose={() => { setActiveVolunteer(null); window.location.hash = ''; }} 
            />
          )}

          {/* 7. Registration Hub Modal */}
          {isHubOpen && (
            <RegistrationHubModal
              onClose={() => window.location.hash = ''}
              onSelectEvent={() => {
                setIsHubOpen(false);
                window.location.hash = 'register';
              }}
              onSelectVolunteer={() => {
                setIsHubOpen(false);
                window.location.hash = 'volunteer';
              }}
            />
          )}

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
                <button 
                  onClick={() => setIsAdminOpen(false)}
                  className="fixed top-4 right-4 sm:top-6 sm:right-6 p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-[9999] shadow-lg border border-slate-700"
                >
                  <X size={20} />
                </button>
                <AdminDashboard onClose={() => window.location.hash = ''} />
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
                  <span>ERNAKULAM, KERALA</span>
                </div>
              </div>

              {/* Nav Quicklinks */}
              <div className="md:col-span-3 space-y-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">NAVIGATION</h4>
                <div className="flex flex-col gap-2 text-xs">
                  <a href="#about" onClick={(e) => { e.preventDefault(); const fn = () => { const el = document.getElementById('about'); if(el) el.scrollIntoView({behavior: 'smooth'}); }; if (activeRegistration) { window.location.hash = ''; setTimeout(fn, 100); } else fn(); }} className="hover:text-white transition-colors">About</a>
                  <a href="#why-attend" onClick={(e) => { e.preventDefault(); const fn = () => { const el = document.getElementById('why-attend'); if(el) el.scrollIntoView({behavior: 'smooth'}); }; if (activeRegistration) { window.location.hash = ''; setTimeout(fn, 100); } else fn(); }} className="hover:text-white transition-colors">Events</a>
                  <a href="#timeline" onClick={(e) => { e.preventDefault(); const fn = () => { const el = document.getElementById('timeline'); if(el) el.scrollIntoView({behavior: 'smooth'}); }; if (activeRegistration) { window.location.hash = ''; setTimeout(fn, 100); } else fn(); }} className="hover:text-white transition-colors">The Schedule</a>
                  <a href="#contact-us" onClick={(e) => { e.preventDefault(); const fn = () => { const el = document.getElementById('contact-us'); if(el) el.scrollIntoView({behavior: 'smooth'}); }; if (activeRegistration) { window.location.hash = ''; setTimeout(fn, 100); } else fn(); }} className="hover:text-white transition-colors">Contact Us</a>
                </div>
              </div>

              {/* Resource Links */}
              <div className="md:col-span-4 space-y-3">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-widest">LEGAL & RESOURCES</h4>
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  For inquiries, press relations, and registration inquiries, contact the msf TechFed central organizing wing.
                </p>
                <div className="text-[10px] font-mono text-slate-500 mt-2 space-y-1">
                  <div>EMAIL: <span className="font-mono lowercase text-brand-blue">team@techcon26.org</span></div>
                  <div>OFFICIAL WEBSITE: www.techcon26.org</div>
                </div>
                
                {/* Social Media */}
                <div className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-800/50">
                  <a href="#" className="text-slate-500 hover:text-brand-pink transition-colors">
                    <Instagram size={18} />
                  </a>
                  <a href="#" className="text-slate-500 hover:text-brand-blue transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href="#" className="text-slate-500 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                    </svg>
                  </a>
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
                  onClick={() => window.location.hash = 'admin'}
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
      
      {/* Add-On Registration Modal */}
      <AnimatePresence>
        {addOnEventName && (
          <AddOnRegistrationModal 
            eventName={addOnEventName} 
            isSpecialProgram={isAddOnSpecial} 
            onClose={() => window.location.hash = ''} 
          />
        )}
      </AnimatePresence>
    </>
  );
}
