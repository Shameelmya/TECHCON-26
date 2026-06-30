import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Search, AlertCircle, Download, CheckCircle2 } from 'lucide-react';
import { fetchPass } from '../utils/db';
import TicketPass from './TicketPass';
import { AttendeeRegistration } from '../types';

interface GetPassModalProps {
  onClose: () => void;
}

export default function GetPassModal({ onClose }: GetPassModalProps) {
  const [mobile, setMobile] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ticket, setTicket] = useState<AttendeeRegistration | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim() || !name.trim()) {
      setErrorMsg('Please enter both name and mobile number.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    try {
      const result = await fetchPass(name, mobile);
      setTicket(result);
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not find your pass.');
      setTicket(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    const ticketEl = document.getElementById('ticket-pass-container');
    if (!ticketEl) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(ticketEl, { 
        scale: 3,
        useCORS: true,
        backgroundColor: null
      });
      
      const link = document.createElement('a');
      link.download = `TECHCON26_PASS_${ticket?.id}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Failed to download ticket', error);
      alert('Failed to generate image. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-sans font-bold text-slate-900">Retrieve Your Pass</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter your details to find your ticket</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {!ticket ? (
            <form onSubmit={handleSearch} className="space-y-4">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl flex items-start gap-3 text-sm">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <p>{errorMsg}</p>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="E.g., Muhammad"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl outline-none font-sans text-slate-900 transition-all"
                />
                <p className="text-[10px] text-slate-400 ml-1">You can just enter a part of your name (case insensitive).</p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider ml-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="Exact mobile number used for registration"
                  value={mobile}
                  onChange={e => setMobile(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:border-purple-500 focus:bg-white rounded-xl outline-none font-sans text-slate-900 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-slate-950 hover:bg-purple-600 text-white font-sans font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Search size={18} />
                    <span>Find My Pass</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center">
              <div className="bg-green-50 text-green-700 p-3 rounded-xl flex items-center gap-2 text-sm w-full justify-center mb-6 border border-green-100">
                <CheckCircle2 size={18} />
                <span className="font-medium">Pass found successfully!</span>
              </div>
              
              <div id="ticket-pass-container" className="w-full max-w-[350px] mb-6">
                <TicketPass attendee={ticket} />
              </div>

              <button
                onClick={handleDownload}
                className="w-full bg-slate-950 hover:bg-purple-600 text-white font-sans font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Download size={18} />
                <span>Download Entry Pass</span>
              </button>
              
              <button
                onClick={() => setTicket(null)}
                className="w-full mt-3 bg-transparent text-slate-500 font-sans font-medium py-2 text-sm hover:text-slate-800 transition-colors"
              >
                Search Another
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
