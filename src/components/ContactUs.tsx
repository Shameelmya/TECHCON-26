import { motion } from 'motion/react';
import { Phone, MessageCircle, Instagram, Facebook, Mail, User } from 'lucide-react';

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
                <h3 className="text-base sm:text-lg font-orbitron font-bold text-white mb-0.5">Name 1</h3>
                <p className="text-[9px] sm:text-[10px] font-mono text-brand-pink uppercase tracking-widest font-bold mb-1">Event Coordinator</p>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">+91 98765 43210</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-emerald-500 border border-slate-700 flex items-center justify-center text-white transition-all shadow-md shrink-0"
              >
                <MessageCircle size={16} />
              </a>
              <a 
                href="tel:+919876543210"
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
                <h3 className="text-base sm:text-lg font-orbitron font-bold text-white mb-0.5">Name 2</h3>
                <p className="text-[9px] sm:text-[10px] font-mono text-brand-blue uppercase tracking-widest font-bold mb-1">Program Director</p>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">+91 98765 43211</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href="https://wa.me/919876543211"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-emerald-500 border border-slate-700 flex items-center justify-center text-white transition-all shadow-md shrink-0"
              >
                <MessageCircle size={16} />
              </a>
              <a 
                href="tel:+919876543211"
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
                <h3 className="text-base sm:text-lg font-orbitron font-bold text-white mb-0.5">Name 3</h3>
                <p className="text-[9px] sm:text-[10px] font-mono text-brand-pink uppercase tracking-widest font-bold mb-1">Operations Head</p>
                <p className="text-xs sm:text-sm text-slate-400 font-mono">+91 98765 43212</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <a 
                href="https://wa.me/919876543212"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-slate-800 hover:bg-emerald-500 border border-slate-700 flex items-center justify-center text-white transition-all shadow-md shrink-0"
              >
                <MessageCircle size={16} />
              </a>
              <a 
                href="tel:+919876543212"
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
          className="flex flex-col gap-6"
        >
          {/* Social Links */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-[32px] p-8 shadow-[0_0_30px_rgba(255,32,142,0.1)] flex flex-col justify-center h-full hover:border-brand-pink/50 transition-colors">
            <h4 className="text-xl font-orbitron font-bold text-white mb-6 uppercase tracking-wide">Connect With Us</h4>
            
            <div className="grid grid-cols-3 gap-4">
              <a href="#" className="flex flex-col items-center justify-center gap-3 bg-slate-800/50 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 text-slate-400 hover:text-white aspect-square rounded-2xl transition-all duration-300 group border border-slate-700/50 hover:border-transparent">
                <Instagram size={28} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono tracking-wider font-bold">INSTA</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center gap-3 bg-slate-800/50 hover:bg-blue-600 text-slate-400 hover:text-white aspect-square rounded-2xl transition-all duration-300 group border border-slate-700/50 hover:border-transparent">
                <Facebook size={28} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono tracking-wider font-bold">FB</span>
              </a>
              <a href="#" className="flex flex-col items-center justify-center gap-3 bg-slate-800/50 hover:bg-white text-slate-400 hover:text-black aspect-square rounded-2xl transition-all duration-300 group border border-slate-700/50 hover:border-transparent">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16" className="group-hover:scale-110 transition-transform">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
                </svg>
                <span className="text-[10px] font-mono tracking-wider font-bold">X</span>
              </a>
            </div>
          </div>

          {/* Quick Info */}
          <a href="mailto:hello@techcon26.com" className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-[32px] p-6 shadow-lg flex items-center justify-center hover:bg-slate-800/80 transition-colors cursor-pointer group hover:border-brand-blue/50">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0 group-hover:scale-110 transition-transform">
                <Mail size={18} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Email Support</span>
                <span className="text-sm font-sans font-medium text-slate-300 group-hover:text-white transition-colors">hello@techcon26.com</span>
              </div>
            </div>
          </a>
        </motion.div>
      </div>

    </section>
  );
}
