import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, ShieldAlert, Loader2, Network, ChevronRight, Zap, Target, Users, Award } from 'lucide-react';
import { submitCampusAmbassador, getProgramSettings } from '../utils/db';

interface CampusAmbassadorModalProps {
  onClose: () => void;
}

export default function CampusAmbassadorModal({ onClose }: CampusAmbassadorModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'register'>('details');
  const scrollRef = useRef<HTMLDivElement>(null);

  // New independent form fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [institution, setInstitution] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isClosed, setIsClosed] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    // Check if program is enabled
    getProgramSettings().then(settings => {
      if (settings['Campus Ambassador'] === false) {
        setIsClosed(true);
      }
      setIsLoadingSettings(false);
    });
  }, []);

  const switchTab = (tab: 'details' | 'register') => {
    setActiveTab(tab);
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await submitCampusAmbassador({
        fullName,
        mobileNumber,
        email,
        institution,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Registration failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white border border-slate-100 rounded-[24px] sm:rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col h-[90vh] md:h-[80vh] max-h-[800px]">
      
      {/* Sticky Header with Close button and Tabs */}
      <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 pt-6 px-6 sm:px-10 pb-0">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-purple/10 text-brand-purple rounded-xl flex items-center justify-center shrink-0">
              <Network size={20} />
            </div>
            <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-slate-900 tracking-tight uppercase">
              Campus Ambassador
            </h2>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 pb-4 items-center border-b border-transparent">
          <button 
            onClick={() => switchTab('details')}
            className={`px-5 py-2.5 text-sm font-bold tracking-widest uppercase transition-all rounded-xl ${
              activeTab === 'details' 
                ? 'text-brand-purple bg-brand-purple/10' 
                : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            Details
          </button>
          <button 
            onClick={() => switchTab('register')}
            className={`px-5 py-2.5 text-sm font-bold tracking-widest uppercase transition-all rounded-xl shadow-sm ${
              activeTab === 'register' 
                ? 'bg-gradient-to-r from-brand-purple to-indigo-600 text-white shadow-brand-purple/30 shadow-lg scale-[1.02]' 
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
            }`}
          >
            Register Now
          </button>
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar relative">
        <div className="absolute w-64 h-64 rounded-full bg-brand-purple/5 blur-3xl -top-10 -right-10 pointer-events-none" />

        <AnimatePresence mode="wait">
          {activeTab === 'details' ? (
            <motion.div 
              key="details"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              
              <div className="text-center space-y-4 mb-8">
                <h3 className="text-3xl sm:text-4xl font-orbitron font-bold text-slate-900 uppercase">
                  Lead Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-indigo-600">Campus</span>
                </h3>
                <p className="text-slate-500 font-sans max-w-xl mx-auto leading-relaxed">
                  Become the official face of TECHCON '26 at your institution and gain unparalleled experience in leadership and management.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <Target size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wide">Core Mission</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Organize promotional events, execute strategic marketing campaigns, and drive student participation from your college.</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                    <Award size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wide">Exclusive Perks</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Build strong networks with industry experts, enhance your resume, and qualify for financial rewards and corporate perks.</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
                    <Users size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wide">Chief Representative</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Act as the primary face of your college to the TECHCON committee. Multiple ambassadors may be appointed for larger institutions.</p>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-1 uppercase tracking-wide">Eligibility</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">Any student currently pursuing higher education. Independent application is now officially open to all active students.</p>
                  </div>
                </div>
              </div>

              <div className="bg-brand-purple/5 border border-brand-purple/20 p-6 rounded-2xl text-center">
                <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wide">Ready to make an impact?</h4>
                <p className="text-sm text-slate-600 mb-6">Join an elite network of student leaders across the state.</p>
                <button 
                  onClick={() => switchTab('register')}
                  className="px-8 py-3 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 hover:shadow-lg hover:shadow-brand-purple/20 transition-all flex items-center gap-2 mx-auto"
                >
                  Apply Now <ChevronRight size={18} />
                </button>
              </div>

            </motion.div>
          ) : (
            <motion.div 
              key="register"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-md mx-auto"
            >
              
              {isLoadingSettings ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
                </div>
              ) : isClosed ? (
                <div className="text-center space-y-4 py-12">
                   <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                     <ShieldAlert size={32} />
                   </div>
                   <h3 className="text-xl font-bold text-slate-900 font-orbitron">Registration Paused</h3>
                   <p className="text-sm text-slate-500 max-w-sm mx-auto">
                     We are currently not accepting new Campus Ambassador applications. Please check back later.
                   </p>
                </div>
              ) : isSuccess ? (
                <div className="text-center space-y-4 py-12">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-orbitron uppercase tracking-wide">Application Submitted!</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Your request to become a Campus Ambassador has been received. Our team will review your application and contact you soon.
                  </p>
                  <button 
                    onClick={() => switchTab('details')}
                    className="mt-8 px-8 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Back to Details
                  </button>
                </div>
              ) : (
                <div className="py-4">
                  <div className="space-y-6">
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-slate-900 font-orbitron uppercase tracking-wide">Ambassador Registration</h3>
                      <p className="text-sm text-slate-500 mt-2">Enter your details below to apply.</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-5">
                      
                      {submitError && (
                        <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs flex gap-2">
                          <ShieldAlert size={16} className="shrink-0" />
                          <p>{submitError}</p>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
                          Full Name
                        </label>
                        <input 
                          type="text" 
                          required
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 transition-all text-sm font-medium"
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
                          Mobile Number
                        </label>
                        <input 
                          type="tel" 
                          required
                          value={mobileNumber}
                          onChange={e => setMobileNumber(e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 transition-all text-sm font-medium"
                          placeholder="10-digit mobile number"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
                          Email Address
                        </label>
                        <input 
                          type="email" 
                          required
                          value={email}
                          onChange={e => setEmail(e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 transition-all text-sm font-medium"
                          placeholder="Your email address"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
                          Institution
                        </label>
                        <input 
                          type="text" 
                          required
                          value={institution}
                          onChange={e => setInstitution(e.target.value)}
                          className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-brand-purple focus:ring-4 focus:ring-brand-purple/10 transition-all text-sm font-medium"
                          placeholder="Your College or University"
                        />
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting || !fullName.trim() || !mobileNumber.trim() || !email.trim() || !institution.trim()}
                        className="w-full py-4 mt-2 bg-brand-purple text-white font-bold rounded-xl hover:bg-purple-700 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:shadow-none disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Submit Application"}
                      </button>
                    </form>
                    
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
