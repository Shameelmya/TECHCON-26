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
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setErrorMsg(null);
    setIsSearching(true);
    
    const lowerQuery = query.trim().toLowerCase();
    
    try {
      // Check local cache first
      let list = getRegistrations();
      let reg = list.find(r => 
        r.mobileNumber === lowerQuery || 
        r.fullName.toLowerCase().includes(lowerQuery)
      );
      
      // Fallback to server if not found in local cache
      if (!reg) {
        list = await fetchAllRegistrations();
        reg = list.find(r => 
          r.mobileNumber === lowerQuery || 
          r.fullName.toLowerCase().includes(lowerQuery)
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
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-4">
          <span className="text-purple-600 font-semibold uppercase">RETRIEVE ENTRY PASS</span>
          <button 
            type="button" 
            onClick={onCancel}
            className="p-1 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600 -mr-2"
          >
            <X size={18} />
          </button>
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
        <div className="relative">
          <label className="block text-xs font-mono text-slate-400 tracking-wider uppercase font-semibold mb-2 ml-1">
            Phone Number or Name
          </label>
          <div className="relative">
            <input
              type="text"
              required
              autoFocus
              disabled={isSearching}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. 9876543210 or John Doe"
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border-2 border-slate-100 focus:border-brand-purple focus:bg-white rounded-2xl outline-none font-sans text-sm text-slate-900 transition-all placeholder:text-slate-400 font-medium"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-bold font-sans text-sm transition-all shadow-lg ${
            isSearching || !query.trim()
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
