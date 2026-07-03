import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageSquare } from 'lucide-react';

const faqs: { question: string; answer: React.ReactNode }[] = [
  {
    question: "What is TECHCON '26?",
    answer: "TECHCON '26 is a premier national technology conference organized by msf TechFed, bringing together students, professionals, and industry leaders to explore the latest advancements in AI, networking, and software engineering."
  },
  {
    question: "Who can attend the conference?",
    answer: "The conference is open to college students, aspiring developers, tech enthusiasts, and early-career professionals who want to learn, network, and build."
  },
  {
    question: "Do I need any prior programming experience?",
    answer: "Not necessarily! While some technical workshops (like the Hackathon) require coding skills, many sessions are beginner-friendly and designed to introduce you to new concepts."
  },
  {
    question: "Do I need registration?",
    answer: (
      <>
        Yes, you must be a registered delegate to attend the conference. Registration is fast and easy. 
        <a href="#register" className="text-brand-blue font-bold ml-1 hover:underline">Register Now</a>
      </>
    )
  },
  {
    question: "I registered but forgot to get my pass. What should I do?",
    answer: (
      <>
        Don't worry! You can easily retrieve it. Click <strong>Register Now</strong> or click on
        <a href="#retrieve" className="text-brand-pink font-bold ml-1 hover:underline">Get Pass Now</a> 
        to access the portal and retrieve your digital ticket.
      </>
    )
  },
  {
    question: "Who are the organizers?",
    answer: "TECHCON '26 is officially organized by msf TechFed Kerala, aimed at driving technological revolution and student empowerment across the region."
  },
  {
    question: "How can I sponsor the event?",
    answer: (
      <>
        We offer various sponsorship tiers with immense brand visibility. To learn more, check out our 
        <a href="#sponsorship" className="text-brand-pink font-bold mx-1 hover:underline">Sponsorship Brochure</a> 
        or contact our coordinators directly.
      </>
    )
  },
  {
    question: "When and where is the event?",
    answer: "July 2026, Ernakulam. The specific date and exact venue will be announced soon. Please check back here later for detailed updates!"
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-24 px-6 md:px-12 relative overflow-hidden bg-brand-dark">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-xs font-mono font-bold tracking-[0.25em] text-brand-blue uppercase block mb-3">
            // COMMON QUERIES
          </span>
          <h2 className="text-3xl sm:text-4xl font-orbitron font-bold tracking-[0.06em] text-white mb-5 uppercase flex items-center justify-center gap-4">
            <MessageSquare size={32} className="text-brand-blue" />
            FAQ
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`border rounded-2xl overflow-hidden transition-colors ${
                  isOpen 
                    ? 'bg-slate-900/80 border-brand-blue/50 shadow-[0_0_20px_rgba(32,156,255,0.1)]' 
                    : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <button
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                >
                  <span className={`font-orbitron font-bold text-sm sm:text-base pr-4 ${isOpen ? 'text-white' : 'text-slate-300'}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'bg-brand-blue text-white rotate-180' : 'bg-slate-800 text-slate-400'}`}>
                    <ChevronDown size={16} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-6 text-sm text-slate-400 font-sans leading-relaxed border-t border-slate-800/50 pt-4 mt-2">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
