import React, { forwardRef } from 'react';
import { Briefcase, TrendingUp, Users, Target, CheckCircle2 } from 'lucide-react';

const SponsorPDFLayout = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div 
      ref={ref} 
      className="w-[800px] overflow-hidden"
      style={{ backgroundColor: '#020617', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}
    >
      <div id="pdf-content" className="w-[800px] p-12 space-y-16">
        
        {/* Cover Page */}
        <div className="h-[1050px] flex flex-col justify-between border-b border-slate-800 pb-12">
          <div className="pt-20">
            <h4 className="text-xl tracking-[0.3em] font-bold mb-4" style={{ color: '#FF208E' }}>SPONSORSHIP BROCHURE</h4>
            <h1 className="text-7xl font-black uppercase mb-6" style={{ color: '#ffffff' }}>
              TECHCON '26
            </h1>
            <h2 className="text-4xl font-bold text-slate-200">Defining the Future</h2>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">National Technology Conference</h3>
            <p className="text-xl text-slate-400">15 July 2026<br/>Ernakulam, Kerala</p>
            <div className="pt-6 border-t border-slate-800">
              <p className="text-sm tracking-widest text-slate-500 uppercase">Organised by</p>
              <p className="text-xl font-bold mt-2">MSF TechFed Kerala</p>
            </div>
            <p className="text-lg font-bold" style={{ color: '#782DFF' }}>Partnering for Kerala's Next Technology Revolution</p>
          </div>
        </div>

        {/* Page 2: About & Why Partner */}
        <div className="h-[1050px] flex flex-col gap-12 border-b border-slate-800 pb-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-bold">The Future Starts Here.</h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              Technology has become the driving force behind every industry, every business, and every society. The organizations shaping tomorrow are those investing in innovation today.
            </p>
            <p className="text-xl text-slate-300 leading-relaxed">
              When you partner with TECHCON, you don't simply support an event. You become part of Kerala's technology revolution.
            </p>
          </div>
          
          <div className="flex gap-8 mt-12">
            <div className="flex-1 p-8 rounded-2xl border border-slate-700" style={{ backgroundColor: '#0f172a' }}>
              <h3 className="text-3xl font-bold mb-6">Invest in Innovation.</h3>
              <ul className="space-y-4 text-lg text-slate-300">
                <li className="flex items-center gap-3"><CheckCircle2 size={20} color="#782DFF" /> Increase brand visibility</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} color="#782DFF" /> Recruit future talent</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} color="#782DFF" /> Launch innovative products</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} color="#782DFF" /> Generate quality business leads</li>
                <li className="flex items-center gap-3"><CheckCircle2 size={20} color="#782DFF" /> Position as a technology leader</li>
              </ul>
            </div>
            
            <div className="w-1/3 p-8 rounded-2xl text-white flex flex-col justify-center space-y-8" style={{ backgroundColor: '#782DFF' }}>
              <div>
                <h4 className="text-5xl font-black mb-1">10,000+</h4>
                <span className="text-sm uppercase tracking-widest font-mono">Participants</span>
              </div>
              <div>
                <h4 className="text-5xl font-black mb-1">200+</h4>
                <span className="text-sm uppercase tracking-widest font-mono">Colleges</span>
              </div>
              <div>
                <h4 className="text-5xl font-black mb-1">50+</h4>
                <span className="text-sm uppercase tracking-widest font-mono">Startups</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page 3: Sponsorship Packages */}
        <div className="min-h-[1050px] pb-12">
          <h2 className="text-4xl font-bold mb-10">Sponsorship Packages</h2>
          
          <div className="flex flex-wrap gap-8 mb-12">
            
            {/* Title */}
            <div className="w-[47%] border-2 p-8 rounded-2xl" style={{ backgroundColor: '#1e1b4b', borderColor: '#782DFF' }}>
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#782DFF' }}>1 Exclusive Slot</span>
              <h3 className="text-3xl font-bold mt-2 mb-4">Title Sponsor</h3>
              <p className="text-4xl font-black text-white mb-6">₹2,50,000</p>
              <ul className="space-y-3 text-lg text-slate-300">
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full" style={{ backgroundColor: '#782DFF' }} /> "TECHCON '26 Powered By" Branding</li>
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full" style={{ backgroundColor: '#782DFF' }} /> Prime Logo Placement</li>
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full" style={{ backgroundColor: '#782DFF' }} /> 10-Minute Speaking Opportunity</li>
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full" style={{ backgroundColor: '#782DFF' }} /> Premium Exhibition Stall (6m×3m)</li>
              </ul>
            </div>
            
            {/* Platinum */}
            <div className="w-[47%] border p-8 rounded-2xl" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>2 Slots</span>
              <h3 className="text-3xl font-bold mt-2 mb-4">Platinum</h3>
              <p className="text-4xl font-black text-white mb-6">₹1,00,000</p>
              <ul className="space-y-3 text-lg text-slate-300">
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full bg-slate-500" /> Premium Logo Placement</li>
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full bg-slate-500" /> Keynote Speaking Opportunity</li>
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full bg-slate-500" /> Premium Exhibition Stall</li>
              </ul>
            </div>
            
            {/* Gold */}
            <div className="w-[47%] border p-8 rounded-2xl" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#f59e0b' }}>5 Slots</span>
              <h3 className="text-3xl font-bold mt-2 mb-4">Gold</h3>
              <p className="text-4xl font-black mb-6" style={{ color: '#f59e0b' }}>₹50,000</p>
              <ul className="space-y-3 text-lg text-slate-300">
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full bg-amber-500" /> Logo Placement</li>
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full bg-amber-500" /> Exhibition Stall</li>
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full bg-amber-500" /> Event & Website Branding</li>
              </ul>
            </div>
            
            {/* Silver */}
            <div className="w-[47%] border p-8 rounded-2xl" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
              <span className="text-sm font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>10 Slots</span>
              <h3 className="text-3xl font-bold mt-2 mb-4">Silver</h3>
              <p className="text-4xl font-black text-white mb-6">₹25,000</p>
              <ul className="space-y-3 text-lg text-slate-300">
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full bg-slate-500" /> Event Branding</li>
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full bg-slate-500" /> Website Branding</li>
                <li className="flex items-start gap-2"><div className="mt-2 w-2 h-2 rounded-full bg-slate-500" /> Shared Exhibition Counter</li>
              </ul>
            </div>

          </div>

          <h2 className="text-2xl font-bold mb-6 pt-8 border-t border-slate-800">Partnership Options</h2>
          <div className="flex flex-wrap gap-6">
            <div className="w-[47%] p-6 border rounded-xl" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
              <p className="font-bold text-xl mb-2">Knowledge Partner</p>
              <p className="text-2xl font-bold" style={{ color: '#782DFF' }}>₹75,000</p>
            </div>
            <div className="w-[47%] p-6 border rounded-xl" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
              <p className="font-bold text-xl mb-2">Recruitment Partner</p>
              <p className="text-2xl font-bold" style={{ color: '#FF208E' }}>₹75,000</p>
            </div>
            <div className="w-[47%] p-6 border rounded-xl" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
              <p className="font-bold text-xl mb-2">Innovation Partner</p>
              <p className="text-2xl font-bold" style={{ color: '#13C2C2' }}>₹50,000</p>
            </div>
            <div className="w-[47%] p-6 border rounded-xl" style={{ backgroundColor: '#0f172a', borderColor: '#334155' }}>
              <p className="font-bold text-xl mb-2">Delegate Kit Sponsor</p>
              <p className="text-white text-2xl font-bold">₹35,000</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

SponsorPDFLayout.displayName = 'SponsorPDFLayout';
export default SponsorPDFLayout;
