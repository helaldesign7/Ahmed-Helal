import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { ChatPanel } from './ChatPanel';

interface AIAssistantProps {
  lang: 'en' | 'ar';
}

export const AIAssistant = ({ lang }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isRtl = lang === 'ar';

  const t = {
    en: 'Ask AURA AI',
    ar: 'اسأل أورا الذكية'
  };

  return (
    <>
      <div className={`fixed bottom-10 ${isRtl ? 'left-10' : 'right-10'} z-50`}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1, rotate: 10 }}
          whileTap={{ scale: 0.9, rotate: -10 }}
          className="relative w-20 h-20 rounded-4xl bg-accent-violet flex items-center justify-center text-white shadow-[0_20px_50px_rgba(139,92,246,0.5)] cursor-pointer group transition-all duration-500 overflow-visible"
        >
          {/* Layered Glows */}
          <div className="absolute inset-0 bg-accent-violet rounded-4xl animate-pulse opacity-40 blur-xl scale-125 -z-10" />
          <div className="absolute inset-0 bg-accent-violet rounded-4xl animate-ping opacity-20 -z-10" />
          
          <Sparkles className="w-8 h-8 relative z-10 transition-transform group-hover:scale-125" />
          
          {/* Cinematic Tooltip */}
          <div className={`absolute ${isRtl ? 'left-full ml-6' : 'right-full mr-6'} top-1/2 -translate-y-1/2 px-6 py-3 rounded-3xl bg-black/90 backdrop-blur-2xl border border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-500 whitespace-nowrap pointer-events-none transform group-hover:translate-y-[-50%] shadow-2xl`}>
             <span className={`text-[10px] font-black tracking-[0.2em] uppercase text-accent-violet ${isRtl ? 'font-arabic' : 'font-mono'}`}>
                {t[lang]}
             </span>
             {/* Tooltip Arrow alternative */}
             <div className={`absolute top-1/2 -translate-y-1/2 ${isRtl ? '-left-1.5' : '-right-1.5'} w-3 h-3 bg-white/5 rotate-45 border-l border-b border-white/10 z-[-1] lg:block hidden`} />
          </div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && <ChatPanel lang={lang} onClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </>
  );
};
