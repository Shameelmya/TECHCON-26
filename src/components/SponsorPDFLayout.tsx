import React, { forwardRef } from 'react';

const SponsorPDFLayout = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div 
      ref={ref} 
      className="bg-brand-dark text-white font-sans w-[800px] overflow-hidden hidden"
      style={{ display: 'none' }} // We will render it offscreen before capturing
    >
      <div id="pdf-content" className="w-[800px] p-12 space-y-16 bg-brand-dark">
        {/* Cover Page */}
        <div className="h-[1050px] flex flex-col justify-between border-b border-slate-800 pb-12">
          <div className="pt-20">
            <h4 className="text-xl font-mono text-brand-pink tracking-[0.3em] font-bold mb-4">SPONSORSHIP BROCHURE</h4>
            <h1 className="text-7xl font-orbitron font-black uppercase text-transparent bg-clip-text bg-gradient-to-br from-brand-pink via-brand-purple to-brand-blue mb-6">
              TECHCON '26
            </h1>
            <h2 className="text-4xl font-sans font-bold text-slate-200">Defining the Future</h2>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">National Technology Conference</h3>
            <p className="text-xl text-slate-400">15 July 2026<br/>Ernakulam, Kerala</p>
            <div className="pt-6 border-t border-slate-800">
              <p className="text-sm font-mono tracking-widest text-slate-500 uppercase">Organised by</p>
              <p className="text-xl font-bold mt-2">MSF TechFed Kerala</p>
            </div>
            <p className="text-brand-purple text-lg font-bold">Partnering for Kerala's Next Technology Revolution</p>
          </div>
        </div>

        {/* Page 2: About & Why Partner */}
        <div className="h-[1050px] flex flex-col gap-12 border-b border-slate-800 pb-12">
          <div className="space-y-6">
            <h2 className="text-4xl font-orbitron font-bold">The Future Starts Here.</h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              Technology has become the driving force behind every industry, every business, and every society. The organizations shaping tomorrow are those investing in innovation today.
            </p>
            <p className="text-xl text-slate-300 leading-relaxed">
              When you partner with TECHCON, you don't simply support an event. You become part of Kerala's technology revolution.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 mt-12">
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-700">
              <h3 className="text-3xl font-bold mb-6">Invest in Innovation.</h3>
              <ul className="space-y-4 text-lg text-slate-300">
                <li>• Increase brand visibility</li>
                <li>• Recruit future talent</li>
                <li>• Launch innovative products</li>
                <li>• Generate quality business leads</li>
                <li>• Position as a technology leader</li>
              </ul>
            </div>
            
            <div className="bg-brand-purple p-8 rounded-2xl text-white flex flex-col justify-center space-y-6">
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
          <h2 className="text-4xl font-orbitron font-bold mb-10">Sponsorship Packages</h2>
          
          <div className="grid grid-cols-2 gap-8 mb-12">
            <div className="bg-gradient-to-b from-brand-purple/20 to-slate-900 border-2 border-brand-purple p-8 rounded-2xl">
              <span className="text-sm font-bold text-brand-purple uppercase tracking-widest">1 Exclusive Slot</span>
              <h3 className="text-3xl font-bold mt-2 mb-4">Title Sponsor</h3>
              <p className="text-4xl font-black text-white mb-6">₹2,50,000</p>
              <ul className="space-y-3 text-lg text-slate-300">
                <li>• "TECHCON '26 Powered By" Branding</li>
                <li>• Prime Logo Placement</li>
                <li>• 10-Minute Speaking Opportunity</li>
                <li>• Premium Exhibition Stall (6m×3m)</li>
                <li>• Delegate Kit & ID Branding</li>
              </ul>
            </div>
            
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">2 Slots</span>
              <h3 className="text-3xl font-bold mt-2 mb-4">Platinum</h3>
              <p className="text-4xl font-black text-white mb-6">₹1,00,000</p>
              <ul className="space-y-3 text-lg text-slate-300">
                <li>• Premium Logo Placement</li>
                <li>• Keynote Speaking Opportunity</li>
                <li>• Premium Exhibition Stall</li>
                <li>• Website & Social Media Branding</li>
              </ul>
            </div>
            
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl">
              <span className="text-sm font-bold text-amber-500 uppercase tracking-widest">5 Slots</span>
              <h3 className="text-3xl font-bold mt-2 mb-4">Gold</h3>
              <p className="text-4xl font-black text-amber-500 mb-6">₹50,000</p>
              <ul className="space-y-3 text-lg text-slate-300">
                <li>• Logo Placement</li>
                <li>• Exhibition Stall</li>
                <li>• Event & Website Branding</li>
              </ul>
            </div>
            
            <div className="bg-slate-900 border border-slate-700 p-8 rounded-2xl">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">10 Slots</span>
              <h3 className="text-3xl font-bold mt-2 mb-4">Silver</h3>
              <p className="text-4xl font-black text-white mb-6">₹25,000</p>
              <ul className="space-y-3 text-lg text-slate-300">
                <li>• Event Branding</li>
                <li>• Website Branding</li>
                <li>• Shared Exhibition Counter</li>
              </ul>
            </div>
          </div>

          <h2 className="text-2xl font-orbitron font-bold mb-6 pt-8 border-t border-slate-800">Partnership Options</h2>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-4 border border-slate-700 rounded-xl bg-slate-900">
              <p className="font-bold text-xl">Knowledge Partner</p>
              <p className="text-brand-purple text-lg font-bold">₹75,000</p>
            </div>
            <div className="p-4 border border-slate-700 rounded-xl bg-slate-900">
              <p className="font-bold text-xl">Recruitment Partner</p>
              <p className="text-brand-pink text-lg font-bold">₹75,000</p>
            </div>
            <div className="p-4 border border-slate-700 rounded-xl bg-slate-900">
              <p className="font-bold text-xl">Innovation Partner</p>
              <p className="text-brand-blue text-lg font-bold">₹50,000</p>
            </div>
            <div className="p-4 border border-slate-700 rounded-xl bg-slate-900">
              <p className="font-bold text-xl">Delegate Kit Sponsor</p>
              <p className="text-white text-lg font-bold">₹35,000</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
});

SponsorPDFLayout.displayName = 'SponsorPDFLayout';
export default SponsorPDFLayout;
