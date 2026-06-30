/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { motion } from 'motion/react';
import { Download, Share2, MapPin, Calendar, Compass, User, Printer } from 'lucide-react';
import { AttendeeRegistration } from '../types';

interface TicketPassProps {
  registration: AttendeeRegistration;
  onBackToHome: () => void;
}

export default function TicketPass({ registration, onBackToHome }: TicketPassProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const ticketRef = useRef<HTMLDivElement | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement | null>(null);

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
    if (qrCanvasRef.current) {
      QRCode.toCanvas(qrCanvasRef.current, qrPayload, {
        width: 180,
        margin: 1
      });
    }
  }, [registration]);

  const handleSavePNG = () => {
    // Create high-resolution 640x960 export in full compliance with white-theme guidelines
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 960;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill white ticket background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 640, 960);

    // Draw top gradient stripe
    const gradient = ctx.createLinearGradient(0, 0, 640, 0);
    gradient.addColorStop(0, '#782DFF'); // brand-purple
    gradient.addColorStop(1, '#FF208E'); // brand-pink
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 640, 20);

    // Subtle ticket border
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, 620, 940);

    // Horizontal TECHCON Logo
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('TECHCON \'26', 45, 95);

    ctx.fillStyle = '#782DFF';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('DEFINING THE DIGITAL TOMORROW', 45, 125);

    // Ticket ID on top right
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 20px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(registration.id, 595, 95);

    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('OFFICIAL ENTRY PASS', 595, 120);

    // Reset text align
    ctx.textAlign = 'left';

    // Divider Line 1
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 160);
    ctx.lineTo(600, 160);
    ctx.stroke();

    // Attendee Name
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('ATTENDEE / PARTICIPANT', 45, 205);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillText(registration.fullName.toUpperCase(), 45, 245);

    // ID Relevance & Phone directly under the name
    ctx.fillStyle = '#782DFF';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`ID: ${registration.id}   |   PHONE: ${registration.mobileNumber}`, 45, 275);

    // Role Category
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('PASS CATEGORY', 45, 340);
    ctx.fillStyle = '#FF208E';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillText(registration.occupation.toUpperCase(), 45, 375);

    // Venue & Location
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('VENUE', 340, 340);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('CUSAT, KOCHI', 340, 375);

    // Date
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('DATE & TIME', 45, 440);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('JULY 15, 2026', 45, 475);

    // Organizer info
    ctx.fillStyle = '#64748b';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('ORGANIZED BY', 340, 440);
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('msf Kerala State Committee Tech Wing', 340, 475);

    // Ticket stub dashed line
    ctx.strokeStyle = '#cbd5e1';
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 540);
    ctx.lineTo(600, 540);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Draw QR canvas image onto the exporter canvas
    if (qrCanvasRef.current) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(220, 590, 200, 200);
      ctx.drawImage(qrCanvasRef.current, 230, 600, 180, 180);
    }

    // Ticket instructions
    ctx.fillStyle = '#64748b';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PLEASE PRESENT THIS ENTRY PASS AT THE VENUE GATE FOR INSTANT CHECK-IN', 320, 830);
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 9px monospace';
    ctx.fillText('POWERED BY MSF TECHFED SYSTEMS', 320, 860);

    // Export & Download trigger
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `techcon26_boardingpass_${registration.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShareWhatsApp = () => {
    const text = `Hey! I just registered for TECHCON '26 (organized by msf TechFed). Here is my official Entry Pass Boarding ID: *${registration.id}*. See you there at CUSAT, Kochi on July 15, 2026!`;
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div id="registration-success-pane" className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6">
      
      {/* Hidden high-res canvas */}
      <canvas ref={qrCanvasRef} className="hidden" />

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
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-brand-purple to-brand-pink" />

            {/* Circular ticket stubs notch cuts on the side */}
            <div className="absolute -left-3.5 top-[58%] w-7 h-7 rounded-full bg-[#f8fafc] border border-slate-200 z-10" />
            <div className="absolute -right-3.5 top-[58%] w-7 h-7 rounded-full bg-[#f8fafc] border border-slate-200 z-10" />

            {/* Ticket Header Area */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4 select-none pt-2">
              <div className="flex flex-col">
                <span className="font-orbitron text-base font-bold text-slate-900 tracking-wider">
                  TECHCON '26
                </span>
                <span className="text-[8px] font-mono tracking-[0.1em] text-slate-400 uppercase leading-none mt-0.5">
                  Organized by msf TechFed
                </span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase">ENTRY PASS</span>
                <span className="text-sm font-mono text-brand-pink font-bold mt-0.5">{registration.id}</span>
              </div>
            </div>

            {/* Primary Passenger Pass details */}
            <div className="space-y-4 mb-4 text-left">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block">PASSENGER / ATTENDEE</span>
                <span className="text-xl font-bold font-sans tracking-tight text-slate-900 block truncate uppercase mt-0.5">
                  {registration.fullName}
                </span>
              </div>

              {/* ID relevance & Phone directly under name of person */}
              <div className="bg-slate-50 border border-slate-100 p-2.5 rounded-xl space-y-1">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>REG ID:</span>
                  <span className="font-bold text-purple-700">{registration.id}</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>PHONE NO:</span>
                  <span className="font-bold text-slate-800">{registration.mobileNumber}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block">PASS CATEGORY</span>
                  <span className="text-xs font-semibold font-orbitron text-brand-purple mt-0.5 block truncate uppercase">
                    {registration.occupation}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block">VENUE</span>
                  <span className="text-xs font-semibold font-sans text-slate-800 mt-0.5 block truncate uppercase">
                    CUSAT, Kochi
                  </span>
                </div>
              </div>
            </div>

            {/* Dashed line on Ticket stub */}
            <div className="border-t border-dashed border-slate-200 my-1 py-3" />

            {/* Event Time & Organizer */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-left">
              <div>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block">DATE</span>
                <span className="text-xs font-semibold text-slate-800 mt-0.5 block truncate">
                  July 15, 2026
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block">TICKET SERIAL</span>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5 block truncate">
                  {registration.ticketNumber}
                </span>
              </div>
            </div>

            {/* Center QR Code Image Area */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex flex-col items-center justify-center mb-1 relative">
              {qrUrl ? (
                <img 
                  src={qrUrl} 
                  alt="Entry pass scan token" 
                  className="w-32 h-32 select-none"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center animate-pulse">
                  <span className="text-[10px] font-mono text-slate-400">QR GENERATOR ACTIVE</span>
                </div>
              )}
              <span className="text-[8px] font-mono text-slate-400 tracking-wider text-center block mt-2 uppercase">
                SECURE QR GATE PASS
              </span>
            </div>

          </div>
        </div>

        {/* Right Column: Clean Actions */}
        <div className="md:col-span-5 flex flex-col gap-4 text-left">
          
          <div className="bg-slate-50 border border-slate-150/80 p-6 rounded-3xl space-y-4">
            <h3 className="text-xs font-mono tracking-[0.2em] text-slate-400 uppercase font-bold">PASS MANAGEMENT</h3>
            
            {/* Save Button (No save png label, just Save Ticket) */}
            <button
              onClick={handleSavePNG}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-2xl font-sans font-semibold text-xs text-slate-800 transition-all duration-300 shadow-sm"
            >
              <span className="flex items-center gap-2.5">
                <Download size={15} className="text-purple-600" />
                <span>Save Entry Pass</span>
              </span>
              <span className="text-[10px] font-mono text-purple-500 font-bold">SAVE</span>
            </button>

            {/* Share to WhatsApp with beautiful WhatsApp Icon */}
            <button
              onClick={handleShareWhatsApp}
              className="w-full flex items-center justify-between p-4 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-2xl font-sans font-semibold text-xs text-slate-800 transition-all duration-300 shadow-sm"
            >
              <span className="flex items-center gap-2.5">
                {/* Custom Inline WhatsApp SVG Icon */}
                <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 text-emerald-500 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.706 1.458h.013c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <span>Share Entry ID on WhatsApp</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">SHARE</span>
            </button>
          </div>

          {/* Clean Simplified Note */}
          <div className="p-5 bg-[#0f172a] text-slate-100 rounded-3xl text-xs space-y-2 select-none border border-slate-800">
            <span className="font-mono font-bold block uppercase text-[10px] text-pink-500 tracking-wider">// ENTRY NOTIFICATION</span>
            <p className="text-slate-300 leading-relaxed font-sans">
              Please keep this Entry Pass saved on your device. Present it at the program entry or event entry gate at CUSAT Kochi for verification.
            </p>
          </div>

          <button
            onClick={onBackToHome}
            className="w-full py-4 border border-slate-200 hover:bg-slate-50 text-slate-700 font-sans font-semibold text-xs uppercase tracking-wider rounded-2xl transition-colors text-center"
          >
            Return to Homepage
          </button>
        </div>

      </div>
    </div>
  );
}
