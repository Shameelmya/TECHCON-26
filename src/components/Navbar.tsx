/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShieldAlert, Calendar } from 'lucide-react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAdmin: () => void;
  onOpenRegister: () => void;
}

export default function Navbar({ onNavigate, activeSection, onOpenAdmin, onOpenRegister }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'why-attend', label: 'Why Attend' },
    { id: 'timeline', label: 'Schedule' },
    { id: 'venue', label: 'Venue' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/70 backdrop-blur-md border-b border-slate-100 py-3 shadow-[0_2px_20px_rgba(0,0,0,0.02)]'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* TECHCON Brand Logo / Link */}
        <div 
          onClick={() => handleItemClick('hero')} 
          className="flex items-center gap-2.5 cursor-pointer hover-logo select-none group"
        >
          {/* Small Logo Icon */}
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full filter drop-shadow-sm group-hover:rotate-6 transition-transform duration-300">
              <defs>
                <linearGradient id="nav-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FF208E" />
                  <stop offset="50%" stopColor="#782DFF" />
                  <stop offset="100%" stopColor="#209CFF" />
                </linearGradient>
              </defs>
              <path
                d="M 30,25 C 30,25 45,20 65,22 C 72,23 75,28 72,32 C 68,36 55,38 45,42 C 41,44 38,48 38,55 L 38,72 C 38,79 42,82 48,80 C 56,77 64,68 64,68"
                fill="none"
                stroke="url(#nav-logo-grad)"
                strokeWidth="15"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-orbitron text-[13px] tracking-[0.15em] font-bold text-slate-950 uppercase leading-none">
              TECHCON<span className="text-brand-pink font-extrabold font-orbitron">'26</span>
            </span>
            <span className="text-[8px] font-mono tracking-[0.05em] text-slate-400 uppercase leading-none mt-1">
              by msf TechFed
            </span>
          </div>
        </div>

        {/* Desktop Menu Links */}
        <div className="hidden md:flex items-center gap-1.5 bg-slate-100/50 p-1 rounded-full border border-slate-200/40 backdrop-blur-sm">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`px-4 py-1.5 text-[13px] font-sans font-medium rounded-full transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-slate-950 shadow-[0_2px_8px_rgba(120,45,255,0.06)] border border-slate-100'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-white/30'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Console Link */}
          <button
            onClick={onOpenAdmin}
            className="px-4 py-2 text-[13px] font-mono tracking-wider font-semibold text-slate-500 hover:text-purple-600 transition-colors"
          >
            Console
          </button>
          
          {/* Primary CTA */}
          <button
            onClick={onOpenRegister}
            className="px-5 py-2 text-[13px] font-sans font-bold bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-full hover:shadow-[0_4px_12px_rgba(120,45,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Register Now
          </button>
        </div>

        {/* Mobile Hamburger toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-100 bg-white/95 backdrop-blur-md absolute top-full left-0 right-0 overflow-hidden shadow-lg"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-left py-2 px-4 rounded-xl text-[14px] font-sans font-medium transition-colors ${
                    activeSection === item.id
                      ? 'bg-purple-50 text-purple-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <hr className="border-slate-100 my-1" />
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2 text-center text-xs font-mono tracking-wider font-bold border border-slate-200 text-slate-600 hover:text-purple-600 rounded-xl"
              >
                Console
              </button>
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full py-3 text-center text-sm font-sans font-bold bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-xl shadow-md"
              >
                Register Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
