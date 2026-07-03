/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Instagram, Facebook, Twitter } from 'lucide-react';
import MagneticButton from './MagneticButton';

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
    { id: 'why-attend', label: 'Events' },
    { id: 'contact-us', label: 'Contact Us' },
    { id: 'about', label: 'About' },
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
          ? 'bg-brand-dark/70 backdrop-blur-md border-b border-slate-800 py-3 shadow-[0_2px_20px_rgba(0,0,0,0.02)]'
          : 'bg-transparent py-5 md:py-8'
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
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`relative px-1 py-1 text-[13px] font-sans font-medium transition-colors duration-300 group ${isActive ? 'text-white' : 'text-slate-400 hover:text-white'}`}
              >
                {item.label}
                <div 
                  className={`absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-brand-purple to-brand-pink transition-all duration-300 ease-out ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}
                />
              </button>
            );
          })}
        </div>

        {/* Action Buttons & Socials */}
        <div className="flex items-center gap-3 md:gap-5">
          
          <div className="hidden md:flex items-center gap-3 text-slate-400 mr-2 border-r border-slate-800 pr-5">
            <a href="#" className="hover:text-brand-pink transition-colors"><Instagram size={18} /></a>
            <a href="#" className="hover:text-brand-blue transition-colors"><Facebook size={18} /></a>
            <a href="#" className="hover:text-white transition-colors"><Twitter size={18} /></a>
          </div>
          
          {/* Primary CTA */}
          <MagneticButton onClick={onOpenRegister}>
            <div className="px-5 py-2 text-[13px] font-sans font-bold bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-full shadow-[0_0_15px_rgba(120,45,255,0.3)] border border-brand-pink/50">
              Register Now
            </div>
          </MagneticButton>

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full hover:bg-slate-100 text-slate-300 transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed top-[80px] left-4 right-4 bg-brand-navy/95 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden pointer-events-auto"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`text-left py-3 px-4 rounded-xl text-[15px] font-sans font-medium transition-all ${
                    activeSection === item.id
                      ? 'bg-brand-purple/20 text-brand-pink border border-brand-purple/30'
                      : 'text-slate-300 hover:text-white hover:bg-brand-black/50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              <hr className="border-slate-800/50 my-2" />
              
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegister();
                }}
                className="w-full py-3 mt-2 text-center text-[15px] font-sans font-bold bg-gradient-to-r from-brand-purple to-brand-pink text-white rounded-xl shadow-[0_0_15px_rgba(120,45,255,0.2)]"
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
