import { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, MapPin } from 'lucide-react';
import TechLoadingModal from './TechLoadingModal';

export default function Timeline() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");

  const schedule = [
    { time: "09:00 AM", title: "Registration & Breakfast", details: "Check-in at the main desk, collect your delegate kits, and enjoy networking over breakfast.", location: "Main Hall" },
    { time: "10:30 AM", title: "Inaugural Ceremony", details: "Official kickoff of TECHCON '26 with keynote speeches from industry leaders.", location: "Auditorium A" },
    { time: "12:00 PM", title: "AI Summit", details: "Deep dive into governance and AI integration.", location: "Hall B" },
    { time: "02:00 PM", title: "Hackathon Kickoff", details: "Teams assemble and begin building hardware and software prototypes.", location: "Innovation Hub" },
    { time: "05:00 PM", title: "Pro Night", details: "Closing ceremonies, music, and entertainment.", location: "Open Air Theatre" }
  ];

  return (
    <section 
      id="timeline" 
      className="py-24 sm:py-32 px-6 md:px-12 relative overflow-hidden"
    >
      {/* Background Soft Blobs */}
      <div className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-pink-100/30 to-purple-100/20 blur-[110px] top-40 -right-48 pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center mb-16">
        <span className="text-xs font-mono font-bold tracking-[0.25em] text-brand-purple uppercase block mb-3">
          // EXPERIENCE TIMELINE
        </span>
        <h2 className="text-3xl sm:text-4xl font-orbitron font-bold tracking-[0.06em] text-white mb-5 uppercase">
          The Schedule
        </h2>
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-slate-800 -translate-x-1/2" />

        <div className="space-y-8 relative">
          {schedule.map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative group cursor-pointer ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              onClick={() => {
                setModalTitle(item.title);
                setModalOpen(true);
              }}
            >
              {/* Center Dot */}
              <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-brand-dark border-2 border-brand-purple shadow-[0_0_10px_rgba(120,45,255,0.5)] -translate-x-1/2 mt-6 md:mt-0 group-hover:scale-125 group-hover:bg-brand-pink group-hover:border-brand-pink transition-all" />

              {/* Empty side for layout */}
              <div className="hidden md:block md:w-1/2" />

              {/* Content Card */}
              <div className={`w-full md:w-1/2 pl-20 md:pl-0 flex ${i % 2 === 0 ? 'md:pr-12 md:justify-end' : 'md:pl-12 md:justify-start'}`}>
                <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 w-full group-hover:border-brand-purple/50 transition-colors shadow-lg relative overflow-hidden">
                  <div className="flex items-center gap-3 text-brand-pink font-mono text-xs font-bold mb-2">
                    <Clock size={14} />
                    <span>{item.time}</span>
                  </div>
                  <h4 className="text-lg font-orbitron font-bold text-white uppercase group-hover:text-brand-purple transition-colors">
                    {item.title}
                  </h4>
                  
                  {/* Hover Reveal Details */}
                  <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-all duration-300 ease-out mt-0 group-hover:mt-4">
                    <div className="overflow-hidden">
                      <p className="text-sm font-sans text-slate-400 leading-relaxed mb-3">
                        {item.details}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-brand-blue font-mono uppercase">
                        <MapPin size={12} />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <TechLoadingModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        title={modalTitle}
      />
    </section>
  );
}
