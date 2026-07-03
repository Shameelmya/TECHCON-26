import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, X, AlertCircle, Loader2 } from 'lucide-react';
import { AttendeeRegistration } from '../types';
import { getRegistrations, fetchAllRegistrations } from '../utils/db';

interface RetrievePassFormProps {
  onSuccess: (reg: AttendeeRegistration) => void;
  onCancel: () => void;
  onOpenRegister: () => void;
}

export default function RetrievePassForm({ onSuccess, onCancel, onOpenRegister }: RetrievePassFormProps) {
  const [nameQuery, setNameQuery] = useState('');
  const [phoneQuery, setPhoneQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameQuery.trim() || !phoneQuery.trim()) return;
    
    setErrorMsg(null);
    setIsSearching(true);
    
    const lowerName = nameQuery.trim().toLowerCase();
    const phone = phoneQuery.trim();
    
    try {
      // Check local cache first
      let list = getRegistrations();
      let reg = list.find(r => 
        r.mobileNumber === phone && 
        r.fullName.toLowerCase().includes(lowerName)
      );
      
      // Fallback to server if not found in local cache
      if (!reg) {
        list = await fetchAllRegistrations();
        reg = list.find(r => 
          r.mobileNumber === phone && 
          r.fullName.toLowerCase().includes(lowerName)
        );
      }
      
      if (reg) {
        onSuccess(reg);
      } else {
        setErrorMsg("No registration found with this Name or Phone Number. Please check your spelling or register anew.");
      }
    } catch (err) {
      setErrorMsg("Failed to connect to the server. Please check your internet connection.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-slate-100 p-8 sm:p-10 rounded-[32px] shadow-xl relative overflow-hidden">
      {/* Glow Backdrop Accent */}
      <div className="absolute w-44 h-44 rounded-full bg-purple-500/5 blur-2xl -top-10 -right-10 pointer-events-none" />

      {/* Header Info */}
      <div className="mb-8 select-none">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-mono text-slate-400 mb-4 gap-4">
          <span className="text-purple-600 font-semibold uppercase">FOR REGISTERED USERS ONLY</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenRegister}
              className="px-4 py-1.5 bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white transition-colors rounded-full font-bold text-[10px] tracking-wider uppercase shrink-0"
            >
              Register Now
            </button>
            <button 
              type="button" 
              onClick={onCancel}
              className="p-1.5 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 shrink-0"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-orbitron font-bold text-slate-900 mb-3 tracking-wide">
          Find Your Pass
        </h2>
        <p className="text-sm text-slate-500 font-sans leading-relaxed max-w-md mx-auto">
          Enter your registered phone number or part of your name to instantly retrieve your Techcon '26 boarding pass.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-sm flex items-start gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      <form onSubmit={handleSearch} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <label className="block text-xs font-mono text-slate-400 tracking-wider uppercase font-semibold mb-2 ml-1">
              Registered Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                autoFocus
                disabled={isSearching}
                value={phoneQuery}
                onChange={(e) => setPhoneQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-4 bg-slate-50 border-2 border-slate-100 focus:border-brand-purple focus:bg-white rounded-2xl outline-none font-sans text-sm text-slate-900 transition-all font-medium"
              />
            </div>
          </div>
          
          <div className="relative">
            <label className="block text-xs font-mono text-slate-400 tracking-wider uppercase font-semibold mb-2 ml-1">
              Registered Name
            </label>
            <div className="relative">
              <input
                type="text"
                required
                disabled={isSearching}
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                className="w-full pl-4 pr-4 py-4 bg-slate-50 border-2 border-slate-100 focus:border-brand-purple focus:bg-white rounded-2xl outline-none font-sans text-sm text-slate-900 transition-all font-medium"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSearching || !nameQuery.trim() || !phoneQuery.trim()}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold font-sans text-sm transition-all shadow-lg ${
            isSearching || !nameQuery.trim() || !phoneQuery.trim()
              ? 'bg-slate-200 text-slate-400 shadow-none cursor-not-allowed'
              : 'bg-brand-purple text-white shadow-purple-500/20 hover:shadow-purple-500/40 hover:-translate-y-0.5'
          }`}
        >
          {isSearching ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>SEARCHING...</span>
            </>
          ) : (
            'RETRIEVE PASS'
          )}
        </button>
      </form>

      {/* Switch to Register */}
      <div className="mt-8 pt-6 border-t border-slate-100 p-4 bg-brand-pink/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-[11px] sm:text-xs text-brand-pink font-sans font-semibold uppercase tracking-wider text-center sm:text-left">
          Didn't register yet?
        </span>
        <button
          type="button"
          onClick={onOpenRegister}
          className="px-6 py-2.5 bg-white hover:bg-brand-pink text-brand-pink hover:text-white border border-brand-pink/20 rounded-xl text-xs font-bold transition-colors uppercase tracking-widest shadow-sm w-full sm:w-auto"
        >
          Register Now
        </button>
      </div>
    </div>
  );
}
