/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { motion } from 'motion/react';
import { Download, Share2, MapPin, Calendar, Compass, User, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import { AttendeeRegistration } from '../types';

interface TicketPassProps {
  registration: AttendeeRegistration;
  onBackToHome: () => void;
}

export default function TicketPass({ registration, onBackToHome }: TicketPassProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const qrRef = useRef<HTMLCanvasElement>(null);
  const ticketRef = useRef<HTMLDivElement>(null);
  const [ticketDataUrl, setTicketDataUrl] = useState<string | null>(null);
  const [ticketBlob, setTicketBlob] = useState<Blob | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Compile QR payload securely
    const qrPayload = JSON.stringify({
      id: registration.id,
      name: registration.fullName,
      phone: registration.mobileNumber,
      email: registration.email,
    });

    // Generate QR code for rendering
    QRCode.toDataURL(qrPayload, {
      width: 250,
      margin: 1.5,
      color: {
        dark: '#0f172a', // deep slate
        light: '#ffffff' // white
      }
    }, (err, url) => {
      if (!err && url) {
        setQrUrl(url);
      }
    });

    // Draw on hidden canvas for high-res PNG download
    if (qrRef.current) {
      QRCode.toCanvas(qrRef.current, qrPayload, {
        width: 140,
        margin: 1
      }, () => {
        // After QR is rendered, wait a tiny bit for DOM to paint, then generate the ticket image
        setTimeout(async () => {
          if (!ticketRef.current) return;
          try {
            const canvas = await html2canvas(ticketRef.current, { scale: 3, useCORS: true, backgroundColor: null });
            const url = canvas.toDataURL('image/png');
            setTicketDataUrl(url);
            canvas.toBlob((blob) => {
              setTicketBlob(blob);
              setIsGenerating(false);
            });
          } catch(e) {
            console.error("Failed to pre-generate ticket image", e);
            setIsGenerating(false);
          }
        }, 500);
      });
    }
  }, [registration]);

  const handleSavePNG = () => {
    if (isGenerating || !ticketDataUrl) {
      alert("Ticket image is still generating... Please try again in a few seconds.");
      return;
    }
    try {
      const a = document.createElement('a');
      a.href = ticketDataUrl;
      a.download = `techcon26_boardingpass_${registration.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Failed to download ticket image', error);
      alert("Could not save ticket. Please take a screenshot instead.");
    }
  };

  const handleShareWhatsApp = async () => {
    if (isGenerating || !ticketBlob) {
      alert("Ticket image is still generating... Please try again in a few seconds.");
      return;
    }
    try {
      const file = new File([ticketBlob], `techcon26_boardingpass_${registration.id}.png`, { type: 'image/png' });
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `TECHCON '26 Entry Pass`,
          text: `Hey! I just registered for TECHCON '26. Here is my official Entry Pass Boarding ID: ${registration.id}.`
        });
      } else {
        // Fallback for browsers that don't support file sharing or navigator.share
        const text = `Hey! I just registered for TECHCON '26. Here is my official Entry Pass Boarding ID: ${registration.id}.`;
        const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
        window.location.href = url; // Use location.href instead of window.open to bypass popup blockers
      }
    } catch (error) {
      console.error('Failed to share ticket image', error);
      const text = `Hey! I just registered for TECHCON '26. Here is my official Entry Pass Boarding ID: ${registration.id}.`;
      window.location.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    }
  };

  return (
    <div id="registration-success-pane" className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6">
      
      {/* Hidden high-res canvas */}
      <canvas ref={qrRef} className="hidden" />

      {/* SUCCESS CONFIRMATION TITLE BAR */}
      <div className="text-center max-w-xl mx-auto mb-10 select-none">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-6 h-6">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-slate-900 tracking-[0.05em] uppercase">
          Registration Completed Successfully!
        </h2>
        {/* Unique registration ID shown on top under title */}
        <p className="text-lg font-mono font-bold text-purple-700 mt-2 bg-purple-50 inline-block px-4 py-1 rounded-full border border-purple-100">
          REGISTRATION ID: {registration.id}
        </p>
        <p className="text-xs sm:text-sm font-sans text-slate-500 mt-3 max-w-md mx-auto">
          Your seat is locked! Below is your official Entry Pass. Save it to present at the gate.
        </p>
      </div>

      {/* Grid: White Theme Ticket Stub & Actions */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: White Theme Ticket with cuts */}
        <div className="md:col-span-7 flex justify-center">
          <div 
            ref={ticketRef}
            id="boarding-pass-print"
            className="w-full max-w-[360px] relative bg-white text-slate-900 rounded-[28px] shadow-2xl border border-slate-200 overflow-hidden font-sans flex flex-col justify-between p-6"
          >
            {/* Horizontal Top Stripe using our gradient colors */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue" />
            <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink" />

            {/* Circular ticket stubs notch cuts on the side */}
            <div className="absolute -left-4 top-[60%] w-8 h-8 rounded-full bg-[#f8fafc] border-r border-slate-200 z-10 shadow-inner" />
            <div className="absolute -right-4 top-[60%] w-8 h-8 rounded-full bg-[#f8fafc] border-l border-slate-200 z-10 shadow-inner" />

            {/* Ticket Header Area */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 mb-5 select-none pt-3">
              <div className="flex flex-col">
                <img src="/navbar-logo.png" alt="TECHCON '26" className="h-6 sm:h-7 object-contain" />
                <span className="text-[9px] font-mono tracking-[0.1em] text-slate-400 uppercase leading-none mt-1 ml-4">
                  Organized by msf TechFed
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">ENTRY PASS</span>
                <span className="text-sm font-mono text-brand-purple font-bold mt-1 bg-purple-50 px-2 py-0.5 rounded">{registration.id}</span>
              </div>
            </div>

            {/* Primary Passenger Pass details */}
            <div className="space-y-5 mb-5 text-left relative z-10">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mb-1">ATTENDEE NAME</span>
                <span className="text-2xl font-bold font-sans tracking-tight text-slate-900 block truncate uppercase">
                  {registration.fullName}
                </span>
              </div>

              {/* ID relevance & Phone directly under name of person */}
              <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-xl space-y-1.5 shadow-sm">
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-500">
                  <span>REG ID:</span>
                  <span className="font-bold text-purple-700">{registration.id}</span>
                </div>
                <div className="flex justify-between items-center text-[11px] font-mono text-slate-500">
                  <span>PHONE NO:</span>
                  <span className="font-bold text-slate-800">{registration.mobileNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mb-1">PASS CATEGORY</span>
                  <span className="text-xs font-semibold font-orbitron text-brand-pink block truncate uppercase">
                    {registration.occupation}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mb-1">VENUE</span>
                  <span className="text-xs font-semibold font-sans text-slate-800 block truncate uppercase">
                    CUSAT, Kochi
                  </span>
                </div>
              </div>
            </div>

            {/* Dashed line on Ticket stub */}
            <div className="relative flex items-center justify-center my-4 py-2">
              <div className="absolute w-full border-t-[2px] border-dashed border-slate-200" />
            </div>

            {/* Event Time & Organizer */}
            <div className="grid grid-cols-2 gap-4 mb-5 text-left">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mb-1">DATE</span>
                <span className="text-xs font-bold text-slate-800 block truncate">
                  July 15, 2026
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase block mb-1">TICKET SERIAL</span>
                <span className="text-[11px] font-mono text-slate-500 block truncate">
                  {registration.ticketNumber}
                </span>
              </div>
            </div>

            {/* Center QR Code Image Area with Brand Gradient */}
            <div className="bg-gradient-to-br from-brand-pink via-brand-purple to-brand-blue p-5 rounded-2xl flex flex-col items-center justify-center mb-2 relative shadow-lg">
              <div className="bg-white p-2.5 rounded-xl shadow-md">
                {qrUrl ? (
                  <img 
                    src={qrUrl} 
                    alt="Entry pass scan token" 
                    className="w-32 h-32 select-none rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center animate-pulse">
                    <span className="text-[10px] font-mono text-slate-400 text-center px-2">GENERATING QR</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] font-mono text-white/90 tracking-widest text-center block mt-3 uppercase font-bold drop-shadow-sm">
                SECURE QR GATE PASS
              </span>
            </div>

          </div>
        </div>

        {/* Right Column: Clean Actions */}
        <div className="md:col-span-5 flex flex-col gap-4 text-left">
          
          <div className="bg-slate-50 border border-slate-150/80 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-mono tracking-[0.2em] text-slate-400 uppercase font-bold">PASS MANAGEMENT</h3>
            
            <div className="flex flex-row gap-3">
              {/* Save Button */}
              <button
                onClick={handleSavePNG}
                className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-2xl font-sans text-slate-800 transition-all duration-300 shadow-sm gap-2"
              >
                <Download size={20} className="text-purple-600" />
                <span className="font-semibold text-[10px] sm:text-xs">Download</span>
              </button>

              {/* Share to WhatsApp */}
              <button
                onClick={handleShareWhatsApp}
                className="flex-1 flex flex-col items-center justify-center p-3 sm:p-4 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl font-sans text-slate-800 transition-all duration-300 shadow-sm gap-2"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-500 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.706 1.458h.013c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span className="font-semibold text-[10px] sm:text-xs">Share</span>
              </button>
            </div>
          </div>

          {/* Clean Simplified Note */}
          <div className="p-5 bg-[#0f172a] text-slate-100 rounded-3xl text-xs space-y-2 select-none border border-slate-800">
            <span className="font-mono font-bold block uppercase text-[10px] text-pink-500 tracking-wider">// ENTRY NOTIFICATION</span>
            <p className="text-slate-300 leading-relaxed font-sans">
              Please keep this Entry Pass saved on your device. Present it at the program entry or event entry gate at CUSAT Kochi for verification.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onBackToHome}
              className="flex-1 py-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-sans font-semibold text-xs uppercase tracking-wider rounded-2xl transition-colors text-center"
            >
              Back to Home
            </button>
            <button
              onClick={() => {
                onBackToHome();
                setTimeout(() => {
                  window.location.hash = 'register';
                }, 100);
              }}
              className="flex-1 py-4 bg-purple-600 hover:bg-purple-700 text-white font-sans font-bold text-xs uppercase tracking-wider rounded-2xl transition-colors text-center shadow-lg shadow-purple-500/20"
            >
              Register Another
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
