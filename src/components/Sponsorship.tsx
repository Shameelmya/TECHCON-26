import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, TrendingUp, Users, Target, Rocket, BookOpen, Briefcase, Lightbulb, Package, Download, Send } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import SponsorPDFLayout from './SponsorPDFLayout';

interface SponsorshipProps {
  onClose: () => void;
}

export default function Sponsorship({ onClose }: SponsorshipProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    plan: 'Title Sponsor - ₹2.5L'
  });

  const handleSend = () => {
    const text = `Hi Techcon, we are interested in the ${formData.plan} sponsorship plan. Our company is ${formData.companyName}. Contact person: ${formData.contactPerson}, Email: ${formData.email}. Please get back to us.`;
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/917902993844?text=${encoded}`, '_blank');
    setIsPopupOpen(false);
  };

  const handleDownloadPDF = async () => {
    if (!pdfRef.current || isDownloading) return;
    try {
      setIsDownloading(true);
      
      // We don't need to temporarily unhide because it's always rendered but visually hidden
      const canvas = await html2canvas(pdfRef.current, { 
        scale: 2, 
        useCORS: true, 
        logging: false,
        backgroundColor: '#020617', // force a dark slate-950 background
      });

      const imgData = canvas.toDataURL('image/png');
      
      // A4 size: 210mm x 297mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight(); // approx 297mm

      // For a 800px width canvas, height is 3150px (approx 3.9 pages)
      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Add subsequent pages
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      pdf.save('TECHCON_26_Sponsorship_Brochure.pdf');
    } catch (e) {
      console.error("PDF generation failed", e);
    } finally {
      setIsDownloading(false);
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="w-full h-full min-h-[85vh] mx-auto bg-brand-dark/95 backdrop-blur-2xl border border-slate-800 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden font-sans flex flex-col">
      
      {/* Background glowing effects */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-brand-purple/10 blur-[120px] -top-20 -right-20 pointer-events-none" />
      <div className="absolute w-[600px] h-[600px] rounded-full bg-brand-pink/5 blur-[150px] bottom-10 -left-20 pointer-events-none" />
      
      {/* Header */}
      <div className="shrink-0 z-40 bg-brand-dark/80 backdrop-blur-xl border-b border-slate-800/80 px-6 sm:px-10 py-5 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-brand-pink uppercase font-bold">SPONSORSHIP BROCHURE</span>
          <h2 className="text-xl sm:text-3xl font-orbitron font-bold text-white mt-1">TECHCON '26</h2>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
          >
            {isDownloading ? (
              <span className="animate-pulse">Generating PDF...</span>
            ) : (
              <>
                <Download size={14} />
                <span className="hidden sm:inline">Download PDF</span>
              </>
            )}
          </button>
          <button 
            onClick={onClose}
            className="p-2.5 bg-brand-black hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors border border-slate-800"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Brochure Content */}
      <div className="flex-1 p-6 sm:p-12 overflow-y-auto space-y-24 scroll-smooth">
        
        {/* Cover / Page 2 */}
        <motion.section 
          initial="hidden" animate="show" variants={staggerContainer}
          className="text-center max-w-4xl mx-auto space-y-8 pt-8"
        >
          <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl lg:text-7xl font-orbitron font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue uppercase tracking-tight leading-tight">
            The Future Starts Here.
          </motion.h1>
          <motion.p variants={fadeUp} className="text-slate-400 leading-relaxed font-light text-lg sm:text-xl max-w-2xl mx-auto">
            Technology has become the driving force behind every industry, every business, and every society. The organizations shaping tomorrow are those investing in innovation today.
          </motion.p>
          <motion.p variants={fadeUp} className="text-slate-300 leading-relaxed text-lg sm:text-xl font-medium">
            When you partner with TECHCON, you don't simply support an event.<br/>
            <span className="text-white font-black block mt-2 text-2xl">You become part of Kerala's technology revolution.</span>
          </motion.p>
        </motion.section>

        {/* Why Partner Bento Grid */}
        <motion.section 
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="space-y-8"
        >
          <div className="text-center mb-10">
            <h3 className="text-3xl sm:text-4xl font-orbitron font-bold text-white mb-3">Invest in Innovation.</h3>
            <p className="text-slate-400 text-base">Partner with the People Building Tomorrow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Massive Stat Block */}
            <motion.div variants={fadeUp} className="md:col-span-1 bg-gradient-to-br from-brand-purple/20 to-brand-blue/10 p-8 rounded-[32px] border border-brand-purple/20 flex flex-col justify-center text-center shadow-[0_0_30px_rgba(120,45,255,0.1)] hover:shadow-[0_0_40px_rgba(120,45,255,0.2)] transition-shadow">
              <div className="space-y-8">
                <div>
                  <span className="text-5xl font-black text-white mb-2 block">10,000+</span>
                  <span className="text-xs font-mono tracking-widest text-brand-purple uppercase font-bold">Participants</span>
                </div>
                <div className="w-16 h-px bg-brand-purple/30 mx-auto" />
                <div>
                  <span className="text-5xl font-black text-white mb-2 block">200+</span>
                  <span className="text-xs font-mono tracking-widest text-brand-pink uppercase font-bold">Colleges</span>
                </div>
                <div className="w-16 h-px bg-brand-pink/30 mx-auto" />
                <div>
                  <span className="text-5xl font-black text-white mb-2 block">50+</span>
                  <span className="text-xs font-mono tracking-widest text-brand-blue uppercase font-bold">Startups</span>
                </div>
              </div>
            </motion.div>
            
            {/* Bento Benefits Grid */}
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: <TrendingUp size={24} className="text-brand-pink" />, title: "Increase Visibility", desc: "Gain massive exposure across our expansive digital and physical real estate." },
                { icon: <Users size={24} className="text-brand-blue" />, title: "Recruit Talent", desc: "Direct access to Kerala's most engaged and brilliant engineering students." },
                { icon: <Rocket size={24} className="text-brand-purple" />, title: "Launch Products", desc: "The perfect demographic and stage to unveil your next big innovation." },
                { icon: <Target size={24} className="text-emerald-400" />, title: "Generate Leads", desc: "High-quality business and B2B leads generated directly on the exhibition floor." }
              ].map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-slate-900/50 p-6 rounded-[24px] border border-slate-800 hover:bg-slate-800/50 transition-colors group">
                  <div className="w-12 h-12 rounded-2xl bg-slate-950 flex items-center justify-center mb-4 border border-slate-800 group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Sponsorship Packages */}
        <motion.section 
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
          className="space-y-12"
        >
          <div className="text-center">
            <h3 className="text-3xl sm:text-4xl font-orbitron font-bold text-white mb-3">Sponsorship Opportunities</h3>
            <p className="text-slate-400 text-base">Choose the perfect tier to amplify your brand's presence.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            {/* Title Sponsor - RECOMMENDED */}
            <motion.div variants={fadeUp} className="relative bg-gradient-to-b from-brand-dark to-slate-950 border-2 border-brand-purple rounded-3xl p-8 flex flex-col h-full transform lg:-translate-y-4 shadow-[0_0_40px_rgba(120,45,255,0.15)] order-1 lg:order-none z-10">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-brand-pink to-brand-purple px-4 py-1 rounded-full shadow-lg">
                <span className="text-[10px] font-bold text-white tracking-widest uppercase">Recommended</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-brand-purple tracking-widest uppercase mb-1 mt-2">1 Exclusive Slot</span>
              <h4 className="text-2xl font-bold text-white mb-2">Title Sponsor</h4>
              <div className="mb-8">
                <span className="text-3xl lg:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-purple">₹2,50,000</span>
              </div>
              <ul className="space-y-4 flex-1 mb-8">
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-brand-purple shrink-0" /><span>"TECHCON '26 Powered By" Branding</span></li>
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-brand-purple shrink-0" /><span>Prime Logo Placement</span></li>
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-brand-purple shrink-0" /><span>10-Minute Speaking Opportunity</span></li>
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-brand-purple shrink-0" /><span>Premium Exhibition Stall (6m×3m)</span></li>
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-brand-purple shrink-0" /><span>Delegate Kit & ID Branding</span></li>
              </ul>
              <button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, plan: 'Title Sponsor - ₹2.5L' }));
                  setIsPopupOpen(true);
                }}
                className="w-full py-4 bg-gradient-to-r from-brand-pink to-brand-purple hover:opacity-90 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-opacity shadow-[0_0_20px_rgba(120,45,255,0.4)]"
              >
                Select Title Plan
              </button>
            </motion.div>

            {/* Platinum Sponsor */}
            <motion.div variants={fadeUp} className="bg-slate-900/80 border border-slate-700/80 rounded-3xl p-8 flex flex-col h-full hover:border-slate-500 transition-colors order-2 lg:order-none">
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase mb-1">2 Slots</span>
              <h4 className="text-2xl font-bold text-white mb-2">Platinum</h4>
              <div className="mb-8">
                <span className="text-3xl lg:text-4xl font-black text-white">₹1,00,000</span>
              </div>
              <ul className="space-y-4 flex-1 mb-8">
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-slate-500 shrink-0" /><span>Premium Logo Placement</span></li>
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-slate-500 shrink-0" /><span>Keynote Speaking Opportunity</span></li>
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-slate-500 shrink-0" /><span>Premium Exhibition Stall</span></li>
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-slate-500 shrink-0" /><span>Website Branding</span></li>
              </ul>
              <button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, plan: 'Platinum Sponsor - ₹1L' }));
                  setIsPopupOpen(true);
                }}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Select Platinum
              </button>
            </motion.div>

            {/* Gold Sponsor */}
            <motion.div variants={fadeUp} className="bg-slate-900/80 border border-slate-700/80 rounded-3xl p-8 flex flex-col h-full hover:border-amber-500/50 transition-colors order-3 lg:order-none">
              <span className="text-[10px] font-mono font-bold text-amber-500 tracking-widest uppercase mb-1">5 Slots</span>
              <h4 className="text-2xl font-bold text-white mb-2">Gold</h4>
              <div className="mb-8">
                <span className="text-3xl lg:text-4xl font-black text-amber-500">₹50,000</span>
              </div>
              <ul className="space-y-4 flex-1 mb-8">
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-amber-600 shrink-0" /><span>Logo Placement</span></li>
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-amber-600 shrink-0" /><span>Exhibition Stall</span></li>
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-amber-600 shrink-0" /><span>Event Branding</span></li>
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-amber-600 shrink-0" /><span>Website Branding</span></li>
              </ul>
              <button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, plan: 'Gold Sponsor - ₹50K' }));
                  setIsPopupOpen(true);
                }}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Select Gold
              </button>
            </motion.div>

            {/* Silver Sponsor */}
            <motion.div variants={fadeUp} className="bg-slate-900/80 border border-slate-700/80 rounded-3xl p-8 flex flex-col h-full hover:border-slate-500 transition-colors order-4 lg:order-none">
              <span className="text-[10px] font-mono font-bold text-slate-400 tracking-widest uppercase mb-1">10 Slots</span>
              <h4 className="text-2xl font-bold text-white mb-2">Silver</h4>
              <div className="mb-8">
                <span className="text-3xl lg:text-4xl font-black text-slate-300">₹25,000</span>
              </div>
              <ul className="space-y-4 flex-1 mb-8">
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-slate-600 shrink-0" /><span>Event Branding</span></li>
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-slate-600 shrink-0" /><span>Website Branding</span></li>
                <li className="text-sm text-slate-300 flex items-start gap-3"><CheckCircle2 size={18} className="text-slate-600 shrink-0" /><span>Shared Exhibition Counter</span></li>
              </ul>
              <button 
                onClick={() => {
                  setFormData(prev => ({ ...prev, plan: 'Silver Sponsor - ₹25K' }));
                  setIsPopupOpen(true);
                }}
                className="w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-colors"
              >
                Select Silver
              </button>
            </motion.div>
          </div>
        </motion.section>

        {/* Additional Partnerships */}
        <motion.section 
          initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl sm:text-3xl font-orbitron font-bold text-white mb-3">Partnership Options</h3>
            <p className="text-slate-400 text-base">Specialized modules to position your brand precisely.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {[
              { icon: <BookOpen size={20} className="text-brand-purple" />, title: "Knowledge Partner", price: "₹75,000", color: "from-brand-purple/20" },
              { icon: <Briefcase size={20} className="text-brand-pink" />, title: "Recruitment Partner", price: "₹75,000", color: "from-brand-pink/20" },
              { icon: <Lightbulb size={20} className="text-brand-blue" />, title: "Innovation Partner", price: "₹50,000", color: "from-brand-blue/20" },
              { icon: <Package size={20} className="text-emerald-400" />, title: "Delegate Kit Sponsor", price: "₹35,000", color: "from-emerald-400/20" }
            ].map((p, i) => (
              <motion.div key={i} variants={fadeUp} className={`bg-gradient-to-br ${p.color} to-slate-900/50 p-6 rounded-[24px] border border-slate-800 hover:border-slate-600 transition-colors group cursor-pointer`}
                onClick={() => {
                  setFormData(prev => ({ ...prev, plan: `${p.title} - ${p.price}` }));
                  setIsPopupOpen(true);
                }}
              >
                <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center mb-4 border border-slate-800 group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <h5 className="font-bold text-white mb-1">{p.title}</h5>
                <span className="text-white font-black text-xl">{p.price}</span>
              </motion.div>
            ))}

          </div>
        </motion.section>

      </div>

      {/* Footer sticky action */}
      <div className="shrink-0 bg-slate-950 p-6 border-t border-slate-800/80 flex justify-center z-40 relative">
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-brand-purple/50 to-transparent" />
        <button 
          onClick={() => setIsPopupOpen(true)}
          className="px-12 py-4 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue rounded-full text-white font-bold uppercase tracking-wider text-sm shadow-[0_0_30px_rgba(120,45,255,0.4)] hover:shadow-[0_0_50px_rgba(255,32,142,0.6)] transition-all transform hover:-translate-y-1"
        >
          Become a Sponsor
        </button>
      </div>

      {/* Hidden PDF Layout */}
      <div className="fixed top-0 left-0 w-[800px] h-[3150px] -translate-x-[5000px] z-[-50]">
        <SponsorPDFLayout ref={pdfRef} />
      </div>

      {/* Pop-up form for Sponsor Now */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-brand-dark/95 border border-slate-700/80 w-full max-w-lg rounded-[32px] shadow-[0_0_50px_rgba(120,45,255,0.15)] overflow-hidden flex flex-col relative"
            >
              {/* Background glows for the popup */}
              <div className="absolute w-[300px] h-[300px] rounded-full bg-brand-purple/20 blur-[80px] -top-20 -right-20 pointer-events-none" />
              
              <div className="px-8 py-6 border-b border-slate-800/80 flex justify-between items-center relative z-10">
                <div>
                  <h3 className="font-orbitron font-bold text-white tracking-wider text-lg">Sponsorship Inquiry</h3>
                  <p className="text-xs text-slate-400 mt-1">Fill out the details below to proceed.</p>
                </div>
                <button onClick={() => setIsPopupOpen(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-800/50 hover:bg-slate-800 p-2 rounded-full">
                  <X size={18} />
                </button>
              </div>
              
              <div className="p-8 space-y-6 relative z-10">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-1">Company Name *</label>
                  <input 
                    type="text" 
                    value={formData.companyName}
                    onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder:text-slate-600"
                    placeholder="Enter your organization name"
                  />
                </div>
                
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-1">Contact Person *</label>
                  <input 
                    type="text" 
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                    className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder:text-slate-600"
                    placeholder="John Doe"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-1">Phone *</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder:text-slate-600"
                      placeholder="+91..."
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-1">Email *</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl px-5 py-4 text-sm text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all placeholder:text-slate-600"
                      placeholder="john@company.com"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-1">Selected Plan *</label>
                  <select 
                    value={formData.plan}
                    onChange={(e) => setFormData({...formData, plan: e.target.value})}
                    className="w-full bg-brand-purple/10 border border-brand-purple/30 rounded-2xl px-5 py-4 text-sm font-bold text-white focus:border-brand-purple focus:ring-1 focus:ring-brand-purple outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option>Title Sponsor - ₹2.5L</option>
                    <option>Platinum Sponsor - ₹1L</option>
                    <option>Gold Sponsor - ₹50K</option>
                    <option>Silver Sponsor - ₹25K</option>
                    <option>Knowledge Partner - ₹75K</option>
                    <option>Recruitment Partner - ₹75K</option>
                    <option>Innovation Partner - ₹50K</option>
                    <option>Delegate Kit Sponsor - ₹35K</option>
                    <option>Other / Custom Plan</option>
                  </select>
                </div>

                <button 
                  onClick={handleSend}
                  disabled={!formData.companyName || !formData.contactPerson}
                  className="w-full mt-6 bg-gradient-to-r from-brand-pink via-brand-purple to-brand-blue hover:opacity-90 disabled:opacity-50 disabled:grayscale text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(120,45,255,0.3)] hover:shadow-[0_0_30px_rgba(120,45,255,0.5)] transform hover:-translate-y-0.5"
                >
                  <Send size={18} />
                  <span>Send via WhatsApp</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
