import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface SponsorMessageWindowProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlan: string;
}

const PLANS = [
  { id: 'Title Sponsor - ₹2.5L', label: 'Title', price: '₹2.5L', color: 'bg-brand-purple text-white' },
  { id: 'Platinum Sponsor - ₹1L', label: 'Platinum', price: '₹1L', color: 'bg-slate-900 text-white' },
  { id: 'Gold Sponsor - ₹50K', label: 'Gold', price: '₹50K', color: 'bg-amber-500 text-white' },
  { id: 'Silver Sponsor - ₹25K', label: 'Silver', price: '₹25K', color: 'bg-slate-500 text-white' },
  { id: 'Knowledge Partner - ₹75K', label: 'Knowledge', price: '₹75K', color: 'bg-slate-100 text-slate-900 border-2 border-brand-purple' },
  { id: 'Recruitment Partner - ₹75K', label: 'Recruitment', price: '₹75K', color: 'bg-slate-100 text-slate-900 border-2 border-brand-pink' },
  { id: 'Innovation Partner - ₹50K', label: 'Innovation', price: '₹50K', color: 'bg-slate-100 text-slate-900 border-2 border-brand-blue' },
  { id: 'Delegate Kit Sponsor - ₹35K', label: 'Kit', price: '₹35K', color: 'bg-slate-100 text-slate-900 border-2 border-emerald-500' },
  { id: 'Other / Custom Plan', label: 'Custom', price: 'TBD', color: 'bg-slate-200 text-slate-700' }
];

export default function SponsorMessageWindow({ isOpen, onClose, initialPlan }: SponsorMessageWindowProps) {
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    plan: initialPlan || 'Title Sponsor - ₹2.5L'
  });

  const handleSend = () => {
    const text = `Hi Techcon, we are interested in the ${formData.plan} sponsorship plan. Our company is ${formData.companyName}. Contact person: ${formData.contactPerson}, Email: ${formData.email}. Please get back to us.`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/917902993844?text=${encoded}`, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 w-screen h-[100dvh] z-[9999] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 15 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 15 }}
            className="w-full max-w-2xl bg-white border border-slate-100 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col my-auto max-h-[95dvh]"
          >
            {/* Glow Backdrop Accent */}
            <div className="absolute w-64 h-64 rounded-full bg-purple-500/10 blur-3xl -top-20 -right-20 pointer-events-none" />
            
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center relative z-10 bg-white/80 backdrop-blur-sm shrink-0">
              <div>
                <h3 className="font-orbitron font-bold text-slate-900 tracking-wider text-xl">Sponsorship Inquiry</h3>
                <p className="text-sm text-slate-500 mt-1">Fill out the details below to proceed.</p>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Scrollable Content */}
            <div className="p-8 overflow-y-auto relative z-10 flex-1 space-y-8">
              
              <div className="space-y-5">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Company Name *</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:border-brand-purple focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                    placeholder="Enter your organization name"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Contact Person *</label>
                  <input 
                    type="text" 
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:border-brand-purple focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Phone *</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:border-brand-purple focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                      placeholder="+91..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Email *</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-sm text-slate-900 focus:border-brand-purple focus:bg-white outline-none transition-all placeholder:text-slate-400 font-medium"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>
              </div>

              {/* Plan Selection Boxes */}
              <div className="flex flex-col gap-3 pt-2">
                <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pl-1 font-bold">Select Plan *</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PLANS.map((plan) => (
                    <div 
                      key={plan.id}
                      onClick={() => setFormData({...formData, plan: plan.id})}
                      className={`cursor-pointer rounded-xl p-3 border-2 transition-all relative ${
                        formData.plan === plan.id 
                          ? 'border-brand-purple shadow-md bg-purple-50' 
                          : 'border-slate-100 bg-white hover:border-brand-purple/50'
                      }`}
                    >
                      {formData.plan === plan.id && (
                        <div className="absolute top-2 right-2 text-brand-purple">
                          <CheckCircle2 size={16} className="fill-brand-purple text-white" />
                        </div>
                      )}
                      <div className={`w-8 h-8 rounded-lg ${plan.color} flex items-center justify-center mb-2 text-xs font-bold`}>
                        {plan.label[0]}
                      </div>
                      <p className="font-bold text-slate-900 text-sm leading-tight">{plan.label}</p>
                      <p className="text-xs font-mono text-slate-500 mt-1">{plan.price}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 relative z-10">
              <button 
                onClick={handleSend}
                disabled={!formData.companyName || !formData.contactPerson}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5"
              >
                <Send size={18} />
                <span>Send via WhatsApp</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
