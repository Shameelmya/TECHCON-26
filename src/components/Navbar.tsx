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
        {/* Logo Assembly */}
        <button 
          onClick={() => handleItemClick('hero')}
          className="flex items-center gap-2 lg:gap-3 group select-none relative"
        >
          <img 
            src="/navbar-logo.png" 
            alt="TECHCON 26" 
            className="h-8 sm:h-10 w-auto object-contain relative z-10 transition-transform duration-300 group-hover:scale-105" 
          />
        </button>

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
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* Primary CTA */}
          <button
            onClick={onOpenRegister}
            className="px-4 md:px-5 py-1.5 md:py-2 text-[12px] md:text-[13px] font-sans font-bold bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-full hover:shadow-[0_4px_12px_rgba(120,45,255,0.25)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Register Now
          </button>

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors"
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
