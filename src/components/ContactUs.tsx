import { motion } from 'motion/react';
import { Phone, MessageCircle, Instagram, Linkedin, Mail, User, ArrowUpRight } from 'lucide-react';

export default function ContactUs() {
  return (
    <section id="contact-us" className="py-24 sm:py-32 px-6 md:px-12 relative overflow-hidden bg-brand-dark">
      
      {/* Background blobs */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-tr from-brand-pink/10 to-brand-purple/10 blur-[120px] top-0 left-0 pointer-events-none" />
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-brand-blue/10 to-brand-purple/10 blur-[130px] bottom-0 right-0 pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 text-center mb-16">
        <span className="text-xs font-mono font-bold tracking-[0.25em] text-brand-pink uppercase block mb-3">
          // GET IN TOUCH
        </span>
        <h2 className="text-3xl sm:text-4xl font-orbitron font-bold tracking-[0.06em] text-white mb-5 uppercase">
          Contact Us
        </h2>
        <p className="text-sm font-sans text-slate-400 max-w-lg mx-auto leading-relaxed">
          Have questions about TECHCON '26? Reach out to our dedicated coordinators or connect with us on social media.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        
        {/* Contact Directory */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-4 justify-center"
        >
          {/* Coordinator 1 */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-[24px] p-5 shadow-[0_0_20px_rgba(120,45,255,0.05)] flex items-center justify-between group hover:border-brand-purple/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <User size={24} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-base sm:text-lg font-orbitron font-bold text-white mb-0.5">Jaleel</h3>
                <p className="text-[9px] sm:text-[10px] font-mono text-brand-pink uppercase tracking-widest font-bold mb-1">Chief Coordinator</p>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">+91 98475 10788</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href="https://wa.me/919847510788"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-emerald-500 border border-slate-700 flex items-center justify-center text-white transition-all shadow-md shrink-0"
              >
                <MessageCircle size={16} />
              </a>
              <a 
                href="tel:+919847510788"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-brand-purple border border-slate-700 flex items-center justify-center text-white transition-all shadow-md shrink-0"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>

          {/* Coordinator 2 */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-[24px] p-5 shadow-[0_0_20px_rgba(32,156,255,0.05)] flex items-center justify-between group hover:border-brand-blue/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <User size={24} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-base sm:text-lg font-orbitron font-bold text-white mb-0.5">Nabeel</h3>
                <p className="text-[9px] sm:text-[10px] font-mono text-brand-blue uppercase tracking-widest font-bold mb-1">Lead Coordinator</p>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">+91 96564 35673</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href="https://wa.me/919656435673"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-emerald-500 border border-slate-700 flex items-center justify-center text-white transition-all shadow-md shrink-0"
              >
                <MessageCircle size={16} />
              </a>
              <a 
                href="tel:+919656435673"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-brand-blue border border-slate-700 flex items-center justify-center text-white transition-all shadow-md shrink-0"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>
          {/* Coordinator 3 */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-[24px] p-5 shadow-[0_0_20px_rgba(255,45,120,0.05)] flex items-center justify-between group hover:border-brand-pink/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <User size={24} />
              </div>
              <div className="flex flex-col text-left">
                <h3 className="text-base sm:text-lg font-orbitron font-bold text-white mb-0.5">Aslam vk</h3>
                <p className="text-[9px] sm:text-[10px] font-mono text-brand-pink uppercase tracking-widest font-bold mb-1">Committee Lead</p>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">+91 79029 93844</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href="https://wa.me/917902993844"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-emerald-500 border border-slate-700 flex items-center justify-center text-white transition-all shadow-md shrink-0"
              >
                <MessageCircle size={16} />
              </a>
              <a 
                href="tel:+917902993844"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-brand-pink border border-slate-700 flex items-center justify-center text-white transition-all shadow-md shrink-0"
              >
                <Phone size={16} />
              </a>
            </div>
          </div>
        </motion.div>

        {/* Socials & Info Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-col h-full"
        >
          {/* Mail Form */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-[32px] p-8 shadow-[0_0_30px_rgba(32,156,255,0.1)] flex flex-col h-full hover:border-brand-blue/50 transition-colors">
            <h4 className="text-xl font-orbitron font-bold text-white mb-6 uppercase tracking-wide flex items-center gap-3">
              <Mail className="text-brand-blue" size={20} />
              Mail Us
            </h4>
            
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const name = (form.elements.namedItem('name') as HTMLInputElement).value;
                const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
                window.location.href = `mailto:team@techcon26.org?subject=Inquiry from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}`;
              }} 
              className="flex flex-col gap-4 h-full"
            >
              <input 
                type="text" 
                name="name" 
                required 
                placeholder="Your Name" 
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-blue transition-colors shrink-0" 
              />
              <textarea 
                name="message" 
                required 
                placeholder="Your Message..." 
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-brand-blue resize-none transition-colors flex-grow"
              />
              <button 
                type="submit" 
                className="bg-brand-blue/90 hover:bg-brand-blue text-white font-sans font-semibold tracking-wider py-3.5 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 mt-auto shrink-0"
              >
                Send to team@techcon26.org
              </button>
            </form>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
