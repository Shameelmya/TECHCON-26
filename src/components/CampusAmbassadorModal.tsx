import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, CheckCircle, ShieldAlert, Loader2, Network } from 'lucide-react';
import { verifyMainRegistration, submitCampusAmbassador, getProgramSettings } from '../utils/db';
import { AttendeeRegistration } from '../types';

interface CampusAmbassadorModalProps {
  onClose: () => void;
}

export default function CampusAmbassadorModal({ onClose }: CampusAmbassadorModalProps) {
  const [regId, setRegId] = useState('');
  const [mobile, setMobile] = useState('');
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState<AttendeeRegistration | null>(null);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isClosed, setIsClosed] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);

  useEffect(() => {
    // Check if we came back from registration for auto-fill
    const savedRegId = sessionStorage.getItem('autofillRegId');
    const savedMobile = sessionStorage.getItem('autofillMobile');
    if (savedRegId) setRegId(savedRegId);
    if (savedMobile) setMobile(savedMobile);
    
    // Check if program is enabled
    getProgramSettings().then(settings => {
      if (settings['Campus Ambassador'] === false) {
        setIsClosed(true);
      }
      setIsLoadingSettings(false);
    });
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError(null);
    setSubmitError(null);
    setIsVerifying(true);
    
    try {
      const user = await verifyMainRegistration(regId, mobile);
      setVerifiedUser(user);
    } catch (err: any) {
      setVerifyError(err.message || 'Verification failed. Please check your details.');
      setVerifiedUser(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRegister = async () => {
    if (!verifiedUser) return;
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      await submitCampusAmbassador({
        id: verifiedUser.id,
        fullName: verifiedUser.fullName,
        mobileNumber: verifiedUser.mobileNumber,
        email: verifiedUser.email,
        institution: verifiedUser.institution,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError(err.message || 'Registration failed. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-slate-100 p-6 sm:p-10 rounded-[32px] shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-10">
      
      <div className="absolute w-64 h-64 rounded-full bg-brand-purple/5 blur-3xl -top-10 -right-10 pointer-events-none" />

      {/* Left side: Details */}
      <div className="flex-1 space-y-6 overflow-y-auto max-h-[80vh] pr-2 custom-scrollbar">
        <div className="flex justify-between items-start md:hidden mb-4">
           <div className="w-12 h-12 bg-brand-purple/10 text-brand-purple rounded-xl flex items-center justify-center shrink-0">
             <Network size={24} />
           </div>
           <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
              <X size={20} />
           </button>
        </div>

        <div className="hidden md:flex w-14 h-14 bg-brand-purple/10 text-brand-purple rounded-2xl items-center justify-center shadow-inner shrink-0 mb-6">
          <Network size={32} />
        </div>
        
        <h2 className="text-3xl sm:text-4xl font-orbitron font-bold text-slate-900 tracking-tight leading-tight uppercase">
          Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-indigo-600">Ambassador</span>
        </h2>
        
        <div className="space-y-4 text-sm font-sans text-slate-600 leading-relaxed text-justify">
          <p>
            Campus Ambassador is a registered student representative serving within an academic organization or institution to promote our premier technical festival, TECHCON 26, across their respective campus.
          </p>
          <p>
            The role of a campus ambassador typically involves organizing and participating in promotional events, executing strategic marketing campaigns, and leading other key outreach efforts targeted at students. This position offers a magnificent opportunity for individuals to gain comprehensive, hands-on experience in corporate communication, public relations, project management, and leadership.
          </p>
          <p>
            In addition to skill development, being a campus ambassador enables you to build strong networks with professional peers, industry experts, and potential future employers, while qualifying for exclusive financial rewards and corporate perks.
          </p>
          
          <ul className="list-disc pl-5 space-y-2 text-slate-700 font-medium mt-4">
            <li>Candidates must be officially registered on our primary portal to be eligible.</li>
            <li>As a campus ambassador, you are expected to share all official digital assets, promotional posts, updates, and links across your personal and institutional social media channels, as well as physical college notice boards.</li>
            <li>Your core responsibilities include fostering awareness, encouraging festival registrations, and driving massive student participation from your college into Tenogo Tech fest events.</li>
            <li>Ambassadors will act as the chief face and representative of their college to the Tenogo committee.</li>
            <li>Depending on the institution's student population size, the committee may appoint multiple campus ambassadors per college.</li>
            <li>Any student currently pursuing higher education in a recognized institution is eligible to apply. If there is an influx of applications from the same campus, preference will naturally be granted to applicants demonstrating exceptional interpersonal skills, persuasive communication, and documented past experience.</li>
          </ul>
        </div>
      </div>

      {/* Right side: Verification / Registration Form */}
      <div className="flex-1 md:border-l md:border-slate-100 md:pl-10 flex flex-col pt-6 md:pt-0">
        
        <div className="hidden md:flex justify-end mb-6">
           <button onClick={onClose} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full transition-colors">
              <X size={20} />
           </button>
        </div>

        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex-1 flex flex-col justify-center">
          
          {isLoadingSettings ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-brand-purple animate-spin" />
            </div>
          ) : isClosed ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center space-y-4 py-8">
               <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                 <ShieldAlert size={32} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 font-orbitron">Registration Paused</h3>
               <p className="text-sm text-slate-500 max-w-sm mx-auto">
                 We are currently not accepting new Campus Ambassador applications. Please check back later.
               </p>
               <button 
                 onClick={onClose}
                 className="mt-6 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl w-full hover:bg-slate-800 transition-colors"
               >
                 Close
               </button>
            </motion.div>
          ) : isSuccess ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-orbitron">Application Submitted!</h3>
              <p className="text-sm text-slate-500">
                Your request to become a Campus Ambassador has been received. Our team will review your application and contact you soon.
              </p>
              <button 
                onClick={onClose}
                className="mt-6 px-6 py-3 bg-brand-purple text-white font-bold rounded-xl w-full hover:bg-purple-700 transition-colors"
              >
                Close
              </button>
            </motion.div>
          ) : (
            <>
              <h3 className="text-lg font-bold text-slate-900 mb-6 font-orbitron uppercase text-center tracking-wide">
                Register as Ambassador
              </h3>
              
              {!verifiedUser ? (
                <>
                <form onSubmit={handleVerify} className="space-y-4">
                  
                  {verifyError && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs flex gap-2">
                      <ShieldAlert size={16} className="shrink-0" />
                      <p>{verifyError}</p>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
                      TECHCON'26 Registration ID
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. TC26A001"
                      value={regId}
                      onChange={e => setRegId(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-purple text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest pl-1">
                      Registered Mobile Number
                    </label>
                    <input 
                      type="tel" 
                      required
                      placeholder="10-digit mobile number"
                      value={mobile}
                      onChange={e => setMobile(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-brand-purple text-sm"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isVerifying || !regId.trim() || !mobile.trim()}
                    className="w-full py-3 mt-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isVerifying ? <Loader2 size={18} className="animate-spin" /> : "Verify Registration"}
                  </button>
                </form>
                
                <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                  <p className="text-xs text-slate-500 mb-3 font-medium uppercase tracking-wider">Not registered yet?</p>
                  <button 
                    onClick={() => {
                      sessionStorage.setItem('returnTo', 'ambassador');
                      window.location.hash = 'register';
                    }}
                    className="w-full py-3 border-2 border-brand-purple text-brand-purple font-bold rounded-xl hover:bg-brand-purple hover:text-white transition-colors"
                  >
                    Register for TECHCON '26 Now
                  </button>
                </div>
                </>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                  <div className="p-5 bg-white border-2 border-green-100 rounded-xl">
                    <div className="flex items-center gap-2 text-green-600 mb-4 pb-3 border-b border-green-50">
                      <CheckCircle size={18} />
                      <span className="font-bold text-sm font-sans uppercase tracking-wide">Student Verified</span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Name</span>
                        <span className="font-bold text-slate-900">{verifiedUser.fullName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Reg ID</span>
                        <span className="font-bold text-brand-purple">{verifiedUser.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Mobile</span>
                        <span className="font-bold text-slate-900">{verifiedUser.mobileNumber}</span>
                      </div>
                      <div className="pt-2 border-t border-slate-50">
                        <span className="text-slate-500 block text-xs mb-1">Institution</span>
                        <span className="font-bold text-slate-900 line-clamp-2">{verifiedUser.institution}</span>
                      </div>
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-xs">
                      {submitError}
                    </div>
                  )}

                  <button 
                    onClick={handleRegister}
                    disabled={isSubmitting}
                    className="w-full py-4 bg-brand-purple text-white font-bold rounded-xl shadow-lg shadow-purple-500/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0"
                  >
                    {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : "Apply as Campus Ambassador"}
                  </button>
                </motion.div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
