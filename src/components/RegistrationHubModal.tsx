import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Ticket, ChevronRight, Lock } from 'lucide-react';

interface RegistrationHubModalProps {
  onClose: () => void;
  onSelectEvent: () => void;
  onSelectVolunteer: () => void;
}

export default function RegistrationHubModal({ 
  onClose, 
  onSelectEvent, 
  onSelectVolunteer
}: RegistrationHubModalProps) {
  
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-xl">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] pointer-events-none" />

          {/* Header */}
          <div className="flex items-center justify-between p-6 sm:p-8 border-b border-slate-800 relative z-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-orbitron font-bold text-white tracking-wide">
                Registration <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-blue">Portal</span>
              </h2>
              <p className="text-slate-400 text-sm mt-2 font-sans max-w-lg">
                Choose your path. Whether you're here to experience the future or help build it, your journey starts here.
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-700 rounded-full transition-colors group self-start"
            >
              <X size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            
            {/* Event Registration Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelectEvent}
              className="group relative overflow-hidden rounded-2xl p-px text-left h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue to-brand-purple opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-slate-900/95 p-6 sm:p-8 rounded-2xl flex flex-col justify-between overflow-hidden backdrop-blur-sm border border-slate-800 group-hover:border-transparent transition-colors">
                
                {/* Background Decoration */}
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-blue/10 rounded-full blur-2xl group-hover:bg-brand-blue/20 transition-colors" />
                
                <div>
                  <div className="w-14 h-14 bg-brand-blue/20 rounded-2xl flex items-center justify-center mb-6 border border-brand-blue/30 group-hover:scale-110 transition-transform duration-500">
                    <Ticket className="w-7 h-7 text-brand-blue" />
                  </div>
                  <h3 className="text-2xl font-orbitron font-bold text-white mb-3">Event Registration</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">
                    Get your boarding pass for Techcon '26. Experience groundbreaking keynotes, workshops, and the future of technology.
                  </p>
                </div>
                
                <div className="flex items-center text-brand-blue font-bold text-sm tracking-wide group-hover:translate-x-2 transition-transform duration-300">
                  <span>Enter Portal</span>
                  <ChevronRight size={18} className="ml-1" />
                </div>
              </div>
            </motion.button>

            {/* Volunteer Registration Card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onSelectVolunteer}
              className="group relative overflow-hidden rounded-2xl p-px text-left h-full"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-brand-pink to-brand-purple opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full bg-slate-900/95 p-6 sm:p-8 rounded-2xl flex flex-col justify-between overflow-hidden backdrop-blur-sm border border-slate-800 group-hover:border-transparent transition-colors">
                
                {/* Background Decoration */}
                <div className="absolute -right-12 -top-12 w-48 h-48 bg-brand-pink/10 rounded-full blur-2xl group-hover:bg-brand-pink/20 transition-colors" />
                
                <div>
                  <div className="w-14 h-14 bg-brand-pink/20 rounded-2xl flex items-center justify-center mb-6 border border-brand-pink/30 group-hover:scale-110 transition-transform duration-500">
                    <UserPlus className="w-7 h-7 text-brand-pink" />
                  </div>
                  <h3 className="text-2xl font-orbitron font-bold text-white mb-3">Volunteer Registration</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">
                    Join the core team behind Techcon '26. Gain hands-on experience, network with leaders, and help build the future.
                  </p>
                </div>
                
                <div className="flex items-center text-brand-pink font-bold text-sm tracking-wide group-hover:translate-x-2 transition-transform duration-300">
                  <span>Join the Team</span>
                  <ChevronRight size={18} className="ml-1" />
                </div>
              </div>
            </motion.button>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
