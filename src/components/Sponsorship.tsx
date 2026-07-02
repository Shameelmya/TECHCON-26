import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, Briefcase, Handshake, Users, Sparkles, Megaphone, Send } from 'lucide-react';

interface SponsorshipProps {
  onClose: () => void;
}

export default function Sponsorship({ onClose }: SponsorshipProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    plan: 'Title Sponsor'
  });

  const handleSend = () => {
    const text = `Hi Techcon, we are interested in the ${formData.plan} sponsorship plan. Our company is ${formData.companyName}. Contact person: ${formData.contactPerson}, Email: ${formData.email}. Please get back to us.`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/917902993844?text=${encoded}`, '_blank');
    setIsPopupOpen(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-brand-dark border border-slate-800 rounded-[32px] shadow-2xl relative overflow-hidden font-sans">
      
      {/* Background glowing effects */}
      <div className="absolute w-64 h-64 rounded-full bg-brand-purple/10 blur-[80px] -top-20 -right-20 pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-brand-pink/5 blur-[100px] bottom-10 -left-20 pointer-events-none" />
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-brand-dark/80 backdrop-blur-xl border-b border-slate-800 px-6 sm:px-10 py-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-brand-pink uppercase font-bold">SPONSORSHIP BROCHURE</span>
          <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-white mt-1">TECHCON '26</h2>
        </div>
        <button 
          onClick={onClose}
          className="p-2 bg-slate-900 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Brochure Content */}
      <div className="p-6 sm:p-10 max-h-[75vh] overflow-y-auto space-y-16">
        
        {/* Cover / Page 2 */}
        <section className="text-center max-w-3xl mx-auto space-y-6 pt-4">
          <h1 className="text-3xl sm:text-5xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue uppercase tracking-tight">
            The Future Starts Here.
          </h1>
          <p className="text-slate-400 leading-relaxed font-light text-sm sm:text-base">
            Technology has become the driving force behind every industry, every business, and every society. The organizations shaping tomorrow are those investing in innovation today.
          </p>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base font-medium">
            When you partner with TECHCON, you don't simply support an event.<br/>
            <span className="text-white font-bold block mt-2">You become part of Kerala's technology revolution.</span>
          </p>
        </section>

        {/* Why Partner */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-900/50 p-8 sm:p-10 rounded-3xl border border-slate-800/50">
          <div>
            <h3 className="text-2xl font-orbitron font-bold text-white mb-4">Invest in Innovation.</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Partner with the People Building Tomorrow. Every participant at TECHCON represents an opportunity: An engineer. A future entrepreneur. A startup founder. A researcher. A future leader.
            </p>
            <ul className="space-y-3">
              {[
                "Increase brand visibility",
                "Recruit future talent",
                "Launch innovative products",
                "Generate quality business leads",
                "Position your company as a technology leader"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 size={16} className="text-brand-purple" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-brand-black p-6 rounded-2xl border border-slate-800 flex flex-col justify-center text-center">
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-blue to-brand-purple mb-2">10,000+</span>
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Participants</span>
            
            <div className="w-full h-px bg-slate-800 my-6" />
            
            <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-brand-pink to-brand-purple mb-2">200+</span>
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Colleges & Institutions</span>
            
            <div className="w-full h-px bg-slate-800 my-6" />
            
            <span className="text-4xl font-black text-white mb-2">50+</span>
            <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Startups & Companies</span>
          </div>
        </section>

        {/* Sponsorship Packages */}
        <section className="space-y-8">
          <div className="text-center">
            <h3 className="text-2xl sm:text-3xl font-orbitron font-bold text-white mb-2">Sponsorship Opportunities</h3>
            <p className="text-slate-400 text-sm">Choose the perfect tier to amplify your brand's presence.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Title Sponsor */}
            <div className="bg-gradient-to-b from-brand-purple/10 to-transparent border border-brand-purple/30 p-6 rounded-2xl flex flex-col">
              <span className="text-[10px] font-mono font-bold text-brand-purple tracking-widest uppercase mb-1">1 Exclusive Slot</span>
              <h4 className="text-xl font-bold text-white mb-2">Title Sponsor</h4>
              <span className="text-2xl font-black text-brand-purple mb-6">₹2,50,000</span>
              <ul className="space-y-3 flex-1">
                <li className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5" />"TECHCON '26 Powered By"</li>
                <li className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5" />10-Min Speaking Slot</li>
                <li className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5" />Premium Stall (6m×3m)</li>
                <li className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-brand-purple mt-1.5" />Delegate Kit & ID Branding</li>
              </ul>
            </div>

            {/* Platinum Sponsor */}
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl flex flex-col">
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase mb-1">2 Slots</span>
              <h4 className="text-xl font-bold text-white mb-2">Platinum</h4>
              <span className="text-2xl font-black text-white mb-6">₹1,00,000</span>
              <ul className="space-y-3 flex-1">
                <li className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5" />Premium Logo Placement</li>
                <li className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5" />Keynote Speaking</li>
                <li className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5" />Premium Exhibition Stall</li>
              </ul>
            </div>

            {/* Gold Sponsor */}
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl flex flex-col">
              <span className="text-[10px] font-mono font-bold text-amber-500 tracking-widest uppercase mb-1">5 Slots</span>
              <h4 className="text-xl font-bold text-white mb-2">Gold</h4>
              <span className="text-2xl font-black text-amber-500 mb-6">₹50,000</span>
              <ul className="space-y-3 flex-1">
                <li className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5" />Logo Placement</li>
                <li className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5" />Exhibition Stall</li>
                <li className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5" />Event Branding</li>
              </ul>
            </div>

            {/* Silver Sponsor */}
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl flex flex-col">
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase mb-1">10 Slots</span>
              <h4 className="text-xl font-bold text-white mb-2">Silver</h4>
              <span className="text-2xl font-black text-slate-300 mb-6">₹25,000</span>
              <ul className="space-y-3 flex-1">
                <li className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5" />Event & Website Branding</li>
                <li className="text-xs text-slate-300 flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-1.5" />Shared Exhibition Counter</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Additional Partnerships */}
        <section>
          <h3 className="text-xl font-orbitron font-bold text-white mb-6 border-b border-slate-800 pb-2">Partnership Options</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <h5 className="font-bold text-sm text-white mb-1">Knowledge Partner</h5>
              <span className="text-brand-purple font-mono font-bold text-xs">₹75,000</span>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <h5 className="font-bold text-sm text-white mb-1">Recruitment Partner</h5>
              <span className="text-brand-pink font-mono font-bold text-xs">₹75,000</span>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <h5 className="font-bold text-sm text-white mb-1">Innovation Partner</h5>
              <span className="text-brand-blue font-mono font-bold text-xs">₹50,000</span>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
              <h5 className="font-bold text-sm text-white mb-1">Delegate Kit Sponsor</h5>
              <span className="text-slate-300 font-mono font-bold text-xs">₹35,000</span>
            </div>
          </div>
        </section>

      </div>

      {/* Footer sticky action */}
      <div className="bg-slate-950 p-6 border-t border-slate-800 flex justify-center sticky bottom-0 z-40">
        <button 
          onClick={() => setIsPopupOpen(true)}
          className="px-10 py-4 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue rounded-full text-white font-bold uppercase tracking-wider shadow-[0_0_30px_rgba(120,45,255,0.4)] hover:shadow-[0_0_40px_rgba(255,32,142,0.6)] transition-all transform hover:scale-105"
        >
          Become a Sponsor
        </button>
      </div>

      {/* Pop-up form for Sponsor Now */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 bg-brand-dark/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <h3 className="font-orbitron font-bold text-white tracking-wider">Sponsorship Inquiry</h3>
                <button onClick={() => setIsPopupOpen(false)} className="text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Company Name *</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full bg-brand-black border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-purple outline-none transition-colors"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Contact Person *</label>
                  <input 
                    type="text" 
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full bg-brand-black border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-purple outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Phone *</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-brand-black border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-purple outline-none transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-slate-400 uppercase">Email *</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-brand-black border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-purple outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase">Interested Plan *</label>
                  <select 
                    value={formData.plan}
                    onChange={(e) => setFormData({...formData, plan: e.target.value})}
                    className="w-full bg-brand-black border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-purple outline-none transition-colors appearance-none"
                  >
                    <option>Title Sponsor - ₹2.5L</option>
                    <option>Platinum Sponsor - ₹1L</option>
                    <option>Gold Sponsor - ₹50K</option>
                    <option>Silver Sponsor - ₹25K</option>
                    <option>Knowledge Partner - ₹75K</option>
                    <option>Recruitment Partner - ₹75K</option>
                    <option>Innovation Partner - ₹50K</option>
                    <option>Other / Custom Plan</option>
                  </select>
                </div>

                <button 
                  onClick={handleSend}
                  disabled={!formData.companyName || !formData.contactPerson}
                  className="w-full mt-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                >
                  <Send size={16} />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
