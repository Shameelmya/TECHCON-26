import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { getRegistrations, addEventToRegistration } from '../utils/db';
import { AttendeeRegistration } from '../types';
import TicketPass from './TicketPass';

interface AddOnRegistrationModalProps {
  eventName: string;
  isSpecialProgram: boolean;
  onClose: () => void;
}

export default function AddOnRegistrationModal({ eventName, isSpecialProgram, onClose }: AddOnRegistrationModalProps) {
  const [id, setId] = useState('');
  const [mobile, setMobile] = useState('');
  const [feeReceiptUrl, setFeeReceiptUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [foundAttendee, setFoundAttendee] = useState<AttendeeRegistration | null>(null);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);

  const needsFee = isSpecialProgram && eventName === 'Hackathon';

  const handleVerify = () => {
    setErrorMsg(null);
    if (!id.trim() || !mobile.trim()) {
      setErrorMsg("Please enter both ID and Mobile Number.");
      return;
    }
    
    const list = getRegistrations();
    const attendee = list.find(a => a.id.toUpperCase() === id.trim().toUpperCase() && a.mobileNumber === mobile.trim());
    
    if (!attendee) {
      setErrorMsg("No registration found matching this ID and Mobile Number.");
      return;
    }

    setFoundAttendee(attendee);
    const hasEvent = isSpecialProgram 
      ? attendee.specialPrograms?.includes(eventName) 
      : attendee.sessions?.includes(eventName);
      
    if (hasEvent) {
      setAlreadyRegistered(true);
    }
  };

  const handleReceiptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('File must be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let scaleSize = 800 / img.width;
          if (scaleSize > 1) scaleSize = 1;
          canvas.width = img.width * scaleSize;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          setFeeReceiptUrl(canvas.toDataURL('image/jpeg', 0.6));
          setErrorMsg(null);
        };
      };
    }
  };

  const handleRegister = async () => {
    if (needsFee && !feeReceiptUrl) {
      setErrorMsg("Please upload your fee receipt.");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMsg(null);
    try {
      const updated = await addEventToRegistration(id, mobile, eventName, isSpecialProgram, feeReceiptUrl || undefined);
      setFoundAttendee(updated);
      setAlreadyRegistered(true);
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to register for the event.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/90 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl relative my-auto"
      >
        {/* Header */}
        <div className="p-6 bg-slate-900 flex justify-between items-center text-white">
          <div>
            <h3 className="font-orbitron font-bold text-xl uppercase text-brand-pink">{eventName}</h3>
            <p className="text-xs text-slate-400 font-mono mt-1">Add-on Event Registration</p>
          </div>
          <button onClick={onClose} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {errorMsg && (
            <div className="p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium flex items-start gap-2 border border-red-100">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!foundAttendee ? (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Registration ID</label>
                <input 
                  type="text" 
                  value={id}
                  onChange={e => setId(e.target.value)}
                  placeholder="TC26A001"
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-purple rounded-xl outline-none font-mono text-sm uppercase"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest">Mobile Number</label>
                <input 
                  type="tel" 
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  placeholder="10-digit mobile number"
                  className="w-full px-4 py-3 border border-slate-200 focus:border-brand-purple rounded-xl outline-none font-mono text-sm"
                />
              </div>
              
              <button 
                onClick={handleVerify}
                className="w-full py-4 rounded-xl bg-slate-900 hover:bg-brand-purple text-white font-orbitron font-bold uppercase tracking-wider transition-colors text-sm"
              >
                Verify & Continue
              </button>
              
              <div className="text-center pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">Not registered for TECHCON '26 yet?</p>
                <a href="#register" onClick={onClose} className="text-sm font-bold text-brand-purple mt-1 inline-block hover:underline">
                  Register for Main Event
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {!alreadyRegistered ? (
                <>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <p className="text-xs text-slate-500 font-mono uppercase mb-1">Participant Details</p>
                    <h4 className="font-bold text-slate-900 text-lg">{foundAttendee.fullName}</h4>
                    <p className="text-sm text-slate-600">{foundAttendee.place}, {foundAttendee.district}</p>
                  </div>
                  
                  {needsFee && (
                    <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                      <label className="text-[11px] font-mono tracking-wider text-orange-600 uppercase font-bold block mb-2">
                        Hackathon Fee Receipt (Rs. 500) *
                      </label>
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-20 bg-white rounded-lg border-2 border-orange-200 border-dashed shrink-0 flex items-center justify-center relative overflow-hidden">
                          {feeReceiptUrl ? (
                            <img src={feeReceiptUrl} alt="Receipt" className="w-full h-full object-cover" />
                          ) : (
                            <Upload size={20} className="text-orange-300" />
                          )}
                          <input type="file" accept="image/*" onChange={handleReceiptChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                        <div className="text-xs text-slate-600">
                          Upload payment receipt to proceed.
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={handleRegister}
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-brand-pink hover:bg-brand-purple text-white font-orbitron font-bold uppercase tracking-wider transition-colors text-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Registering...' : `Register for ${eventName}`}
                  </button>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-500 mb-2">
                    <CheckCircle size={32} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">You are Registered!</h4>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">
                    You have successfully registered for <strong>{eventName}</strong>. Your updated entry pass is below.
                  </p>
                  <div className="mt-6 pointer-events-none transform scale-90 origin-top">
                    <TicketPass registration={foundAttendee} onBackToHome={onClose} />
                  </div>
                  <button onClick={onClose} className="text-sm font-bold text-slate-500 hover:text-slate-900">Close</button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
