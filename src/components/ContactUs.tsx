import { motion } from 'motion/react';
import { Phone, MessageCircle, Instagram, Facebook, Twitter, Mail, MapPin } from 'lucide-react';

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
        
        {/* Contact Person Card */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-[32px] p-8 shadow-[0_0_40px_rgba(120,45,255,0.1)] flex flex-col items-center text-center relative overflow-hidden group hover:border-brand-purple/50 transition-colors"
        >
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-purple/5 to-transparent pointer-events-none" />
          
          <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-slate-800 shadow-xl mb-6 group-hover:border-brand-purple transition-colors relative z-10">
            {/* Fallback avatar if no photo is provided */}
            <img 
              src="https://api.dicebear.com/9.x/avataaars/svg?seed=Felix&backgroundColor=782dff" 
              alt="Coordinator" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <h3 className="text-2xl font-orbitron font-bold text-white mb-1 relative z-10">John Doe</h3>
          <p className="text-brand-pink font-mono text-xs uppercase tracking-widest font-bold mb-6 relative z-10">Event Coordinator</p>
          
          <p className="text-slate-300 text-lg font-bold font-mono mb-8 relative z-10 tracking-wider">
            +91 98765 43210
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full relative z-10">
            <a 
              href="tel:+919876543210"
              className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-brand-purple text-white py-3.5 px-6 rounded-full transition-all duration-300 shadow-lg font-bold font-sans text-sm"
            >
              <Phone size={18} />
              <span>Call Now</span>
            </a>
            <a 
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/20 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 py-3.5 px-6 rounded-full transition-all duration-300 shadow-lg font-bold font-sans text-sm"
            >
              <MessageCircle size={18} />
              <span>WhatsApp</span>
            </a>
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
          <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800/80 rounded-[32px] p-6 shadow-lg flex items-center justify-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue shrink-0">
                <Mail size={18} />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">Email Support</span>
                <span className="text-sm font-sans font-medium text-slate-300">hello@techcon26.com</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </section>
  );
}
